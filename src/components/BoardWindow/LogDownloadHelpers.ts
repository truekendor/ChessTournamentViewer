import { useEventStore } from "@/context/EventContext";
import { toTitleCaseTCEC } from "@/utils";
import { XzReadableStream } from "xz-decompress";

function downloadLogLines(lines: string[], gameIndex: number) {
  // Auto-download as blob URL
  const uciLog = lines.join("\n");
  const blob = new Blob([uciLog], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${useEventStore.getState().activeEvent?.tournamentDetails.tNr}_${gameIndex}.log`;
  a.click();

  URL.revokeObjectURL(url);
}

export async function handleLiveLogDownload(
  loading: boolean,
  setLoading: (loading: boolean) => void,
  abortControllerRef: { current: AbortController },
  gameIndex: number
) {
  try {
    if (loading) {
      abortControllerRef.current.abort();

      return;
    }

    setLoading(true);

    const response = await fetch("https://ctv.yoshie2000.de/tcec/live.log", {
      signal: abortControllerRef.current.signal,
    });

    const responseText = await response.text();
    const lines = responseText.split("\n");

    // Find starting and ending window (not exact)
    let startIndex = lines.findIndex((line) =>
      line.includes(`Started game ${gameIndex} `)
    );
    let endIndex = lines.findIndex((line) =>
      line.includes(`Started game ${gameIndex + 1} `)
    );
    if (endIndex === -1) endIndex = lines.length;

    // Walk backwards to find end of previous game
    let found = false;
    for (let i = startIndex; i >= 0; i--) {
      if (lines[i] === "Finished match") {
        startIndex = i + 1;
        found = true;
        break;
      }
    }
    if (!found) startIndex = 0;

    // Walk backwards to find end of current game
    found = false;
    for (let i = endIndex; i > startIndex; i--) {
      if (lines[i] === "Finished match") {
        endIndex = i + 1;
        found = true;
        break;
      }
    }
    if (!found) endIndex = lines.length;

    downloadLogLines(lines.slice(startIndex, endIndex), gameIndex);
  } catch (err) {
    if (err instanceof Error && err.name && err.name === "AbortError") {
      abortControllerRef.current = new AbortController();

      console.info("Log download aborted", err);
    } else {
      console.error("Log download failed", err);
    }
  } finally {
    abortControllerRef.current = new AbortController();
    setLoading(false);
  }
}

export async function handleArchiveLogDownload(
  loading: boolean,
  setLoading: (loading: boolean) => void,
  abortControllerRef: { current: AbortController },
  gameIndex: number
) {
  if (loading) {
    abortControllerRef.current.abort();
    return;
  }

  setLoading(true);
  abortControllerRef.current = new AbortController();

  try {
    const res = await fetch(
      `https://ctv.yoshie2000.de/tcec/loglive/archive/${toTitleCaseTCEC(useEventStore.getState().activeEvent?.tournamentDetails.tNr ?? "")}.log.xz`,
      { signal: abortControllerRef.current.signal }
    );
    if (!res.ok) throw new Error(`Error ${res.status}`);

    const reader = new XzReadableStream(res.body!).getReader();
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

    if (!abortControllerRef.current.signal.aborted) {
      downloadLogLines(buffer, gameIndex);
    }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      console.info("Log download aborted", err);
    } else {
      console.error("Log download failed", err);
      alert(err instanceof Error ? err.message : `Log download failed`);
    }
  } finally {
    abortControllerRef.current = new AbortController();
    setLoading(false);
  }
}
