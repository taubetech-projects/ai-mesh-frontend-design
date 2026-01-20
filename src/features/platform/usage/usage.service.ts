import {
  TokenUsageEvent,
  TokenUsagePageResponse,
} from "./usage.types";
import { UsageQueryParams } from "./usage.params";
import { platformProxyApi } from "@/lib/api/axiosApi";

const BASE_PATH = "/v1/api/platform/usage";

export const usageService = {
  getAll: async (
    params: UsageQueryParams
  ): Promise<TokenUsagePageResponse<TokenUsageEvent>> => {
    const res = await platformProxyApi.get<
      TokenUsagePageResponse<TokenUsageEvent>
    >(BASE_PATH, {
      params: {
        page: 0,
        size: 20,
        sortDir: "DESC",
        ...params,
      },
    });

    return res.data;
  },
  exportPdf: async (params: UsageQueryParams): Promise<Blob> => {
    const res = await platformProxyApi.get(
      `${BASE_PATH}/export/csv`,
      {
        params,
        responseType: "blob", // 👈 CRITICAL
      }
    );

    return res.data;
  },
};
