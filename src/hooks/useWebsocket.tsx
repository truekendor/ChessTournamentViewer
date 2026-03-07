import { useCallback, useEffect, useRef } from "react";

import {
  CCCWebSocket,
  type TournamentWebSocket,
  type WebsocketRegisteredSubIds,
  type WSSubCallback,
} from "../CCCWebsocket";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { TCECSocket } from "../TCECWebsocket";

const isTCEC = window.location.search.includes("tcec");

type _SocketShared = { socket: TournamentWebSocket };

const useWebsocketContext = create<_SocketShared>()(
  immer(() => ({ socket: isTCEC ? new TCECSocket() : new CCCWebSocket() }))
);

type _DEV_useWSHook = { subId: WebsocketRegisteredSubIds };

export const useWebsocket = ({ subId }: _DEV_useWSHook) => {
  const socket = useWebsocketContext((state) => state.socket);
  const cbRef = useRef<WSSubCallback | null>(null);

  useEffect(() => {
    if (!cbRef.current) {
      return;
    }

    if (!socket.isConnected()) {
      socket.connect(cbRef.current, subId);
    } else {
      socket.setHandler(cbRef.current, subId);
    }
  }, [socket, subId]);

  const setCallback = useCallback((cb: WSSubCallback) => {
    cbRef.current = cb;
  }, []);

  const requestEvent = useCallback(
    (gameNr?: string, eventNr?: string) => {
      const message: Record<string, string> = { type: "requestEvent" };
      if (gameNr) message["gameNr"] = gameNr;
      if (eventNr) message["eventNr"] = eventNr;

      socket.send(message);
    },
    [socket]
  );

  return { setCallback, requestEvent, socket } as const;
};
