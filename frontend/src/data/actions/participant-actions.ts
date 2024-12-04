"use server";

import { addParticipantsService } from "../service/participant-service";
import { z } from "zod";

const schemaParticipant = z.object({
  firstName: z.string().min(2).max(20, {
    message: "First name must be between 2 and 20 characters",
  }),
  lastName: z.string().min(2).max(30, {
    message: "Last name must be between 2 and 30 characters",
  }),
  organization: z
    .string()
    .min(2)
    .max(30, {
      message: "Last name must be between 2 and 30 characters",
    })
    .optional(),
  age: z.string().refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
    message: "Дата должна быть в формате ГГГГ-ММ-ДД",
  }),
  avatar: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Размер файла не должен превышать 5 МБ",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      {
        message: "Допустимые форматы изображения: JPEG или PNG",
      }
    )
    .optional(),
});

export async function addParticipantsAction(
  prevState: any,
  formData: FormData
) {
  const validatedFields = schemaParticipant.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    organization: formData.get("organization"),
    age: formData.get("dob"),
    avatar: formData.get("avatar") || undefined,
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
      message: "Missing Fields. Failed to Register.",
    };
  }

  const responseData = await addParticipantsService(validatedFields.data);

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
}
