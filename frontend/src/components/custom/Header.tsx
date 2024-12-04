import { Button } from "../ui/button";
import Link from "next/link";
import { LogoutButton } from "./LogoutButtons";
import { StrapiImage } from "./StrapiImage";
import { getUserMeLoader } from "@/data/service/get-user-me-loader";
import { toast } from "sonner";

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
interface HeaderProps {
  id: number;
  __component: string;
  link: link[];
  logo: logo;
  ctaButton: link;
}
interface AuthUserProps {
  username: string;
  email: string;
}
export const Header = async ({ data }: { readonly data: HeaderProps }) => {
  const user = await getUserMeLoader();
  const { ctaButton } = data;

  return (
    <header className="row-span-1 w-full flex justify-between items-center bg-gray-100/40 ">
      <StrapiImage
        src={data.logo.url}
        alt={data.logo.alternativeText || ""}
        height={60}
        width={60}
      />
      <ul className="flex items-center gap-x-10">
        {data?.link?.map((link, id) => (
          <li key={id}>
            <Link href={link.url}>{link.text}</Link>
          </li>
        )) || <p>Loading...</p>}
        <div className="flex items-center gap-4">
          {user.ok ? (
            <LoggedInUser userData={user.data} />
          ) : (
            <Link href={ctaButton.url}>
              <Button>{ctaButton.text}</Button>
            </Link>
          )}
        </div>
      </ul>
    </header>
  );
};

function LoggedInUser({ userData }: { readonly userData: AuthUserProps }) {
  return (
    <div className="flex gap-2">
      <Link href="/dashboard" className="font-semibold hover:text-primary">
        {userData.username}
      </Link>
      <LogoutButton />
    </div>
  );
}
