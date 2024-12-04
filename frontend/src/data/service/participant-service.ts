import { Participants } from "@/store/useOlympiadsStore";
import { addParticipantsAction } from "@/data/actions/participant-actions";
import { getAuthToken } from "./getToken";
import { getStrapiURL } from "@/lib/utils";
interface addParticipantsProps {
  firstName: string;
  lastName: string;
  age?: string;
  avatar?: File | undefined;
  organization?: string | undefined;
}
const baseUrl = getStrapiURL();
export async function addParticipantsService(
  dataParticipants: addParticipantsProps
) {
  const url = new URL("/api/participants", baseUrl);
  const authToken = await getAuthToken();

  if (!authToken) return { ok: false, data: null, error: null };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ data: dataParticipants }),
      cache: "no-cache",
    });

    const data = await response.json();
    if (data.error) return { ok: false, data: null, error: data.error };

    return { ok: true, data: data, error: null };
  } catch (error) {
    console.error("Registration Service Error:", error);
  }
}
