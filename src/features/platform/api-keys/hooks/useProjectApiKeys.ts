import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { PlatformProjectKeyService } from "../api/projectKeyService";
import { ApiKeyCreateRequest, ApiKeyView } from "../types/apiKeyTypes";
import { projectApiKeyKeys } from "./queryKeys";

/* =======================
   Queries
======================= */

// GET /v1/api/platform/projects/keys
export const useAllApiKeys = () => {
  return useQuery({
    queryKey: projectApiKeyKeys.listAllForUser(),
    queryFn: PlatformProjectKeyService.getAllKeys,
  });
};

// GET /v1/api/platform/projects/{projectId}/keys
export const useProjectApiKeys = (projectId: string) => {
  return useQuery({
    queryKey: projectApiKeyKeys.listByProject(projectId),
    queryFn: () => PlatformProjectKeyService.getProjectKeys(projectId),
    enabled: !!projectId,
  });
};

// GET /v1/api/platform/projects/{projectId}/keys/{keyId}
export const useApiKey = (keyId: string) => {
  return useQuery({
    queryKey: projectApiKeyKeys.detail(keyId),
    queryFn: () => PlatformProjectKeyService.getKey(keyId),
    enabled: !!keyId,
  });
};

/* =======================
   Mutations
======================= */

// POST /v1/api/platform/projects/{projectId}/keys
export const useCreateApiKey = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: ApiKeyCreateRequest) =>
      PlatformProjectKeyService.createKey(projectId, body),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectApiKeyKeys.listByProject(projectId),
      });

      queryClient.invalidateQueries({
        queryKey: projectApiKeyKeys.listAllForUser(),
      });
    },
  });
};

// PATCH /v1/api/platform/projects/keys/{keyId}
export const useUpdateApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: PlatformProjectKeyService.updateKey,

    onSuccess: (_, { keyId }) => {
      queryClient.invalidateQueries({
        queryKey: projectApiKeyKeys.detail(keyId),
      });

      queryClient.invalidateQueries({
        queryKey: projectApiKeyKeys.lists(),
      });
    },
  });
};

// DELETE /v1/api/platform/projects/keys/{keyId}
export const useDeleteApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: PlatformProjectKeyService.deleteKey,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectApiKeyKeys.lists(),
      });
    },
  });
};
