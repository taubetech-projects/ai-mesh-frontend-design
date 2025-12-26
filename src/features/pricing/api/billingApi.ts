import { proxyApi } from "@/lib/api/axiosApi";
import type {
  SubscriptionPlan,
  currentSubscriptionResponse,
} from "../types/subscriptionPlans";
import type {
  BillingRediretResponse,
  CreateBillingRequest,
} from "../types/billing";
import { BILLING_API_PATHS } from "@/shared/constants/constants";

export const BillingService = {
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    const res = await proxyApi.get<SubscriptionPlan[]>(BILLING_API_PATHS.PLANS);
    return res.data;
  },

  purchasePlan: async (
    payload: CreateBillingRequest
  ): Promise<BillingRediretResponse> => {
    const res = await proxyApi.post<BillingRediretResponse>(
      BILLING_API_PATHS.BILLING_START,
      payload
    );
    return res.data;
  },

  getCurrentSubscription: async (): Promise<currentSubscriptionResponse> => {
    const res = await proxyApi.get<currentSubscriptionResponse>(
      BILLING_API_PATHS.SUBSCRIPTION_CURRENT
    );
    return res.data;
  },
};

export default BillingService;
