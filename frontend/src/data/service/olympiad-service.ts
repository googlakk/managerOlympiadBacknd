import { getAuthToken } from "./getToken";
import { getStrapiURL } from "@/lib/utils";
interface createOlympiadProps {
  heading: string;
  subHeading: string;
  place: string;
  dateStart: string;
  dateEnd: string;
  image: File;
}
const baseUrl = getStrapiURL();
export async function createOlympiadService(dataOlympiad: createOlympiadProps) {
  const url = new URL("/api/olympiads", baseUrl);
  const authToken = await getAuthToken();
  console.log("data from service:", dataOlympiad);
  if (!authToken) return { ok: false, data: null, error: null };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ data: dataOlympiad }),
      cache: "no-cache",
    });

    const data = await response.json();
    if (data.error) return { ok: false, data: null, error: data.error };

    return { ok: true, data: data, error: null };
  } catch (error) {
    console.error("Registration Service Error:", error);
  }
}
