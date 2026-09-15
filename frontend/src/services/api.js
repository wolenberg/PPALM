const API_URL = "http://localhost:3001/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();

  if (!res.ok || data.success === false) {
    throw new Error(data.error || `Erro ${res.status}`);
  }

  return data;
}

export const listEnvironments = () => request("/environments/all");

export const createEnvironment = (payload) =>
  request("/environments", { method: "POST", body: JSON.stringify(payload) });

export const getAppRegistration = () => request("/config/app-registration");

export const saveAppRegistration = (payload) =>
  request("/config/app-registration", { method: "POST", body: JSON.stringify(payload) });

export const analyzeSolution = () => request("/solutions/analyze");

export const validateSolution = (payload) =>
  request("/validate", { method: "POST", body: JSON.stringify(payload || {}) });

export const exportSolution = (payload) =>
  request("/deployments/export", { method: "POST", body: JSON.stringify(payload) });

export const importSolution = (payload) =>
  request("/deployments/import", { method: "POST", body: JSON.stringify(payload) });
