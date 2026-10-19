const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function requestJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const fallbackMessage = `请求失败：${response.status}`;
    const payload = await response.json().catch(() => null);
    const message =
      payload && typeof payload.message === "string"
        ? payload.message
        : fallbackMessage;

    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}
