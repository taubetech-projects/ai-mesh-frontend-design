export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string; // defaults to "Bearer" in backend
  user: UserGrantsView;
}

export interface UserGrantsView {
  username: string;
  email: string;
  roles: string[];
  authorities: string[];
}

export interface SignupRequest {
  username: string;  // @Size(min=3,max=32)
  email: string;     // @Email
  password: string;  // @Size(min=8,max=100)
}

export interface SignupResponse {
  id: string;
  username: string;
  email: string;
  message: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface ResendEmailRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ErrorResponse {
  type: string;
  status: number;
  instance: string;
  title: string;
  detail: string;
  errors: string[];
  properties: Record<string, any>;
}
