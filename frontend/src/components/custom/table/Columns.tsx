// Предположим, что `formattedResults` уже содержит данные участников, как ты и описал ранее
// с полем `tasks`, где каждая задача имеет поля `heading`, `score`, `userAnswer`.

import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export type Task = {
  heading: string;
  score: number;
  userAnswer: string;
  rightAnswer: string;
};
export type Result = {
  id: number;
  student: string;
  total: string;
  tasks: Task[];
};
export const flattenData = (results: Result[]): Record<string, any>[] => {
  return results.map((result) => {
    const flattened: Record<string, any> = {
      id: result.id,
      student: result.student,
      total: result.total,
    };

    result.tasks.forEach((task) => {
      flattened[task.heading] = `${task.userAnswer} | ${task.score}`; // Теперь TypeScript не выдаст ошибку
    });

    return flattened;
  });
};

export const useGenerateColumns = (results: Result[]): ColumnDef<any>[] => {
  const taskHeadings = useMemo(() => {
    const headings = new Set<string>();

    results.forEach((result) =>
      result.tasks.forEach((task) => headings.add(task.heading))
    );
    return Array.from(headings);
  }, [results]);

  const baseColumns: ColumnDef<any>[] = [
    { accessorKey: "student", header: "Student" },
    { accessorKey: "total", header: "Total" },
  ];

  const taskColumns: ColumnDef<any>[] = taskHeadings.map((heading) => ({
    accessorKey: heading,
    header: heading,
  }));

  return [...baseColumns, ...taskColumns];
};
