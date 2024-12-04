import { getAuthToken } from "./getToken";
import { getStrapiURL } from "@/lib/utils";
interface createDisciplineProps {
  heading: string;
  subHeading: string;
  image: File;
}
const baseUrl = getStrapiURL();
export async function createDisciplineService(
  dataDiscipline: createDisciplineProps
) {
  const url = new URL("/api/subjects", baseUrl);
  const authToken = await getAuthToken();

  if (!authToken) return { ok: false, data: null, error: null };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ data: dataDiscipline }),
      cache: "no-cache",
    });

    const data = await response.json();
    if (data.error) return { ok: false, data: null, error: data.error };

    return { ok: true, data: data, error: null };
  } catch (error) {
    console.error("Registration Service Error:", error);
  }
}
