"use client";

import { ChangeEvent, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useResultParticipantsStore, {
  Category,
  Discipline,
  Olympiad,
} from "@/store/useTasksStore";

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";

const TableResults = dynamic(() => import("./table/Table-results"));
export function ResultsSectionAdmin() {
  // Используем Zustand store
  const {
    olympiads,
    loadOlympiads,
    selectCategory,
    selectedCategory,
    selectDiscipline,
    selectedDiscipline,
    selectOlympiad,
    selectedOlympiad,
    isAlternative,
    toggleAlternative,
    setTableColumns,
    tableColumns,
    taskCount,
    setTaskCount,

    getTasks,
  } = useResultParticipantsStore();

  useEffect(() => {
    const newColumns = [
      { id: 0, title: "" },
      { id: 1, title: "Фио" },
      {
        id: 2,
        title: "Баллы",
        score: 0,
      },
      { id: 3, title: "Tasks", tasks: getTasks() },
    ];

    setTableColumns(newColumns);
  }, [taskCount]);

  useEffect(() => {
    async function fetchOlympiad() {
      loadOlympiads();
    }

    fetchOlympiad();
  }, []);

  const onChangeOlympiad = (value: string) => {
    selectOlympiad(value);
  };

  const onChangeDiscipline = (value: string) => {
    selectDiscipline(value);
  };

  const onChangeCategory = (value: string) => {
    selectCategory(value);
    setTaskCount(0);
  };

  const onChangeTaskCount = (value: string) => {
    setTaskCount(+value);
  };

  return (
    <>
      <div className=" px-2 flex flex-col h-screen">
        <div className=" flex gap-x-16 h-[100px] ">
          <div>
            <Label className="">Выберите олимпиаду</Label>
            <div className="mt-2">
              <Select onValueChange={onChangeOlympiad}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Олимпиада" />
                </SelectTrigger>
                <SelectContent>
                  {olympiads.map((olymp, idx) => (
                    <SelectItem value={olymp.documentId} key={idx}>
                      {olymp.heading}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="">Выберите дисциплину</Label>
            <div className="mt-2">
              <Select onValueChange={onChangeDiscipline}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Дисциплина" />
                </SelectTrigger>
                <SelectContent>
                  {selectedOlympiad?.disciplines.map((discipline, idx) => (
                    <SelectItem value={`${discipline.documentId}`} key={idx}>
                      {discipline.heading}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="">Выберите категорию</Label>
            <div className="mt-2">
              <Select onValueChange={onChangeCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent>
                  {selectedDiscipline?.categories.map((category, idx) => (
                    <SelectItem value={`${category.documentId}`} key={idx}>
                      {category.heading}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Кол-во заданий</Label>
            <div className="flex gap-x-2 mt-2">
              <Button
                variant={"outline"}
                className=" rounded-full"
                onClick={() => setTaskCount(taskCount - 1)}
              >
                -
              </Button>
              <Input
                className="w-20 text-center"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onChangeTaskCount(e.target.value)
                }
                value={taskCount}
                type="number"
              />
              <Button
                variant={"outline"}
                className=" rounded-full"
                onClick={() => setTaskCount(taskCount + 1)}
              >
                +
              </Button>
            </div>
          </div>
          <div>
            <Label>Альтернативная версия</Label>
            <div className="mt-2">
              <Checkbox
                className=" rounded-full h-9 w-9"
                onCheckedChange={() => toggleAlternative()}
                checked={isAlternative}
              />
            </div>
          </div>
        </div>
        <div className=" flex-1 ">
          <TableResults
            columns={tableColumns}
            users={selectedCategory?.participants || []}
            categoryId={selectedCategory?.documentId || ""}
            disciplineId={selectedDiscipline?.documentId || ""}
            isAlternative={isAlternative}
          />
        </div>
      </div>
    </>
  );
}
