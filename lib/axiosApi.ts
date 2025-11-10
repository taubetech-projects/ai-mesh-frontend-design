import axios from "axios";
import { API_BASE } from "./http";
import { getApiKey } from "./auth";

const authenticatedApi = axios.create({
  baseURL: API_BASE, // Environment-specific base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization token to requests if present
authenticatedApi.interceptors.request.use((config) => {
  const token = getApiKey();
  console.log("Token:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { authenticatedApi };
