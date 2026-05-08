import axios from "axios";
import { storage } from "@/lib/storage";
import { ENDPOINTS } from "@/utils/endpoints";

export const api = axios.create({
  baseURL: ENDPOINTS.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = storage.getItem("idToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("[auth] API request", config.method?.toUpperCase(), config.url);
  return config;
});
