import { useEventStore } from "@/context/EventContext";
import { useLiveInfo } from "@/context/LiveInfoContext";
import { Button, Spin } from "@douyinfe/semi-ui";
import { useRef, useState } from "react";
import { LuDownload } from "react-icons/lu";
import {
  handleArchiveLogDownload,
  handleLiveLogDownload,
} from "./LogDownloadHelpers";

async function downloadGameLogs(
  stream: ReadableStream<Uint8Array>,
  gameIndex: number
) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let tail = "";

  const buffer: string[] = [];
  let isCurrentGame = false;
  let finished = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = tail + decoder.decode(value, { stream: true });
    const lines = chunk.split("\n");
    tail = lines.pop()!; // Last element is a partial line, prepend it next turn

    for (const line of lines) {
      if (line.startsWith(`Started game ${gameIndex} `)) isCurrentGame = true;

      // Keep one game in the buffer at a time
      buffer.push(line);
      if (line.startsWith(`Finished`)) {
        if (isCurrentGame) {
          finished = true;
          break;
        }

        buffer.length = 0;
      }
    }

    if (finished) {
      // Abort the rest of the request
      await reader.cancel();
      break;
    }
  }

  downloadLogLines(buffer, gameIndex);
}

export default function LogDownloadButton() {
  const [loading, setLoading] = useState(false);

  const activeProvider = useEventStore((state) => state.activeProvider);
  const activeGame = useEventStore((state) => state.activeGame);
  const isEventRunning = useEventStore(
    (state) => state.activeEvent?.tournamentDetails.schedule.present
  );

  const game = useLiveInfo((state) => state.game);

  const pgnHeaders = game.getHeaders();
  const termination =
    activeGame?.gameDetails?.termination ??
    pgnHeaders["Termination"] ??
    pgnHeaders["TerminationDetails"];
  const result = pgnHeaders["Result"];

  const abortControllerRef = useRef<AbortController>(new AbortController());

  if (activeProvider === "ccc" && termination && result && result !== "*") {
    return (
      <a
        href={`https://storage.googleapis.com/chess-1-prod-ccc/gamelogs/game-${activeGame?.gameDetails.gameNr}.log`}
        target="_blank"
      >
        <Button title="Download UCI logs">
          <LuDownload />
        </Button>
      </a>
    );
  }

  // fallback
  if (activeProvider !== "tcec") {
    return (
      <Button
        title={`Cannot download logs from ${activeProvider}\nUnknown provider.`}
        disabled={true}
      >
        -
      </Button>
    );
  }

  return (
    <Button
      title="Download UCI logs"
      onClick={
        isEventRunning
          ? () =>
              handleLiveLogDownload(
                loading,
                setLoading,
                abortControllerRef,
                Number(activeGame?.gameDetails.gameNr)
              )
          : () =>
              handleArchiveLogDownload(
                loading,
                setLoading,
                abortControllerRef,
                Number(activeGame?.gameDetails.gameNr)
              )
      }
    >
      {loading ? <Spin /> : <LuDownload />}
    </Button>
  );
}
