import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchModelSettings, updateModelSettings } from './modelPreferencesApi';

export const useModelPreferences = () => {
  return useQuery({
    queryKey: ['model-preferences'],
    queryFn: fetchModelSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateModelPreferences = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateModelSettings,
    onSuccess: () => {
      // Invalidate query to refetch fresh data if needed, or update optimistically
      queryClient.invalidateQueries({ queryKey: ['model-preferences'] });
      alert("Preferences updated successfully!");
    },
  });
};