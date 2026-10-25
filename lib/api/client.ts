const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export async function apiGet<TResponse>(
  path: string,
  token?: string,
): Promise<TResponse> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  const data = await res.json()

  if (!res.ok) {
    throw data
  }

  return data as TResponse
}

export async function apiPost<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  token?: string,
): Promise<TResponse> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()

  if (!res.ok) {
    // Throw the parsed error so TanStack Query catches it
    throw data
  }

  return data as TResponse
}
