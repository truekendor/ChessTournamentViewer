import { memo } from "react";
import { useEventStore } from "../../context/EventContext";
import { Schedule } from "../Schedule";
import { Spinner } from "../Loading";
import { useWebsocket } from "../../hooks/useWebsocket";

export const ScheduleWindow = memo(() => {
  const cccEvent = useEventStore((state) => state.cccEvent);
  const cccGame = useEventStore((state) => state.cccGame);

  const { requestEvent } = useWebsocket({ subId: "scheduleWindow" });

  return (
    <div className="scheduleWindow">
      <h4>Schedule</h4>
      {cccEvent && cccGame ? (
        <Schedule requestEvent={requestEvent} />
      ) : (
        <div className="sectionSpinner">
          <Spinner />
        </div>
      )}
    </div>
  );
});
