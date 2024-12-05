"use server";

import { cookies } from "next/headers";

export async function getAuthToken() {
  const authToken = cookies().get("_vercel_jwt")?.value;
  return authToken;
}
