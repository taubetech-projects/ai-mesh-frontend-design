// lib/react-query/modelQueries.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { modelApi } from "./model.api";
import { modelKeys } from "./model.query-keys";
import { Model, ModelRequestDto } from "./model.types";
import { handleApiErrorToast } from "@/shared/utils/toast.helper";

// GET ALL
export function useModels() {
  return useQuery({
    queryKey: modelKeys.list(),
    queryFn: modelApi.getAll,
  });
}

// GET BY ID
export function useModel(id: string) {
  return useQuery({
    queryKey: modelKeys.detail(id),
    queryFn: () => modelApi.getById(id),
    enabled: !!id,
  });
}

// CREATE
export function useCreateModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ModelRequestDto) => modelApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: modelKeys.lists() });
    },
    onError: handleApiErrorToast
  });
}

// UPDATE
export function useUpdateModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Model> }) =>
      modelApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: modelKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: modelKeys.detail(variables.id),
      });
    },
    onError: handleApiErrorToast
  });
}

// DELETE
export function useDeleteModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => modelApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: modelKeys.lists() });
    },
    onError: handleApiErrorToast
  });
}
