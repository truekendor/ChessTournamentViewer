import { memo, useCallback, useEffect, useRef } from "react";
import "./Schedule.css";
import { MdOutlineClose } from "react-icons/md";
import { useEventStore } from "../../context/EventContext";
import { useLiveInfo } from "../../context/LiveInfoContext";
import { getTimeControl } from "../../LiveInfo";
import { Button } from "@douyinfe/semi-ui";
import { ScheduleEntry } from "./ScheduleEntry";

type ScheduleProps = { selectedEngineId: string };

const Schedule = memo(({ selectedEngineId }: ScheduleProps) => {
  const scheduleRef = useRef<HTMLDivElement>(null);
  const currentGameRef = useRef<HTMLDivElement>(null);

  const scrolledToCurrentGameRef = useRef(false);
  const userClickedRef = useRef(false);

  const selectedGame = useEventStore((state) => state.activeGame);
  const event = useEventStore((state) => state.activeEvent);
  const engines = useEventStore((state) => state.engines);
  const requestEvent = useEventStore((state) => state.requestEvent);

  const scrollToCurrentGame = useCallback(() => {
    if (
      !scheduleRef.current ||
      !currentGameRef.current ||
      scrolledToCurrentGameRef.current
    )
      return;

    const parentRect = scheduleRef.current.getBoundingClientRect();
    const childRect = currentGameRef.current.getBoundingClientRect();
    const relativeChildTop = childRect.top - parentRect.top;

    scheduleRef.current.scrollTo({
      top:
        scheduleRef.current.scrollTop +
        relativeChildTop -
        scheduleRef.current.clientHeight / 2 +
        currentGameRef.current.clientHeight / 2,
      behavior: "instant",
    });

    scrolledToCurrentGameRef.current = true;
  }, []);

  const currentGameCallbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      currentGameRef.current = node;
      if (node) {
        scrollToCurrentGame();
      }
    },
    [scrollToCurrentGame]
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!(event.target instanceof HTMLElement)) {
        return;
      }

      const target = event.target.closest<HTMLDivElement>("div.game");

      if (!target) {
        return;
      }

      const { dataset } = target;

      const finishedGameClicked = dataset.liveAndNotSelected;
      const outcome = dataset.outcome;

      const futureGameClicked = !(outcome || finishedGameClicked);

      if (futureGameClicked) {
        return;
      }

      const gameNr = dataset.gameNumber;

      userClickedRef.current = true;

      if (!finishedGameClicked) {
        requestEvent();
      } else {
        requestEvent(gameNr);
      }
    },
    [requestEvent]
  );

  useEffect(() => {
    if (userClickedRef.current) {
      userClickedRef.current = false;
      return;
    }
    scrolledToCurrentGameRef.current = false;
    scrollToCurrentGame();
  }, [
    event?.tournamentDetails.tNr,
    event?.tournamentDetails.schedule.present?.gameNr,
    selectedGame?.gameDetails.gameNr,
    selectedEngineId,
    scrollToCurrentGame,
  ]);

  if (!event || !selectedGame || !engines) {
    return null;
  }

  const gamesList = [
    ...event.tournamentDetails.schedule.past,
    ...(event.tournamentDetails.schedule.present
      ? [event.tournamentDetails.schedule.present]
      : []),
    ...event.tournamentDetails.schedule.future,
  ];

  const { tcW, tcB } = getTimeControl(useLiveInfo.getState().game);

  const durationPerGame = event.tournamentDetails.schedule.past
    .map((game) => {
      if (!game.timeEnd || !game.timeStart) return null;
      return (
        new Date(game.timeEnd!).getTime() - new Date(game.timeStart!).getTime()
      );
    })
    .filter((duration) => !!duration) as number[];
  const averageDuration =
    durationPerGame.reduce(
      (prev, cur) => prev! + cur!,
      tcW.tcBase + tcB.tcBase + (100 * (tcW.tcIncrement + tcB.tcIncrement)) / 2
    ) /
    (durationPerGame.length + 1) /
    1000 /
    60;
  const currentGameIdx = event.tournamentDetails.schedule.past.length;

  const gamesPerRound = engines.length * (engines.length - 1);
  const scheduleClass = event.tournamentDetails.hasGamePairs
    ? " gamePairs"
    : "";

  return (
    <>
      <div className={"schedule" + scheduleClass} ref={scheduleRef}>
        {gamesList.map((game, i) => {
          const gameWhite = engines.find(
            (engine) => engine.id === game.whiteId
          );
          const gameBlack = engines.find(
            (engine) => engine.id === game.blackId
          );

          if (
            selectedEngineId &&
            ![gameWhite?.id, gameBlack?.id].includes(selectedEngineId)
          ) {
            return null;
          }

          const isLiveGame =
            game.gameNr === event.tournamentDetails.schedule.present?.gameNr;
          const isSelectedGame =
            game.gameNr === String(selectedGame.gameDetails.gameNr);

          return (
            <ScheduleEntry
              onClick={handleClick}
              key={game.gameNr}
              game={game}
              roundIndex={i}
              gameWhite={gameWhite}
              gameBlack={gameBlack}
              isLiveGame={isLiveGame}
              isSelectedGame={isSelectedGame}
              averageDuration={averageDuration}
              currentGameIdx={currentGameIdx}
              gamesPerRound={gamesPerRound}
              isRoundRobin={event.tournamentDetails.isRoundRobin ?? false}
              entryRef={isSelectedGame ? currentGameCallbackRef : null}
            />
          );
        })}
      </div>
      {String(selectedGame.gameDetails.gameNr) !==
        event.tournamentDetails.schedule.present?.gameNr && (
        <Button
          className="closeButton"
          onClick={() => requestEvent()}
          title="Return to live game"
        >
          <MdOutlineClose />
        </Button>
      )}
    </>
  );
});

export { Schedule };
