"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { OlympiadCard } from "@/components/custom/Olympiads/SingleOlympiad";
import SectionTitle from "@/components/common/SectionTitle";
import { StrapiImage } from "@/components/custom/StrapiImage";
import useOlympiadStore from "@/store/useOlympiadsStore";

export default function OlympiadsRoot() {
  const { olympiads } = useOlympiadStore();

  return (
    <section className="relative z-10 overflow-hidden bg-white pb-16 pt-[120px] dark:bg-gray-dark md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px]">
      <SectionTitle title="Наши олимпиады" paragraph="Узнайте более подробнее о наших олимпиадах" center />
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          {olympiads.map((olympiad, idx) => (
            <div key={idx} className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3">
              <OlympiadCard key={idx} data={olympiad} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
