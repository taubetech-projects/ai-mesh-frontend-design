import { api, platformProxyApi } from "@/lib/api/axiosApi";
import {
  CreateProjectRequest,
  ProjectResponse,
  ProjectUpdateRequest,
} from "../types/projectTypes";

const basePath = "/v1/api/platform/projects";

export const PlatformProjectService = {
  create: async (data: CreateProjectRequest): Promise<ProjectResponse> => {
    const res = await platformProxyApi.post<ProjectResponse>(
      `${basePath}`,
      data
    );
    return res.data;
  },

  update: async (
    projectId: string,
    data: ProjectUpdateRequest
  ): Promise<ProjectResponse> => {
    const res = await platformProxyApi.put<ProjectResponse>(
      `${basePath}/${projectId}`,
      data
    );
    return res.data;
  },

  delete: async (projectId: string): Promise<void> => {
    await platformProxyApi.delete(`${basePath}/${projectId}`);
  },

  owned: async (): Promise<ProjectResponse[]> => {
    const res = await platformProxyApi.get<ProjectResponse[]>(
      `${basePath}/owned`
    );
    return res.data;
  },

  memberOf: async (): Promise<ProjectResponse[]> => {
    const res = await platformProxyApi.get<ProjectResponse[]>(
      `${basePath}/member-of`
    );
    return res.data;
  },
};
