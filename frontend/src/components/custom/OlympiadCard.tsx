import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

import { Olympiad } from "@/store/useOlympiadsStore";
import { StrapiImage } from "./StrapiImage";

export function OlympiadCard({ data }: { readonly data: Olympiad }) {
    const { heading, subHeading, dateEnd, dateStart, place, image } = data;
    return (
      <Card className="">
        <CardHeader>
          <CardTitle>{heading}</CardTitle>
          <CardDescription>{subHeading}</CardDescription>
        </CardHeader>
        <CardContent>
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
          <div className=" flex gap-x-10 ">
            <div>
              <label className="text-sm text-muted-foreground">Начало:</label>
              <p className="text-sm">{dateStart}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Начало:</label>
              <p className="text-sm">{dateEnd}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="">
            <label>Место проведения:</label>
            <p>{place}</p>
          </div>
        </CardFooter>
      </Card>
    );
  }