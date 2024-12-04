import Link from "next/link";
import { StrapiImage } from "./StrapiImage";
import { getUserMeLoader } from "@/data/service/get-user-me-loader";

interface Image {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
}

interface Link {
  id: number;
  url: string;
  text: string;
}

interface HeroSectionProps {
  id: number;
  documentId: string;
  __component: string;
  heading: string;
  subHeading: string;
  background: Image;
  ctaButton: Link;
}
export const HeroSection = async ({
  data,
}: {
  readonly data: HeroSectionProps;
}) => {
  const { heading, subHeading, background, ctaButton } = data;
  const user = await getUserMeLoader();
  const linkUrl = user.ok ? "/dashboard" : ctaButton.url;
  return (
    <div className="relative h-[750px] w-full bg-black ">
      <StrapiImage
        src={background.url}
        alt={background.alternativeText || ""}
        height={1080}
        width={1920}
        className={`absolute inset-0 object-cover w-full h-full`}
        style={{
          aspectRatio: "1920/1080",
          objectFit: "cover",
        }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white bg-black bg-opacity-40">
        <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
          {heading}
        </h1>
        <p className="mt-4 text-lg md:text-xl lg:text-2xl">{subHeading}</p>
        <Link
          className="mt-8 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-black bg-white rounded-md shadow hover:bg-gray-100"
          href={linkUrl}
        >
          {user.ok ? "Dashboard" : ctaButton.text}
        </Link>
      </div>
    </div>
  );
};
