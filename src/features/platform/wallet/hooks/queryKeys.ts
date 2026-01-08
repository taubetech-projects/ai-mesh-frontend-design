export const walletKeys = {
  all: ["wallet"] as const,
  me: () => [...walletKeys.all, "me"] as const,
  deposit: () => [...walletKeys.all, "deposit"] as const,
  details: () => [...walletKeys.all, "detail"] as const,
  detail: (keyId: string) => [...walletKeys.details(), keyId] as const,
  transactions: () => [...walletKeys.all, "transactions"] as const,
  transaction: (keyId: string) =>
    [...walletKeys.transactions(), keyId] as const,
};
