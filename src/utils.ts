import type { CCCLiveInfo } from "./types";

import initChess, {
  movesToSan,
  movesToUci,
  WasmChess,
} from "./chess.wasm/chess_wasm";

await initChess();

export function createWasmChess(fen?: string): WasmChess {
  return new WasmChess(fen);
}

export const DEFAULT_POSITION =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const _CHESS = createWasmChess();

export function formatLargeNumber(value?: string) {
  if (!value) return "-";
  const x = Number(value);
  if (isNaN(x)) return "-";
  if (x >= 1_000_000_000) return (x / 1_000_000_000).toFixed(2) + "B";
  if (x >= 1_000_000) return (x / 1_000_000).toFixed(2) + "M";
  if (x >= 1_000) return (x / 1_000).toFixed(2) + "K";
  return x.toFixed(2);
}

export function formatTime(time: number) {
  if (time < 0) time = 0;
  const hundreds = String(Math.floor(time / 100) % 10).padEnd(2, "0");
  const seconds = String(Math.floor(time / 1000) % 60).padStart(2, "0");
  const minutes = String(Math.floor(time / (1000 * 60))).padStart(2, "0");
  return `${minutes}:${seconds}.${hundreds}`;
}

export function getGameAtMoveNumber(
  fen: string,
  moves: string[],
  moveNumber: number
) {
  _CHESS.load(fen);
  const game = _CHESS;

  for (
    let i = 0;
    (i < moveNumber || moveNumber === -1) && i < moves.length;
    i++
  ) {
    if (!game.legalMovesSan().includes(moves[i])) break;
    game.move(moves[i]);
  }
  return game;
}

export function uciToSan(fen: string, moves: string[]): string[] {
  // some engines report stuff after the pv, starting with "string"
  const sliceEnd = moves.includes("string")
    ? moves.indexOf("string")
    : undefined;
  const result = movesToSan(moves.slice(0, sliceEnd), fen).moves;

  if (result.length !== (sliceEnd ?? moves.length) && moves.length > 0) {
    console.warn(
      "uciToSan() produced mismatching pv lengths",
      fen,
      moves.slice(0, sliceEnd),
      result
    );
  }
  return result;
}

export function sanToUci(fen: string, moves: string[]): string[] {
  const result = movesToUci(moves, fen).moves;
  if (result.length !== moves.length) {
    console.warn(
      "sanToUci() produced mismatching pv lengths",
      fen,
      moves,
      result
    );
  }
  return result;
}

export function buildPvGame(
  game: WasmChess,
  fen: string,
  moves: string[],
  pvMoveNumber: number
) {
  game.load(fen);

  for (let i = 0; i < moves.length; i++) {
    if (pvMoveNumber !== -1 && i > pvMoveNumber) {
      break;
    }

    const san = moves[i];
    if (!san) break;

    try {
      game.move(san);
    } catch {
      break;
    }
  }
}

// Normalize a PV so it always starts from the current position (fen's turn).
// If it's not this engine's turn, its PV starts with its own last move,
// so we strip that first move to align both PVs to the same position.
export function normalizePv(
  pv: string,
  engineColor: string,
  fen: string
): string[] {
  const turn = fen.split(" ")[1];
  const turnColor = turn === "w" ? "white" : "black";
  const moves = pv.trim().split(/\s+/);
  if (
    engineColor !== turnColor &&
    !["red", "blue", "green"].includes(engineColor)
  ) {
    return moves.slice(1);
  }
  return moves;
}

export function findPvDisagreementPoint(
  fen: string | undefined,
  ...infos: (CCCLiveInfo | undefined)[]
): number | undefined {
  if (!fen || infos.length < 2) return undefined;

  // Normalize all PVs to start from the current position, then compare directly
  const allMoves = infos
    .map((item) => {
      const data = item?.info;
      if (!data?.pv || !data?.color) return null;
      return normalizePv(data.pv, data.color, fen).filter(Boolean);
    })
    .filter((moves) => moves !== null);

  if (allMoves.length < 2) return undefined;

  const minLength = Math.min(...allMoves.map((m) => m.length));

  for (let i = 0; i < minLength; i++) {
    const firstEngineMove = allMoves[0][i];

    const allAgree = allMoves.every(
      (moveList) => moveList[i] === firstEngineMove
    );

    if (!allAgree) {
      return i;
    }
  }

  return minLength;
}
