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

const platformAuth = createAuthService("/api/platform/auth");

export const PlatformAuthService = {
  login: (data: LoginRequest) =>
    platformAuth.login<LoginRequest, TokenResponse>(data),
  me: () => platformAuth.me<Me>(),
  refreshToken: (data: RefreshRequest) =>
    platformAuth.refreshToken<RefreshRequest, TokenResponse>(data),
  logout: () => platformAuth.logout(),

  signup: (data: SignupRequest) =>
    platformAuth.signup<SignupRequest, SignupResponse>(data),
  resendEmail: (data: ResendEmailRequest) =>
    platformAuth.resendEmail(data.email),

  forgotPassword: (data: ForgotPasswordRequest) =>
    platformAuth.forgotPassword<ForgotPasswordRequest>(data),
  resetPassword: (data: ResetPasswordRequest) =>
    platformAuth.resetPassword<ResetPasswordRequest>(data),
};
