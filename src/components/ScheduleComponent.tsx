import { useEffect, useRef } from "react"
import type { CCCEngine, CCCEventUpdate } from "../types"
import { EngineLogo } from "./EngineLogo"
import "./ScheduleComponent.css"

type ScheduleComponentProps = {
    engines: CCCEngine[]
    event: CCCEventUpdate
    requestEvent: (gameNr: string) => void
}

export function ScheduleComponent({ engines, event, requestEvent }: ScheduleComponentProps) {

    const scheduleRef = useRef<HTMLDivElement>(null)
    const currentGameRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!scheduleRef.current || !currentGameRef.current) return

        console.log(scheduleRef.current.offsetTop, scheduleRef.current.clientTop, scheduleRef.current.scrollTop)
        console.log(currentGameRef.current.offsetTop, currentGameRef.current.clientTop, currentGameRef.current.scrollTop)
        scheduleRef.current.scrollTop = currentGameRef.current.offsetTop - scheduleRef.current.clientHeight / 2
    }, [scheduleRef.current, currentGameRef.current])

    const gamesList = [
        ...event.tournamentDetails.schedule.past,
        ...(event.tournamentDetails.schedule.present ? [event.tournamentDetails.schedule.present] : []),
        ...event.tournamentDetails.schedule.future
    ]

    return (
        <div className="schedule" ref={scheduleRef}>
            {gamesList.map((game, i) => {
                const gameWhite = engines.find(engine => engine.id === game.whiteId)!!
                const gameBlack = engines.find(engine => engine.id === game.blackId)!!

                const whiteClass = game.outcome === "1-0" ? "winner" : game.outcome === "0-1" ? "loser" : game.timeEnd ? "draw" : "tbd";
                const blackClass = game.outcome === "1-0" ? "loser" : game.outcome === "0-1" ? "winner" : game.timeEnd ? "draw" : "tbd";

                const isCurrentGame = game.gameNr === event.tournamentDetails.schedule.present?.gameNr;
                const gameClass = isCurrentGame ? " active" : "";
                const ref = isCurrentGame ? currentGameRef : null

                return (
                    <div className={"game" + gameClass} ref={ref} key={game.gameNr} onClick={() => requestEvent(game.gameNr)}>
                        <span className="round">#{i + 1}</span>
                        <EngineLogo engine={gameWhite} />
                        <span className={"engineName " + whiteClass}>{gameWhite.name}</span>
                        <span className="vs">vs.</span>
                        <span className={"engineName " + blackClass}>{gameBlack.name}</span>
                        <EngineLogo engine={gameBlack} />
                    </div>
                )
            })}
        </div>
    )
}