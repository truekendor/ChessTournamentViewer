import { memo } from "react";
import type { EngineColor } from "../LiveInfo";
import { useLiveInfo } from "../context/LiveInfoContext";
import { formatLargeNumber, formatTime } from "./EngineCard";
import { SkeletonText } from "./Loading";

export const EngineInfoTable = memo(({ color }: { color: EngineColor }) => {
  // This is the main re-render trigger for black / white
  const time =
    Number(
      useLiveInfo((state) =>
        color === "white"
          ? state.clocks.wtime
          : color === "black"
            ? state.clocks.btime
            : "1"
      ) || 1
    ) || 1;

  useLiveInfo((state) =>
    !["black", "white"].includes(color)
      ? Math.max(
          15,
          Number(state.liveInfos[color].liveInfo?.info.depth || 0) || 0
        )
      : undefined
  );

  const state = useLiveInfo.getState();
  const engine = state.liveInfos[color].engineInfo;

  const liveInfo = state.liveInfos[color].liveInfo;

  const data = liveInfo?.info;
  const loading = !data || !engine || !time;

  const fields = loading
    ? ["Time", "Depth", "Nodes", "NPS", "TB Hits", "Hashfull"].map((label) => [
        label,
        null,
      ])
    : [
        ["Time", formatTime(time)],
        ["Depth", `${data.depth} / ${data.seldepth ?? "-"}`],
        ["Nodes", formatLargeNumber(data.nodes)],
        ["NPS", formatLargeNumber(data.speed)],
        ["TB Hits", formatLargeNumber(data.tbhits) ?? "-"],
        ["Hashfull", data.hashfull ?? "-"],
      ];

  return (
    <div className="engineInfoTable">
      {fields.map(([label, value]) => (
        <div
          className={"engineField " + label?.replace(" ", "").toLowerCase()}
          key={label}
        >
          {loading ? (
            <SkeletonText width="100%" />
          ) : (
            <>
              <div className="key">{label}</div>
              <div className="value">{value}</div>
            </>
          )}
        </div>
      ))}
    </div>
  );
});
