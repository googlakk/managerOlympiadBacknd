import { Category, Image } from "@/store/useOlympiadsStore";

export interface Participant {
  documentId: string;
  id: number;
  lastName: string;
  firstName: string;
  organization?: string;
}
export interface TableColumns {
  id: number;
  title: string;
  tasks?: Task[];
}

export interface BaseTask {
  id: number;
  title: string;
  correctAnswer: string;
  currentScore: number;
}
export interface Task extends BaseTask {
  userAnswer: string;
  scoreEarned: number;
  isCorrectly: boolean;
}
export interface Result {
  resultId?: string;
  user: Participant;
  totalScore: number;
  categoryId?: string;
  disciplineId?: string;
  tasks: Task[];
}
export type TaskData = {
  [id: number]: Task;
};

export interface ResultShow {
  resultId?: string;
  firstName: string;
  lastName: string;
  organization: string;
  avatar: Image;

  disciplineId?: string;
  scores: Task[];
}
export interface Winners {
  participant: Participant;
  place: string;
  categoryId: string;
}
export interface loadedWinners {
  place: string;
  participant: Participant;
  category: Category;
}
export enum CATEGORY_PLACES {
  first = "1",
  second = "2",
  third = "3",
  default = "",
}
