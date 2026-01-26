// types/pricing-plan.types.ts

export type PlanType = "PERSONAL" | "BUSINESS";

export interface PlanView {
  id: string; // UUID
  code: string;
  name: string;
  description?: string;

  features: string[];

  monthlyPriceCents: number;
  monthlyTokens: number;
  maxSharedInvites: number;

  roleName: string;
  planType: PlanType;

  isPopular: boolean;
  badgeText?: string;
  uiOrder: number;
  isActive: boolean;

  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface PlanCreateRequest {
  code: string;               // FREE, ESSENTIAL, PRO, SHARED, ENTERPRISE
  name: string;
  description?: string;

  features: string[];

  monthlyPriceCents: number;
  monthlyTokens: number;
  maxSharedInvites: number;

  roleName: string;
  planType: PlanType;

  isPopular: boolean;
  badgeText?: string;
  uiOrder: number;

  isActive: boolean;
}

export interface PlanUpdateRequest {
  code?: string;
  name?: string;
  description?: string;

  features?: string[];

  monthlyPriceCents?: number;
  monthlyTokens?: number;
  maxSharedInvites?: number;

  roleName?: string;
  planType?: PlanType;

  isPopular?: boolean;
  badgeText?: string;
  uiOrder?: number;

  isActive?: boolean;
}
