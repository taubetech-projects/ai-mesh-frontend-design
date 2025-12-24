import { useQuery } from "@tanstack/react-query";
import BillingService from "../api/billingApi";

const subscriptionQueryKeys = {
    subscription: ["subscription"] as const,
};


export const useCurrentSubscription = () => {
  return useQuery({
    queryKey: subscriptionQueryKeys.subscription,
    queryFn: BillingService.getCurrentSubscription,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};