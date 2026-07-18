import { getTokenServer } from "../getTokenServer";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

export const authHeader = async (): Promise<Record<string, string>> => {
  const token = await getTokenServer();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function serverMutation<T>(
  path: string,
  data: unknown,
  method = "POST",
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(await authHeader()),
  };
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function protectedFetch<T>(path: string): Promise<T> {
  const headers: Record<string, string> = { ...(await authHeader()) };
  const res = await fetch(`${baseUrl}${path}`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}
