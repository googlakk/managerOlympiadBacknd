import { Participants } from "./useOlympiadsStore";
import { create } from "zustand";

export interface ParticipantsProps {
  participantsData: Participants[];

  setParticipants: (users: Participants[]) => void;

  resetStore: () => void;
}

const useParticipantsStore = create<ParticipantsProps>((set) => ({
  participantsData: [],
  setParticipants: (participantsData) => set({ participantsData }),

  resetStore: () => set({ participantsData: [] }),
}));

export default useParticipantsStore;
