import { Chessground } from '@lichess-org/chessground'
import { Chess, Move, type Square } from 'chess.js'
import { useEffect, useRef, useState } from 'react'
import { CCCWebSocket } from './websocket'
import type { Api } from '@lichess-org/chessground/api'
import type { CCCLiveInfo, CCCEngine, CCCMessage, CCCEventUpdate } from './types'
import type { DrawShape } from '@lichess-org/chessground/draw'
import './App.css'

function App() {

    const boardElementRef = useRef<HTMLDivElement>(null)
    const boardRef = useRef<Api>(null)
    const whiteArrow = useRef<[DrawShape, DrawShape]>(null)
    const blackArrow = useRef<[DrawShape, DrawShape]>(null)
    const game = useRef(new Chess())
    const ws = useRef(new CCCWebSocket("wss://ccc-api.gcp-prod.chess.com/ws"))

    const [cccEvent, setCccEvent] = useState<CCCEventUpdate>()
    const [white, setWhite] = useState<CCCEngine>()
    const [black, setBlack] = useState<CCCEngine>()

    const [liveInfoWhite, setLiveInfoWhite] = useState<CCCLiveInfo>()
    const [liveInfoBlack, setLiveInfoBlack] = useState<CCCLiveInfo>()

    function getArrows() {
        const arrows: DrawShape[] = []
        if (whiteArrow.current)
            arrows.push(whiteArrow.current[0])
        if (blackArrow.current)
            arrows.push(blackArrow.current[0])
        return arrows;
    }

    function updateBoard(lastMove: [Square, Square]) {
        boardRef.current?.set({
            fen: game.current.fen(),
            lastMove: lastMove,
            drawable: {
                // @ts-ignore
                brushes: {
                    white: {
                        key: "white",
                        color: "#fff",
                        opacity: 0.7,
                        lineWidth: 10,
                    },
                    black: {
                        key: "black",
                        color: "#000",
                        opacity: 0.7,
                        lineWidth: 10,
                    }
                },
                enabled: false,
                eraseOnMovablePieceClick: false,
                shapes: getArrows()
            }
        })
    }

    function handleMessage(msg: CCCMessage) {
        let lastMove: Move

        switch (msg.type) {

            case "eventUpdate":
                setCccEvent(msg)

                const currentGame = msg.tournamentDetails.schedule.present
                setWhite(msg.tournamentDetails.engines.find(engine => engine.id === currentGame.whiteId))
                setBlack(msg.tournamentDetails.engines.find(engine => engine.id === currentGame.blackId))

                break;

            case "gameUpdate":
                game.current.loadPgn(msg.gameDetails.pgn)
                lastMove = game.current.history({ verbose: true }).at(-1)!!
                updateBoard([lastMove.from, lastMove.to])

                break;

            case "liveInfo":
                const pv = msg.info.pv.split(" ")
                const nextMove = pv[0]
                const secondNextMove = pv.length > 1 ? pv[1] : pv[0]
                const arrow: [DrawShape, DrawShape] = [
                    { orig: nextMove.slice(0, 2) as Square, dest: nextMove.slice(2, 4) as Square, brush: msg.info.color },
                    { orig: secondNextMove.slice(0, 2) as Square, dest: secondNextMove.slice(2, 4) as Square, brush: msg.info.color },
                ]

                if (msg.info.color == "white") {
                    setLiveInfoWhite(msg)
                    whiteArrow.current = arrow
                }
                else {
                    setLiveInfoBlack(msg)
                    blackArrow.current = arrow
                }

                lastMove = game.current.history({ verbose: true }).at(-1)!!
                updateBoard([lastMove.from, lastMove.to])

                break;

            case "eventsListUpdate":

                break;

            case "clocks":

                break;

            case "newMove":
                const from = msg.move.slice(0, 2) as Square
                const to = msg.move.slice(2, 4) as Square
                const promo = msg.move?.[4]

                if (game.current.turn() == "w" && whiteArrow.current) {
                    whiteArrow.current = [whiteArrow.current[1], whiteArrow.current[0]]
                } else if (blackArrow.current) {
                    blackArrow.current = [blackArrow.current[1], blackArrow.current[0]]
                }

                game.current.move({ from, to, promotion: promo as any })
                updateBoard([from, to])

                break
        }
    }

    useEffect(() => {
        if (boardRef.current || !boardElementRef.current) return;

        boardRef.current = Chessground(boardElementRef.current, {
            fen: game.current.fen(),
            orientation: 'white',
            movable: { free: false, color: undefined, dests: undefined },
            selectable: { enabled: false },
        })

        ws.current.connect(handleMessage)

        return () => ws.current.disconnect();
    }, [boardElementRef.current])

    const sortedEngines = cccEvent?.tournamentDetails.engines.sort((a, b) => Number(b.points) - Number(a.points)) ?? []

    return (
        <div className="app">

            <div className="boardWindow">
                {liveInfoBlack && black && <EngineComponent info={liveInfoBlack} engine={black} />}

                <div ref={boardElementRef} className="board"></div>

                {liveInfoWhite && white && <EngineComponent info={liveInfoWhite} engine={white} />}
            </div>

            <div className="standingsWindow">
                <h2>Standings</h2>
                <div className="standings">
                    {sortedEngines.map((engine, index) => {
                        const playedGames = Number(cccEvent?.tournamentDetails.schedule.past.filter(game => game.blackId === engine.id || game.whiteId === engine.id).length);
                        return (
                            <div key={engine.id} className="standingsEntry">
                                <div>#{index + 1}</div>
                                <div>{engine.name}</div>
                                <div className="standingsScore">{engine.points} / {playedGames}.00 ({engine.perf}%)</div>
                                <div>{engine.rating}</div>
                            </div>
                        )
                    })}
                </div>
            </div>

        </div>
    )
}

type EngineComponentProps = {
    info: CCCLiveInfo
    engine: CCCEngine
}

function EngineComponent({ engine, info }: EngineComponentProps) {
    return (
        <div className="engine">
            <img src={"https://images.chesscomfiles.com/chess-themes/computer_chess_championship/avatars/" + engine.imageUrl + ".png"} />
            <span className="engine-name">{engine.name}</span>
            <span className="engine-eval">{info.info.score}</span>
            <span className="engine-field"> D: <span>{info.info.depth} / {info.info.seldepth}</span></span>
            <span className="engine-field"> N: <span>{info.info.nodes}</span></span>
            <span className="engine-field"> NPS: <span>{info.info.speed}</span></span>
        </div>
    )
}

export default App
