import { create } from "zustand";
import { Chess960, type Square } from "../chess.js/chess";
import { immer } from "zustand/middleware/immer";
import type { LiveEngineDataEntry } from "../LiveInfo";
import type { Api } from "@lichess-org/chessground/api";
import type { DrawShape } from "@lichess-org/chessground/draw";
import type { Config } from "@lichess-org/chessground/config";

type ChessContext = {
  game: Chess960;
  boardApi: Api | null;

  lastBoardUpdateTime: number;
  setLastBoardUpdateTime: (num: number) => void;

  boardHandle: (
    game: Chess960,
    currentMoveNumber: number,
    liveInfos?: LiveEngineDataEntry,
    bypassRateLimit?: boolean
  ) => void;

  setBoardApi: (api: Api) => void;
};

const BOARD_THROTTLE_MS = 50;
const emptyBoardFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0";

const createChessStore = () => {
  return create<ChessContext>()(
    immer((set, get) => ({
      game: new Chess960(emptyBoardFen),
      boardElement: null,
      boardApi: null,
      lastBoardUpdateTime: 0,
      setLastBoardUpdateTime(num) {
        set({ lastBoardUpdateTime: num });
      },
      setBoardApi(api) {
        set({ boardApi: api });
      },
      boardHandle(game, currentMoveNumber, liveInfos, bypassRateLimit) {
        if (!get().boardApi) return;

        const currentTime = new Date().getTime();
        if (
          !bypassRateLimit &&
          currentTime - get().lastBoardUpdateTime <= BOARD_THROTTLE_MS
        )
          return;

        const fen = game.fenAt(currentMoveNumber);
        const turn = game.turnAt(currentMoveNumber);
        const lastMove = game.moveAt(currentMoveNumber);

        const arrows: DrawShape[] = [];

        let moveWhite: string | null = null;
        if (liveInfos?.white.liveInfo) {
          const pv = liveInfos.white.liveInfo.info.pv.split(" ");
          const nextMove = turn === "w" ? pv[0] : pv[1];
          if (nextMove && nextMove.length >= 4) {
            moveWhite = nextMove;
            arrows.push({
              orig: (nextMove.slice(0, 2) as Square) || "a1",
              dest: (nextMove.slice(2, 4) as Square) || "a1",
              brush: liveInfos.white.liveInfo.info.color,
            });
          }
        }

        if (liveInfos?.black.liveInfo) {
          const pv = liveInfos.black.liveInfo.info.pv.split(" ");
          const nextMove = turn === "b" ? pv[0] : pv[1];
          if (nextMove && nextMove === moveWhite) {
            arrows[0].brush = "agree";
          } else if (nextMove && nextMove.length >= 4) {
            arrows.push({
              orig: (nextMove.slice(0, 2) as Square) || "a1",
              dest: (nextMove.slice(2, 4) as Square) || "a1",
              brush: liveInfos.black.liveInfo.info.color,
            });
          }
        }

        for (const color of ["green", "red", "blue"] as const) {
          if (liveInfos?.[color].liveInfo) {
            const pv = liveInfos[color].liveInfo.info.pv.split(" ");
            const nextMove = pv[0];
            if (nextMove && nextMove.length >= 4) {
              arrows.push({
                orig: (nextMove.slice(0, 2) as Square) || "a1",
                dest: (nextMove.slice(2, 4) as Square) || "a1",
                brush: color,
              });
            }
          }
        }

        const config: Config = {
          drawable: {
            // @ts-ignore
            brushes: {
              white: { key: "white", color: "#fff", opacity: 1, lineWidth: 10 },
              black: { key: "black", color: "#000", opacity: 1, lineWidth: 10 },
              agree: {
                key: "agree",
                color: "#c548c5",
                opacity: 1,
                lineWidth: 10,
              },
              red: {
                key: "red",
                color: "#ff1f1f",
                opacity: 0.75,
                lineWidth: 4,
              },
              blue: {
                key: "blue",
                color: "#0D47A1",
                opacity: 0.75,
                lineWidth: 4,
              },
              green: {
                key: "green",
                color: "#17a01d",
                opacity: 0.75,
                lineWidth: 7,
              },
            },
            enabled: false,
            eraseOnMovablePieceClick: false,
            shapes: arrows,
          },
          fen,
          ...(lastMove
            ? { lastMove: [lastMove.from, lastMove.to] }
            : { lastMove: [] }),
        };

        requestAnimationFrame(() => {
          get().boardApi?.set(config);
        });

        get().setLastBoardUpdateTime(new Date().getTime());
      },
    }))
  );
};

export const useChessGameMain = createChessStore();
