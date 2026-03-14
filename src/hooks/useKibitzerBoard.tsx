import { createStore, useStore } from "zustand";
import { Chess, Chess960 } from "../chess.js/chess";
import {
  Board as BoardComponent,
  type BoardHandle,
  type BoardProps,
} from "../components/Board";
import { useEffect, useRef, useState } from "react";
import { immer } from "zustand/middleware/immer";

type KibitzerBoardContext = {
  game: Chess960;
  boardHandle: BoardHandle;

  currentMoveNumber: number;
  setCurrentMoveNumber: (callback: (previous: number) => number) => void;
  currentFen: string;
  setCurrentFen: (fen: string) => void;
};

const STARTING_POSITION = new Chess().fen();

const createLocalStore = () => {
  return createStore<KibitzerBoardContext>()(
    immer((set, get) => ({
      game: new Chess960(),

      currentFen: STARTING_POSITION,

      setCurrentFen(fen) {
        set((state) => {
          state.currentFen = fen;
        });
      },
      currentMoveNumber: -1,
      setCurrentMoveNumber(callback) {
        set((state) => {
          state.currentMoveNumber = callback(state.currentMoveNumber);
          state.currentFen = state.game.fenAt(state.currentMoveNumber);
        });
      },
      boardHandle: {
        updateBoard(game, currentMoveNumber, liveInfos, bypassRateLimit) {
          //
        },
      },
    }))
  );
};

const useUniqueStore = () => {
  const [store] = useState(() => createLocalStore());
  const game = useStore(store, (state) => state.game);
  const currentFen = useStore(store, (state) => state.currentFen);
  const currentMoveNumber = useStore(store, (state) => state.currentMoveNumber);

  const setCurrentFen = useStore(store, (state) => state.setCurrentFen);
  const setCurrentMoveNumber = useStore(
    store,
    (state) => state.setCurrentMoveNumber
  );
  const boardHandle = useStore(store, (state) => state.boardHandle);

  return {
    game,
    currentFen,
    currentMoveNumber,
    setCurrentFen,
    setCurrentMoveNumber,
    boardHandle,
  };
};

export function useKibitzerBoard__DEV({ animated, id }: BoardProps) {
  const boardHandle = useRef<BoardHandle>(null);
  const {
    currentFen,
    currentMoveNumber,
    game,
    setCurrentFen,
    setCurrentMoveNumber,
  } = useUniqueStore();

  useEffect(() => {
    setTimeout(() => {
      boardHandle.current?.updateBoard(game, currentMoveNumber);
    }, 10);
  }, [currentMoveNumber, currentFen, game]);

  return {
    Board: <BoardComponent id={id} ref={boardHandle} animated={animated} />,
    game,
    currentMoveNumber,
    setCurrentMoveNumber,
    currentFen,
    setCurrentFen,
  };
}
