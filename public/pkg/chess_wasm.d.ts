/* tslint:disable */
/* eslint-disable */
/**
 * A verbose representation of a chess move, exposed to TypeScript as a plain object.
 *
 * # API Differences from chess.js
 *
 * Chess.js provides methods (`isCapture()`, `isEnPassant()`) while this port exposes
 * boolean fields directly on the object.
 *
 * **Capture Detection:**
 * - `captured` (string | null | undefined): The piece that was taken (includes both regular and en passant captures)
 * - `isRegularCapture` (boolean): Matches chess.js `isCapture()` behavior exactly
 *
 * ```typescript
 * if (move.captured) {
 *     // A piece was captured (regular or en passant)
 * }
 *
 * if (move.isRegularCapture) {
 *     // Matches chess.js isCapture() - false for en passant
 * }
 *
 * if (move.isEnPassant) {
 *     // True only for en passant captures
 * }
 * ```
 *
 * **Other fields directly mirror chess.js verbose move properties:**
 * - `san`, `lan`, `piece`, `color`, `promotion`
 * - `isBigPawn`, `isCastle`, `isKingsideCastle`, `isQueensideCastle`
 * - `from`, `to`, `before`, `after`
 */
export interface MoveVerbose {
    from: SquareStr;
    to: SquareStr;
    /**
     * FEN before the move is played
     */
    before: string;
    /**
     * FEN after the move is played
     */
    after: string;
    color: ColorChar;
    piece: PieceSymbol;
    captured: PieceSymbol | undefined;
    /**
     * Matches chess.js `isCapture()` behavior.
     *
     * Returns `true` for regular captures (piece moves onto opponent-occupied square).
     * Returns `false` for en passant captures, unlike checking `captured` which includes them.
     *
     * For exact chess.js `isCapture()` compatibility, use this field.
     */
    isRegularCapture: boolean;
    promotion: PieceSymbol | undefined;
    san: string;
    lan: string;
    isEnPassant: boolean;
    /**
     * Returns `true` for two-square pawn moves (e.g., e2e4)
     */
    isBigPawn: boolean;
    isCastle: boolean;
    isKingsideCastle: boolean;
    isQueensideCastle: boolean;
}

export interface CastlingObj {
    king: boolean | undefined;
    queen: boolean | undefined;
}

export interface CommentsObj {
    fen: string;
    comment?: string;
    suffixAnnotation?: string;
    nags: string[];
}

export interface DivergeData {
    moveSan: string;
    moveIndex: number;
}

export interface LegalMovesFilterOptions {
    fromSquare: SquareStr | undefined;
    piece: PieceSymbol | undefined;
}

export interface MoveFromSquares {
    from: SquareStr;
    to: SquareStr;
}

export interface MoveObject {
    from: SquareStr;
    to: SquareStr;
    promotion?: PieceSymbol;
}

export interface MovesAndError {
    moves: string[];
    message: string | undefined;
}

export interface OkOrError {
    ok: boolean;
    err: string | undefined;
}

export interface PGNOptions {
    /**
     * Maximum line width for wrapping PGN moves (default: 80)
     */
    maxWidth: number | undefined;
    /**
     * Custom newline sequence (default: \"\\r\\n\" per PGN spec)
     */
    newline: string | undefined;
}

export interface PieceObj {
    type: PieceSymbol;
    color: ColorChar;
}

export interface PreserveHeaders {
    preserveHeaders: boolean;
}

export interface PrunedCommentsObj {
    fen: string;
    comment: string;
}

export interface SquareInfo {
    square: SquareStr;
    type: PieceSymbol;
    color: ColorChar;
}

export interface TranspositionDataEntry {
    moveIndex: number;
    divergeData?: DivergeData;
}

export type BoardState = BoardMatrix;

export type ColorChar = "w" | "b";

export type HeadersObj = Map<string, string>;

export type PieceSymbol = "p" | "n" | "b" | "r" | "q" | "k";

