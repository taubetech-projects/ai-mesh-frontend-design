import { api, authenticatedApi } from "@/lib/api/axiosApi";
import { SubscriptionPlan } from "../types/subscriptionPlans";
import { BillingRediretResponse, CreateBillingRequest } from "../types/billing";

export const BillingService = {
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    const res = await authenticatedApi.get<SubscriptionPlan[]>("/v1/api/chat/plans");
    return res.data;
  },

  purchasePlan: async (
    payload: CreateBillingRequest
  ): Promise<BillingRediretResponse> => {
    const res = await authenticatedApi.post<BillingRediretResponse>(
      "/v1/api/chat/billing/start",
      payload
    );
    return res.data;
  },
};

export default BillingService;