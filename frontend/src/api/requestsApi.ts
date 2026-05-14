import type { Request, CreateRequestPayload, ApiError } from '../types/request';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export async function createRequest(payload: CreateRequestPayload): Promise<Request> {
  const res = await fetch(`${BASE_URL}/api/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error: ApiError = await res.json();
    throw error;
  }
  return res.json() as Promise<Request>;
}

export async function getRequests(): Promise<Request[]> {
  const res = await fetch(`${BASE_URL}/api/requests`, {
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) {
    const error: ApiError = await res.json();
    throw error;
  }
  return res.json() as Promise<Request[]>;
}
