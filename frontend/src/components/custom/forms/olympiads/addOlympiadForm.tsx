"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { DatePicker } from "../../DatePicker";
import { FORMS_STEPS } from "./Olympiad";
import ImagePicker from "../../ImagePicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StrapiErrors } from "../../StrapiErrors";
import { SubmitButton } from "../../SubmitButton";
import { ZodErrorsDisplay } from "../../ZodErrors";
import { createOlympiadAction } from "@/data/actions/olympiad-actions";
import { format } from "date-fns"; // Импортируем format из date-fns
import { toast } from "sonner";
import useCategoryDisciplineStore from "@/store/useCategoryDisciplineStore";
import { useFormState } from "react-dom";
import { useState } from "react";

interface StrapiErrorsProps {
  message: string | null;
  name: string;
}
interface OlympiadFormsProps {
  setStep: (step: FORMS_STEPS) => void;
}
const INITIAL_STATE_ERRORS = {
  message: null,
  name: "",
};
const INITIAL_STATE = {
  data: null,
};

export const OlympiadForm: React.FC<OlympiadFormsProps> = ({ setStep }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<StrapiErrorsProps>(INITIAL_STATE_ERRORS);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [image, setImage] = useState<File | null>(null); // Состояние для изображения
  const disciplines = useCategoryDisciplineStore(
    (state) => state.disciplinesData
  );
  const [selectedDiscipline, setSelectedDiscipline] = useState<number[]>([]);

  const [formValues, setFormValues] = useState({
    heading: "",
    subHeading: "",
    dateStart: "",
    dateEnd: "",
    place: "",
    image: null,
    streamSrc: ""
  });
  const handleStartDateChange = (selectedDate: Date | undefined) => {
    setStartDate(selectedDate); // Обновляем состояние при выборе даты
  };
  const handleEndDateChange = (selectedDate: Date | undefined) => {
    setEndDate(selectedDate); // Обновляем состояние при выборе даты
  };
  const [formState, formAction] = useFormState(
    createOlympiadAction,
    INITIAL_STATE
  );

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget); // Создаем FormData из текущей формы

    selectedDiscipline.forEach((dis) => {
      formData.append("disciplines", String(dis));
    });

    if (startDate) {
      formData.set("dateStart", format(startDate, "yyyy-MM-dd")); // Используем формат для даты начала
    }
    if (endDate) {
      formData.set("dateEnd", format(endDate, "yyyy-MM-dd")); // Используем формат для даты окончания
    }
    if (image) {
      formData.set("image", image); // Устанавливаем выбранное изображение
    }

    setLoading(true);

    try {
      await formAction(formData);
      if (formState?.strapiErrors || formState?.zodErrors.length > 0) {
        toast.error("Failed to add olympiad");
      } else {
        setFormValues({
          heading: "",
          subHeading: "",
          place: "",
          image: null,
          dateEnd: "",
          dateStart: "",
          streamSrc: ""
        });
        setImage(null);
        setStartDate(undefined);
        setEndDate(undefined);
        clearError();
        toast.success("Olympiad created");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while adding the olympiad");
    } finally {
      setLoading(false);
    }
  }
  const handleCheckboxChange = (id: number) => {
    setSelectedDiscipline((prevSelected) => {
      if (prevSelected.includes(id)) {
        // Если чекбокс уже выбран, убираем его из массива
        return prevSelected.filter((checkboxId) => checkboxId !== id);
      } else {
        // Если чекбокс не выбран, добавляем его в массив
        return [...prevSelected, id];
      }
    });
  };
  const handleImageChange = (file: File | null) => {
    setImage(file); // Теперь это корректно
  };
  const handlePrevFormsState = () => {
    setStep(FORMS_STEPS.discipline);
  };
  function clearError() {
    setError(INITIAL_STATE_ERRORS);
  }

  return (
    <div className="w-full h-full max-w-6xl flex flex-col">
      <form onSubmit={handleFormSubmit} className=" h-full">
        <Card className="p-2 relative h-full ">
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

            <div className="m-0">
              <Label htmlFor="organization">Place</Label>
              <Input
                id="place"
                name="place"
                type="text"
                placeholder="place"
                value={formValues.place} // Устанавливаем значение из состояния
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    place: e.target.value,
                  }))
                } // Обновляем состояние при вводе
              />
              <ZodErrorsDisplay errors={formState?.zodErrors?.place} />
            </div>

            <div>
              <Label htmlFor="dob">Дата начала</Label>
              <DatePicker onChange={handleStartDateChange} />
              <ZodErrorsDisplay errors={formState?.zodErrors?.dateStart} />
            </div>
            <div>
              <Label htmlFor="dob">Конец</Label>
              <DatePicker onChange={handleEndDateChange} />
              <ZodErrorsDisplay errors={formState?.zodErrors?.dateEnd} />
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
            <div className="m-0">
              <Label htmlFor="streamSrc">Stream src</Label>
              <Input
                id="streamSrc"
                name="streamSrc"
                type="text"
                placeholder="your broadcast src"
                value={formValues.streamSrc} // Устанавливаем значение из состояния
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    streamSrc: e.target.value,
                  }))
                } // Обновляем состояние при вводе
              />
              <ZodErrorsDisplay errors={formState?.zodErrors?.streamSrc} />
            </div>
            <div className=" m-0 h-[180px]  bottom-16 w-full">
              <Label>Disciplines</Label>
              <ScrollArea className="w-full rounded-md border px-2 pt-1 h-[180px]">
                <div className="grid grid-cols-2  w-full">
                  {disciplines.map((discipline) => (
                    <div
                      key={discipline.id}
                      className="flex items-center w-full gap-x-2 mb-3"
                    >
                      <Input
                        className=" w-full rounded-md"
                        type="checkbox"
                        id={`${discipline.id}`}
                        checked={selectedDiscipline.includes(discipline.id)}
                        onChange={() => handleCheckboxChange(discipline.id)}
                      />
                      <label
                        htmlFor={`${discipline.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {discipline.heading}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <ZodErrorsDisplay errors={formState?.zodErrors?.categories} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end w-full gap-x-5 absolute  ring-0 bottom-0">
            <Button onClick={handlePrevFormsState}>Prev</Button>
            <SubmitButton
              text="Create olumpiad"
              loadingText="creating"
              loading={loading}
            />
            <StrapiErrors error={formState?.strapiErrors} />
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
