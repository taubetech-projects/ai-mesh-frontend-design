// lib/api/modelApi.ts

import { Model, ModelRequestDto } from "./model.types";
import { chatProxyApi } from "@/lib/api/axiosApi";

const BASE_URL = "/v1/api/chat/models";


export const modelApi = {
  getAll: (): Promise<Model[]> =>
    chatProxyApi.get(BASE_URL),

  getById: (id: string): Promise<Model> =>
    chatProxyApi.get(`${BASE_URL}/${id}`),

  create: (data: ModelRequestDto): Promise<Model> =>
    chatProxyApi.post(BASE_URL, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Model>): Promise<Model> =>
    chatProxyApi.put(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string): Promise<void> =>
    chatProxyApi.delete(`${BASE_URL}/${id}`),
};
