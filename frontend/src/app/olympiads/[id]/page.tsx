"use client";

import { Result, Task, Winners } from "@/lib/types";
import { useEffect, useState } from "react";
import useOlympiadStore, {
  Discipline,
  Olympiad,
} from "@/store/useOlympiadsStore";

import { SingleOlympiadSection } from "@/components/custom/SingleOlympiadSection";
import { getOlympiadById } from "@/data/loaders";
import { io } from "socket.io-client";

interface ParamsProps {
  params: {
    id: string;
  };
}


export default function SingleOlympiadRoot({ params }: ParamsProps) {
  const initialOlympiadState: Olympiad = {
    id: 0,
    documentId: "",
    heading: "Default Heading",
    subHeading: "Default SubHeading",
    dateStart: "2024-01-01",
    dateEnd: "2024-01-02",
    place: "Default Location",
    disciplines: [],
    startRegistration: false,
    image: {
      id: 0,
      documentId: "",
      url: "",
      alternativeText: "defailt Text",
    },
    streamSrc: "",
  };
  const [results, setResults] = useState<Result[]>([]);
  const [olympiad, setOlympiad] = useState<Olympiad>(initialOlympiadState);
  const [loading, setLoading] = useState(true);
  const [serverWinners, setServerWinners] = useState<Winners[]>([]);
  const [socketWinners, setSocketWinners] = useState<Winners[]>([]);
  const [displayWinners, setDisplayWinners] = useState<Winners[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const socket = io("http://localhost:1337");
  const updateWinners = (newWinners: Winners[]) => {
    if (!Array.isArray(newWinners)) {
      console.error("Expected newWinners to be an array, but got:", newWinners);
      return; // Выход из функции, если это не массив
    }
    if (typeof newWinners === null && typeof newWinners === undefined) {
      return [];
    }
    console.log(newWinners);
    setDisplayWinners((prevWinners) => {
      if (!newWinners || newWinners.length === 0) {
        return prevWinners; // Если победителей нет, не обновляем список
      }

      const updatedWinners = [...prevWinners];

      // Обновляем только тех победителей, которые относятся к полученной категории
      newWinners.forEach((newWinner) => {
        const winnerIndex = updatedWinners.findIndex(
          (winner) =>
            winner.categoryId === newWinner.categoryId &&
            winner.participant.documentId === newWinner.participant.documentId
        );

        if (winnerIndex !== -1) {
          // Если победитель уже есть в списке, обновляем его данные
          updatedWinners[winnerIndex] = newWinner;
        } else {
          // Если победитель новый, добавляем его в список
          updatedWinners.push(newWinner);
        }
      });

      return updatedWinners;
    });
  };

  useEffect(() => {
    // Присоединяемся к комнате конкретной олимпиады
    socket.emit("joinOlympiad", params.id);

    // Слушаем обновления результатов
    socket.on("resultsUpdated", ({ olympiadId, results }) => {
      console.log("Подключено к веб-сокету:", socket.id);
      if (olympiadId === params.id) {
        // Проверяем, что данные для текущей олимпиады
        setResults(results); // Обновляем локальное состояние
      }
    });

    socket.on("categoryWinnersUpdated", ({ olympiadId, winners }) => {
      if (olympiadId === params.id) {
        if (!winners) {
          updateWinners([]);
        } else {
          updateWinners(winners);
        }
      }
    });
    return () => {
      socket.disconnect(); // Отключаем сокет при размонтировании
    };
  }, [params.id]);



  const getOlymiad = async () => {
    setLoading(true);
    const data = await getOlympiadById(params.id);

    const extractWinners = (disciplines: Discipline[]) => {
      return disciplines.flatMap((discipline) =>
        discipline.categories.flatMap((category) =>
          category.winners.map((winner) => ({
            ...winner,
            categoryId: category.documentId, // Дополнительно сохраняем ID категории
          }))
        )
      );
    };
    const winnersFromServer = extractWinners(data.disciplines || []);
    setOlympiad(data);
    setServerWinners(winnersFromServer);
    setLoading(false);
  };

  useEffect(() => {
    getOlymiad();
  }, []);
  useEffect(() => {
    setDisplayWinners(socketWinners.length > 0 ? socketWinners : serverWinners);
  }, [serverWinners, socketWinners]);
  useEffect(() => {
    setTasks(results[0]?.tasks || []);
  }, [results]);

  const newColumns = [
    { id: 1, title: "Фио" },
    {
      id: 2,
      title: "Баллы",
      score: 0,
    },
    { id: 3, title: "Tasks", tasks: tasks },
  ];

  return (
    <SingleOlympiadSection
      loading={loading}
      displayWinners={displayWinners}
      data={olympiad}
      results={results}
      columns={newColumns}
    />
  );
}
