/* @ts-self-types="./chess_wasm.d.ts" */

export class WasmChess {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmChessFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmchess_free(ptr, 0);
    }
    /**
     * @param {string} nag
     * @param {string | null} [fen]
     */
    addNag(nag, fen) {
        const ptr0 = passStringToWasm0(nag, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(fen) ? 0 : passStringToWasm0(fen, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        wasm.wasmchess_addNag(this.__wbg_ptr, ptr0, len0, ptr1, len1);
    }
    /**
     * @returns {string}
     */
    ascii() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.wasmchess_ascii(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {SquareStr} square
     * @param {ColorChar | null} [attacked_by_side]
     * @returns {SquareStr[]}
     */
    attackers(square, attacked_by_side) {
        const ret = wasm.wasmchess_attackers(this.__wbg_ptr, square, isLikeNone(attacked_by_side) ? 0 : addToExternrefTable0(attacked_by_side));
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {BoardState}
     */
    board() {
        const ret = wasm.wasmchess_board(this.__wbg_ptr);
        return ret;
    }
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
     * @returns {string}
     */
    boardFen() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.wasmchess_boardFen(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {boolean | null} [force_en_passant_square]
     * @returns {string}
     */
    fen(force_en_passant_square) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.wasmchess_fen(this.__wbg_ptr, isLikeNone(force_en_passant_square) ? 0xFFFFFF : force_en_passant_square ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
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
     * @param {number} index
     * @returns {string}
     */
    fenAt(index) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.wasmchess_fenAt(this.__wbg_ptr, index);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
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
     * @param {string} piece
     * @returns {SquareStr[]}
     */
    findPiece(piece) {
        const ptr0 = passStringToWasm0(piece, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmchess_findPiece(this.__wbg_ptr, ptr0, len0);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v2 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v2;
    }
    /**
     * @param {PieceObj} piece
     * @returns {SquareStr[]}
     */
    findPieceByType(piece) {
        const ret = wasm.wasmchess_findPieceByType(this.__wbg_ptr, piece);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {number}
     */
    fullmoves() {
        const ret = wasm.wasmchess_fullmoves(this.__wbg_ptr);
        return ret >>> 0;
    }
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
     * @param {SquareStr} square
     * @returns {PieceObj | undefined}
     */
    get(square) {
        const ret = wasm.wasmchess_get(this.__wbg_ptr, square);
        return ret;
    }
    /**
     * @param {ColorChar} color_char
     * @returns {CastlingObj}
     */
    getCastlingRights(color_char) {
        const ret = wasm.wasmchess_getCastlingRights(this.__wbg_ptr, color_char);
        return ret;
    }
    /**
     * @returns {string | undefined}
     */
    getComment() {
        const ret = wasm.wasmchess_getComment(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {CommentsObj[]}
     */
    getComments() {
        const ret = wasm.wasmchess_getComments(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {HeadersObj}
     */
    getHeaders() {
        const ret = wasm.wasmchess_getHeaders(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string | null} [fen]
     * @returns {string[]}
     */
    getNags(fen) {
        var ptr0 = isLikeNone(fen) ? 0 : passStringToWasm0(fen, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmchess_getNags(this.__wbg_ptr, ptr0, len0);
        var v2 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v2;
    }
    /**
     * @param {string | null} [fen]
     * @returns {string | undefined}
     */
    getSuffixAnnotation(fen) {
        var ptr0 = isLikeNone(fen) ? 0 : passStringToWasm0(fen, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmchess_getSuffixAnnotation(this.__wbg_ptr, ptr0, len0);
        let v2;
        if (ret[0] !== 0) {
            v2 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v2;
    }
    /**
     * @returns {number}
     */
    halfmoves() {
        const ret = wasm.wasmchess_halfmoves(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {string[]}
     */
    historySan() {
        const ret = wasm.wasmchess_historySan(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {string[]}
     */
    historyUci() {
        const ret = wasm.wasmchess_historyUci(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {MoveVerbose[]}
     */
    historyVerbose() {
        const ret = wasm.wasmchess_historyVerbose(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {SquareStr} square
     * @param {ColorChar | null} [attacked_by_side]
     * @returns {boolean}
     */
    isAttacked(square, attacked_by_side) {
        const ret = wasm.wasmchess_isAttacked(this.__wbg_ptr, square, isLikeNone(attacked_by_side) ? 0 : addToExternrefTable0(attacked_by_side));
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    isCheck() {
        const ret = wasm.wasmchess_isCheck(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    isCheckmate() {
        const ret = wasm.wasmchess_isCheckmate(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    isDraw() {
        const ret = wasm.wasmchess_isDraw(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    isDrawByFiftyMoves() {
        const ret = wasm.wasmchess_isDrawByFiftyMoves(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    isGameOver() {
        const ret = wasm.wasmchess_isGameOver(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    isInsufficientMaterial() {
        const ret = wasm.wasmchess_isInsufficientMaterial(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Checks if a move from the given squares would result in a promotion.
     *
     * # Returns
     * `true` if the move would promote a pawn, `false` otherwise
     * @param {MoveFromSquares} move_obj
     * @returns {boolean}
     */
    isPromotion(move_obj) {
        const ret = wasm.wasmchess_isPromotion(this.__wbg_ptr, move_obj);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    isStalemate() {
        const ret = wasm.wasmchess_isStalemate(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    isThreefoldRepetition() {
        const ret = wasm.wasmchess_isThreefoldRepetition(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {LegalMovesFilterOptions | null} [filter_options]
     * @returns {string[]}
     */
    legalMovesSan(filter_options) {
        const ret = wasm.wasmchess_legalMovesSan(this.__wbg_ptr, isLikeNone(filter_options) ? 0 : addToExternrefTable0(filter_options));
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {LegalMovesFilterOptions | null} [filter_options]
     * @returns {string[]}
     */
    legalMovesUci(filter_options) {
        const ret = wasm.wasmchess_legalMovesUci(this.__wbg_ptr, isLikeNone(filter_options) ? 0 : addToExternrefTable0(filter_options));
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * # API Discrepancy: chess.js Compatibility
     *
     * This implementation differs from chess.js in how it handles the
     * en passant square in verbose move objects.
     *
     * |      Aspect       |           chess.js             |      This Implementation      |
     * |-------------------|--------------------------------|-------------------------------|
     * | En passant square | Always included when available | Only included for legal moves |
     * @param {LegalMovesFilterOptions | null} [filter_options]
     * @returns {MoveVerbose[]}
     */
    legalMovesVerbose(filter_options) {
        const ret = wasm.wasmchess_legalMovesVerbose(this.__wbg_ptr, isLikeNone(filter_options) ? 0 : addToExternrefTable0(filter_options));
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {number}
     */
    length() {
        const ret = wasm.wasmchess_length(this.__wbg_ptr);
        return ret >>> 0;
    }
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
     * @param {string} starting_fen
     * @param {PreserveHeaders | null} [preserve_headers]
     */
    load(starting_fen, preserve_headers) {
        const ptr0 = passStringToWasm0(starting_fen, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmchess_load(this.__wbg_ptr, ptr0, len0, isLikeNone(preserve_headers) ? 0 : addToExternrefTable0(preserve_headers));
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {string} pgn
     */
    loadPgn(pgn) {
        const ptr0 = passStringToWasm0(pgn, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmchess_loadPgn(this.__wbg_ptr, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
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
     * @param {string} move_str
     * @returns {MoveVerbose}
     */
    move(move_str) {
        const ptr0 = passStringToWasm0(move_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmchess_move(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
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
     * @param {number} index
     * @returns {MoveObject | undefined}
     */
    moveAt(index) {
        const ret = wasm.wasmchess_moveAt(this.__wbg_ptr, index);
        return ret;
    }
    /**
     * @param {MoveObject} move_obj
     * @returns {MoveVerbose}
     */
    moveFromObj(move_obj) {
        const ret = wasm.wasmchess_moveFromObj(this.__wbg_ptr, move_obj);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {number}
     */
    moveNumber() {
        const ret = wasm.wasmchess_moveNumber(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {string | null} [fen]
     */
    constructor(fen) {
        var ptr0 = isLikeNone(fen) ? 0 : passStringToWasm0(fen, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmchess_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        WasmChessFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} depth
     * @returns {bigint}
     */
    perft(depth) {
        const ret = wasm.wasmchess_perft(this.__wbg_ptr, depth);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {PGNOptions | null} [options]
     * @returns {string}
     */
    pgn(options) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.wasmchess_pgn(this.__wbg_ptr, isLikeNone(options) ? 0 : addToExternrefTable0(options));
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
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
     * @param {string[]} moves
     * @returns {MoveVerbose[]}
     */
    playMovesBatch(moves) {
        const ptr0 = passArrayJsValueToWasm0(moves, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmchess_playMovesBatch(this.__wbg_ptr, ptr0, len0);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v2 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v2;
    }
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
     * @param {PieceObj} piece_obj
     * @param {SquareStr} square
     * @returns {boolean}
     */
    put(piece_obj, square) {
        const ret = wasm.wasmchess_put(this.__wbg_ptr, piece_obj, square);
        return ret !== 0;
    }
    /**
     * @returns {string | undefined}
     */
    removeComment() {
        const ret = wasm.wasmchess_removeComment(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {PrunedCommentsObj[]}
     */
    removeComments() {
        const ret = wasm.wasmchess_removeComments(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {string} key
     * @returns {boolean}
     */
    removeHeader(key) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmchess_removeHeader(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
     * @param {string} nag
     * @param {string | null} [fen]
     * @returns {boolean}
     */
    removeNag(nag, fen) {
        const ptr0 = passStringToWasm0(nag, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(fen) ? 0 : passStringToWasm0(fen, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        const ret = wasm.wasmchess_removeNag(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return ret !== 0;
    }
    /**
     * @param {string | null} [fen]
     * @returns {string[]}
     */
    removeNags(fen) {
        var ptr0 = isLikeNone(fen) ? 0 : passStringToWasm0(fen, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmchess_removeNags(this.__wbg_ptr, ptr0, len0);
        var v2 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v2;
    }
    /**
     * @param {string | null} [fen]
     * @returns {string | undefined}
     */
    removeSuffixAnnotation(fen) {
        var ptr0 = isLikeNone(fen) ? 0 : passStringToWasm0(fen, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmchess_removeSuffixAnnotation(this.__wbg_ptr, ptr0, len0);
        let v2;
        if (ret[0] !== 0) {
            v2 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v2;
    }
    /**
     * resets to default starting position
     * and clears all history and pgn related data
     */
    reset() {
        wasm.wasmchess_reset(this.__wbg_ptr);
    }
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
     * @param {ColorChar} color
     * @param {CastlingObj} castling_obj
     * @returns {boolean}
     */
    setCastlingRights(color, castling_obj) {
        const ret = wasm.wasmchess_setCastlingRights(this.__wbg_ptr, color, castling_obj);
        return ret !== 0;
    }
    /**
     * @param {string} comment
     */
    setComment(comment) {
        const ptr0 = passStringToWasm0(comment, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.wasmchess_setComment(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} key
     * @param {string} value
     * @returns {HeadersObj}
     */
    setHeader(key, value) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.wasmchess_setHeader(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return ret;
    }
    /**
     * @param {string[]} nags
     * @param {string | null} [fen]
     */
    setNags(nags, fen) {
        const ptr0 = passArrayJsValueToWasm0(nags, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(fen) ? 0 : passStringToWasm0(fen, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        wasm.wasmchess_setNags(this.__wbg_ptr, ptr0, len0, ptr1, len1);
    }
    /**
     * @param {string} suffix
     * @param {string | null} [fen]
     */
    setSuffixAnnotation(suffix, fen) {
        const ptr0 = passStringToWasm0(suffix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(fen) ? 0 : passStringToWasm0(fen, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        const ret = wasm.wasmchess_setSuffixAnnotation(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
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
     * @param {ColorChar} color
     * @returns {boolean}
     */
    setTurn(color) {
        const ret = wasm.wasmchess_setTurn(this.__wbg_ptr, color);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] !== 0;
    }
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
     * @param {number} index
     * @returns {ColorChar}
     */
    sideToMoveAt(index) {
        const ret = wasm.wasmchess_sideToMoveAt(this.__wbg_ptr, index);
        return ret;
    }
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
     * @param {string} move_str
     * @returns {MoveVerbose}
     */
    simulateMove(move_str) {
        const ptr0 = passStringToWasm0(move_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmchess_simulateMove(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {SquareStr} square
     * @returns {SquareColor | undefined}
     */
    squareColor(square) {
        const ret = wasm.wasmchess_squareColor(this.__wbg_ptr, square);
        return ret;
    }
    /**
     * @returns {ColorChar}
     */
    turn() {
        const ret = wasm.wasmchess_turn(this.__wbg_ptr);
        return ret;
    }
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
     * @returns {MoveVerbose | undefined}
     */
    undo() {
        const ret = wasm.wasmchess_undo(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} fen
     * @returns {OkOrError}
     */
    validateFen(fen) {
        const ptr0 = passStringToWasm0(fen, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmchess_validateFen(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @returns {bigint}
     */
    zobristHash() {
        const ret = wasm.wasmchess_zobristHash(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
}
if (Symbol.dispose) WasmChess.prototype[Symbol.dispose] = WasmChess.prototype.free;

/**
 * @param {string} common_fen
 * @param {string[]} move_list_current
 * @param {string[]} move_list_reverse
 * @returns {TranspositionDataEntry[]}
 */
export function findDivergence(common_fen, move_list_current, move_list_reverse) {
    const ptr0 = passStringToWasm0(common_fen, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayJsValueToWasm0(move_list_current, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passArrayJsValueToWasm0(move_list_reverse, wasm.__wbindgen_malloc);
    const len2 = WASM_VECTOR_LEN;
    const ret = wasm.findDivergence(ptr0, len0, ptr1, len1, ptr2, len2);
    var v4 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v4;
}

/**
 * converts Vec of moves in SAN/LAN format, into Vec of SAN moves
 * @param {string[]} moves
 * @param {string | null} [starting_fen]
 * @returns {MovesAndError}
 */
export function movesToSan(moves, starting_fen) {
    const ptr0 = passArrayJsValueToWasm0(moves, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    var ptr1 = isLikeNone(starting_fen) ? 0 : passStringToWasm0(starting_fen, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    const ret = wasm.movesToSan(ptr0, len0, ptr1, len1);
    return ret;
}

/**
 * converts Vec of moves in SAN/LAN format, into Vec of UCI moves
 * @param {string[]} moves
 * @param {string | null} [starting_fen]
 * @returns {MovesAndError}
 */
export function movesToUci(moves, starting_fen) {
    const ptr0 = passArrayJsValueToWasm0(moves, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    var ptr1 = isLikeNone(starting_fen) ? 0 : passStringToWasm0(starting_fen, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    const ret = wasm.movesToUci(ptr0, len0, ptr1, len1);
    return ret;
}

function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg_Error_2e59b1b37a9a34c3: function(arg0, arg1) {
            const ret = Error(getStringFromWasm0(arg0, arg1));
            return ret;
        },
        __wbg_Number_e6ffdb596c888833: function(arg0) {
            const ret = Number(arg0);
            return ret;
        },
        __wbg_String_8564e559799eccda: function(arg0, arg1) {
            const ret = String(arg1);
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_bigint_get_as_i64_2c5082002e4826e2: function(arg0, arg1) {
            const v = arg1;
            const ret = typeof(v) === 'bigint' ? v : undefined;
            getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
        },
        __wbg___wbindgen_boolean_get_a86c216575a75c30: function(arg0) {
            const v = arg0;
            const ret = typeof(v) === 'boolean' ? v : undefined;
            return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
        },
        __wbg___wbindgen_debug_string_dd5d2d07ce9e6c57: function(arg0, arg1) {
            const ret = debugString(arg1);
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_in_4bd7a57e54337366: function(arg0, arg1) {
            const ret = arg0 in arg1;
            return ret;
        },
        __wbg___wbindgen_is_bigint_6c98f7e945dacdde: function(arg0) {
            const ret = typeof(arg0) === 'bigint';
            return ret;
        },
        __wbg___wbindgen_is_object_40c5a80572e8f9d3: function(arg0) {
            const val = arg0;
            const ret = typeof(val) === 'object' && val !== null;
            return ret;
        },
        __wbg___wbindgen_is_string_b29b5c5a8065ba1a: function(arg0) {
            const ret = typeof(arg0) === 'string';
            return ret;
        },
        __wbg___wbindgen_is_undefined_c0cca72b82b86f4d: function(arg0) {
            const ret = arg0 === undefined;
            return ret;
        },
        __wbg___wbindgen_jsval_eq_7d430e744a913d26: function(arg0, arg1) {
            const ret = arg0 === arg1;
            return ret;
        },
        __wbg___wbindgen_jsval_loose_eq_3a72ae764d46d944: function(arg0, arg1) {
            const ret = arg0 == arg1;
            return ret;
        },
        __wbg___wbindgen_number_get_7579aab02a8a620c: function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'number' ? obj : undefined;
            getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
        },
        __wbg___wbindgen_string_get_914df97fcfa788f2: function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'string' ? obj : undefined;
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_throw_81fc77679af83bc6: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg_entries_616b1a459b85be0b: function(arg0) {
            const ret = Object.entries(arg0);
            return ret;
        },
        __wbg_get_4848e350b40afc16: function(arg0, arg1) {
            const ret = arg0[arg1 >>> 0];
            return ret;
        },
        __wbg_get_with_ref_key_6412cf3094599694: function(arg0, arg1) {
            const ret = arg0[arg1];
            return ret;
        },
        __wbg_instanceof_ArrayBuffer_ff7c1337a5e3b33a: function(arg0) {
            let result;
            try {
                result = arg0 instanceof ArrayBuffer;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_Uint8Array_4b8da683deb25d72: function(arg0) {
            let result;
            try {
                result = arg0 instanceof Uint8Array;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_isSafeInteger_ea83862ba994770c: function(arg0) {
            const ret = Number.isSafeInteger(arg0);
            return ret;
        },
        __wbg_length_0c32cb8543c8e4c8: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_length_6e821edde497a532: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_new_4f9fafbb3909af72: function() {
            const ret = new Object();
            return ret;
        },
        __wbg_new_99cabae501c0a8a0: function() {
            const ret = new Map();
            return ret;
        },
        __wbg_new_a560378ea1240b14: function(arg0) {
            const ret = new Uint8Array(arg0);
            return ret;
        },
        __wbg_new_f3c9df4f38f3f798: function() {
            const ret = new Array();
            return ret;
        },
        __wbg_prototypesetcall_3e05eb9545565046: function(arg0, arg1, arg2) {
            Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
        },
        __wbg_set_08463b1df38a7e29: function(arg0, arg1, arg2) {
            const ret = arg0.set(arg1, arg2);
            return ret;
        },
        __wbg_set_6be42768c690e380: function(arg0, arg1, arg2) {
            arg0[arg1] = arg2;
        },
        __wbg_set_6c60b2e8ad0e9383: function(arg0, arg1, arg2) {
            arg0[arg1 >>> 0] = arg2;
        },
        __wbindgen_cast_0000000000000001: function(arg0) {
            // Cast intrinsic for `F64 -> Externref`.
            const ret = arg0;
            return ret;
        },
        __wbindgen_cast_0000000000000002: function(arg0, arg1) {
            // Cast intrinsic for `Ref(String) -> Externref`.
            const ret = getStringFromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_cast_0000000000000003: function(arg0) {
            // Cast intrinsic for `U64 -> Externref`.
            const ret = BigInt.asUintN(64, arg0);
            return ret;
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./chess_wasm_bg.js": import0,
    };
}

const WasmChessFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmchess_free(ptr >>> 0, 1));

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_externrefs.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    for (let i = 0; i < array.length; i++) {
        const add = addToExternrefTable0(array[i]);
        getDataViewMemory0().setUint32(ptr + 4 * i, add, true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasm;
function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('chess_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
