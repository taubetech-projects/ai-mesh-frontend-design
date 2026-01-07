import { platformProxyApi } from "@/lib/api/axiosApi";
import {
  EndpointView,
  EndpointCreateRequest,
  EndpointUpdateRequest,
} from "./endpoint.types";

const BASE_PATH = "/v1/api/platform/catalog/endpoints";

export const endpointCatalogService = {
  list: async (): Promise<EndpointView[]> => {
    const res = await platformProxyApi.get<EndpointView[]>(BASE_PATH);
    return res.data;
  },

  get: async (id: string): Promise<EndpointView> => {
    const res = await platformProxyApi.get<EndpointView>(`${BASE_PATH}/${id}`);
    return res.data;
  },

  create: async (
    data: EndpointCreateRequest
  ): Promise<EndpointView> => {
    const res = await platformProxyApi.post<EndpointView>(BASE_PATH, data);
    return res.data;
  },

  update: async (
    id: string,
    data: EndpointUpdateRequest
  ): Promise<EndpointView> => {
    const res = await platformProxyApi.patch<EndpointView>(
      `${BASE_PATH}/${id}`,
      data
    );
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await platformProxyApi.delete(`${BASE_PATH}/${id}`);
  },
};
