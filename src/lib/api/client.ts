const API_BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

interface FetchOptions extends RequestInit {
  token?: string | null;
}

export class ApiError extends Error {
  data: Record<string, unknown>;
  status: number;
  constructor(message: string, status: number, data: Record<string, unknown>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new ApiError(error.error || `HTTP ${res.status}`, res.status, error);
  }

  return res.json();
}
