import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { WalletService } from "../api/walletService";
import { walletKeys } from "./queryKeys";
import { toast } from "sonner";
import { DepositRequest } from "../types/walletTypes";

/* =======================
   Queries
======================= */
// GET /v1/api/platform/wallet/me
export const useWalletQuery = () => {
  return useQuery({
    queryKey: walletKeys.me(),
    queryFn: WalletService.getMyWallet,
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
export const useCreateWalletMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: DepositRequest) => WalletService.create(body),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: walletKeys.me(),
      });
      toast("Your new wallet has been created successfully.");
    },
    onError: () => {
      toast("Failed to create wallet. Please try again.");
    },
  });
};
