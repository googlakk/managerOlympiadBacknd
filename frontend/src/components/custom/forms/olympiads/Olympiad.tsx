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

import { Button } from "@/components/ui/button";
import { CategoryForm } from "./addCategoryForm";
import { DisciplineForm } from "./addDisciplineForm";
import { OlympiadForm } from "./addOlympiadForm";
import { useState } from "react";

export enum FORMS_STEPS {
  category,
  discipline,
  olympiad,
}
export const OlympiadAddFormRout = () => {
  const [step, setStep] = useState<FORMS_STEPS>(FORMS_STEPS.category);
  const steps = {
    [FORMS_STEPS.category]: <CategoryForm setStep={setStep} />,
    [FORMS_STEPS.discipline]: <DisciplineForm setStep={setStep} />,
    [FORMS_STEPS.olympiad]: <OlympiadForm setStep={setStep} />,
  };
  const formsMetaData = {
    [FORMS_STEPS.category]: {
      heading: " Create categeory",
      subHeading: "You can create category. Click save when you're done.",
    },
    [FORMS_STEPS.discipline]: {
      heading: "Create Discipline",
      subHeading: "Add disciplines related to the Olympiad category",
    },
    [FORMS_STEPS.olympiad]: {
      heading: "Create Olympiad",
      subHeading: "Fill in the details to create a new Olympiad",
    },
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Создать olymp</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[896px] max-h-[700px] flex flex-col h-full ">
          <DialogHeader>
            <DialogTitle>{formsMetaData[step].heading}</DialogTitle>
            <DialogDescription>
              {formsMetaData[step].subHeading}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow flex flex-col h-full">{steps[step]}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
