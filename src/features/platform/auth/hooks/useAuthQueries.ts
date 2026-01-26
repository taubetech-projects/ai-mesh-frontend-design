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
export function useMeQuery(opts?: { enabled?: boolean; userId?: string | null }) {
  return useQuery({
    queryKey: qk.me(opts?.userId),
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
      /**
       * React Query has a feature called Partial Matching. When you invalidate ["auth", "me"], it doesn't just look for an exact match; it looks for any key that starts with those two words.
       * It will find and clear:
       * ["auth", "me", "user123"]
       * ["auth", "me", "user456"]
       * ["auth", "me", null]
       */
      await qc.invalidateQueries({ queryKey: ["auth", "me"] });
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
      qc.removeQueries({ queryKey: ["auth", "me"] });
      await qc.invalidateQueries({ queryKey: ["auth", "me"] });
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
      await qc.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: (error : any) => {
      // If refresh fails, consider user logged out
      qc.removeQueries({ queryKey: ["auth", "me"] });
      handleApiErrorToast(error);
    },
  });
}
