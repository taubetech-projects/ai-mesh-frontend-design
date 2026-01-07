import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { modelCatalogService } from "../api/modelService";
import { modelCatalogKeys } from "./queryKeys";
import {
  ModelCreateRequest,
  ModelUpdateRequest,
} from "../types/modelTypes";

export function useModels() {
  return useQuery({
    queryKey: modelCatalogKeys.list(),
    queryFn: modelCatalogService.list,
  });
}

export function useModel(id: string, enabled = true) {
  return useQuery({
    queryKey: modelCatalogKeys.detail(id),
    queryFn: () => modelCatalogService.get(id),
    enabled: !!id && enabled,
  });
}

export function useCreateModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ModelCreateRequest) =>
      modelCatalogService.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: modelCatalogKeys.all,
      });
    },
  });
}


export function useUpdateModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ModelUpdateRequest;
    }) => modelCatalogService.update(id, data),

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: modelCatalogKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: modelCatalogKeys.list(),
      });
    },
  });
}

export function useDeleteModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      modelCatalogService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: modelCatalogKeys.all,
      });
    },
  });
}




