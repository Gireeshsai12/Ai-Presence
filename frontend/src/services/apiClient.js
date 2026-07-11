import { getSettings } from "./storage";
import { getAuthToken } from "./authService";

export function getApiBaseUrl() {
  const environmentUrl = process.env.REACT_APP_API_URL;

  if (environmentUrl) {
    return environmentUrl.replace(/\/$/, "");
  }

  const settings = getSettings();
  const raw = settings.backendUrl || "ws://127.0.0.1:8000/ws";

  if (raw.startsWith("ws://")) {
    return raw.replace("ws://", "http://").replace(/\/ws\/?$/, "");
  }

  if (raw.startsWith("wss://")) {
    return raw.replace("wss://", "https://").replace(/\/ws\/?$/, "");
  }

  return raw.replace(/\/ws\/?$/, "").replace(/\/$/, "");
}

export async function apiRequest(path, options = {}) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const token = getAuthToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  let payload = null;
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    payload = await response.json();
  } else {
    payload = await response.text();
  }

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload?.detail
        ? payload.detail
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload;
}

export async function apiHealthCheck() {
  return apiRequest("/api/health");
}
