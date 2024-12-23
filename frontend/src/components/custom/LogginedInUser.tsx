import { useEffect, useState } from "react";

import { Button } from "../ui/button";
import Link from "next/link";
import { LogoutButton } from "./LogoutButtons";
import { getUserMeLoader } from "@/data/service/get-user-me-loader";

export default function LoggedInUser() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      const userResponse = await getUserMeLoader();
      setUser(userResponse);
    }
    fetchUser();
  }, []);

  return (
    <div className="flex items-center gap-4">
      {user?.ok ? (
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-5 justify-center rounded-full bg-primary px-7.5 py-2.5 text-regular text-white duration-300 ease-in-out hover:bg-primaryho"
          >
            {user.data.username}
            
          </Link>
          <LogoutButton />
        </div>
      ) : (
        <Link href={`/signin`}>
          <Button className="flex items-center justify-center rounded-full bg-primary px-7.5 py-2.5 text-regular text-white duration-300 ease-in-out hover:bg-primaryho">
            Войти
          </Button>
        </Link>
      )}
    </div>
  );
}
