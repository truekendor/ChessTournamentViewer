import { create } from "zustand";
import type {
  CCCEventsListUpdate,
  CCCEventUpdate,
  CCCGameUpdate,
  Nullish,
} from "../types";

type EventContext = Nullish<{
  cccEventList: CCCEventsListUpdate;
  cccEvent: CCCEventUpdate;
  cccGame: CCCGameUpdate;

  setEventList: (eventList: CCCEventsListUpdate) => void;
  setGame: (game: CCCGameUpdate) => void;
  setEvent: (cccEvent: CCCEventUpdate) => void;
}>;

export const useEventStore = create<EventContext>((set) => {
  return {
    cccEvent: null,
    cccGame: null,
    cccEventList: null,

    setEvent: (cccEvent) => {
      if (cccEvent === null) {
        return;
      }

      set({ cccEvent });
    },
    setGame: (game) => {
      if (game === null) {
        return;
      }

      set({ cccGame: game });
    },
    setEventList: (eventList) => {
      if (eventList === null) {
        return;
      }

      set((state) => {
        const eventListNotChanged =
          state.cccEventList?.events.length === eventList.events.length;

        if (eventListNotChanged) {
          return state;
        }

        return { cccEventList: eventList };
      });
    },
  };
});
