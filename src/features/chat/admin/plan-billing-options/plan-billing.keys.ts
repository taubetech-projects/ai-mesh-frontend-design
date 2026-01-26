// react-query/plan-billing-option.keys.ts

export const planBillingOptionKeys = {
  all: ["planBillingOptions"] as const,

  lists: () => [...planBillingOptionKeys.all, "list"] as const,
  list: (filters?: Record<string, any>) =>
    [...planBillingOptionKeys.lists(), { filters }] as const,

  details: () => [...planBillingOptionKeys.all, "detail"] as const,
  detail: (id: string) =>
    [...planBillingOptionKeys.details(), id] as const,
};
