export type WebsocketRegisteredSubIds =
  | "main"
  | "useKibitzerHook"
  | "useClockHook"
  | "scheduleWindow";

export type WSSubCallback = (msg: CCCMessage) => void;

import type { CCCMessage } from "./types";

export interface TournamentWebSocket {
  connect: (onMessage: WSSubCallback, subId: WebsocketRegisteredSubIds) => void;
  setHandler: (
    onMessage: WSSubCallback,
    subId: WebsocketRegisteredSubIds
  ) => void;

  isConnected: () => boolean;

  disconnect: () => void;
  send: (msg: unknown) => void;
  socket: WebSocket | SocketIOClient.Socket | null;
}

export class CCCWebSocket implements TournamentWebSocket {
  private url: string = "wss://ccc-api.gcp-prod.chess.com/ws";
  socket: WebSocket | null = new WebSocket(this.url);

  private socketSubs: Map<WebsocketRegisteredSubIds, WSSubCallback> = new Map();

  connect(onMessage: WSSubCallback, id: WebsocketRegisteredSubIds) {
    if (this.socket === null) {
      this.socket = new WebSocket(this.url);
    }

    this.setHandler(onMessage, id);
  }

  isConnected() {
    return (
      !!this.socket &&
      this.socket.readyState !== this.socket.CLOSING &&
      this.socket.readyState !== this.socket.CLOSED &&
      this.socket.readyState !== undefined
    );
  }

  setHandler(onMessage: WSSubCallback, id: WebsocketRegisteredSubIds) {
    if (this.socket === null) {
      return;
    }

    this.socketSubs.set(id, onMessage);

    this.socket.onopen = () => {
      this.send({ type: "requestEvent" });
      this.send({ type: "requestEventsListUpdate" });
    };

    this.socket.onclose = () => {
      this.socket = null;
    };

    this.socket.onerror = () => {
      // this.ws?.close();
    };

    this.socket.onmessage = (e) => {
      const messages = JSON.parse(e.data) as CCCMessage[];
      for (const msg of messages) {
        if (msg.type === "eventUpdate") {
          msg.tournamentDetails.hasGamePairs = true;
          msg.tournamentDetails.isRoundRobin = true;
        }

        this.socketSubs.forEach((callback) => {
          callback(msg);
        });
      }
    };
  }

  disconnect() {
    this.socket?.close();
  }

  send(msg: unknown) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    this.socket.send(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
}
