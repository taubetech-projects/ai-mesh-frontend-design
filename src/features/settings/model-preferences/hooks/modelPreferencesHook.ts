import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchModelSettings,
  modelPreferencesService,
  updateModelSettings,
} from "../api/modelPreferencesApi";

export const useModelPreferences = () => {
  return useQuery({
    queryKey: ["model-preferences"],
    queryFn: modelPreferencesService.getPreferences,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateModelPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateModelSettings,
    onSuccess: () => {
      // Invalidate query to refetch fresh data if needed, or update optimistically
      queryClient.invalidateQueries({ queryKey: ["model-preferences"] });
      alert("Preferences updated successfully!");
    },
  });
};
