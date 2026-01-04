import { platformProxyApi } from "@/lib/api/axiosApi";
import { ApiKeyCreateRequest, ApiKeyCreateResponse, ApiKeyView } from "../types/apiKeyTypes";

const basePath = "/v1/api/platform/projects";

export const PlatformProjectKeyService = {
  getAllKeys: async () : Promise<ApiKeyView[]> => {
    const res = await platformProxyApi.get(`${basePath}/keys`);
    return res.data;
  },

  getProjectKeys: async (projectId: string) => {
    const res = await platformProxyApi.get(`${basePath}/${projectId}/keys`);
    return res.data;
  },

  getKey: async (keyId: string) => {
    const res = await platformProxyApi.get(`${basePath}/keys/${keyId}`);
    return res.data;
  },

  createKey: async (projectId: string, body: ApiKeyCreateRequest) => {
    const res = await platformProxyApi.post(
      `${basePath}/${projectId}/keys`,
      body
    );
    return res.data;
  },

  updateKey: async ({ keyId, body }: { keyId: string; body: any }) => {
    const res = await platformProxyApi.patch(
      `${basePath}/keys/${keyId}`,
      body
    );
    return res.data;
  },

  deleteKey: async (keyId: string) => {
    await platformProxyApi.delete(`${basePath}/keys/${keyId}`);
  },
};
