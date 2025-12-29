import { createAuthService } from "@/lib/auth/createAuthService";
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
} from "../types/authModels";

const chatAuth = createAuthService("/api/chat/auth");

export const ChatAuthService = {
  login: (data: LoginRequest) =>
    chatAuth.login<LoginRequest, TokenResponse>(data),

  me: () => chatAuth.me<Me>(),

  refreshToken: (data: RefreshRequest) =>
    chatAuth.refreshToken<RefreshRequest, TokenResponse>(data),

  logout: () => chatAuth.logout(),

  signup: (data: SignupRequest) =>
    chatAuth.signup<SignupRequest, SignupResponse>(data),

  resendEmail: (data: ResendEmailRequest) => chatAuth.resendEmail(data.email),

  forgotPassword: (data: ForgotPasswordRequest) =>
    chatAuth.forgotPassword<ForgotPasswordRequest>(data),

  resetPassword: (data: ResetPasswordRequest) =>
    chatAuth.resetPassword<ResetPasswordRequest>(data),
};
