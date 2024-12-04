import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { Olympiad } from "@/store/useOlympiadsStore";
import { OlympiadCard } from "./OlympiadCard";
import { StrapiImage } from "./StrapiImage";

interface Image {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
}


interface OlympiadSectionProps {
  id: number;
  documentId: string;
  __component: string;
  heading: string;
  subHeading: string;
  olympiads: Olympiad[]; // Массив олимпиад
}
export const OlympiadSection = async ({
  data,
}: {
  readonly data: OlympiadSectionProps;
}) => {
  const { olympiads } = data;

  return (
    <>
      <div className=" min-h-[400px] grid grid-cols-3 gap-x-10 my-5">
        {olympiads.map((olympiad, idx) => (
          <OlympiadCard key={idx} data={olympiad} />
        ))}
      </div>
    </>
  );
};


