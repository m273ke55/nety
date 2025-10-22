const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

async function request(path, method="GET", body=null, token=null) {
  const headers = {};
  token = localStorage.getItem('token');
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(`${path}`, {
    method,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "API error");
  return data;
}

const api = {
  get: (path, token) => request(path, "GET", null, token),
  post: (path, body, token) => request(path, "POST", body, token),
  put: (path, body, token) => request(path, "PUT", body, token),
  delete: (path, token) => request(path, "DELETE", null, token),
  upload: (path, formData, token) => request(path, "POST", formData, token) 
};

export default api;

