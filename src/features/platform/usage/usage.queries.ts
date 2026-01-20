import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import { usageService } from "./usage.service";
import { usageKeys } from "./usage.queryKeys";
import { UsageQueryParams } from "./usage.params";
import { handleApiErrorToast } from "@/shared/utils/toast.helper";

export function useTokenUsage(params: UsageQueryParams) {
  return useQuery({
    queryKey: usageKeys.list(params),
    queryFn: () => usageService.getAll(params),
    placeholderData: keepPreviousData, // 👈 VERY IMPORTANT for pagination
  });
}

export function useExportUsagePdf() {
  return useMutation({
    mutationFn: (params: UsageQueryParams) =>
      usageService.exportPdf(params),

    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "usage-report.csv";
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    onError: handleApiErrorToast,
  });
}
