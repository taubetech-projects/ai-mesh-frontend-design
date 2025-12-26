import { api } from "@/lib/api/axiosApi";
import type {
  SignupRequest,
  SignupResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResendEmailRequest,
  Me,
  LoginRequest,
  RefreshRequest,
  TokenResponse,
} from "@/features/auth/types/authModels";

export const AuthService = {
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const res = await api.post<TokenResponse>("/api/auth/login", data);
    return res.data;
  },

  me: async (): Promise<Me> => {
    const res = await api.get<Me>("/api/auth/me");
    return res.data;
  },

  refreshToken: async (data: RefreshRequest): Promise<TokenResponse> => {
    const res = await api.post<TokenResponse>("/api/chat/auth/refresh", data);
    return res.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/api/auth/logout");
  },

  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const res = await api.post<SignupResponse>("/api/auth/signup", data);
    return res.data;
  },

  resendEmail: async (data: ResendEmailRequest): Promise<string> => {
    const res = await api.post<string>(
      `/api/auth/resend-email?email=${encodeURIComponent(data.email)}`
    );
    return res.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    await api.post("/api/auth/forgot-password", data);
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await api.post("/api/auth/reset-password", data);
  },
};
