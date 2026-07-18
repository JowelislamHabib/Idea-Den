import { headers } from "next/headers";
import { auth } from "./auth";

export const getTokenServer = async () => {
  try {
    const response = await auth.api.getToken({
      headers: await headers(),
    });
    return response?.token || null;
  } catch {
    return null;
  }
};
