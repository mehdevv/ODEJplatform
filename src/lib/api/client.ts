const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("odej_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Future real API fetch helper */
export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((err as { message?: string }).message ?? "Request failed");
  }
  return res.json() as Promise<T>;
}
