import { Chessground } from "@lichess-org/chessground";
import { memo, useEffect, useRef } from "react";
import type { Api } from "@lichess-org/chessground/api";
import type { LiveEngineDataEntry } from "../LiveInfo";
import type { Chess960, Square } from "../chess.js/chess";
import "./Board.css";
import { useChessGameMain } from "../context/ChessContext";

export type BoardHandle = {
  updateBoard: (
    game: Chess960,
    currentMoveNumber: number,
    liveInfos?: LiveEngineDataEntry,
    bypassRateLimit?: boolean
  ) => void;
};

type BoardProps = { id?: string; animated: boolean };

export const Board = memo((props: BoardProps) => {
  const boardElementRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<Api>(null);
  const _setBoardApi = useChessGameMain((state) => state.setBoardApi);

  useEffect(() => {
    if (boardRef.current || !boardElementRef.current) return;

    const api = Chessground(boardElementRef.current, {
      orientation: "white",
      movable: { free: false, color: undefined, dests: undefined },
      selectable: { enabled: false },
      animation: { enabled: props.animated },
    });

    _setBoardApi(api);

    // boardRef.current = api;
  }, [_setBoardApi, props.animated]);

  return <div ref={boardElementRef} className="board" {...props} />;
});
