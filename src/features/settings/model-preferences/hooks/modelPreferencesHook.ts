import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  modelPreferencesService,
} from "../api/modelPreferencesApi";

export const useModelPreferences = () => {
  return useQuery({
    queryKey: ["model-preferences"],
    queryFn: modelPreferencesService.getPreferences,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddModelPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: modelPreferencesService.addPreference,
    onSuccess: () => {
      // Invalidate query to refetch fresh data if needed, or update optimistically
      queryClient.invalidateQueries({ queryKey: ["model-preferences"] });
    }
  });
};

export const useDeleteModelPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: modelPreferencesService.deletePreference,
    onSuccess: () => {
      // Invalidate query to refetch fresh data if needed, or update optimistically
      queryClient.invalidateQueries({ queryKey: ["model-preferences"] });
    }
  });
};

export const useUpdateModelPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: modelPreferencesService.updatePreference,
    onSuccess: () => {
      // Invalidate query to refetch fresh data if needed, or update optimistically
      queryClient.invalidateQueries({ queryKey: ["model-preferences"] });
    },
  });
};
