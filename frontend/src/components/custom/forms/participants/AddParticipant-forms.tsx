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
import { DatePicker } from "../../DatePicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StrapiErrors } from "../../StrapiErrors";
import { SubmitButton } from "../../SubmitButton";
import { ZodErrorsDisplay } from "../../ZodErrors";
import { addParticipantsAction } from "@/data/actions/participant-actions";
import { format } from "date-fns"; // Импортируем format из date-fns
import { toast } from "sonner";
import { useFormState } from "react-dom";
import { useState } from "react";

interface StrapiErrorsProps {
  message: string | null;
  name: string;
}

const INITIAL_STATE_ERRORS = {
  message: null,
  name: "",
};
const INITIAL_STATE = {
  data: null,
};
interface AddParticipantsFormsProps {
  dataReload?: (r: boolean) => void;
}
export function AddParticipantsForms({
  dataReload,
}: AddParticipantsFormsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<StrapiErrorsProps>(INITIAL_STATE_ERRORS);
  const [dob, setDob] = useState<Date | undefined>();
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    organization: "",
    dob: "",
  });
  const handleDateChange = (selectedDate: Date | undefined) => {
    setDob(selectedDate); // Обновляем состояние при выборе даты
  };

  const [formState, formAction] = useFormState(
    addParticipantsAction,
    INITIAL_STATE
  );

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const originalFormData = new FormData(event.currentTarget);

    if (dob) {
      originalFormData.set("dob", format(dob, "yyyy-MM-dd"));
    }

    setLoading(true);

    try {
      await formAction(originalFormData); // formAction обновит formState автоматически

      if (formState?.strapiErrors) {
        toast.error("Failed to add participant");
      } else {
        setFormValues({
          firstName: "",
          lastName: "",
          organization: "",
          dob: "",
        });
        setDob(undefined); // сбрасываем выбранную дату

        toast.success("Participant added");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while adding the participant");
    } finally {
      setLoading(false);
      if (dataReload) {
        dataReload(true);
      }
    }
  }

  function clearError() {
    setError(INITIAL_STATE_ERRORS);
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Создать участинка</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[896px]">
          <DialogHeader>
            <DialogTitle>Add participant</DialogTitle>
            <DialogDescription>
              You can add participant. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full max-w-4xl">
            <form onSubmit={handleFormSubmit}>
              <Card className="p-2">
                <CardContent className="grid grid-cols-2 gap-8">
                  <div className="m-0">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="firstName"
                      value={formValues.firstName} // Устанавливаем значение из состояния
                      onChange={(e) =>
                        setFormValues((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      } // Обновляем состояние при вводе
                    />
                    <ZodErrorsDisplay
                      errors={formState?.zodErrors?.firstName}
                    />
                  </div>

                  <div className="m-0">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="lastName"
                      value={formValues.lastName} // Устанавливаем значение из состояния
                      onChange={(e) =>
                        setFormValues((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      } // Обновляем состояние при вводе
                    />
                    <ZodErrorsDisplay errors={formState?.zodErrors?.lastName} />
                  </div>

                  <div className="m-0">
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      name="organization"
                      type="text"
                      placeholder="organization"
                      value={formValues.organization} // Устанавливаем значение из состояния
                      onChange={(e) =>
                        setFormValues((prev) => ({
                          ...prev,
                          organization: e.target.value,
                        }))
                      } // Обновляем состояние при вводе
                    />
                    <ZodErrorsDisplay
                      errors={formState?.zodErrors?.organization}
                    />
                  </div>

                  <div>
                    <Label htmlFor="dob">Дата рождения</Label>
                    <DatePicker onChange={handleDateChange} />
                    <ZodErrorsDisplay errors={formState?.zodErrors?.dob} />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <SubmitButton
                    text="Add participant"
                    loadingText="Adding"
                    loading={loading}
                  />
                  <StrapiErrors error={formState?.strapiErrors} />
                </CardFooter>
              </Card>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
