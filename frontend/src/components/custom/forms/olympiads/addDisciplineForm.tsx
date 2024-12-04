"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { FORMS_STEPS } from "./Olympiad";
import ImagePicker from "../../ImagePicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StrapiErrors } from "../../StrapiErrors";
import { SubmitButton } from "../../SubmitButton";
import { ZodErrorsDisplay } from "../../ZodErrors";
import { createDisciplineAction } from "@/data/actions/discipline-action";
import { toast } from "sonner";
import useCategoryDisciplineStore from "@/store/useCategoryDisciplineStore";
import { useFormState } from "react-dom";

interface StrapiErrorsProps {
  message: string | null;
  name: string;
}
interface DisciplineFormsProps {
  setStep: (step: FORMS_STEPS) => void;
}
const INITIAL_STATE_ERRORS = {
  message: null,
  name: "",
};
const INITIAL_STATE = {
  data: null,
};

export const DisciplineForm: React.FC<DisciplineFormsProps> = ({ setStep }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<StrapiErrorsProps>(INITIAL_STATE_ERRORS);

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const addDisciplineToStore = useCategoryDisciplineStore(
    (state) => state.setDisciplines
  );
  const [image, setImage] = useState<File | null>(null); // Состояние для изображения
  const cats = useCategoryDisciplineStore((state) => state.categoriesData);
  console.log(cats);
  const [formValues, setFormValues] = useState({
    heading: "",
    subHeading: "",
    image: null,
  });

  const [formState, formAction] = useFormState(
    createDisciplineAction,
    INITIAL_STATE
  );
  const handleCheckboxChange = (id: number) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((checkboxId) => checkboxId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };
  useEffect(() => {
    if (formState?.data?.data) {
      const { id, heading } = formState.data.data.data; // Извлекаем `id` и `heading`
      console.log("id:", id);
      console.log("heading", heading);
      addDisciplineToStore({ id, heading });
    }
  }, [formState.data]);

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget); // Создаем FormData из текущей формы

    selectedCategories.forEach((cat) =>
      formData.append("categories", String(cat))
    );
    setLoading(true);
    try {
      // Запускаем функцию отправки формы
      await formAction(formData);

      // Проверяем наличие ошибок валидации
      if (formState?.strapiErrors || formState?.zodErrors) {
        // Ошибка валидации
        toast.error("Failed to add discipline: Please check the input fields.");
      } else {
        // Если ошибок нет, сбрасываем значения формы
        setFormValues({
          heading: "",
          subHeading: "",
          image: null,
        });
        clearError();
        toast.success("Discipline created successfully!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while adding the discipline");
    } finally {
      setLoading(false);
    }
  }
  const handleImageChange = (file: File | null) => {
    setImage(file); // Теперь это корректно
  };
  const handleNextFormsStep = () => {
    setStep(FORMS_STEPS.olympiad);
  };
  const handlePrevFormsStep = () => {
    setStep(FORMS_STEPS.category);
  };

  function clearError() {
    setError(INITIAL_STATE_ERRORS);
  }

  return (
    <div className="w-full h-full max-w-4xl flex flex-col">
      <form onSubmit={handleFormSubmit} className=" h-full">
        <Card className="p-2 relative h-full">
          <CardContent className="grid grid-cols-2 gap-8">
            <div className="m-0">
              <Label htmlFor="firstName">Heading</Label>
              <Input
                id="heading"
                name="heading"
                type="text"
                placeholder="heading"
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
              <Label htmlFor="lastName">subHeading</Label>
              <Input
                id="subHeading"
                name="subHeading"
                type="text"
                placeholder="subHeading"
                value={formValues.subHeading} // Устанавливаем значение из состояния
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    subHeading: e.target.value,
                  }))
                } // Обновляем состояние при вводе
              />
              <ZodErrorsDisplay errors={formState?.zodErrors?.subHeading} />
            </div>

            <div>
              <Label htmlFor="image">Preview</Label>
              <ImagePicker
                id="image"
                name="image"
                label="preview  Image"
                defaultValue={""}
                onImageChange={handleImageChange}
              />
              <ZodErrorsDisplay errors={formState?.zodErrors?.image} />
            </div>

            <div>
              <Label>Categories</Label>
              <ScrollArea className="w-full rounded-md border px-2 pt-1 h-[300px]">
                <div className="grid grid-cols-2">
                  {cats.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center gap-x-2 mb-3"
                    >
                      <Input
                        className=" w-4 rounded-md"
                        type="checkbox"
                        id={`${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCheckboxChange(category.id)}
                      />
                      <label
                        htmlFor={`${category.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category.heading}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <ZodErrorsDisplay errors={formState?.zodErrors?.categories} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end w-full gap-x-5 absolute ring-0 bottom-0">
            <Button onClick={handlePrevFormsStep}>Prev</Button>
            <SubmitButton
              text="Create discipline"
              loadingText="creating"
              loading={loading}
            />
            <Button onClick={handleNextFormsStep}>Next</Button>
            <StrapiErrors error={formState?.strapiErrors} />
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
