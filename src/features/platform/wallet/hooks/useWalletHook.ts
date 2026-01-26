import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { WalletService } from "../api/walletService";
import { walletKeys } from "./queryKeys";
import { toast } from "sonner";
import { DepositRequest, TopUpRequest, TopUpResponse } from "../types/walletTypes";
import {
  handleApiErrorToast,
  showSuccessToast,
} from "@/shared/utils/toast.helper";

/* =======================
   Queries
======================= */
// GET /v1/api/platform/wallet/me
export const useMyTeamWalletQuery = (teamId: string) => {
  return useQuery({
    queryKey: walletKeys.me(),
    queryFn: () => WalletService.getMyTeamWallet(teamId),
  });
};

// GET /v1/api/platform/wallet/me/transactions
export const useTransactionsQuery = () => {
  return useQuery({
    queryKey: walletKeys.transactions(),
    queryFn: WalletService.list,
  });
};

/* =======================
   Mutations
======================= */

// POST /v1/api/platform/wallet/deposit
export const useCreateTopUpMutation = (teamId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: TopUpRequest) => WalletService.topUp(body, teamId),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: walletKeys.me(),
      });
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: handleApiErrorToast,
  });
};
