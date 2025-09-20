"use client";

interface AuthData {
  accessToken: string;
  email: string;
  name: string;
}

const AUTH_STORAGE_KEY = "auth_data";

export function setAuthData(data: AuthData) {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  }
}

export function getAuthData(): AuthData | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }
  return null;
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    const data = getAuthData();
    return data ? data.accessToken : null;
  }
  return null;
}

export function clearAuthData() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}