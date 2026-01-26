// react-query/pricing-plan.keys.ts

export const pricingPlanKeys = {
  all: ["admin-pricing-plans"] as const,

  lists: () => [...pricingPlanKeys.all, "list"] as const,
  list: () => [...pricingPlanKeys.lists()] as const,

  details: () => [...pricingPlanKeys.all, "detail"] as const,
  detail: (id: string) => [...pricingPlanKeys.details(), id] as const,
};
