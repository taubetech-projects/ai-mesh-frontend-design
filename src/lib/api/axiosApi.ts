import axios from "axios";

export const api = axios.create({
  baseURL: "", // same origin
  withCredentials: true,
});

export const proxyApi = axios.create({
  baseURL: "/api/proxy",
  withCredentials: true,
});