export type SquareColor = "light" | "dark";

export type SquareStr = "a1" | "b1" | "c1" | "d1" | "e1" | "f1" | "g1" | "h1" | "a2" | "b2" | "c2" | "d2" | "e2" | "f2" | "g2" | "h2" | "a3" | "b3" | "c3" | "d3" | "e3" | "f3" | "g3" | "h3" | "a4" | "b4" | "c4" | "d4" | "e4" | "f4" | "g4" | "h4" | "a5" | "b5" | "c5" | "d5" | "e5" | "f5" | "g5" | "h5" | "a6" | "b6" | "c6" | "d6" | "e6" | "f6" | "g6" | "h6" | "a7" | "b7" | "c7" | "d7" | "e7" | "f7" | "g7" | "h7" | "a8" | "b8" | "c8" | "d8" | "e8" | "f8" | "g8" | "h8";

export type SuffixSymbol = "exclam" | "question" | "doubleExclam" | "exclamQuestion" | "questionExclam" | "doubleQuestion";


export class WasmChess {
    free(): void;
    [Symbol.dispose](): void;
    addNag(nag: string, fen?: string | null): void;
    ascii(): string;
    attackers(square: SquareStr, attacked_by_side?: ColorChar | null): SquareStr[];
    board(): BoardState;
    /**
     * Returns a FEN string representing only the piece placement on the board.
     *
     * ## Returns
     * A FEN string in the format `"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"`
     * describing the current piece layout.
     *
     * ## Example
     * ```
     * let board_fen = chess.board_fen();
     * assert_eq!(board_fen, "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
     * ```
     */
    boardFen(): string;
    fen(force_en_passant_square?: boolean | null): string;
    /**
     * Returns the FEN string at a specific move index.
     *
     * ## Parameters
     * * `index` - The move index (0-based):
     *   - `0` - Starting position (before any moves)
     *   - `1` - Position after first move
     *   - `2` - Position after second move, etc.
     *
     * ## Returns
     * The FEN string at the requested position:
     *   - For valid indices (0 through history length), returns the position at that index
     *   - For indices beyond the history length, returns the last available position
     *
     * ## Note
     * This method never fails - out-of-bounds indices return the final position.
     * This is useful for UCI-style interfaces where move indices might exceed the game length.
     *
     * ## Example
     * ```
     * assert_eq!(chess.fen_at(0), "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
     *
     * // After 1.e4
     * assert_eq!(chess.fen_at(1), "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1");
     *
     * // Index beyond game length returns the final position
     * assert_eq!(chess.fen_at(999), final_position_fen);
     * ```
     */
    fenAt(index: number): string;
    /**
     * Finds all squares containing a piece identified by its single-character notation.
     *
     *
     * # JavaScript Example
     * ```js
     * // Find all white knights
     * const knightSquares = chess.findPiece('N');
     *
     * // Find all black pawns
     * const blackPawnSquares = chess.findPiece('p');
     * ```
     *
     * # Parameters
     * - `piece`: Single character piece notation:
     *   - Uppercase: `K` (king), `Q` (queen), `R` (rook), `B` (bishop), `N` (knight), `P` (pawn) = white
     *   - Lowercase: same letters = black
     *
     * # Returns
     * Array of square strings (e.g., `['g1', 'b1']`)
     *
     * # Throws
     * If the piece string is invalid (wrong length or unknown piece character)
     */
    findPiece(piece: string): SquareStr[];
    findPieceByType(piece: PieceObj): SquareStr[];
    fullmoves(): number;
    /**
     * Gets the piece at a specific square.
     *
     * # JavaScript Example
     * ```js
     * const piece = chess.get('e2');
     * if (piece) {
     *   console.log(piece.color, piece.kind); // 'w', 'pawn'
     * }
     * ```
     *
     * # Returns
     * - `PieceObj` if a piece exists at the square
     * - `null` | `undefined` if the square is empty
     */
    get(square: SquareStr): PieceObj | undefined;
    getCastlingRights(color_char: ColorChar): CastlingObj;
    getComment(): string | undefined;
    getComments(): CommentsObj[];
    getHeaders(): HeadersObj;
    getNags(fen?: string | null): string[];
    getSuffixAnnotation(fen?: string | null): string | undefined;
    halfmoves(): number;
    historySan(): string[];
    historyUci(): string[];
    historyVerbose(): MoveVerbose[];
    isAttacked(square: SquareStr, attacked_by_side?: ColorChar | null): boolean;
    isCheck(): boolean;
    isCheckmate(): boolean;
    isDraw(): boolean;
    isDrawByFiftyMoves(): boolean;
    isGameOver(): boolean;
    isInsufficientMaterial(): boolean;
    /**
     * Checks if a move from the given squares would result in a promotion.
     *
     * # Returns
     * `true` if the move would promote a pawn, `false` otherwise
     */
    isPromotion(move_obj: MoveFromSquares): boolean;
    isStalemate(): boolean;
    isThreefoldRepetition(): boolean;
    legalMovesSan(filter_options?: LegalMovesFilterOptions | null): string[];
    legalMovesUci(filter_options?: LegalMovesFilterOptions | null): string[];
    /**
     * # API Discrepancy: chess.js Compatibility
     *
     * This implementation differs from chess.js in how it handles the
     * en passant square in verbose move objects.
     *
     * |      Aspect       |           chess.js             |      This Implementation      |
     * |-------------------|--------------------------------|-------------------------------|
     * | En passant square | Always included when available | Only included for legal moves |
     */
    legalMovesVerbose(filter_options?: LegalMovesFilterOptions | null): MoveVerbose[];
    length(): number;
    /**
     * Loads a position from a FEN string.
     *
     * This completely replaces the current game state and clears:
     * - move history
     * - repetition tracking
     * - PGN comments
     * - PGN headers
     *
     * # Errors
     *
     * Returns an error if the provided FEN is invalid.
     *
     * # chess.js Compatibility
     *
     * Behaves similarly to `chess.load()` from chess.js.
     *
     * # Examples
     *
     * ```js
     * chess.load("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
     * ```
     */
    load(starting_fen: string, preserve_headers?: PreserveHeaders | null): void;
    loadPgn(pgn: string): void;
    /**
     * Makes a move using SAN or UCI notation.
     *
     * Accepted formats include:
     * - SAN (`Nf3`, `Qxe5+`, `O-O`)
     * - UCI (`e2e4`, `g1f3`, `g7h8q`)
     *
     * On success the move is applied, repetition state is updated,
     * and the move is appended to history.
     *
     * # Errors
     *
     * Returns an error if:
     * - the move cannot be parsed
     * - the move is illegal in the current position
     *
     * # chess.js Compatibility
     *
     * Compatible with `chess.move()` string input behavior with an
     * exception of nullmoves
     *
     * # Examples
     *
     * ```js
     * chess.move("e4")
     * chess.move("Nf3")
     * chess.move("e2e4")
     * ```
     */
    move(move_str: string): MoveVerbose;
    /**
     * Returns the move at a specific index.
     *
     * # Parameters
     * * `index` - The move index (0-based):
     *   - `0` - Returns `None` (no move at starting position)
     *   - `1` - First move played
     *   - `2` - Second move played, etc.
     *
     * # Returns
     * * `Some(MoveObject)` - The move at the requested index
     * * `None` - If `index` is 0 or exceeds total moves played
     */
    moveAt(index: number): MoveObject | undefined;
    moveFromObj(move_obj: MoveObject): MoveVerbose;
    moveNumber(): number;
    constructor(fen?: string | null);
    perft(depth: number): bigint;
    pgn(options?: PGNOptions | null): string;
    /**
     * Plays multiple moves sequentially from the current position.
     *
     * Each move is processed using [`make_move`](#method.make_move),
     * meaning all normal validation, history tracking, repetition
     * updates, and verbose move generation still apply.
     *
     * Accepted move formats:
     * - SAN (`e4`, `Nf3`, `O-O`)
     * - UCI (`e2e4`, `g1f3`)
     *
     * # Atomicity
     *
     * This method is **not atomic**.
     *
     * If a move in the batch fails:
     * - all previously applied moves remain applied
     * - processing stops immediately
     * - the error is returned
     *
     * # Returns
     *
     * Returns a vector of [`MoveVerbose`] objects corresponding
     * to each successfully played move.
     *
     * # Errors
     *
     * Returns an error if any move:
     * - cannot be parsed
     * - is illegal in the current position
     *
     * # Examples
     *
     * ```js
     * chess.playMovesBatch(["e4", "e5", "Nf3", "Nc6"])
     *
     * chess.playMovesBatch([
     *   "e2e4",
     *   "e7e5",
     *   "g1f3"
     * ])
     * ```
     */
    playMovesBatch(moves: string[]): MoveVerbose[];
    /**
     * Places a piece on the board at the given square.
     *
     * # JavaScript Example
     * ```js
     * const success = chess.put({ kind: 'queen', color: 'white' }, 'e2');
     * ```
     *
     * # Returns
     * - `true` if the position is valid after placement
     * - `false` if the placement would create an invalid position (e.g., illegal castling rights)
     *
     * # Notes
     * - En passant square is cleared when placing pieces manually
     * - Invalid positions are rejected and the board remains unchanged
     */
    put(piece_obj: PieceObj, square: SquareStr): boolean;
    removeComment(): string | undefined;
    removeComments(): PrunedCommentsObj[];
    removeHeader(key: string): boolean;
    removeNag(nag: string, fen?: string | null): boolean;
    removeNags(fen?: string | null): string[];
    removeSuffixAnnotation(fen?: string | null): string | undefined;
    /**
     * resets to default starting position
     * and clears all history and pgn related data
     */
    reset(): void;
    /**
     * Updates castling rights for a specific color.
     *
     * # JavaScript Example
     * ```js
     * // Disable black's kingside castling only
     * chess.setCastlingRights('b', { king: false });
     *
     * // Enable both kingside and queenside for white
     * chess.setCastlingRights('w', { king: true, queen: true });
     *
     * // Leave queenside unchanged, remove kingside
     * chess.setCastlingRights('w', { king: false });
     * ```
     *
     * # Parameters
     * - `color`: `'w'` or `'b'`
     * - `castling_obj`: Object with optional boolean fields
     *   - `king` - `true` to enable, `false` to disable, `undefined` to leave unchanged
     *   - `queen` - Same as above
     *
     * # Returns
     * - `true` if the requested rights were successfully applied
     * - `false` if the operation didn't take effect (e.g., invalid position rejected)
     *
     * # Notes
     * - Invalid castling configurations (e.g., rights on empty files) are automatically filtered out
     * - The method returns `false` if the final rights don't match the request
     */
    setCastlingRights(color: ColorChar, castling_obj: CastlingObj): boolean;
    setComment(comment: string): void;
    setHeader(key: string, value: string): HeadersObj;
    setNags(nags: string[], fen?: string | null): void;
    setSuffixAnnotation(suffix: string, fen?: string | null): void;
    /**
     * Changes which player moves next.
     *
     * # JavaScript Example
     * ```js
     * try {
     *   const changed = chess.setTurn('b'); // Switch to black
     *   console.log(changed ? "Turn changed" : "Already black's turn");
     * } catch (err) {
     *   console.error("Invalid position after turn change:", err);
     * }
     * ```
     *
     * # Parameters
     * - `color`: `'w'` for white, `'b'` for black
     *
     * # Returns
     * - `Ok(true)` - Turn was successfully changed
     * - `Ok(false)` - Already that player's turn (no change)
     * - `Err(string)` - Position became invalid after turn change (contains error details)
     */
    setTurn(color: ColorChar): boolean;
    /**
     * Returns which side to move at a specific index.
     *
     * # Parameters
     * * `index` - The position index (0-based):
     *   - `0` - Starting position (White's turn for default starting position)
     *   - `1` - Turn after first move (Black's turn for default starting position)
     *   - `2` - Turn after second move, etc.
     *
     * # Behavior
     * * If `index` is within history bounds, returns the side to move at that position
     * * If `index` overflows the history (exceeds available moves), returns the current side to move
     */
    sideToMoveAt(index: number): ColorChar;
    /**
     * Parses and validates a move without modifying the current position.
     *
     * Unlike [`move`](#method.make_move), this method does **not**
     * update:
     * - the board state
     * - move history
     * - repetition tracking
     * - hashes or PGN state
     *
     * This is useful for:
     * - validating user input
     * - previewing move metadata
     * - checking legality before committing a move
     * - UI hover / drag previews
     *
     * Accepted formats include:
     * - SAN (`Nf3`, `Qxe5+`, `O-O`)
     * - UCI (`e2e4`, `g1f3`, `g7h8q`)
     *
     * # Returns
     *
     * Returns a [`MoveVerbose`] object describing the move if it is legal.
     *
     * # Errors
     *
     * Returns an error if:
     * - the move cannot be parsed
     * - the move is illegal in the current position
     *
     * # Examples
     *
     * ```js
     * chess.simulateMove("e4")
     * chess.simulateMove("Nf3")
     * chess.simulateMove("e2e4")
     * ```
     */
    simulateMove(move_str: string): MoveVerbose;
    squareColor(square: SquareStr): SquareColor | undefined;
    turn(): ColorChar;
    /**
     * Undoes the last move.
     *
     * Restores:
     * - board state
     * - side to move
     * - castling rights
     * - en passant state
     * - repetition tracking
     *
     * Returns the undone move in verbose format.
     *
     * Returns `None` if the game history is empty.
     *
     * # chess.js Compatibility
     *
     * Behaves similarly to `chess.undo()`.
     */
    undo(): MoveVerbose | undefined;
    validateFen(fen: string): OkOrError;
    zobristHash(): bigint;
}

