import { Line } from "react-chartjs-2";
import type { CCCEngine, CCCLiveInfo } from "../types";
import { useState } from "react";
import "./GameGraph.css";
import type { LiveInfoEntry } from "./LiveInfo";

type GameGraphProps = {
  liveInfosWhite: LiveInfoEntry[];
  liveInfosBlack: LiveInfoEntry[];
  liveInfosKibitzer: LiveInfoEntry[];
  white: CCCEngine;
  black: CCCEngine;
  setCurrentMoveNumber: (moveNumber: number) => void;
  currentMoveNumber: number;
};

const MODES = [
  {
    name: "Eval",
    map: function (liveInfo?: CCCLiveInfo) {
      if (!liveInfo) return NaN;
      if (liveInfo.info.score.includes("+M")) return 10.0;
      if (liveInfo.info.score.includes("-M")) return -10.0;
      return Math.min(Math.max(Number(liveInfo.info.score), -10.0), 10.0);
    },
  },
  {
    name: "Depth",
    map: function (liveInfo?: CCCLiveInfo) {
      return Number(liveInfo?.info.depth);
    },
  },
  {
    name: "Nodes",
    map: function (liveInfo?: CCCLiveInfo) {
      return Number(liveInfo?.info.nodes);
    },
  },
  {
    name: "Time",
    map: function (liveInfo?: CCCLiveInfo) {
      return Number(liveInfo?.info.time) / 1000;
    },
  },
  {
    name: "Speed",
    map: function (liveInfo?: CCCLiveInfo) {
      return Number(liveInfo?.info.speed);
    },
  },
  {
    name: "TB Hits",
    map: function (liveInfo?: CCCLiveInfo) {
      return Number(liveInfo?.info.tbhits);
    },
  },
  {
    name: "Hashfull",
    map: function (liveInfo?: CCCLiveInfo) {
      return Number(liveInfo?.info.hashfull);
    },
  },
];

export function GameGraph({
  liveInfosBlack,
  liveInfosWhite,
  white,
  black,
  liveInfosKibitzer,
  setCurrentMoveNumber,
  currentMoveNumber,
}: GameGraphProps) {
  const [mode, setMode] = useState(0);

  const bookPlies = liveInfosWhite.findIndex((liveInfo) => !!liveInfo);

  const labels = Array.from(
    {
      length:
        Math.max(
          liveInfosWhite.length,
          liveInfosBlack.length,
          liveInfosKibitzer.length
        ) - bookPlies,
    },
    (_, i) => String(i + 1 + bookPlies)
  );

  const data = {
    labels,
    datasets: [
      {
        label: black.name,
        data: liveInfosBlack.slice(bookPlies).map(MODES[mode].map),
        borderColor: "rgba(0, 0, 0, 0.7)",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        spanGaps: true,
      },
      {
        label: white.name,
        data: liveInfosWhite.slice(bookPlies).map(MODES[mode].map),
        borderColor: "rgba(255, 255, 255, 0.7)",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        spanGaps: true,
      },
      {
        label: "Kibitzer",
        data: liveInfosKibitzer.slice(bookPlies).map(MODES[mode].map),
        borderColor: "rgba(21, 101, 192, 0.7)",
        backgroundColor: "rgba(21, 101, 192, 0.7)",
        spanGaps: true,
      },
    ],
  };

  return (
    <div className="gameGraph">
      <div className="modeSelectorList">
        {MODES.map((m, i) => (
          <button
            key={m.name}
            onClick={() => setMode(i)}
            className={"modeSelector" + (mode === i ? " active" : "")}
          >
            {m.name}
          </button>
        ))}
      </div>
      <div className="graphWrapper">
        <Line
          options={{
            animation: false,
            responsive: true,
            maintainAspectRatio: false,
            transitions: { active: { animation: { duration: 0 } } },
            elements: {
              line: { tension: 0 },
              // point: { radius: 0 },
            },
            plugins: {
              legend: { display: false, onClick: undefined },
              // @ts-ignore
              verticalLine: { index: currentMoveNumber - bookPlies },
            },
            onClick: (_, elements) => {
              setCurrentMoveNumber(elements[0].index + bookPlies);
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: (context) => {
                    const val = context.tick.value;
                    if (mode === 0 && (val === 1 || val === -1))
                      return "rgba(0, 0, 0, 0.25)";
                    if (mode === 0 && val === 0) return "rgba(0, 0, 0, 0.5)";
                    return "rgba(0, 0, 0, 0.05)";
                  },
                },
              },
            },
          }}
          plugins={[
            {
              id: "verticalLine",
              afterDraw: (chart, _, options) => {
                const {
                  ctx,
                  chartArea: { top, bottom, left, right },
                  scales: { x },
                } = chart;

                const xPos = x.getPixelForValue(options.index);

                if (xPos >= left && xPos <= right) {
                  ctx.save();
                  ctx.beginPath();

                  ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
                  ctx.lineWidth = 1;

                  ctx.moveTo(xPos, top);
                  ctx.lineTo(xPos, bottom);
                  ctx.stroke();

                  ctx.restore();
                }
              },
            },
          ]}
          data={data}
        />
      </div>
    </div>
  );
}
