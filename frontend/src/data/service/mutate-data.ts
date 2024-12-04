// import { getAuthToken } from "./getToken";
// import { getStrapiURL } from "@/lib/utils";

// export async function mutateData(method: string, path: string, payload?: any) {
//   const baseUrl = getStrapiURL();
//   const authToken = await getAuthToken();
//   const url = new URL(path, baseUrl);

//   if (!authToken) throw new Error("No auth token found");

//   try {
//     const response = await fetch(url, {
//       method: method,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${authToken}`,
//       },
//       body: JSON.stringify({ data: { ...payload } }),
//     });
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.log("error", error);
//     throw error;
//   }
// }

import { getAuthToken } from "./getToken";
import { getStrapiURL } from "@/lib/utils";

export async function mutateData(method: string, path: string, payload?: any) {
  const baseUrl = getStrapiURL();
  const authToken = await getAuthToken();
  const url = new URL(path, baseUrl);

  if (!authToken) throw new Error("No auth token found");

  // Убираем body для методов GET и HEAD
  const options: RequestInit = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  };

  if (method !== "GET" && method !== "HEAD" && payload) {
    options.body = JSON.stringify({ data: { ...payload } });
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log("mutate:", data);
    return data;
  } catch (error) {
    console.log("Error in mutateData:", error);
    throw error;
  }
}
