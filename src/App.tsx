import {
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import "./App.css";
import { EngineWindow } from "./components/EngineWindow/EngineWindow";
import { EventListWindow } from "./components/EventListWindow/EventListWindow";
import { GraphWindow } from "./components/GraphWindow/GraphWindow";
import { StandingsWindow } from "./components/StandingsWindow/StandingsWindow";

import { BoardWindow } from "./components/BoardWindow/BoardWindow";
import { ScheduleWindow } from "./components/ScheduleWindow/ScheduleWindow";
import { Popup } from "./components/Popup/Popup";
import { ConfigProvider, theme } from "antd";

import initChess from "./../public/pkg";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

await initChess();

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgElevated: "#343434",
          colorPrimary: "#fafafa",
          controlOutline: "transparent",
          colorPrimaryBg: "#4d4d4d",
        },
        components: { TreeSelect: { indentSize: 14, switcherSize: 15 } },
      }}
    >
      <div className="app">
        <Popup />

        <EventListWindow />

        <EngineWindow />

        <BoardWindow />

        <StandingsWindow />

        <GraphWindow />

        <ScheduleWindow />
      </div>
    </ConfigProvider>
  );
}

export default App;
