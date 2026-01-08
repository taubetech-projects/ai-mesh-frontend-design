export type WalletView = {
  balanceUsd: number;
  balanceNanoUsd: number;
  currency: string;
};

export type DeveloperWalletTransaction = {
  id: string;
  walletId: string;
  type: string;
  amountNanoUsd: number;
  balanceAfterNanoUsd: number;
  description: string;
  createdAt: string;
};

export type DepositRequest = {
  amountUsd: number;
  currency: string;
};
