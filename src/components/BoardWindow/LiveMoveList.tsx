import { memo, useState } from "react";
import { useEventStore } from "../../context/EventContext";
import { useLiveInfo } from "../../context/LiveInfoContext";
import { MoveList } from "../MoveList";
import { shallow } from "zustand/shallow";
import { useInterval } from "../../hooks/useInterval";
import { DEFAULT_POSITION } from "@/chess.js/chess";

const LiveMoveList = memo(() => {
  const activeGame = useEventStore((state) => state.activeGame);
  const game = useLiveInfo((state) => state.game);

  const [moves, setMoves] = useState<string[]>([]);
  const [currentMoveNumber, setCurrentMoveNumber] = useState(-1);
  const [bookMoves, setBookMoves] = useState(-1);

  useInterval((state) => {
    setCurrentMoveNumber(state.currentMoveNumber);

    setMoves((previous) => {
      if (shallow(previous, state.moves)) return previous;
      return state.moves;
    });

    const bookPlies = Math.min(
      state.liveEngineData.white.liveInfo?.findIndex((liveInfo) => !!liveInfo),
      state.liveEngineData.black.liveInfo?.findIndex((liveInfo) => !!liveInfo)
    );
    setBookMoves(bookPlies);
  });

  const pgnHeaders = game.getHeaders();
  const termination =
    activeGame?.gameDetails?.termination ??
    pgnHeaders.get("Termination") ??
    pgnHeaders.get("TerminationDetails");
  const result = pgnHeaders.get("Result");

  return (
    <MoveList
      startFen={pgnHeaders.get("FEN") ?? DEFAULT_POSITION}
      moves={moves}
      currentMoveNumber={currentMoveNumber}
      setCurrentMoveNumber={useLiveInfo.getState().setCurrentMoveNumber}
      bookMoves={bookMoves}
      downloadURL={
        termination && result && result !== "*"
          ? `https://storage.googleapis.com/chess-1-prod-ccc/gamelogs/game-${activeGame?.gameDetails.gameNr}.log`
          : undefined
      }
      controllers={true}
    />
  );
});

export { LiveMoveList };
