import { Result, Task } from "@/lib/types";

import { getAuthToken } from "./getToken";
import { getStrapiURL } from "@/lib/utils";

interface ScoreData {
  participant: string;
  category: string;
  discipline: string;
  totalScore: number;
  result: Task[];
}
const baseUrl = getStrapiURL();
export async function addResultService(results: ScoreData) {
  const url = new URL("/api/scores", baseUrl);
  const authToken = await getAuthToken();

  console.log("data from service:", results);

  if (!authToken) return { ok: false, data: null, error: null };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ data: results }),
      cache: "no-cache",
    });
    const data = await response.json();
    console.log("response-", data);
    if (data.error) return { ok: false, data: null, error: data.error };

    return { ok: true, data: data, error: null };
  } catch (error) {
    console.error("Added Service Error:", error);
  }
}

export async function updateResultService(
  resultId: string,
  newResult: ScoreData
) {
  const url = new URL(`/api/scores/${resultId}`, baseUrl);
  const authToken = await getAuthToken();

  if (!authToken) return { ok: false, data: null, error: null };
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ data: newResult }),
      cache: "no-cache",
    });
    if (!response.ok) {
      const errorData = await response.json();
      return {
        ok: false,
        data: null,
        error: errorData.error || "Unknown error",
      };
    }
    if (response.ok) {
      console.log("Данные успешно обновлены");
    }
    const data = await response.json();
    if (data.error) return { ok: false, data: null, error: data.error };
    return { ok: true, data: data, error: null };
  } catch (error) {
    console.error("Updated Service Error:", error);
    return { ok: false, data: null, error };
  }
}
