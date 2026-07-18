const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers);

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const data =
    res.status === 204
      ? null
      : await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      data?.detail ??
      data?.message ??
      "Request gagal"
    );
  }

  return data;
}