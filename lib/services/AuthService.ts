// src/services/authService.ts
import { api, authenticatedApi } from "@/lib/axiosApi";
import { SignupRequest, TokenResponse, RefreshRequest, LogoutRequest, LoginRequest, ErrorResponse, ResendEmailRequest, SignupResponse, ForgotPasswordRequest, ResetPasswordRequest } from "@/types/authModels";
import { clear } from "console";
import { da } from "date-fns/locale";
import { clearTokens } from "../auth";
import axios from "axios";
import VerifyEmail from "@/app/auth/signup/verify-email/page";

export const AuthService = {

    login: async (data: LoginRequest): Promise<TokenResponse> => {
        const res = await api.post<TokenResponse>("/v1/api/auth/login", data);
        return res.data;
    },
    signup: async (data: SignupRequest): Promise<SignupResponse> => {
        const res = await api.post<SignupResponse>("/v1/api/auth/signup", data);
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
        console.log("Logout data:", data);
        const response = await authenticatedApi.post("/v1/api/auth/logout", data);
        console.log("Logout response:", response.status);
        // Clear tokens after successful logout
        return response.status.toString();
    },

    resendEmail: async (data: ResendEmailRequest): Promise<string> => {
        const res = await api.post<string>(
            "/v1/api/auth/resend-email",
            null, // No request body
            { params: data } // Send data as query parameters
        );
        return res.data;
    },

    forgotPassword: async (data: ForgotPasswordRequest) =>  {
        const res = await api.post<void>("/v1/api/auth/forgot-password",data);
        return res.data;
    },

    resetPassword: async (data: ResetPasswordRequest) =>  {
        const res = await api.post<void>("/v1/api/auth/reset-password",data);
        return res.data;
    }
};
