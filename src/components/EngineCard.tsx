import { useMemo, memo, useEffect } from "react";
import { EngineLogo } from "./EngineLogo";
import "./EngineCard.css";
import { SkeletonBlock, SkeletonText } from "./Loading";
import { MoveList } from "./MoveList";
import {
  buildPvGame,
  buildPvGame__DEV,
  findPvDisagreementPoint,
  normalizePv,
} from "../utils";
import { Chess, Chess960 } from "../chess.js/chess";
import { useMediaQuery } from "react-responsive";
import { useKibitzerBoard } from "../hooks/BoardHook";
import type { EngineColor } from "../LiveInfo";
import { useLiveInfo } from "../context/LiveInfoContext";
import { useKibitzerBoard__DEV } from "../hooks/useKibitzerBoard";
import { EngineInfoTable } from "./EngineInfoTable";

type EngineCardProps = {
  color: EngineColor;
  opponentColor?: EngineColor;
  kibitzerLayout?: boolean;
};

export function formatLargeNumber(value?: string) {
  if (!value) return "-";
  const x = Number(value);
  if (isNaN(x)) return "-";
  if (x >= 1_000_000_000) return (x / 1_000_000_000).toFixed(2) + "B";
  if (x >= 1_000_000) return (x / 1_000_000).toFixed(2) + "M";
  if (x >= 1_000) return (x / 1_000).toFixed(2) + "K";
  return String(x);
}

export function formatTime(time: number) {
  if (time < 0) time = 0;
  const hundreds = String(Math.floor(time / 100) % 10).padEnd(2, "0");
  const seconds = String(Math.floor(time / 1000) % 60).padStart(2, "0");
  const minutes = String(Math.floor(time / (1000 * 60)) % 60).padStart(2, "0");
  return `${minutes}:${seconds}.${hundreds}`;
}

const EngineCard = memo(
  ({ color, opponentColor, kibitzerLayout }: EngineCardProps) => {
    const t1 = performance.now();

    // Kibitzers re-render on FEN change, or on every depth change after depth 15
    const fen = useLiveInfo((state) =>
      state.game.fenAt(state.currentMoveNumber)
    );
    useLiveInfo((state) =>
      !["black", "white"].includes(color)
        ? Math.max(
            15,
            Number(state.liveInfos[color].liveInfo?.info.depth || 0) || 0
          )
        : undefined
    );

    const state = useLiveInfo.getState();
    const engine = state.liveInfos[color].engineInfo;

    const liveInfo = state.liveInfos[color].liveInfo;
    const opponentInfo = opponentColor
      ? state.liveInfos[opponentColor].liveInfo
      : undefined;

    const pvDisagreementPoint = findPvDisagreementPoint(
      fen,
      liveInfo,
      opponentInfo
    );

    const data = liveInfo?.info;
    const loading = !data || !engine;

    // const {
    //   Board,
    //   currentMoveNumber,
    //   game,
    //   setCurrentFen,
    //   setCurrentMoveNumber,
    // } = useKibitzerBoard({ animated: false });

    const {
      Board,
      currentMoveNumber,
      game,
      setCurrentFen,
      setCurrentMoveNumber,
    } = useKibitzerBoard__DEV({ animated: false });

    const moves = useMemo(() => {
      if (loading || !fen || !data?.color) return undefined;

      setCurrentMoveNumber(() => -1);
      return normalizePv(data.pvSan, data.color, fen);
    }, [loading, fen, data?.color, data?.pvSan, setCurrentMoveNumber]);

    useEffect(() => {
      if (!fen || !moves) return;

      buildPvGame__DEV(game, fen, moves, -1);
      setCurrentFen(game.fen());
    }, [fen, game, moves, setCurrentFen]);

    const isMobile = useMediaQuery({ maxWidth: 1400 });

    const safeFen = fen ?? new Chess().fen();
    const moveNumberOffset = new Chess960(safeFen).moveNumber() - 1;

    const t2 = performance.now();

    console.log(`timer: ${t2 - t1} sec`);

    return (
      <div
        className={`engineComponent ${loading ? "loading" : ""} ${kibitzerLayout ? "kibitzer" : ""}`}
      >
        <div className="engineLeftSection">
          <div className="engineInfoHeader">
            {!engine ? (
              <SkeletonBlock width={36} height={36} style={{ margin: 6 }} />
            ) : (
              <EngineLogo engine={engine!} />
            )}

            <div className="engineName" title={engine?.name ?? ""}>
              {!engine ? color : engine!.name}
            </div>
          </div>

          <hr />

          <EngineInfoTable color={color} />

          <hr />

          <div className="engineInfoEval">
            {loading ? (
              <SkeletonText width="100%" />
            ) : (
              <div className="engineEval">{data.score}</div>
            )}
          </div>
        </div>

        {loading && !isMobile ? (
          <SkeletonBlock
            width="100%"
            height="calc(100% - 2 * var(--padding))"
            style={{ margin: "var(--padding) var(--padding) var(--padding) 0" }}
          />
        ) : moves && !isMobile ? (
          <div className="engineRightSection">
            {Board}

            <MoveList
              startFen={safeFen}
              moves={moves}
              currentMoveNumber={currentMoveNumber}
              setCurrentMoveNumber={setCurrentMoveNumber}
              controllers={false}
              disagreementMoveIndex={
                pvDisagreementPoint !== -1 ? pvDisagreementPoint : undefined
              }
              moveNumberOffset={moveNumberOffset}
            />
          </div>
        ) : null}
        {(() => {
          console.log(`render time ${performance.now() - t2} sec`);
        })()}
      </div>
    );
  }
);

export { EngineCard };
