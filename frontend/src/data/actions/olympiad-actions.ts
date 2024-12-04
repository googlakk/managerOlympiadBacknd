"use server";

import { addParticipantsService } from "../service/participant-service";
import { createOlympiadService } from "../service/olympiad-service";
import { fileUploadService } from "../service/file-upload-service";
import { getEmbedUrl } from "@/lib/utils";
import { z } from "zod";
const MAX_FILE_SIZE = 5000000;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const schemaOlympiad = z.object({
  heading: z.string().min(2).max(100, {
    message: "Heading must be between 2 and 100 characters",
  }),
  subHeading: z.string().min(2).max(150, {
    message: "Sub heading must be between 2 and 150 characters",
  }),
  place: z.string().min(2).max(200, {
    message: "Last name must be between 2 and 30 characters",
  }),
  dateStart: z.string().refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
    message: "Дата должна быть в формате ГГГГ-ММ-ДД",
  }),
  dateEnd: z.string().refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
    message: "Дата должна быть в формате ГГГГ-ММ-ДД",
  }),
  image: z
    .any()
    .refine((file) => {
      if (file.size === 0 || file.name === undefined) return false;
      else return true;
    }, "Please update or add new image.")

    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    )
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`),
  disciplines: z
    .array(z.string(), { message: "At least one category is required" })
    .nonempty("At least one category is required"),
  streamSrc: z.string().min(2).max(150, {
    message: "Src must be between 2 and 150 characters",
  }),
});

export async function createOlympiadAction(prevState: any, formData: FormData) {
  // 1. Проверяем и валидируем данные, включая файл
  const validatedFields = schemaOlympiad.safeParse({
    heading: formData.get("heading"),
    subHeading: formData.get("subHeading"),
    place: formData.get("place"),
    dateStart: formData.get("dateStart"),
    dateEnd: formData.get("dateEnd"),
    image: formData.get("image"),
    disciplines: formData.getAll("disciplines"),
    streamSrc: formData.get("streamSrc"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
      message: "Missing Fields. Failed to Register.",
    };
  }
  // 1. Изменяем формат ссылки, на трансляцию
  let embedStreamUrl = getEmbedUrl(validatedFields.data.streamSrc);
  console.log(embedStreamUrl);
  // 2. Загружаем изображение, если оно есть, и получаем его ID
  let imageId = null;
  if (validatedFields.data.image) {
    const fileUploadResponse = await fileUploadService(
      validatedFields.data.image
    );
    if (!fileUploadResponse || fileUploadResponse.error) {
      return {
        ...prevState,
        strapiErrors: fileUploadResponse ? fileUploadResponse.error : null,
        zodErrors: null,
        message: "Failed to Upload File.",
      };
    }
    imageId = fileUploadResponse[0].id; // сохраняем ID загруженного изображения
  }

  // 3. Добавляем ID изображения в payload и создаём олимпиаду
  const olympiadData = {
    ...validatedFields.data,
    image: imageId,
    streamSrc: embedStreamUrl,
  };

  const responseData = await createOlympiadService(olympiadData);

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

export async function removeOlympiad(id: string) {
  // /api/olympiads/:id
}
