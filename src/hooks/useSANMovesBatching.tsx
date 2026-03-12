import { useCallback, useRef } from "react";
import type { Chess960 } from "../chess.js/chess";
import { uciToSan } from "../utils";
import type { CCCLiveInfo } from "../types";
import {
  extractLiveInfoFromTCECGame,
  type EngineColor,
  type LiveInfoEntry,
} from "../LiveInfo";
import { useLiveInfo } from "../context/LiveInfoContext";

const BATCH_SIZE = 15;
const CALCULATION_DELAY_MS = 170;

export type BatchTaskEntry = {
  fen: string;
  ply: number;
  pv: string;
  color: EngineColor;
};

function calcSanMovesForBatch(batch: BatchTaskEntry[]): BatchTaskEntry[] {
  return batch.map((el) => {
    el.pv = uciToSan(el.fen, el.pv.split(" ")).join(" ");

    return el;
  });
}

export const useSANMovesBatching = () => {
  // raw collection on tasks
  const taskStack = useRef<BatchTaskEntry[]>([]);
  // collection of task-lists with a length of a batch size
  const butchList = useRef<BatchTaskEntry[][]>([]);

  const patchLiveEngineData = useLiveInfo((state) => state.patchLiveEngineData);

  const mainTimerHandler = useRef<number>(-1);
  const butchTaskTimerHandler = useRef<number>(-1);

  const butchTimeout = useCallback(async () => {
    for (let i = 0; i < butchList.current.length; i++) {
      const cur = butchList.current[i];

      await new Promise((res) => {
        butchTaskTimerHandler.current = setTimeout(() => {
          const tasks = calcSanMovesForBatch(cur);
          patchLiveEngineData(tasks);

          res(null);
        }, CALCULATION_DELAY_MS);
      });
    }
  }, [patchLiveEngineData]);

  const calcRest = useCallback(
    async function () {
      const batchList: BatchTaskEntry[] = [];
      const copy = taskStack.current;

      while (copy.length > 0) {
        const val = copy.pop();

        // this should never fire but you never know
        // with the async stuff
        if (val === undefined) {
          butchList.current.push([...batchList]);
          batchList.length = 0;
          break;
        }

        batchList.push(val);

        const reachedBatchSize = batchList.length >= BATCH_SIZE;
        const noTasksLeft = copy.length === 0;

        if (reachedBatchSize || noTasksLeft) {
          butchList.current.push([...batchList]);
          batchList.length = 0;
        }
      }

      await butchTimeout();
    },
    [butchTimeout]
  );

  const __extractLiveInfoFromGame = useCallback(
    (game: Chess960) => {
      if (game.getHeaders()["Site"]?.includes("tcec")) {
        return extractLiveInfoFromTCECGame(game);
      }

      const comments = game.getComments();

      if (mainTimerHandler.current) {
        clearTimeout(mainTimerHandler.current);
      }
      if (butchTaskTimerHandler.current) {
        clearTimeout(butchTaskTimerHandler.current);
      }

      taskStack.current.length = 0;
      butchList.current.length = 0;

      const startingFen = game.getHeaders()["FEN"] ?? "";

      const liveInfosWhite: LiveInfoEntry[] = [];
      const liveInfosBlack: LiveInfoEntry[] = [];

      for (let i = comments.length - 1; i > 0; i--) {
        // for (let i = 0; i < comments.length; i++) {
        const value = comments[i];
        const data = value.comment?.split(", ") ?? [];

        if (data[0] === "book") {
          continue;
        }

        const fenBeforeMove = comments[i - 1]?.fen ?? startingFen;
        const color = fenBeforeMove.includes(" w ") ? "white" : "black";

        let score = data[0].split("/")[0];
        if (color === "black") {
          if (score.includes("+")) score = score.replace("+", "-");
          else score = score.replace("-", "+");
        }

        const pvString = data[8].replace("pv=", "").replaceAll('"', "");

        let sanCalculated = false;

        const sanPv = (() => {
          if (i <= BATCH_SIZE || i >= comments.length - BATCH_SIZE) {
            sanCalculated = true;
            return uciToSan(fenBeforeMove, pvString.split(" ")).join(" ");
          }

          return pvString;
        })();

        const liveInfo: CCCLiveInfo = {
          type: "liveInfo",
          info: {
            color,
            depth: data[0].split("/")[1].split(" ")[0],
            multipv: "1",
            hashfull: data[6].split("=")[1],
            name: "",
            nodes: data[3].split("=")[1],
            ply: i,
            pv: pvString,
            pvSan: sanPv,
            score,
            seldepth: data[4].split("=")[1],
            speed: data[5].split("=")[1],
            tbhits: data[7].split("=")[1],
            time: data[0].split(" ")[1].split("s")[0].replace(".", ""),
          },
        };

        if (!sanCalculated) {
          taskStack.current.push({
            fen: fenBeforeMove,
            ply: i,
            pv: pvString,
            color,
          });
        }

        if (color === "white") liveInfosWhite[liveInfo.info.ply] = liveInfo;
        else liveInfosBlack[liveInfo.info.ply] = liveInfo;
      }

      mainTimerHandler.current = setTimeout(calcRest, CALCULATION_DELAY_MS);

      return { liveInfosWhite, liveInfosBlack };
    },
    [calcRest]
  );

  return { __extractLiveInfoFromGame };
};
