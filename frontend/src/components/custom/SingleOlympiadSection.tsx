"use client";

import { BlocksContent, BlocksRenderer } from "@strapi/blocks-react-renderer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Category, Olympiad } from "@/store/useOlympiadsStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Participant,
  Result,
  ResultShow,
  TableColumns,
  Task,
  Winners,
} from "@/lib/types";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import React from "react";
import { StrapiImage } from "./StrapiImage";
import { renderPlaceIcon } from "./table/Table-results";
import { useState } from "react";

interface SingleOlympiadProps {
  columns: TableColumns[];
  results: Result[];
  data: Olympiad;
  displayWinners: Winners[];
  loading: boolean;
}
export const SingleOlympiadSection = ({
  columns,
  results,
  data,
  displayWinners,
  loading,
}: Readonly<SingleOlympiadProps>) => {
  console.log(data.description);
  const content = Array.isArray(data.description)
    ? data.description // если это уже массив, передаем как есть
    : data.description
    ? [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: data.description,
            },
          ],
        },
      ]
    : []; // если description нет, передаем пустой массив

  console.log(content);
  return (
    <section className="pb-20 pt-25 lg:pb-25 lg:pt-35 xl:pb-30 xl:pt-35">
      <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
        <div className="animate_top rounded-md border border-stroke bg-white p-7.5 shadow-solid-13 dark:border-strokedark dark:bg-blacksection md:p-10">
          <div className="h-[300px] border w-full relative sm:h-[500px] md:h-[750px]  ">
            <StrapiImage
              height={1080}
              width={1920}
              className="absolute inset-0 object-cover w-full h-full "
              style={{
                aspectRatio: "1920/1080",
                objectFit: "cover",
              }}
              src={data.image.url}
              alt={data.image.alternativeText || ""}
            />
          </div>
          <div className="mx-auto max-w-[800px] mt-5 text-center">
            <h1 className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
              {data.heading}
            </h1>
            <p className="mb-12 text-base !leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg md:text-xl">
              {data.subHeading}
            </p>
          </div>
          <div className="mx-auto max-w-[800px] mt-5 text-center">
            <article className="prose lg:prose-xl">
              <BlocksRenderer content={content} />
            </article>
          </div>
          {/* <div>{data?.description}</div> */}
          <div className=" md:my-10 md:space-y-10">
            <h1 className="text-lg md:text-2xl my-2 text-center font-bold">
              Дисциплины
            </h1>
            <div className=" my-3 flex flex-wrap justify-center gap-5 w-full">
              {data.disciplines.map((data) => (
                <Card className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3">
                  <CardHeader className="min-h-[80px] sm:min-h-[100px]">
                    <CardTitle className="text-sm sm:text-base md:text-lg">
                      {data.heading}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm md:text-base">
                      {data.subHeading}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="h-[100px] sm:h-[150px] md:h-[200px]">
                    <StrapiImage
                      src={data.image?.url || ""}
                      alt={data.image?.alternativeText || "Ops..."}
                      width={300}
                      height={200}
                      className="relative block aspect-[368/239]"
                      style={{
                        aspectRatio: "200/100",
                        objectFit: "cover",
                      }}
                    />
                  </CardContent>

                  <CardContent>
                    <div className="flex flex-col">
                      <div className="text-xs sm:text-sm text-muted-foreground mb-2">
                        Список категорий
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {data.categories.map((cat, idx) => (
                          <Badge
                            className="text-[8px] sm:text-[10px] text-white"
                            key={idx}
                          >
                            {cat.heading}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <div className="mt-2">
                      <DialogShowResults data={data.categories} />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center w-full  my-10 space-y-10 py-10">
            <h1 className="text-2xl my-2 text-center font-bold">Прямой эфир</h1>
            <ScrollArea className="max-w-[1400px] border whitespace-nowrap ">
              <Table className=" ">
                <TableCaption>Результаты участников</TableCaption>
                {/* Заголовки таблицы */}
                <TableHeader>
                  <TableRow className="h-[110px] border-b rounded-md  flex relative ">
                    {columns.map((col) => (
                      <TableHead
                        key={col.id}
                        className={` text-center align-top ${
                          col.id === 1 ? "w-[256px] border-r " : ""
                        } ${col.id === 2 ? "w-[106px] border-r" : ""} ${
                          col.id === 3 ? "flex-1" : ""
                        }`}
                      >
                        {col.id === 1 && (
                          <div className="max-w-64 w-full">{col.title}</div>
                        )}
                        {col.id === 2 && <div>{col.title}</div>}
                        {/* Заголовок и подзаголовки для колонки Tasks */}
                        {col.id === 3 && col.tasks && (
                          <div>
                            <strong className="">Tasks</strong>
                            <div className="flex gap-x-6 mt-2">
                              {col.tasks.map((task, taskId) => (
                                <div
                                  key={task.id}
                                  className="flex flex-col gap-y-2  p-0 w-20"
                                >
                                  <div className="text-center w-20  p-0 border-b">
                                    <strong className="w-full ">
                                      {task.title}
                                    </strong>
                                  </div>
                                  <div className="p-0 m-0 border-b">
                                    {task.currentScore}
                                  </div>
                                  <div className="p-0 m-0 ">
                                    {task.correctAnswer}
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
                  {results.map((user, userIdx) => (
                    <TableRow
                      key={userIdx}
                      className={`${
                        userIdx % 2 != 0 ? "bg-[#f0f9ff]" : ""
                      } flex`}
                    >
                      {/* Колонка ФИО */}
                      <TableCell className="font-medium min-w-[256px] border-r w-[256px]">
                        {`${user.user.lastName} ${user.user.firstName}`}
                      </TableCell>
                      {/* Колонка c Баллами*/}

                      <TableCell className="text-center w-[106px] border-r">
                        <strong>{user.totalScore} </strong>
                      </TableCell>
                      {/* Колонка с Ответами */}
                      <TableCell className="flex-1 align-middle border-r">
                        <div className="flex gap-x-6">
                          {user.tasks.map((task, id) => (
                            <div
                              key={id}
                              className={`border text-center w-20 ${
                                task.isCorrectly
                                  ? "bg-[#a7f3d0]"
                                  : "bg-[#fecdd3]"
                              }`}
                            >
                              {task.userAnswer}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <div className="relative aspect-[97/60] w-full sm:aspect-[97/44]">
            {data.streamSrc ? (
              <iframe
                className="rounded-md object-cover object-center w-full h-[500px]"
                src={`${data.streamSrc || ""}`}
                title="Тестовая трансляция 2"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            ) : (
              "Прямой эфмир"
            )}
          </div>

          <div className="w-full flex flex-col gap-y-10">
            <div className="w-fit m-auto">
              <strong>Победители</strong>
            </div>
            <div className="grid grid-cols-1 gap-y-14 w-full">
              {data.disciplines.map((dis) => (
                <div key={dis.id}>
                  <div className="text-2xl font-semibold leading-none tracking-tight mb-5">
                    {dis.heading}
                  </div>
                  <div className="mx-auto mt-15 max-w-c-1280 px-4 md:px-8 xl:mt-20 xl:px-0">
                    <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:grid-cols-3 xl:gap-10">
                      {dis.categories.map((cat, idx) => (
                        <div key={idx} className="">
                          <Card className=" w-full">
                            <CardHeader>
                              <CardTitle>
                                <strong>{cat.heading}</strong>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="min-h-[200px]">
                              {loading ? (
                                <p>Загрузка...</p>
                              ) : displayWinners.length > 0 ? (
                                displayWinners
                                  .filter(
                                    (winner) =>
                                      winner.categoryId === cat.documentId
                                  )
                                  .sort(
                                    (a, b) => Number(a.place) - Number(b.place)
                                  )
                                  .map((winner, idx) => (
                                    <div
                                      className="flex border-b mb-3 gap-x-5"
                                      key={idx}
                                    >
                                      <div>{renderPlaceIcon(winner.place)}</div>
                                      <div>
                                        <strong>
                                          {`${winner.participant?.firstName} ${winner.participant?.lastName}`}
                                        </strong>
                                        <p className="text-sm text-muted-foreground">
                                          {winner.participant?.organization}
                                        </p>
                                      </div>
                                    </div>
                                  ))
                              ) : (
                                <p>Победителей пока еще нет</p>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
interface DialogResultsProps {
  data: Category[];
}
function DialogShowResults({ data }: Readonly<DialogResultsProps>) {
  const [scores, setScores] = useState<any[]>([]);
  const categories = data.map((cat) => {
    return {
      id: cat.id,
      title: cat.heading,
      scores: cat.scores,
      participants: cat.participants,
    };
  });

  const handleCategoryChange = (id: string) => {
    const resultsFromCategory = categories.filter(
      (cat) => cat.id.toString() == id
    );

    setScores(resultsFromCategory[0].scores || []);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-sm" variant="outline">
          Результаты
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1225px] ">
        <DialogHeader>
          <DialogTitle>
            <Select onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Выбирите категорию" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Категория</SelectLabel>
                  {categories.map((cat, idx) => (
                    <SelectItem key={idx} value={`${cat.id}`}>
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </DialogTitle>
          <DialogDescription>
            Перезагрузите страницу, если результаты не обновились
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 ">
          <ScrollArea className="max-w-[1400px] whitespace-nowrap ">
            <Table className="border">
              <TableCaption>Результаты участников</TableCaption>
              {/* Заголовки таблицы */}

              <TableHeader>
                <TableRow className="h-[110px] border-b flex relative  ">
                  <TableHead className="text-center align-top w-[256px] border-r">
                    <div>ФИО</div>
                  </TableHead>
                  <TableHead className="text-center align-top w-[106px] border-r">
                    <div>Баллы</div>
                  </TableHead>
                  <TableHead className="text-center align-top flex-1">
                    <div>
                      <strong className="">Задания</strong>
                      <div className="flex gap-x-6 mt-2">
                        {scores[0]?.result.map((task: Task) => (
                          <div
                            key={task?.id}
                            className="flex flex-col gap-y-2  p-0 w-20"
                          >
                            <div className="text-center w-20  p-0 border-b">
                              <strong className="w-full ">{task?.title}</strong>
                            </div>
                            <div className="p-0 m-0 border-b">
                              {task?.currentScore}
                            </div>
                            <div className="p-0 m-0 ">
                              {task?.correctAnswer}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>

              {/* Тело таблицы */}
              <TableBody>
                {scores?.map((score, Idx) => (
                  <TableRow
                    key={Idx}
                    className={`${Idx % 2 != 0 ? "bg-[#f0f9ff]" : ""} flex`}
                  >
                    {/* Колонка ФИО */}
                    <TableCell className="font-medium min-w-[256px] border-r w-[256px]">
                      {`${score.participant.lastName} ${score.participant.firstName}`}
                    </TableCell>
                    {/* Колонка c Баллами*/}

                    <TableCell className="text-center w-[106px] border-r">
                      <strong> {score.totalScore}</strong>
                    </TableCell>
                    {/* Колонка с Ответами */}
                    <TableCell className="flex-1 align-middle border-r">
                      <div className="flex gap-x-6">
                        {score.result.map((task: Task) => (
                          <div
                            key={task.id}
                            className={`border text-center w-20 ${
                              task.isCorrectly ? "bg-[#a7f3d0]" : "bg-[#fecdd3]"
                            }`}
                          >
                            {task.userAnswer}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
