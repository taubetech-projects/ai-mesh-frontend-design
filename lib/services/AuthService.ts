// src/services/authService.ts
import { api, authenticatedApi } from "@/lib/axiosApi";
import { SignupRequest, TokenResponse, RefreshRequest, LogoutRequest, LoginRequest, ErrorResponse } from "@/types/authModels";
import { clear } from "console";
import { da } from "date-fns/locale";
import { clearTokens } from "../auth";
import axios from "axios";

export const AuthService = {

    login: async (data: LoginRequest): Promise<TokenResponse> => {
        const res = await api.post<TokenResponse>("/v1/api/auth/login", data);
        return res.data;
    },
    signup: async (data: SignupRequest): Promise<string> => {
        const res = await api.post<string>("/v1/api/auth/signup", data);
        console.log("Signup response:", res.data);
        return res.data;
    },

    refreshToken: async (data: RefreshRequest): Promise<TokenResponse> => {
        const res = await api.post<TokenResponse>("/v1/api/auth/refresh", data);
        return res.data;
    },

    logout: async (data: LogoutRequest): Promise<string> => {
        if (!data.refreshToken) return "";
        // Call the authenticated endpoint to invalidate the token on the server
        const response = await authenticatedApi.post("/v1/api/auth/logout", data);
        console.log("Logout response:", response.status);
        // Clear tokens after successful logout
        return response.status.toString();
    },
};
