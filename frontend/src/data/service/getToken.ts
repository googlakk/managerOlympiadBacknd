"use server";

import { cookies } from "next/headers";

export async function getAuthToken() {
  const authToken = cookies().get("auth-jwt")?.value;
  return authToken;
}
