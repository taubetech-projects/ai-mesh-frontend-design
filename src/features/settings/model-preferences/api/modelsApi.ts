import { authenticatedApi } from "@/lib/api/axiosApi";
import { ModelResponse } from "../types/modelTypes";

export const modelsService = {
  getAllModels: async (): Promise<ModelResponse[]> => {
    const res = await authenticatedApi.get<ModelResponse[]>(
      "/v1/api/chat/models"
    );
    return res.data;
  },

};