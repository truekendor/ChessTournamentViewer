import type { CCCEngine } from "../types";
import "./StandingsTable.css"

type StandingsTableProps = {
    engines: CCCEngine[]
}

export function StandingsTable({engines}: StandingsTableProps) {
    return (
        <table className="standings">
            <tbody>
                {engines.map((engine, index) => {
                    const playedGames = Math.round(100 * Number(engine.points) / Number(engine.perf))
                    return (
                        <tr key={engine.id} className="standingsEntry">
                            <td>#{index + 1}</td>
                            <td>{engine.name}</td>
                            <td className="standingsScore">{engine.points} / {playedGames}.00</td>
                            <td className="perf">{engine.perf}%</td>
                            <td className="rating">{engine.rating}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}