import axios from "axios";
import { API_BASE } from "./http";

const authenticatedApi = axios.create({
  baseURL: API_BASE, // Environment-specific base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization token to requests if present
authenticatedApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { authenticatedApi };
