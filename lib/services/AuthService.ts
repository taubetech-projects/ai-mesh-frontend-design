// src/services/authService.ts
import { api } from "@/lib/axiosApi";
import { SignupRequest, TokenResponse, RefreshRequest, LogoutRequest, LoginRequest } from "@/types/authModels";
import { da } from "date-fns/locale";

export const AuthService = {

    login: async (data: LoginRequest): Promise<TokenResponse> => {

        const res = await api.post<TokenResponse>("/v1/api/auth/login", data);
        return res.data;
    },
    signup: async (data: SignupRequest): Promise<string> => {
        const res = await api.post<string>("/v1/api/auth/signup", data);
        return res.data;
    },

    refreshToken: async (data: RefreshRequest): Promise<TokenResponse> => {
        const res = await api.post<TokenResponse>("/v1/api/auth/refresh", data);
        return res.data;
    },

    logout: async (data: LogoutRequest): Promise<string> => {
        const res = await api.post<string>("/v1/api/auth/logout", data);
        return res.data;
    },
};
