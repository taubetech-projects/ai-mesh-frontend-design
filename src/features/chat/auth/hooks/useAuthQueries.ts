import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChatAuthService } from "../api/authApi";
import { qk } from "@/lib/react-query/keys";

import type {
  LoginRequest,
  SignupRequest,
  ResendEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshRequest,
} from "@/features/chat/auth/types/authModels";
import { handleApiErrorToast, showSuccessToast } from "@/shared/utils/toast.helper";

/* ---------------------------
 * Queries
 * -------------------------- */
export function useMeQuery(opts?: { enabled?: boolean; userId?: string | null }) {
  return useQuery({
    queryKey: qk.me(opts?.userId),
    queryFn: ChatAuthService.me,
    retry: false,
    staleTime: 30_000,
    enabled: opts?.enabled ?? true,
    select: (data) => {
        // console.log("useMeQuery data:", data);
        return data;
    }
  });
}

/* ---------------------------
 * Mutations
 * -------------------------- */
export function useLoginMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginRequest) => ChatAuthService.login(data),
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
  });
}

export function useLogoutMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => ChatAuthService.logout(),
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
    mutationFn: (data: SignupRequest) => ChatAuthService.signup(data),
  });
}

export function useResendEmailMutation() {
  return useMutation({
    mutationFn: (data: ResendEmailRequest) => ChatAuthService.resendEmail(data),
    onError: handleApiErrorToast,
    onSuccess: () => {
      showSuccessToast("Verification email sent successfully!");
    }
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      ChatAuthService.forgotPassword(data),
    onError: handleApiErrorToast
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) =>
      ChatAuthService.resetPassword(data),
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
    mutationFn: (data: RefreshRequest) => ChatAuthService.refreshToken(data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: () => {
      // If refresh fails, consider user logged out
      qc.removeQueries({ queryKey: ["auth", "me"] });
    },
  });
}

export function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: (token: string) => ChatAuthService.verifyEmail(token),
    onError: handleApiErrorToast,
    onSuccess: () => {
      showSuccessToast("Email verified successfully!");
    }
  });
}