export function findDivergence(common_fen: string, move_list_current: string[], move_list_reverse: string[]): TranspositionDataEntry[];

/**
 * converts Vec of moves in SAN/LAN format, into Vec of SAN moves
 */
export function movesToSan(moves: string[], starting_fen?: string | null): MovesAndError;

/**
 * converts Vec of moves in SAN/LAN format, into Vec of UCI moves
 */
export function movesToUci(moves: string[], starting_fen?: string | null): MovesAndError;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_wasmchess_free: (a: number, b: number) => void;
    readonly findDivergence: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number];
    readonly movesToSan: (a: number, b: number, c: number, d: number) => any;
    readonly movesToUci: (a: number, b: number, c: number, d: number) => any;
    readonly wasmchess_addNag: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly wasmchess_ascii: (a: number) => [number, number];
    readonly wasmchess_attackers: (a: number, b: any, c: number) => [number, number];
    readonly wasmchess_board: (a: number) => any;
    readonly wasmchess_boardFen: (a: number) => [number, number];
    readonly wasmchess_fen: (a: number, b: number) => [number, number];
    readonly wasmchess_fenAt: (a: number, b: number) => [number, number];
    readonly wasmchess_findPiece: (a: number, b: number, c: number) => [number, number, number, number];
    readonly wasmchess_findPieceByType: (a: number, b: any) => [number, number];
    readonly wasmchess_fullmoves: (a: number) => number;
    readonly wasmchess_get: (a: number, b: any) => any;
    readonly wasmchess_getCastlingRights: (a: number, b: any) => any;
    readonly wasmchess_getComment: (a: number) => [number, number];
    readonly wasmchess_getComments: (a: number) => [number, number];
    readonly wasmchess_getHeaders: (a: number) => any;
    readonly wasmchess_getNags: (a: number, b: number, c: number) => [number, number];
    readonly wasmchess_getSuffixAnnotation: (a: number, b: number, c: number) => [number, number];
    readonly wasmchess_halfmoves: (a: number) => number;
    readonly wasmchess_historySan: (a: number) => [number, number];
    readonly wasmchess_historyUci: (a: number) => [number, number];
    readonly wasmchess_historyVerbose: (a: number) => [number, number];
    readonly wasmchess_isAttacked: (a: number, b: any, c: number) => number;
    readonly wasmchess_isCheck: (a: number) => number;
    readonly wasmchess_isCheckmate: (a: number) => number;
    readonly wasmchess_isDraw: (a: number) => number;
    readonly wasmchess_isDrawByFiftyMoves: (a: number) => number;
    readonly wasmchess_isGameOver: (a: number) => number;
    readonly wasmchess_isInsufficientMaterial: (a: number) => number;
    readonly wasmchess_isPromotion: (a: number, b: any) => number;
    readonly wasmchess_isStalemate: (a: number) => number;
    readonly wasmchess_isThreefoldRepetition: (a: number) => number;
    readonly wasmchess_legalMovesSan: (a: number, b: number) => [number, number];
    readonly wasmchess_legalMovesUci: (a: number, b: number) => [number, number];
    readonly wasmchess_legalMovesVerbose: (a: number, b: number) => [number, number];
    readonly wasmchess_length: (a: number) => number;
    readonly wasmchess_load: (a: number, b: number, c: number, d: number) => [number, number];
    readonly wasmchess_loadPgn: (a: number, b: number, c: number) => [number, number];
    readonly wasmchess_move: (a: number, b: number, c: number) => [number, number, number];
    readonly wasmchess_moveAt: (a: number, b: number) => any;
    readonly wasmchess_moveFromObj: (a: number, b: any) => [number, number, number];
    readonly wasmchess_new: (a: number, b: number) => [number, number, number];
    readonly wasmchess_perft: (a: number, b: number) => bigint;
    readonly wasmchess_pgn: (a: number, b: number) => [number, number];
    readonly wasmchess_playMovesBatch: (a: number, b: number, c: number) => [number, number, number, number];
    readonly wasmchess_put: (a: number, b: any, c: any) => number;
    readonly wasmchess_removeComment: (a: number) => [number, number];
    readonly wasmchess_removeComments: (a: number) => [number, number];
    readonly wasmchess_removeHeader: (a: number, b: number, c: number) => number;
    readonly wasmchess_removeNag: (a: number, b: number, c: number, d: number, e: number) => number;
    readonly wasmchess_removeNags: (a: number, b: number, c: number) => [number, number];
    readonly wasmchess_removeSuffixAnnotation: (a: number, b: number, c: number) => [number, number];
    readonly wasmchess_reset: (a: number) => void;
    readonly wasmchess_setCastlingRights: (a: number, b: any, c: any) => number;
    readonly wasmchess_setComment: (a: number, b: number, c: number) => void;
    readonly wasmchess_setHeader: (a: number, b: number, c: number, d: number, e: number) => any;
    readonly wasmchess_setNags: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly wasmchess_setSuffixAnnotation: (a: number, b: number, c: number, d: number, e: number) => [number, number];
    readonly wasmchess_setTurn: (a: number, b: any) => [number, number, number];
    readonly wasmchess_sideToMoveAt: (a: number, b: number) => any;
    readonly wasmchess_simulateMove: (a: number, b: number, c: number) => [number, number, number];
    readonly wasmchess_squareColor: (a: number, b: any) => any;
    readonly wasmchess_turn: (a: number) => any;
    readonly wasmchess_undo: (a: number) => any;
    readonly wasmchess_validateFen: (a: number, b: number, c: number) => any;
    readonly wasmchess_zobristHash: (a: number) => bigint;
    readonly wasmchess_moveNumber: (a: number) => number;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __externref_table_alloc: () => number;
    readonly __externref_drop_slice: (a: number, b: number) => void;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
