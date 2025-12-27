import { useQuery } from "@tanstack/react-query";
import { modelsService } from "../api/modelsApi";

export const useModels = () => {
  return useQuery({
    queryKey: ["models"],
    queryFn: modelsService.getAllModels,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};