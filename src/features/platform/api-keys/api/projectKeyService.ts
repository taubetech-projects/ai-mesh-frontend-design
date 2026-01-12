import { platformProxyApi } from "@/lib/api/axiosApi";
import {
  ApiKeyCreateRequest,
  ApiKeyCreateResponse,
  ApiKeyUpdateRequest,
  ApiKeyView,
} from "../types/apiKeyTypes";

const basePath = "/v1/api/platform";

export const PlatformProjectKeyService = {
  getAllKeys: async (teamId: string): Promise<ApiKeyView[]> => {
    const res = await platformProxyApi.get(`${basePath}/teams/${teamId}/api-keys`);
    return res.data;
  },

  getProjectKeys: async (projectId: string) => {
    const res = await platformProxyApi.get(`${basePath}/projects/${projectId}/api-keys`);
    return res.data;
  },

  getKey: async (keyId: string) => {
    const res = await platformProxyApi.get(`${basePath}/api-keys/${keyId}`);
    return res.data;
  },

  createKey: async (projectId: string, body: ApiKeyCreateRequest) => {
    const res = await platformProxyApi.post(
      `${basePath}/${projectId}/api-keys`,
      body
    );
    return res.data;
  },

  updateKey: async ({
    keyId,
    body,
  }: {
    keyId: string;
    body: ApiKeyUpdateRequest;
  }) => {
    // console.log("Updating key:", keyId, "with body:", body);
    const res = await platformProxyApi.patch(`${basePath}/api-keys/${keyId}`, body);
    return res.data;
  },

  serachKeys: async (
    keyName: string | null,
    projectId: string | null,
    active: boolean | null,
    teamId?: string
  ) => {
    const params: Record<string, any> = {};
    if (keyName) params.keyName = keyName;
    if (projectId) params.projectId = projectId;
    if (active !== null) params.active = active;

    const res = await platformProxyApi.get(`${basePath}/teams/${teamId}/api-keys`, {
      params,
    });
    return res.data;
  },

  revokeKey: async ({ keyId }: { keyId: string }) => {
    await platformProxyApi.put(`${basePath}/api-keys/${keyId}`);
  },

  deleteKey: async (keyId: string) => {
    await platformProxyApi.delete(`${basePath}/api-keys/${keyId}`);
  },
};
