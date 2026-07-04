import { apiRequest } from "./apiClient";

const AUTH_KEYS = {
  token: "ai_presence_auth_token",
  user: "ai_presence_auth_user",
};

export function getAuthToken() {
  return localStorage.getItem(AUTH_KEYS.token);
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEYS.user);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAuthSession(token, user = null) {
  localStorage.setItem(AUTH_KEYS.token, token);
  if (user) localStorage.setItem(AUTH_KEYS.user, JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem(AUTH_KEYS.token);
  localStorage.removeItem(AUTH_KEYS.user);
  window.location.href = "/login";
}

export async function registerUser({ fullName, email, password }) {
  const tokenPayload = await apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      full_name: fullName,
      email,
      password,
    }),
  });

  saveAuthSession(tokenPayload.access_token);
  const user = await getCurrentUser();
  saveAuthSession(tokenPayload.access_token, user);
  return user;
}

export async function loginUser({ email, password }) {
  const tokenPayload = await apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  saveAuthSession(tokenPayload.access_token);
  const user = await getCurrentUser();
  saveAuthSession(tokenPayload.access_token, user);
  return user;
}

export async function getCurrentUser() {
  return apiRequest("/api/auth/me");
}
