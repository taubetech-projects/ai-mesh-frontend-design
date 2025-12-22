// hooks/usePurchasePlan.ts
import { useMutation } from "@tanstack/react-query";
import { BillingService } from "../api/billingApi";
import { CreateBillingRequest } from "../types/billing";
import { toast } from "sonner";

export const usePurchasePlan = () => {
  return useMutation({
    mutationFn: (payload: CreateBillingRequest) =>
      BillingService.purchasePlan(payload),

    onSuccess: (data) => {
      // Redirect to Stripe Checkout
      toast.success("Billing session created successfully!");
      window.location.href = data.redirectUrl;
    },

    onError: (error) => {
      toast.error("Failed to create billing session. Reason : " + error);
    //   console.error("Error creating billing session:", error);
    },
  });
};
