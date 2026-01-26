// types/plan-billing-option.types.ts

export enum PaymentGatewayProvider {
  STRIPE = "STRIPE",
  PAYPAL = "PAYPAL",
}

export enum BillingKind {
  ONE_TIME = "ONE_TIME",
  RECURRING = "RECURRING",
}

export enum BillingInterval {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  YEAR = "YEAR",
}

export interface PlanBillingOption {
  id: string;                 // UUID
  planId: string;            // UUID
  provider: PaymentGatewayProvider;
  kind: BillingKind;
  interval: BillingInterval | null; // null for ONE_TIME
  currency: string;          // e.g. "USD"
  amountCents: number;
  externalId: string;        // Stripe price_... or PayPal P-...
  isActive: boolean;
  createdAt: string;         // ISO datetime
  updatedAt: string;         // ISO datetime
}

/**
 * For create/update payloads
 * Usually backend ignores id, createdAt, updatedAt
 */
export type PlanBillingOptionCreateRequest = Omit<
  PlanBillingOption,
  "id" | "createdAt" | "updatedAt"
>;

export type PlanBillingOptionUpdateRequest =
  Partial<PlanBillingOptionCreateRequest>;
