import Link from "next/link";
import { StrapiImage } from "./StrapiImage";

interface link {
  id: number;
  url: string;
  text: string;
}
interface logo {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
}
interface FooterProps {
  id: number;
  __component: string;
  link: link[];
  logo: logo;
  text: string;
}
export const Footer = ({ data }: { readonly data: FooterProps }) => {
  return (
    <footer className=" row-span-1 w-full flex justify-between items-center ">
      <StrapiImage
        src={data.logo.url}
        alt={data.logo.alternativeText || ""}
        height={60}
        width={60}
      />
      <div> &copy; {data.text}</div>
      <ul className="flex gap-x-10">
        {data?.link?.map((link, id) => (
          <li key={id}>
            <Link href={link.url}>{link.text}</Link>
          </li>
        )) || <p>Loading...</p>}
      </ul>
    </footer>
  );
};
