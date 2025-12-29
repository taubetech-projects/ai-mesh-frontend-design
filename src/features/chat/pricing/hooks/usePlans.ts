// hooks/usePlans.ts
import { useQuery } from "@tanstack/react-query";
import { BillingService } from "../api/billingApi";

export const billingQueryKeys = {
  plans: ["billing", "plans"] as const,
};

export const usePlans = () => {
  return useQuery({
    queryKey: billingQueryKeys.plans,
    queryFn: BillingService.getPlans,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
