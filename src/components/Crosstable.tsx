import type { CCCEngine, CCCEventUpdate, CCCGame } from "../types";
import "./Crosstable.css"

type CrosstableProps = {
    engines: CCCEngine[]
    cccEvent: CCCEventUpdate
}

export function Crosstable({engines, cccEvent}: CrosstableProps) {
    return (
        <table className="crosstable">
            <tbody>
                <tr>
                    <td></td>
                    {engines.map(engine => (
                        <td key={engine.id}>{engine.name}</td>
                    ))}
                </tr>
                {engines.map((engine, i) => (
                    <tr key={engine.id}>
                        <td>#{i + 1}. {engine.name}</td>
                        {engines.map(engine2 => {
                            const games = cccEvent.tournamentDetails.schedule.past.filter(game => game.blackId === engine.id && game.whiteId === engine2.id || game.whiteId === engine.id && game.blackId === engine2.id)
                            const gamePairs: [CCCGame, CCCGame][] = [];
                            for (let i = 0; i < games.length; i += 2) {
                                gamePairs.push(games.slice(i, i + 2) as [CCCGame, CCCGame]);
                            }
                            return (
                                <td key={engine2.id}>
                                    <div className="h2h">
                                        {gamePairs.map(gamePair => {
                                            const whiteWin1 = engine.id === gamePair[0].whiteId ? "win" : "loss"
                                            const blackWin1 = engine.id === gamePair[0].blackId ? "win" : "loss"
                                            const result1 = gamePair[0].outcome === "1-0" ? whiteWin1 : gamePair[0].outcome === "0-1" ? blackWin1 : "draw"

                                            const whiteWin2 = engine.id === gamePair[1].whiteId ? "win" : "loss"
                                            const blackWin2 = engine.id === gamePair[1].blackId ? "win" : "loss"
                                            const result2 = gamePair[1].outcome === "1-0" ? whiteWin2 : gamePair[1].outcome === "0-1" ? blackWin2 : "draw"

                                            const text1 = result1 === "win" ? "1" : result1 === "loss" ? "0" : "½"
                                            const text2 = result2 === "win" ? "1" : result2 === "loss" ? "0" : "½"

                                            const pairResult =
                                                result1 === "win" && result2 !== "loss" || result2 === "win" && result1 !== "loss" ? "win" :
                                                    result1 === "loss" && result2 !== "win" || result2 === "loss" && result1 !== "win" ? "loss" :
                                                        "";
                                            return (
                                                <span key={gamePair[0].gameNr} className={"gamePair " + pairResult}>
                                                    <span className={result1}>{text1}</span>
                                                    <span className={result2}>{text2}</span>
                                                </span>
                                            )
                                        })}
                                    </div>
                                </td>
                            )
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}