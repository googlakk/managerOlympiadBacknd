"use client";

import { Olympiad } from "@/store/useOlympiadsStore";
import { OlympiadCard } from "./SingleOlympiad";
import SectionTitle from "@/components/common/SectionTitle";
import { motion } from "framer-motion";

interface OlympiadSectionProps {
  id: number;
  documentId: string;
  __component: string;
  heading: string;
  subHeading: string;
  olympiads: Olympiad[]; // Массив олимпиад
}
export const OlympiadsPreview = async ({
  data,
}: {
  readonly data: OlympiadSectionProps;
}) => {
  const { olympiads } = data;

  return (
    <section
      id="blog"
      className="z-10  relative dark:bg-bg-color-dark py-16 md:py-20 lg:py-28"
    >
      <div className="container  backdrop-blur-md rounded-lg">
        <SectionTitle title="Наши последние олимпиады" paragraph="" center />
        <motion.div
          variants={{
            hidden: {
              opacity: 0,
              x: -20,
            },

            visible: {
              opacity: 1,
              x: 0,
            },
          }}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="animate_top "
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
            {olympiads.map((olympiad, idx) => (
              <div key={idx} className="w-full">
                <OlympiadCard key={idx} data={olympiad} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-[-1] h-full w-full bg-[url(/images/bg/shape.svg)] bg-cover bg-center bg-no-repeat"></div>
    </section>
  );
};
