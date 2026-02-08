import type { CCCEngine } from "../types";
import "./StandingsTable.css"

type StandingsTableProps = {
    engines: CCCEngine[]
}

export function StandingsTable({engines}: StandingsTableProps) {

    const sortedEngines = engines.sort((a, b) => Number(b.points) - Number(a.points)) ?? []

    return (
        <div className="standings">
            {sortedEngines.map((engine, index) => {
                const playedGames = Math.round(100 * Number(engine.points) / Number(engine.perf))
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
    )
}