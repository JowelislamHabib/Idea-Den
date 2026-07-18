export async function getToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/auth/get-token");
    const data = await res.json();
    return data.token || null;
  } catch {
    return null;
  }
}
