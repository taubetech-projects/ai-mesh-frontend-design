export enum BillingProvider {
  STRIPE = "STRIPE",
  PAYPAL = "PAYPAL",
}

export enum BillingKind {
  SUBSCRIPTION = "SUBSCRIPTION",
  ONE_TIME = "ONE_TIME",
}

export enum BillingInterval {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export interface CreateBillingRequest {
  planId: string;
  provider: BillingProvider;
  kind: BillingKind;
  interval: BillingInterval;
}

export interface BillingRediretResponse {
  provider: "STRIPE" | "PAYPAL";
  kind: "SUBSCRIPTION" | "ONE_TIME";
  redirectUrl: string;
  stripeSessionId: string | null;
  paypalOrderId: string | null;
  paypalSubscriptionId: string | null;
}
