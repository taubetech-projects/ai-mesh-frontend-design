import { platformProxyApi } from "@/lib/api/axiosApi";
import {
  DepositRequest,
  DeveloperWalletTransaction,
  WalletView,
} from "../types/walletTypes";

const basePath = "/v1/api/platform/wallet";

export const WalletService = {
  getMyWallet: async (): Promise<WalletView[]> => {
    const res = await platformProxyApi.get(`${basePath}/me`);
    return res.data;
  },

  list: async (): Promise<DeveloperWalletTransaction[]> => {
    const res = await platformProxyApi.get<DeveloperWalletTransaction[]>(
      `${basePath}/me/transactions`
    );
    return res.data;
  },

  create: async (data: DepositRequest): Promise<WalletView> => {
    const res = await platformProxyApi.post<WalletView>(
      `${basePath}/deposit`,
      data
    );
    return res.data;
  },
};
