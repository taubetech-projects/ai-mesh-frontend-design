import { api, platformProxyApi } from "@/lib/api/axiosApi";
import {
  CreateProjectRequest,
  ProjectResponse,
  ProjectUpdateRequest,
} from "../types/projectTypes";

const basePath = "/v1/api/platform";

export const PlatformProjectService = {
  create: async (
    teamId: string,
    data: CreateProjectRequest
  ): Promise<ProjectResponse> => {
    const res = await platformProxyApi.post<ProjectResponse>(
      `${basePath}/teams/${teamId}/projects`,
      data
    );
    return res.data;
  },

  update: async (
    teamId: string,
    projectId: string,
    data: ProjectUpdateRequest
  ): Promise<ProjectResponse> => {
    const res = await platformProxyApi.patch<ProjectResponse>(
      `${basePath}/teams/${teamId}/projects/${projectId}`,
      data
    );
    return res.data;
  },

  delete: async (teamId: string, projectId: string): Promise<void> => {
    await platformProxyApi.delete(
      `${basePath}/teams/${teamId}/projects/${projectId}`
    );
  },

  getAll: async (teamId: string): Promise<ProjectResponse[]> => {
    const res = await platformProxyApi.get<ProjectResponse[]>(
      `${basePath}/teams/${teamId}/projects`
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
