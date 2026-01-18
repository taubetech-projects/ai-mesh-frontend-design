import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlatformProjectKeyService } from "../api/projectKeyService";
import { ApiKeyCreateRequest, ApiKeyView } from "../types/apiKeyTypes";
import { projectApiKeyKeys } from "./queryKeys";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { ErrorResponse } from "@/features/chat/auth/types/authModels";

/* =======================
   Queries
======================= */

// GET /v1/api/platform/projects/keys
export const useAllApiKeys = () => {
  const selectedTeam = useSelector((state: any) => state.team?.selectedTeam);

  return useQuery({
    queryKey: [...projectApiKeyKeys.listAllForUser(), selectedTeam?.id],
    queryFn: () => PlatformProjectKeyService.getAllKeys(selectedTeam?.id),
    enabled: !!selectedTeam?.id,
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

// GET /v1/api/platform/projects/keys/search?keyName={keyName}&projectId={projectId}&active={active}
export const useSearchApiKeys = (
  keyName: string | null,
  projectId: string | null,
  active: boolean | null
) => {
  const selectedTeam = useSelector((state: any) => state.team?.selectedTeam);

  return useQuery({
    queryKey: projectApiKeyKeys.search(
      keyName,
      projectId,
      active,
      selectedTeam?.id
    ),
    queryFn: () =>
      PlatformProjectKeyService.serachKeys(
        keyName,
        projectId,
        active,
        selectedTeam?.id
      ),
  });
};

/* =======================
   Mutations
======================= */

// POST /v1/api/platform/projects/{projectId}/keys
export const useCreateApiKey = (projectId: string) => {
  const queryClient = useQueryClient();
  const selectedTeam = useSelector((state: any) => state.team?.selectedTeam);

  return useMutation({
    mutationFn: (body: ApiKeyCreateRequest) =>
      PlatformProjectKeyService.createKey(projectId, body),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectApiKeyKeys.listByProject(projectId),
      });
      queryClient.invalidateQueries({
        queryKey: [...projectApiKeyKeys.listAllForUser(), selectedTeam?.id],
      });
      toast("Your new API key has been created successfully.");
    },
    onError: () => {
      toast("Failed to create API key");
    },
  });
};

// PATCH /v1/api/platform/projects/keys/{keyId}
export const useUpdateApiKey = () => {
  const queryClient = useQueryClient();
  const selectedTeam = useSelector((state: any) => state.team?.selectedTeam);

  return useMutation({
    mutationFn: PlatformProjectKeyService.updateKey,

    onSuccess: (_, { keyId }) => {
      queryClient.invalidateQueries({
        queryKey: projectApiKeyKeys.detail(keyId),
      });

      queryClient.invalidateQueries({
        queryKey: [...projectApiKeyKeys.listAllForUser(), selectedTeam?.id],
      });
      queryClient.invalidateQueries({
        queryKey: projectApiKeyKeys.lists(),
      });
    },
  });
};

export const useRevokeApiKey = () => {
  const queryClient = useQueryClient();
  const selectedTeam = useSelector((state: any) => state.team?.selectedTeam);

  return useMutation({
    mutationFn: PlatformProjectKeyService.revokeKey,

    onSuccess: (_, { keyId }) => {
      queryClient.invalidateQueries({
        queryKey: projectApiKeyKeys.detail(keyId),
      });

      queryClient.invalidateQueries({
        queryKey: [...projectApiKeyKeys.listAllForUser(), selectedTeam?.id],
      });
      queryClient.invalidateQueries({
        queryKey: projectApiKeyKeys.lists(),
      });
    },

    onError: (error: ErrorResponse) => {
      let message = "Failed to revoke API key.";
      if (error?.detail) message = error.detail;
      toast(message);
    },
  });
};

// DELETE /v1/api/platform/projects/keys/{keyId}
export const useDeleteApiKey = () => {
  const queryClient = useQueryClient();
  const selectedTeam = useSelector((state: any) => state.team?.selectedTeam);

  return useMutation({
    mutationFn: PlatformProjectKeyService.deleteKey,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...projectApiKeyKeys.listAllForUser(), selectedTeam?.id],
      });
      queryClient.invalidateQueries({
        queryKey: projectApiKeyKeys.lists(),
      });
      toast("The API key has been deleted.");
    },

    onError: (error : ErrorResponse) => {
      let message = "Failed to revoke API key.";
      if (error?.detail) message = error.detail;
      toast(message);
    },
  });
};
