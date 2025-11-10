export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
}

// src/models/auth.ts

// TokenResponse.java
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string; // defaults to "Bearer" in backend
}

// SignupRequest.java
export interface SignupRequest {
  username: string;  // @Size(min=3,max=32)
  email: string;     // @Email
  password: string;  // @Size(min=8,max=100)
}

// RefreshRequest.java
export interface RefreshRequest {
  refreshToken: string;
}

// LogoutRequest.java
export interface LogoutRequest {
  refreshToken: string;
}
