"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { use, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { FORMS_STEPS } from "./Olympiad";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StrapiErrors } from "../../StrapiErrors";
import { SubmitButton } from "../../SubmitButton";
import { Textarea } from "@/components/ui/textarea";
import { ZodErrorsDisplay } from "../../ZodErrors";
import { createCategoryAction } from "@/data/actions/category-actions";
import { toast } from "sonner";
import useCategoryDisciplineStore from "@/store/useCategoryDisciplineStore";
import { useFormState } from "react-dom";

interface StrapiErrorsProps {
  message: string | null;
  name: string;
}
interface CategoryFormProps {
  setStep: (step: FORMS_STEPS) => void;
}
const INITIAL_STATE_ERRORS = {
  message: null,
  name: "",
};
const INITIAL_STATE = {
  data: null,
};

export const CategoryForm: React.FC<CategoryFormProps> = ({ setStep }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<StrapiErrorsProps>(INITIAL_STATE_ERRORS);
  const addCategoryToStore = useCategoryDisciplineStore(
    (state) => state.setCategories
  );
  const cats = useCategoryDisciplineStore((state) => state.categoriesData);
  const [formValues, setFormValues] = useState({
    heading: "",
    description: "",
  });
  console.log(cats);
  const [formState, formAction] = useFormState(
    createCategoryAction,
    INITIAL_STATE
  );
  useEffect(() => {
    if (formState?.data?.data) {
      const { id, heading } = formState.data.data.data; // Извлекаем `id` и `heading`
      console.log("id:", id);
      console.log("heading", heading);
      addCategoryToStore({ id, heading });
    }
  }, [formState.data]);

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget); // Создаем FormData из текущей формы

    setLoading(true);
    try {
      // Запускаем функцию отправки формы
      await formAction(formData);

      // Проверяем наличие ошибок валидации
      if (formState?.strapiErrors || formState?.zodErrors?.length > 0) {
        // Ошибка валидации
        toast.error("Failed to add category: Please check the input fields.");
      } else {
        // Если ошибок нет, сбрасываем значения формы
        setFormValues({
          heading: "",
          description: "",
        });
        clearError()
        toast.success("Category created successfully!");
      }
    } catch (error) {
      // Обрабатываем непредвиденные ошибки
      console.error("Error submitting form:", error);
      toast.error("An error occurred while adding the category");
    } finally {
      setLoading(false);
    }
  }
  const handleNextStep = () => {
    setStep(FORMS_STEPS.discipline);
  };
  function clearError() {
    setError(INITIAL_STATE_ERRORS);
  }

  return (
    <div className="w-full h-full max-w-4xl flex flex-col">
      <form onSubmit={handleFormSubmit} className=" h-full ">
        <Card className="p-2 h-full relative ">
          <CardContent className="grid grid-cols-2 gap-8 ">
            <div className="m-0">
              <Label htmlFor="firstName">Heading</Label>
              <Input
                id="heading"
                name="heading"
                type="text"
                placeholder="heading of categories"
                value={formValues.heading} // Устанавливаем значение из состояния
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    heading: e.target.value,
                  }))
                } // Обновляем состояние при вводе
              />
              <ZodErrorsDisplay errors={formState?.zodErrors?.heading} />
            </div>

            <div className="m-0">
              <Label htmlFor="lastName">Description</Label>
              <Textarea
                id="description"
                name="description"
                className="resize-none border rounded-md w-full h-[224px] p-2"
                placeholder="description"
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                } // Обновляем состояние при вводе
              />
              <ZodErrorsDisplay errors={formState?.zodErrors?.description} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end w-full gap-x-5 absolute ring-0 bottom-0">
            <SubmitButton
              text="Create categories"
              loadingText="creating"
              loading={loading}
            />
            <Button onClick={handleNextStep}>Next</Button>
            <StrapiErrors error={formState?.strapiErrors} />
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
