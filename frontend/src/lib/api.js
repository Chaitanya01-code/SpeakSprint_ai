const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8001";

export function authFetch(path, options = {}) {
  const authUser = JSON.parse(localStorage.getItem("authUser") || "null");
  const headers = new Headers(options.headers || {});
  if (authUser?.access_token) {
    headers.set("Authorization", `Bearer ${authUser.access_token}`);
  }
  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    cache: options.cache || "no-store",
  });
}

export { API_BASE_URL };
