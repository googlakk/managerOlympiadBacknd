"use server";

import { createDisciplineService } from "../service/discipline-service";
import { fileUploadService } from "../service/file-upload-service";
import { z } from "zod";

const MAX_FILE_SIZE = 5000000;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const schemaDiscipline = z.object({
  heading: z.string().min(2).max(100, {
    message: "Heading must be between 2 and 20 characters",
  }),
  subHeading: z.string().min(2).max(150, {
    message: "Sub heading must be between 2 and 30 characters",
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
  categories: z
    .array(z.string(), { message: "At least one category is required" })
    .nonempty("At least one category is required"),
});

export async function createDisciplineAction(
  prevState: any,
  formData: FormData
) {
  const validatedFields = schemaDiscipline.safeParse({
    heading: formData.get("heading"),
    subHeading: formData.get("subHeading"),
    image: formData.get("image"),
    categories: formData.getAll("categories"), // Получаем категории как массив
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
      message: "Missing Fields. Failed to Register.",
    };
  }

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
    imageId = fileUploadResponse[0].id;
  }

  const disciplineData = {
    ...validatedFields.data,
    image: imageId,
  };

  const responseData = await createDisciplineService(disciplineData);

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
