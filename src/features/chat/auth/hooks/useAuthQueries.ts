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
export function useMeQuery(opts?: { enabled?: boolean }) {
  return useQuery({
    queryKey: qk.me(),
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
      // Ensure cookies are set -> then refresh /me
      await qc.invalidateQueries({ queryKey: qk.me() });
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
      qc.setQueryData(qk.me(), null);
      await qc.invalidateQueries({ queryKey: qk.me() });
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
      await qc.invalidateQueries({ queryKey: qk.me() });
    },
    onError: () => {
      // If refresh fails, consider user logged out
      qc.setQueryData(qk.me(), null);
    },
  });
}
