const isLocalhost =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : isLocalhost
    ? "http://localhost:5000/api"
    : "/api";

async function request(path, options = {}) {
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("insightdesk_token")
      : "";

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

export async function authRequest(endpoint, payload) {
  return request(`/auth/${endpoint}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getLeads() {
  return request("/crm/leads");
}

export async function createLead(payload) {
  return request("/crm/leads", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getDeals() {
  return request("/crm/deals");
}

export async function createDeal(payload) {
  return request("/crm/deals", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
