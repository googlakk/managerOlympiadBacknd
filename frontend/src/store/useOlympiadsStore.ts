import { Result, ResultShow, Winners } from "@/lib/types";

import { create } from "zustand";

export interface Score {
  id: number;
  score: number;
  userAnswer: string;
  defaultScore: number;
  heading: string;
  rightAnswer: string;
}
export interface Image {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
}
export interface Olympiad {
  id: number;
  documentId: string;
  heading: string;
  subHeading: string;
  dateStart: string;
  dateEnd: string;
  place: string;
  disciplines: Discipline[];
  startRegistration: boolean;
  image: Image;
  streamSrc: string;
  description?: string;
}

export interface Discipline {
  documentId: string;
  id?: number;
  heading: string;
  subHeading: string;
  categories: Category[];
  image: Image;
}
export interface Participants {
  documentId: string;
  id: number;
  firstName: string;
  lastName: string;
  age: string;
  avatar?: Image;
  organization?: string;
}
export interface WinnersResult {
  place: string;
  participant: Participants;
}
export interface Category {
  id: number;
  documentId: string;
  heading: string;
  description: string;
  participants: Participants[];
  scores: ResultShow[];
  winners: WinnersResult[];
}

interface OlympiadStore {
  olympiads: Olympiad[];
  setOlympiads: (olympiads: Olympiad[]) => void;
}

const useOlympiadStore = create<OlympiadStore>((set) => ({
  olympiads: [],
  setOlympiads: (olympiads) => set({ olympiads: olympiads }),
}));

export default useOlympiadStore;
