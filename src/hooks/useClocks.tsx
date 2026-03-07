import { useCallback, useEffect } from "react";
import { useLiveInfo } from "../context/LiveInfoContext";
import { useWebsocket } from "./useWebsocket";
import type { CCCMessage } from "../types";

const CLOCK_UPDATE_MS = 100;

export const useClocks = () => {
  const game = useLiveInfo((state) => state.game);
  const setClocks = useLiveInfo((state) => state.setClocks);

  const { setCallback } = useWebsocket({ subId: "useClockHook" });

  useEffect(() => {
    const handleMessage = (msg: CCCMessage) => {
      switch (msg.type) {
        case "clocks":
          setClocks(() => msg);
          break;
      }
    };

    setCallback(handleMessage);
  }, [setCallback, setClocks]);

  const updateClocks = useCallback(() => {
    setClocks((currentClock) => {
      if (!currentClock) return currentClock;
      const result = game.getHeaders()["Result"];
      if (result && result !== "*") return { ...currentClock };

      let wtime = Number(currentClock.wtime);
      let btime = Number(currentClock.btime);

      if (game.turn() == "w") wtime -= CLOCK_UPDATE_MS;
      else btime -= CLOCK_UPDATE_MS;

      return { ...currentClock, wtime: String(wtime), btime: String(btime) };
    });
  }, [game, setClocks]);

  useEffect(() => {
    const clockTimer = setInterval(updateClocks, CLOCK_UPDATE_MS);
    return () => clearInterval(clockTimer);
  }, [updateClocks]);
};
