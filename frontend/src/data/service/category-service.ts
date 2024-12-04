import { getAuthToken } from "./getToken";
import { getStrapiURL } from "@/lib/utils";
interface createCategoryProps {
  heading: string;
  description: string;

}
const baseUrl = getStrapiURL();
export async function createCategoryService(
  dataCategory: createCategoryProps
) {
  const url = new URL("/api/categories", baseUrl);
  const authToken = await getAuthToken();
  
  if (!authToken) return { ok: false, data: null, error: null };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ data: dataCategory}),
      cache: "no-cache",
    });

    const data = await response.json();
    if (data.error) return { ok: false, data: null, error: data.error };

    return { ok: true, data: data, error: null };
  } catch (error) {
    console.error("Registration Service Error:", error);
  }
}
