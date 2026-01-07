import axios from "axios";

/**
 * Use this for calling your Next.js API routes directly:
 *  - /api/chat/...
 *  - /api/platform/...
 */
export const api = axios.create({
  baseURL: "", // same origin
  withCredentials: true,
});

/**
 * Use these for backend proxy calls via Next:
 *  - /api/proxy/chat/...
 *  - /api/proxy/platform/...
 */
export const chatProxyApi = axios.create({
  baseURL: "/api/proxy/chat",
  withCredentials: true,
});

export const platformProxyApi = axios.create({
  baseURL: "/api/proxy/platform",
  withCredentials: true,
});
