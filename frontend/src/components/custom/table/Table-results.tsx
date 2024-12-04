import { Participant, Result, TableColumns, Winners } from "@/lib/types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createCategoryParticipantResults,
  updateCategoryParticipantResults,
  winnersByCategoryAction,
} from "@/data/actions/result-actions";
import { useEffect, useRef, useState } from "react";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "../SubmitButton";
import { TableResultsSkeleton } from "../skeletons/tableResult-skeleton";
import { WinnersCheckDropDown } from "../WinnersDropdown";
import { flattenData } from "./Columns";
import { getScoresByCategory } from "@/data/loaders";
import { io } from "socket.io-client";
import { mapDataToResult } from "@/lib/utils";
import { resultsService } from "@/lib/services/results-service";
import useResultParticipantsStore from "@/store/useTasksStore";

interface ResultsProps {
  users: Participant[];
  columns: TableColumns[];
  categoryId: string;
  disciplineId: string;
  isAlternative: boolean;
}
export default function TableResults({
  users,
  columns,
  categoryId,
  disciplineId,
  isAlternative,
}: Readonly<ResultsProps>) {
  const cellsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [resultsParicipants, setResults] = useState<Result[]>([]);
  const [winners, setWinners] = useState<Winners[]>([]);

  const [totalScore, setTotalScore] = useState<Record<string, number>>({});
  const [isClient, setIsClient] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isSorted, setIsSorted] = useState(false);
  const {
    baseTasks,
    taskCount,
    setChangedTaskTitle,
    setParticipantsResult,
    participantsResults,
    selectedOlympiad,
    selectedCategory,
    setTaskCount,
  } = useResultParticipantsStore();

  const socket = io("http://localhost:1337");
  const submitResults = () => {
    updateCategoryParticipantResults(resultsParicipants);
    console.log("web-socket", resultsParicipants);
    console.log("select", selectedOlympiad?.documentId);
    socket.emit("updateResults", {
      olympiadId: selectedOlympiad?.documentId, // ID текущей олимпиады
      results: resultsParicipants,
    });
  };

  const initializeResults = async () => {
    const initializedResults = await resultsService.initializeResults(
      users,
      baseTasks,
      categoryId,
      disciplineId
    );
    createCategoryParticipantResults(initializedResults);
  };
  const getResultsByCategory = async () => {
    const data = await getScoresByCategory(categoryId);
    const resultFromServer = mapDataToResult(data.data);
    setResults(resultFromServer);
    setTaskCount(resultFromServer[0]?.tasks.length || 0);
  };

  useEffect(() => {
    setIsUpdate(true);
    setIsClient(true);
  }, []);

  useEffect(() => {
    initializeResults();
    getResultsByCategory();
    setWinners([]);
  }, [categoryId]);

  useEffect(() => {
    if (isUpdate) {
      initializeResults(); // Асинхронная инициализация
      setIsUpdate(false);
    } else {
      setResults((prevResults) =>
        resultsService.addOrUpdateTasks(prevResults, baseTasks)
      );
    }
  }, [taskCount, baseTasks]);

  useEffect(() => {
    setParticipantsResult(resultsParicipants);
    const totalScores = resultsParicipants.reduce((acc, res) => {
      if (res.user.documentId) {
        acc[res.user.documentId] = res.totalScore || 0;
      }
      return acc;
    }, {} as Record<string, number>);

    setTotalScore(totalScores);
  }, [resultsParicipants]);

  const handleBlur = (
    taskId: number,
    field: "id" | "title" | "currentScore" | "correctAnswer",
    value: string
  ) => {
    const currentTask = baseTasks.find((task) => task.id === taskId);
    if (!currentTask) return;

    const updatedTask = {
      ...currentTask,
      id: taskId,
      [field]: field === "currentScore" ? Number(value) : value,
    };

    setChangedTaskTitle(updatedTask);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    userId: number,
    taskId: number
  ) => {
    const key = `${userId}-${taskId}`;
    if (!cellsRef.current[key]) return;
    let nextUserIdx = userId;
    let nextTaskId = taskId;
    if (e.key === "ArrowDown") {
      nextUserIdx = userId + 1;
    } else if (e.key === "ArrowUp") {
      nextUserIdx = userId - 1;
    }
    const nextKey = `${nextUserIdx}-${nextTaskId}`;
    if (cellsRef.current[nextKey]) {
      cellsRef.current[nextKey]?.focus();
    }
  };

  const handleBlurAnswer = (userId: string, taskId: number, answer: string) => {
    let updatedResults = resultsService.updateTaskForParticipant(
      resultsParicipants,
      userId,
      taskId,
      answer,
      isAlternative
    );
    setResults(updatedResults);
  };

  const handleSelectWinner = (
    participant: Participant,
    place: string | null
  ) => {
    setWinners((prev) => {
      // Удаляем участника, если он уже есть в массиве
      const filtered = prev.filter(
        (item) => item.participant.documentId !== participant.documentId
      );

      // Если место не задано, просто удаляем из массива
      if (!place) return filtered;

      // Добавляем участника с новым местом
      return [
        ...filtered,
        {
          participant, // Сохраняем объект участника
          place,
          categoryId,
        } as Winners,
      ];
    });
  };

  const submitWinners = () => {
    console.log("winers12", winners);
    winnersByCategoryAction(winners);

    socket.emit("updateWinners", {
      olympiadId: selectedOlympiad?.documentId, // ID текущей олимпиады
      categoryId: selectedCategory?.documentId,
      winners: winners,
    });
  };
  const sortResultsParticipants = () => {
    const sortedResults = [...resultsParicipants].sort(
      (a, b) => b.totalScore - a.totalScore
    );
    setResults(sortedResults);
  };
  console.log("users", resultsParicipants);
  return (
    <>
      <ScrollArea className="max-w-[1400px] whitespace-nowrap ">
        {isClient ? (
          <Table className="border">
            <TableCaption>Результаты участников</TableCaption>
            {/* Заголовки таблицы */}
            <TableHeader>
              <TableRow className=" pb-20 border-b flex relative ">
                {columns.map((col) => (
                  <TableHead
                    key={col.id}
                    className={` text-center align-top 
                    ${col.id === 0 ? "w-[64px] px-0" : ""}
                    ${
                      col.id === 1 ? "w-[256px] border-r flex items-start " : ""
                    } ${col.id === 2 ? "w-[106px] border-r" : ""} ${
                      col.id === 3 ? "flex-1" : ""
                    }`}
                  >
                    {col.id === 0 && <div className=" px-0 w-[64px]"></div>}
                    {col.id === 1 && <div>{col.title}</div>}
                    {col.id === 2 && (
                      <div>
                        {col.title}
                        <Button
                          onClick={sortResultsParticipants}
                          variant="ghost"
                        >
                          <ArrowUpDown />
                        </Button>
                      </div>
                    )}
                    {/* Заголовок и подзаголовки для колонки Tasks */}
                    {col.id === 3 && col.tasks && (
                      <div>
                        <strong className="">Tasks</strong>
                        <div className="flex gap-x-6 mt-2">
                          {resultsParicipants[0]?.tasks.map((task, id) => (
                            <div
                              key={task.id}
                              className="flex flex-col gap-y-2  p-0 w-20"
                            >
                              <div className="text-center w-20  p-0 border-b">
                                <strong className="w-full ">
                                  <Input
                                    className="bg-transparent border-none w-20 outline-none text-center h-4 p-0"
                                    placeholder={
                                      task.title ?? `task ${task.id}`
                                    }
                                    onBlur={(e) => {
                                      handleBlur(
                                        task.id,
                                        "title",
                                        e.target.value
                                      );
                                    }}
                                  />
                                </strong>
                              </div>
                              <div className="p-0 m-0 border-b">
                                <Input
                                  className="bg-transparent border-none w-20 outline-none text-center h-4 p-0"
                                  placeholder={`${
                                    task.currentScore ?? `score`
                                  }`}
                                  onBlur={(e) =>
                                    handleBlur(
                                      task.id,
                                      "currentScore",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div className="p-0 m-0 ">
                                <Input
                                  className="bg-transparent border-none w-20 outline-none text-center h-4 p-0"
                                  placeholder={`${
                                    task.correctAnswer === ""
                                      ? `current Answer`
                                      : task.correctAnswer
                                  }`}
                                  onBlur={(e) =>
                                    handleBlur(
                                      task.id,
                                      "correctAnswer",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            {/* Тело таблицы */}
            <TableBody>
              {resultsParicipants.map((user, userIdx) => (
                <TableRow
                  key={userIdx}
                  className={`${
                    winners.some(
                      (winner) =>
                        winner.participant.documentId === user.user.documentId
                    )
                      ? "bg-[#bbf7d0]" // Цвет для победителей
                      : userIdx % 2 !== 0
                      ? "bg-[#f0f9ff]"
                      : ""
                  } flex items-center`}
                >
                  {/* Колонка ФИО */}
                  <TableCell className="w-[64px] ">
                    <div>
                      <WinnersCheckDropDown
                        onSelected={handleSelectWinner}
                        participant={user.user}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium min-w-[256px] flex items-center justify-between border-r w-[256px]">
                    {`${user.user.lastName} ${user.user.firstName}`}
                    {winners.some(
                      (winner) =>
                        winner.participant.documentId === user.user.documentId
                    ) &&
                      /* Находим место участника */
                      renderPlaceIcon(
                        winners.find(
                          (winner) =>
                            winner.participant.documentId ===
                            user.user.documentId
                        )?.place || ""
                      )}
                  </TableCell>
                  {/* Колонка c Баллами*/}

                  <TableCell className="text-center w-[106px] border-r">
                    <strong>{totalScore[user.user.documentId] || 0} </strong>
                  </TableCell>

                  {/* Колонка для ответов на задания */}
                  <TableCell className="flex-1 align-middle border-r">
                    <div className="flex gap-x-6">
                      {user.tasks.map((task, id) => (
                        <div key={id} className=" w-20">
                          {isAlternative ? (
                            <Checkbox
                              checked={task.isCorrectly}
                              className=" ml-8 w-6 h-6"
                              onBlur={(e) =>
                                handleBlurAnswer(
                                  user.user.documentId,
                                  task.id,
                                  e.currentTarget.value
                                )
                              }
                            />
                          ) : (
                            <Input
                              className=" text-center h-8"
                              key={id}
                              placeholder={task.userAnswer}
                              ref={(el) => {
                                cellsRef.current[`${userIdx}-${task.id}`] = el;
                              }}
                              onKeyDown={(e) =>
                                handleKeyDown(e, userIdx, task.id)
                              }
                              onBlur={(e) =>
                                handleBlurAnswer(
                                  user.user.documentId,
                                  task.id,
                                  e.currentTarget.value
                                )
                              }
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className=" bg-white gap-x-5 flex">
              <SubmitButton
                className="my-2"
                handleFunction={submitResults}
                text="Save"
                loadingText="Saving..."
              />
              <SubmitButton
                className="my-2"
                handleFunction={submitWinners}
                text="Add winners"
                loadingText="Adding..."
              />
            </TableFooter>
          </Table>
        ) : (
          <TableResultsSkeleton />
        )}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
}

export function renderPlaceIcon(place: string) {
  if (place === "1") {
    return (
      <Image
        src={"/images/icons/firstPlace.png"}
        alt="first place"
        width={40}
        height={40}
      />
    );
  } else if (place === "2") {
    return (
      <Image
        src={"/images/icons/secondPlace.png"}
        alt="first place"
        width={40}
        height={40}
      />
    );
  } else if (place === "3") {
    return (
      <Image
        src={"/images/icons/thirdPlace.png"}
        alt="first place"
        width={40}
        height={40}
      />
    );
  } else {
    return null;
  }
}
