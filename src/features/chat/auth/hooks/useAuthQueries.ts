import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "../api/authApi";
import { qk } from "@/lib/react-query/keys";

import type {
  LoginRequest,
  SignupRequest,
  ResendEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshRequest,
} from "@/features/chat/auth/types/authModels";

/* ---------------------------
 * Queries
 * -------------------------- */
export function useMeQuery(opts?: { enabled?: boolean }) {
  return useQuery({
    queryKey: qk.me(),
    queryFn: AuthService.me,
    retry: false,
    staleTime: 30_000,
    enabled: opts?.enabled ?? true,
  });
}

/* ---------------------------
 * Mutations
 * -------------------------- */
export function useLoginMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginRequest) => AuthService.login(data),
    onSuccess: async () => {
      // Ensure cookies are set -> then refresh /me
      await qc.invalidateQueries({ queryKey: qk.me() });
    },
  });
}

export function useLogoutMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: async () => {
      // Immediately drop auth state
      qc.setQueryData(qk.me(), null);
      await qc.invalidateQueries({ queryKey: qk.me() });
    },
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: (data: SignupRequest) => AuthService.signup(data),
  });
}

export function useResendEmailMutation() {
  return useMutation({
    mutationFn: (data: ResendEmailRequest) => AuthService.resendEmail(data),
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      AuthService.forgotPassword(data),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => AuthService.resetPassword(data),
  });
}

/**
 * Refresh token (cookie-based)
 * - Calls POST /api/auth/refresh (server reads refresh cookie, sets new access cookie)
 * - Then refetches /me so UI updates
 */
export function useRefreshTokenMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: RefreshRequest) => AuthService.refreshToken(data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: qk.me() });
    },
    onError: () => {
      // If refresh fails, consider user logged out
      qc.setQueryData(qk.me(), null);
    },
  });
}
