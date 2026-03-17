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
import { useEffect } from "react";

import init from "../public/pkg/chess_wasm";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  useEffect(() => {
    const loadWasm = async () => {
      await init();
    };
    loadWasm();
  }, []);

  return (
    <div className="app">
      <Popup />

      <EventListWindow />

      <EngineWindow />

      <BoardWindow />

      <StandingsWindow />

      <GraphWindow />

      <ScheduleWindow />
    </div>
  );
}

export default App;
