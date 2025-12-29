import { proxyApi } from "@/lib/api/axiosApi";
import { ModelResponse } from "../types/modelTypes";

export const modelsService = {
  getAllModels: async (): Promise<ModelResponse[]> => {
    const res = await proxyApi.get<ModelResponse[]>("v1/api/chat/models");
    return res.data;
  },
};
