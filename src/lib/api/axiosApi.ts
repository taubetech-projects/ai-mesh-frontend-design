import axios from "axios";
import { API_BASE } from "./http";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "@/features/auth/utils/auth";
import { AuthService } from "@/features/auth/api/authApi";
import {
  APPLICATION_JSON,
  AUTHORIZATION,
  BEARER,
  CONTENT_TYPE,
} from "@/shared/constants/constants";
import { APP_ROUTES } from "@/shared/constants/routingConstants";

const authenticatedApi = axios.create({
  baseURL: API_BASE, // Environment-specific base URL
  headers: {
    [CONTENT_TYPE]: APPLICATION_JSON,
  },
});

const api = axios.create({
  baseURL: API_BASE, // Environment-specific base URL
  headers: {
    [CONTENT_TYPE]: APPLICATION_JSON,
  },
});

// Attach Authorization token to requests if present
authenticatedApi.interceptors.request.use((config) => {
  const token = getAccessToken();
  console.log("Token:", token);
  if (token) {
    config.headers.Authorization = `${BEARER} ${token}`;
  }
  return config;
});

// Handle token refresh on 401 Unauthorized responses
authenticatedApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 and we haven't already retried
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark that we've retried this request

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        // No refresh token available, redirect to login
        clearTokens();
        window.location.href = APP_ROUTES.SIGNIN;
        return Promise.reject(error);
      }

      try {
        // Call the refresh token endpoint
        const { accessToken, refreshToken: newRefreshToken } =
          await AuthService.refreshToken({ refreshToken });

        // Store the new tokens
        setTokens(accessToken, newRefreshToken);

        // Update the Authorization header for the original request
        originalRequest.headers[AUTHORIZATION] = `${BEARER} ${accessToken}`;

        // Retry the original request
        return authenticatedApi(originalRequest);
      } catch (refreshError) {
        // Refresh token failed (e.g., it's also expired)
        clearTokens();
        window.location.href = APP_ROUTES.SIGNIN;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { authenticatedApi, api };
