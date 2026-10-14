import type { useEventStore } from "@/context/EventContext";
import type { CCCEngine } from "@/types";
import { EngineLogo } from "../EngineWindow/EngineLogo";

type ScheduleGame = NonNullable<
  ReturnType<typeof useEventStore.getState>["activeEvent"]
>["tournamentDetails"]["schedule"]["past"][number];

type ScheduleEntryProps = {
  game: ScheduleGame;
  roundIndex: number;
  gameWhite?: CCCEngine;
  gameBlack?: CCCEngine;
  isLiveGame: boolean;
  isSelectedGame: boolean;
  averageDuration: number;
  currentGameIdx: number;
  gamesPerRound: number;
  isRoundRobin: boolean;
  entryRef?: React.Ref<HTMLDivElement> | null;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

function formatDuration(value: number) {
  if (value === 1) return `ìn 1 minute`;
  if (value < 60) return `in ${value.toFixed(0)} minutes`;
  value = Math.round(value / 60);
  if (value === 1) return `in 1 hour`;
  return `in ${value.toFixed(0)} hours`;
}

function formatOutcome(outcome: string) {
  return outcome.replace(/-/, "\u2013"); // en dash
}

function getOutcomeClasses(game: ScheduleGame) {
  let result: "white" | "black" | null = null;
  if (game.outcome === "1-0") {
    result = "white";
  } else if (game.outcome === "0-1") {
    result = "black";
  }
  const fallback = game.timeEnd ? "draw" : "tbd";

  return {
    whiteClass: result ? (result === "white" ? "winner" : "loser") : fallback,
    blackClass: result ? (result === "black" ? "winner" : "loser") : fallback,
  };
}

export const ScheduleEntry = ({
  game,
  roundIndex,
  gameWhite,
  gameBlack,
  isLiveGame,
  isSelectedGame,
  averageDuration,
  currentGameIdx,
  gamesPerRound,
  isRoundRobin,
  entryRef,
  onClick,
}: ScheduleEntryProps) => {
  const { whiteClass, blackClass } = getOutcomeClasses(game);

  let gameClass = "";
  gameClass += !game.outcome && !isLiveGame ? " future" : "";
  gameClass += isSelectedGame ? " active" : "";
  gameClass += isLiveGame ? " live" : "";

  const isLastOfRound =
    isRoundRobin && gamesPerRound > 2 && (roundIndex + 1) % gamesPerRound === 0;
  gameClass += isLastOfRound ? " lastOfRound" : "";

  let vsText: string;
  if (isLiveGame) {
    vsText = "vs.";
  } else if (game.outcome) {
    vsText = formatOutcome(game.outcome);
  } else {
    vsText = formatDuration(averageDuration * (roundIndex - currentGameIdx));
  }

  return (
    <div
      className={"game" + gameClass}
      ref={entryRef}
      data-live-and-not-selected={isLiveGame && !isSelectedGame}
      data-game-number={game.gameNr}
      data-outcome={game.outcome ?? ""}
      onClick={onClick}
    >
      <span className="round">#{roundIndex + 1}</span>
      <EngineLogo engine={gameWhite} size={28} />
      <span className={"engineName " + whiteClass} title={gameWhite?.name}>
        {gameWhite?.name}
      </span>
      <span className="vs">{vsText}</span>
      <span className={"engineName " + blackClass} title={gameBlack?.name}>
        {gameBlack?.name}
      </span>
      <EngineLogo engine={gameBlack} size={28} />
    </div>
  );
};
