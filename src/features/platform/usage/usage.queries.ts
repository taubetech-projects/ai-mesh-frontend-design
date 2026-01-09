import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { usageService } from "./usage.service";
import { usageKeys } from "./usage.queryKeys";
import { UsageQueryParams } from "./usage.params";

export function useTokenUsage(params: UsageQueryParams) {
  return useQuery({
    queryKey: usageKeys.list(params),
    queryFn: () => usageService.getAll(params),
    placeholderData: keepPreviousData, // 👈 VERY IMPORTANT for pagination
  });
}
