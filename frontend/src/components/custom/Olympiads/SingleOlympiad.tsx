import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Olympiad } from "@/store/useOlympiadsStore";
import { StrapiImage } from "../StrapiImage";

export function OlympiadCard({ data }: { readonly data: Olympiad }) {
  const { heading, subHeading, dateEnd, dateStart, place, image, documentId } =
    data;
  return (
    <div className="group relative overflow-hidden rounded-sm bg-white shadow-one duration-300 hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark">
      <Link
        href={`/olympiads/${documentId}`}
        className="relative block aspect-[37/22] w-full"
      >
        <span className="absolute right-6 top-6 z-20 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold capitalize text-white">
          прошло
        </span>
        <StrapiImage
          src={image.url}
          alt={image.alternativeText || ""}
          width={200}
          height={140}
          className={` object-cover w-full h-full`}
          style={{
            aspectRatio: "200/100",
            objectFit: "cover",
          }}
        />
      </Link>
      <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8">
        <h3 className=" min-h-20">
          <Link
            href={`/olympiads/${documentId}`}
            className="mb-4 block text-xl font-bold text-black hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl"
          >
            {heading}
          </Link>
        </h3>

        <div className="flex items-center min-h-24 justify-between">
          <div className="mr-5 flex items-center border-r border-body-color border-opacity-10 pr-5 dark:border-white dark:border-opacity-10 xl:mr-3 xl:pr-3 2xl:mr-5 2xl:pr-5">
            <div className="w-full">
              <h4 className="mb-1 text-sm font-medium text-dark dark:text-white">
                place
              </h4>
              {place}
            </div>
          </div>
          <div className="inline-block">
            <h4 className="mb-1 text-sm font-medium text-dark dark:text-white">
              Date start
            </h4>
            <p className="text-xs text-body-color">{dateStart}</p>
          </div>
          <div className="inline-block">
            <h4 className="mb-1 text-sm font-medium text-dark dark:text-white">
              Date end
            </h4>
            <p className="text-xs text-body-color">{dateEnd}</p>
          </div>
        </div>

        <Button>
          <Link className="text-white" href={`/olympiads/${documentId}`}>
            Подробнее
          </Link>
        </Button>
      </div>
    </div>
  );
}
