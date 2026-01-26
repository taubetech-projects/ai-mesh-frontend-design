// lib/api/modelApi.ts

import { Model, ModelRequestDto } from "./model.types";
import { chatProxyApi } from "@/lib/api/axiosApi";

const BASE_URL = "/v1/api/chat/models";

export const modelApi = {
  getAll: async (): Promise<Model[]> => {
    const res = await chatProxyApi.get<Model[]>(BASE_URL);
    return res.data;
  },

  getById: async (id: string): Promise<Model> => {
    const res = await chatProxyApi.get<Model>(`${BASE_URL}/${id}`);
    return res.data;
  },

  create: async (data: ModelRequestDto): Promise<Model> => {
    const res = await chatProxyApi.post<Model>(BASE_URL, data);
    return res.data;
  },

  update: async (id: string, data: Partial<Model>): Promise<Model> => {
    const res = await chatProxyApi.put<Model>(`${BASE_URL}/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await chatProxyApi.delete(`${BASE_URL}/${id}`);
  },
};
