// import { ColumnResult, Result, Task, TaskData } from "@/lib/types";

// import { create } from "zustand";

// export interface resultParticipantsProps {
//   tasksData: Task[];
//   participantsResultData: Result[];
//   columnsResultData: ColumnResult[];
//   indexingTaskData: TaskData;

//   setTaskData: (taskData: Task) => void;
//   setParticipantResult: (results: Result[]) => void;
//   setColumnsResultData: (columns: ColumnResult[]) => void;
//   setIndexingTaskData: (indexData: TaskData) => void;
//   resetStore: () => void;
// }

// const useResultParticipantsStore = create<resultParticipantsProps>((set) => ({
//   tasksData: [] as Task[],
//   participantsResultData: [] as Result[],
//   columnsResultData: [] as ColumnResult[],
//   indexingTaskData: {} as Record<number, Task>,

//   setTaskData: (taskData: Task) =>
//   set((state) => ({
//     tasksData: state.tasksData.some((task) => task.id === taskData.id)
//       ? state.tasksData
//       : [...state.tasksData, taskData],
//   })),

//   setParticipantResult: (results: Result[]) =>
//     set((state) => ({
//       participantsResultData: results,
//     })),

//   setColumnsResultData: (columns: ColumnResult[]) =>
//     set((state) => ({
//       columnsResultData: columns,
//     })),

//   setIndexingTaskData: (indexData: TaskData ) =>
//     set((state) => ({
//       indexingTaskData: {
//         ...state.indexingTaskData,
//         ...indexData,
//       },
//     })),
//   resetStore: () =>
//     set(() => ({
//       tasksData: [],
//       participantsResultData: [],
//       columnsResultData: [],
//       indexingTaskData: {},
//     })),
// }));

// export default useResultParticipantsStore

import { BaseTask, Result, TableColumns, Task } from "@/lib/types";

import { create } from "zustand";
import { getOlympiadsData } from "@/data/loaders";

export interface Olympiad {
  documentId: string;
  heading: string;
  disciplines: Discipline[];
}

export interface Discipline {
  documentId: string;
  heading: string;
  categories: Category[];
}

export interface Category {
  documentId: string;
  heading: string;
  participants: Participant[];
}

export interface Participant {
  documentId: string;
  id: number;
  firstName: string;
  lastName: string;
}

interface ResultParticipantsStore {
  participants: Participant[];
  participantsResults: Result[];
  olympiads: Olympiad[];
  selectedOlympiad?: Olympiad;
  selectedDiscipline?: Discipline;
  selectedCategory?: Category;
  baseTasks: BaseTask[];
  tasksData: Task[];
  taskCount: number;
  isAlternative: boolean;
  tableColumns: TableColumns[];

  loadOlympiads: () => Promise<void>;
  selectOlympiad: (id: string) => void;
  selectDiscipline: (id: string) => void;
  selectCategory: (id: string) => void;
  setTaskCount: (count: number) => void;
  toggleAlternative: () => void;
  setTableColumns: (collumns: any[]) => void;
  setChangedTaskTitle: (taskData: BaseTask) => void;

  getTasks: () => BaseTask[];
  resetSelections: () => void;
  setParticipantsResult: (results: Result[]) => void;
}

const useResultParticipantsStore = create<ResultParticipantsStore>(
  (set, get) => ({
    participants: [],
    olympiads: [],
    taskCount: 0,
    isAlternative: false,
    tableColumns: [],
    baseTasks: [],
    tasksData: [],
    participantsResults: [],

    async loadOlympiads() {
      const olympiads = await getOlympiadsData();
      set({ olympiads: olympiads.data });
    },
    setChangedTaskTitle: (updatedTask) =>
      set((state: ResultParticipantsStore) => {
        const updatedData = state.baseTasks.map((task) =>
          task.id === updatedTask.id ? { ...task, ...updatedTask } : task
        );
        return {
          ...state,
          baseTasks: updatedData,
        };
      }),

    getTasks() {
      return get().baseTasks;
    },
    setParticipantsResult(results) {
      console.log("Устанавливаю participantsResults в стор:", results);
      set({ participantsResults: results });
    },

    selectOlympiad(id) {
      const olympiad = get().olympiads.find((o) => o.documentId === id);
      set({
        selectedOlympiad: olympiad,
        selectedDiscipline: undefined,
        selectedCategory: undefined,
      });
    },

    selectDiscipline(id) {
      const discipline = get().selectedOlympiad?.disciplines.find(
        (d) => d.documentId === id
      );
      set({ selectedDiscipline: discipline, selectedCategory: undefined });
    },

    selectCategory(id) {
      const category = get().selectedDiscipline?.categories.find(
        (c) => c.documentId === id
      );
      set({ selectedCategory: category });
    },

    setTaskCount(count) {
      set((state) => {
        const currentTasks = state.baseTasks;
        if (count > currentTasks.length) {
          // Добавляем недостающие задания
          const additionalTasks = Array.from(
            { length: count - currentTasks.length },
            (_, index) => ({
              id: currentTasks.length + index + 1, // Генерация уникального ID
              title: `Task ${currentTasks.length + index + 1}`,
              correctAnswer: "",
              currentScore: 0,
            })
          );
          return {
            taskCount: count,
            baseTasks: [...currentTasks, ...additionalTasks],
          };
        }

        if (count < currentTasks.length) {
          // Удаляем лишние задания
          return { taskCount: count, baseTasks: currentTasks.slice(0, count) };
        }

        return { taskCount: count };
      });
    },

    toggleAlternative() {
      set((state) => ({ isAlternative: !state.isAlternative }));
    },

    setTableColumns(columns) {
      set(() => ({ tableColumns: columns }));
    },
    resetSelections() {
      set({ selectedDiscipline: undefined, selectedCategory: undefined });
    },
  })
);

export default useResultParticipantsStore;
