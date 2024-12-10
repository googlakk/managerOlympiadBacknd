import { Result, loadedWinners } from "@/lib/types";
import {
  addResultService,
  updateResultService,
} from "../service/resultParticipant-service";
import { getAllScores, getAllWinners } from "../loaders";

import { Winners } from "./../../lib/types";
import { mutateData } from "../service/mutate-data";

export async function createCategoryParticipantResults(results: Result[]) {
  const data = await getAllScores();
  const newData: [] = data.data;

  const participants = newData.map((item: any) => {
    return {
      category: item?.category,
      participant: item?.participant,
      dicipline: item.discipline,
    };
  });
  console.log("scores", participants);
  const existingResults = results.map((newResult: Result) => {
    const exists = participants.some((participant) => {
      return (
        newResult.categoryId === participant.category.documentId &&
        newResult.disciplineId === participant.dicipline.documentId &&
        newResult.user.documentId === participant.participant.documentId
      );
    });
    return {
      result: newResult,
      isExist: exists,
    };
  });

  for (const result of existingResults) {
    if (!result.isExist) {
      const addedResult = {
        participant: result.result.user.documentId,
        category: result.result.categoryId || "",
        discipline: result.result.disciplineId || "",
        totalScore: result.result.totalScore,
        result: result.result.tasks,
      };

      try {
        const response = await addResultService(addedResult);
        console.log("результат успешно добавлен", response);
      } catch (error) {
        console.error("Ошибка при добавлении результата:", error);
      }
    } else {
      console.log("результат уже имеется");
    }
  }
}

export async function updateCategoryParticipantResults(results: Result[]) {
  for (const userResult of results) {
    const newResult = {
      participant: userResult.user.documentId,
      category: userResult.categoryId || "",
      discipline: userResult.disciplineId || "",
      totalScore: userResult.totalScore,
      result: userResult.tasks,
    };
    if (userResult.resultId) {
      updateResultService(userResult.resultId, newResult);
    }
  }
}

export async function winnersByCategoryAction(winners: Winners[]) {
  const data = await getAllWinners();
  const newData: [] = data.data;

  console.log("winners", winners);

  const loadedWinners = newData.map((winner: loadedWinners) => {
    return {
      participant: winner.participant.documentId,
      category: winner.category.documentId,
      place: winner.place,
    };
  });

  const existingWinners = winners.map((winner) => {
    const exist = loadedWinners.some((loadedWinner) => {
      return (
        winner.categoryId === loadedWinner.category &&
        winner.participant.documentId === loadedWinner.participant
      );
    });
    return {
      winner: {
        category: winner.categoryId,
        participant: winner.participant.documentId,
        place: winner.place,
      },
      isExist: exist,
    };
  });

  for (let winner of existingWinners) {
    if (!winner.isExist) {
      const payload = winner.winner;
      try {
        const respnoseData = await mutateData("POST", "/api/winners", payload);
        console.log("winners added", respnoseData);
      } catch (error) {
        console.error("Ошибка при добавлении результата:", error);
      }
    } else {
      console.log("winner already added");
    }
  }
  console.log("winners loaded", loadedWinners);
}
