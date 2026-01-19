import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlatformAuthService } from "../api/paltformApi";
import { qk } from "@/lib/react-query/keys";

import type {
  LoginRequest,
  SignupRequest,
  ResendEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshRequest,
} from "@/features/platform/auth/types/authModels";
import { handleApiErrorToast, showSuccessToast } from "@/shared/utils/toast.helper";

/* ---------------------------
 * Queries
 * -------------------------- */
export function useMeQuery(opts?: { enabled?: boolean }) {
  return useQuery({
    queryKey: qk.me(),
    queryFn: PlatformAuthService.me,
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
    mutationFn: (data: LoginRequest) => PlatformAuthService.login(data),
    onSuccess: async () => {
      // Ensure cookies are set -> then refresh /me
      await qc.invalidateQueries({ queryKey: qk.me() });
      showSuccessToast("Login successful! Welcome to our platform...");
    },
    onError: handleApiErrorToast
  });
}

export function useLogoutMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => PlatformAuthService.logout(),
    onSuccess: async () => {
      // Immediately drop auth state
      qc.setQueryData(qk.me(), null);
      await qc.invalidateQueries({ queryKey: qk.me() });
      showSuccessToast("You have been logged out.");
    },
    onError: handleApiErrorToast
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: (data: SignupRequest) => PlatformAuthService.signup(data),
    onError: handleApiErrorToast,
    onSuccess: () => {
      showSuccessToast("Signup successful! Please check your email for verification.");
    }
  });
}

export function useResendEmailMutation() {
  return useMutation({
    mutationFn: (data: ResendEmailRequest) =>
      PlatformAuthService.resendEmail(data),
    onError: handleApiErrorToast
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      PlatformAuthService.forgotPassword(data),
    onError: handleApiErrorToast
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) =>
      PlatformAuthService.resetPassword(data),
    onError: handleApiErrorToast
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
    mutationFn: (data: RefreshRequest) =>
      PlatformAuthService.refreshToken(data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: qk.me() });
    },
    onError: (error : any) => {
      // If refresh fails, consider user logged out
      qc.setQueryData(qk.me(), null);
      handleApiErrorToast(error);
    },
  });
}
