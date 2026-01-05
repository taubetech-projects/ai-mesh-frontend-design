import { platformProxyApi } from "@/lib/api/axiosApi";
import {
  ModelView,
  ModelCreateRequest,
  ModelUpdateRequest,
} from "../types/modelTypes";

const BASE_PATH = "/v1/api/platform/catalog/models";

export const modelCatalogService = {
  list: async (): Promise<ModelView[]> => {
    const res = await platformProxyApi.get<ModelView[]>(BASE_PATH);
    return res.data;
  },

  get: async (id: string): Promise<ModelView> => {
    const res = await platformProxyApi.get<ModelView>(`${BASE_PATH}/${id}`);
    return res.data;
  },

  create: async (data: ModelCreateRequest): Promise<ModelView> => {
    const res = await platformProxyApi.post<ModelView>(BASE_PATH, data);
    return res.data;
  },

  update: async (
    id: string,
    data: ModelUpdateRequest
  ): Promise<ModelView> => {
    const res = await platformProxyApi.patch<ModelView>(`${BASE_PATH}/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await platformProxyApi.delete(`${BASE_PATH}/${id}`);
  },
};
