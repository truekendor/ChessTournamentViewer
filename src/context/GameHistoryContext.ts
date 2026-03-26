import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type History = { moveList: string[]; fenList: string[] };
export type AgreementMove = { moveNumber: number; diverge?: string };

type GameHistory = {
  history: Record<number, History>;
  samePositionsList: AgreementMove[];
  // list with indexes of all overlapping positions
  // that is used to underline moves list entries
  setOverlappingMovesIndxList: (list: AgreementMove[]) => void;
  setFenListForGame: (gameNumber: number, history: History) => void;
};

export const useGameHistory = create<GameHistory>()(
  immer((set) => ({
    history: {},
    samePositionsList: [],
    setOverlappingMovesIndxList(list) {
      set((state) => {
        state.samePositionsList = list;
      });
    },
    setFenListForGame(gameNumber, history) {
      set((state) => {
        state.history[gameNumber] = history;
      });
    },
  }))
);
