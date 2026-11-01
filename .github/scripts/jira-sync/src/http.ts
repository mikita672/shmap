const MAX_ATTEMPTS = 4;
const TIMEOUT_MS = 30_000;

export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type RequestOptions = {
  method: string;
  headers: Record<string, string>;
  body?: unknown;
};

export async function request<T>(
  url: string,
  { method, headers, body }: RequestOptions,
): Promise<{ data: T; headers: Headers }> {
  for (let attempt = 1; ; attempt++) {
    const response = await fetch(url, {
      method,
      headers:
        body === undefined
          ? headers
          : { ...headers, "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const retryable = response.status === 429 || response.status >= 500;
    if (retryable && attempt < MAX_ATTEMPTS) {
      const retryAfter = Number(response.headers.get("retry-after")) || 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, Math.min(retryAfter, 30) * 1000));
      continue;
    }

    const text = await response.text();
    if (!response.ok) {
      const path = new URL(url).pathname;
      throw new HttpError(response.status, `${method} ${path} → ${response.status} ${text}`);
    }
    return { data: (text ? JSON.parse(text) : undefined) as T, headers: response.headers };
  }
}
