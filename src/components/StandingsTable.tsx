import { memo } from "react";
import { EngineLogo } from "./EngineLogo";
import { useEventStore } from "../context/EventContext";

import "./StandingsTable.css";

export const StandingsTable = memo(function () {
  const engines = useEventStore((state) => state.engines) ?? [];

  return (
    <div className="standingsWrapper">
      <table className="standings">
        <tbody>
          {engines.map((engine, index) => (
            <tr key={engine.id} className="standingsEntry">
              <td className="placement">#{index + 1}</td>
              <td className="logo">
                <EngineLogo engine={engine} />
              </td>
              <td className="name">{engine.name}</td>
              <td className="score">
                {engine.points} / {engine.playedGames}
              </td>
              <td className="perf">{engine.perf}%</td>
              <td className="rating">{engine.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
