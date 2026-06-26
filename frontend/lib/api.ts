const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface ShortenResponse {
  shortCode: string;
  shortUrl: string;
  longUrl: string;
}

export interface StatsResponse {
  shortCode: string;
  longUrl: string;
  clickCount: number;
  createdAt: string;
}

export async function shortenUrl(url: string): Promise<ShortenResponse> {
  const res = await fetch(`${API_URL}/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }

  return res.json();
}

export async function getStats(code: string): Promise<StatsResponse> {
  const res = await fetch(`${API_URL}/links/${code}/stats`);

  if (res.status === 404) {
    throw new Error("NOT_FOUND");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }

  return res.json();
}
