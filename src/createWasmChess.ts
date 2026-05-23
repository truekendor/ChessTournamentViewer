import initChess, { WasmChess } from "../public/pkg/chess_wasm";

await initChess();

export function createWasmChess(fen?: string) {
  return new WasmChess(fen);
}
