"use server";

import { Participants } from "@/store/useOlympiadsStore";
import { createCategoryService } from "../service/category-service";
import { mutateData } from "../service/mutate-data";
import qs from "qs";
import { z } from "zod";

const schemaCategory = z.object({
  heading: z.string().min(2).max(100, {
    message: "Heading must be between 2 and 20 characters",
  }),
  description: z.string().min(2).max(150, {
    message: "Sub heading must be between 2 and 30 characters",
  }),
});

export async function createCategoryAction(prevState: any, formData: FormData) {
  // 1. Проверяем и валидируем данные, включая файл
  const validatedFields = schemaCategory.safeParse({
    heading: formData.get("heading"),
    description: formData.get("description"),
  });
  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
      message: "Missing Fields. Failed to Register.",
    };
  }

  const responseData = await createCategoryService(validatedFields.data);

  if (!responseData) {
    return {
      ...prevState,
      strapiErrors: null,
      zodErrors: null,
      message: "Ops! Something went wrong. Please try again.",
    };
  }

  if (responseData.error) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      message: "Failed to Register.",
    };
  }

  return {
    ...prevState,
    data: responseData,
    zodErrors: null,
    strapiErrors: null,
    message: "Olympiad successfully created!",
  };
}

export async function addParticipantsToCategory(
  categoryId: string,
  newParticipants: string[]
) {
  // Сначала получаем текущих участников для категории
  const query = qs.stringify({
    populate: {
      participants: true,
    },
  });

  const existingCategoryData = await mutateData(
    "GET",
    `/api/categories/${categoryId}?${query}`
  );

  if (!existingCategoryData || existingCategoryData.error) {
    return {
      strapiErrors: existingCategoryData?.error || null,
      message: "Failed to retrieve current participants.",
    };
  }

  // Извлекаем текущих участников и добавляем новых
  const existingParticipants = existingCategoryData.data.participants.map(
    (participant: Participants) => participant.id
  );

  const updatedParticipants = Array.from(
    new Set([...existingParticipants, ...newParticipants])
  );

  // Подготавливаем данные для обновления
  const payload = { participants: updatedParticipants };

  // Отправляем обновленный список участников
  const responseData = await mutateData(
    "PUT",
    `/api/categories/${categoryId}?${query}`,
    payload
  );

  if (!responseData) {
    return {
      strapiErrors: null,
      message: "Ops! Something went wrong. Please try again.",
    };
  }

  if (responseData.error) {
    return {
      strapiErrors: responseData.error,
      message: "Failed to Register.",
    };
  }

  return {
    message: "Participants successfully updated",
    data: responseData,
    strapiErrors: null,
  };
}

export async function removeParticipantsByCategory(
  categoryId: string,
  newParticipants: number[]
) {
  const query = qs.stringify({
    populate: "participants",
  });

  const payload = {
    participants: newParticipants,
  };

  const responseData = await mutateData(
    "PUT",
    `/api/categories/${categoryId}?${query}`,
    payload
  );

  if (!responseData) {
    return {
      strapiErrors: null,
      message: "Ops! Something went wrong. Please try again.",
    };
  }

  if (responseData.error) {
    return {
      strapiErrors: responseData.error,
      message: "Failed to Register.",
    };
  }

  return {
    message: "Participants successfully updated",
    data: responseData,
    strapiErrors: null,
  };
}
