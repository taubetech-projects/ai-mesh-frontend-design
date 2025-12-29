export interface SubscriptionPlan {
  id: string;
  code: "FREE" | "ENTERPRISE" | "ESSENTIAL" | "PRO" | "SHARED";
  name: string;
  description: string;
  features: string[]; // array of strings
  isPopular: boolean;
  badgeText: string | null;
  uiOrder: number;
  planType: "PERSONAL" | "BUSINESS";
  monthlyPriceCents: number;
  monthlyTokens: number;
  maxSharedInvites: number;
}

export interface currentSubscriptionResponse{
  id: string;
  planId: string;
  planCode: "FREE" | "ENTERPRISE" | "ESSENTIAL" | "PRO" | "SHARED";
  planName: string;
  status: "active" | "canceled" | "past_due" | "unpaid";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}
