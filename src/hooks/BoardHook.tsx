import { useCallback, useEffect, useRef, useState } from "react";
import {
  Board as BoardComponent,
  type BoardHandle,
  type BoardProps,
} from "../components/BoardWindow/Board";
import { useLiveInfo } from "../context/LiveInfoContext";
import { getLiveInfosForMove } from "../LiveInfo";
import { WasmChess } from "../../public/pkg/chess_wasm";

export function useLiveBoard({ animated, id }: BoardProps) {
  const boardHandle = useRef<BoardHandle>(null);

  const updateBoard = useCallback((bypassRateLimit: boolean = false) => {
    const { game, currentMoveNumber, liveEngineData } = useLiveInfo.getState();

    boardHandle.current?.updateBoard(
      game,
      currentMoveNumber,
      getLiveInfosForMove(
        liveEngineData,
        currentMoveNumber,
        game.sideToMoveAt(currentMoveNumber)
      ),
      bypassRateLimit
    );
  }, []);

  return {
    Board: <BoardComponent id={id} ref={boardHandle} animated={animated} />,
    updateBoard,
  };
}

export function useKibitzerBoard({ animated, id }: BoardProps) {
  const [boardHandle, setBoardHandle] = useState<BoardHandle | null>(null);
  const game = useRef(new WasmChess());

  const [currentMoveNumber, setCurrentMoveNumber] = useState(-1);
  const [currentFen, setCurrentFen] = useState(game.current.fen());

  useEffect(() => {
    setTimeout(() => {
      boardHandle?.updateBoard(
        game.current,
        currentMoveNumber,
        undefined,
        true
      );
    }, 10);
  }, [currentMoveNumber, currentFen, boardHandle]);

  return {
    Board: <BoardComponent id={id} ref={setBoardHandle} animated={animated} />,
    game,
    currentMoveNumber,
    setCurrentMoveNumber,
    currentFen,
    setCurrentFen,
  };
}
