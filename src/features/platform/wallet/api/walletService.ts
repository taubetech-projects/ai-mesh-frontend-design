import { platformProxyApi } from "@/lib/api/axiosApi";
import {
  DepositRequest,
  DeveloperWalletTransaction,
  TopUpRequest,
  TopUpResponse,
  WalletView,
} from "../types/walletTypes";

const basePath = "/v1/api/platform";

export const WalletService = {
  getMyTeamWallet: async (teamId: string): Promise<WalletView> => {
    const res = await platformProxyApi.get(`${basePath}/teams/${teamId}/wallet/balance`);
    return res.data;
  },

  topUp: async (data: TopUpRequest, teamId: string): Promise<TopUpResponse> => {
    const res = await platformProxyApi.post<TopUpResponse>(
      `${basePath}/teams/${teamId}/wallet/topup`,
      data,
    );
    return res.data;
  },

  list: async (): Promise<DeveloperWalletTransaction[]> => {
    const res = await platformProxyApi.get<DeveloperWalletTransaction[]>(
      `${basePath}/me/transactions`,
    );
    return res.data;
  },

  create: async (data: DepositRequest): Promise<WalletView> => {
    const res = await platformProxyApi.post<WalletView>(
      `${basePath}/deposit`,
      data,
    );
    return res.data;
  },
};
