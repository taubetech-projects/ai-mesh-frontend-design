// react-query/pricing-plan.queries.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminPricingPlanApi } from "./pricing-plan.api";
import { pricingPlanKeys } from "./pricing-plan.keys";
import {
  PlanCreateRequest,
  PlanUpdateRequest,
} from "./pricing-plan.types";

/* =======================
   Queries
======================= */

export const useAdminPricingPlans = () =>
  useQuery({
    queryKey: pricingPlanKeys.list(),
    queryFn: AdminPricingPlanApi.listPlans,
  });

export const useAdminPricingPlan = (id: string, enabled = true) =>
  useQuery({
    queryKey: pricingPlanKeys.detail(id),
    queryFn: () => AdminPricingPlanApi.getPlan(id),
    enabled: !!id && enabled,
  });

/* =======================
   Mutations
======================= */

export const useCreateAdminPricingPlan = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (req: PlanCreateRequest) =>
      AdminPricingPlanApi.createPlan(req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pricingPlanKeys.list() });
    },
  });
};

export const useUpdateAdminPricingPlan = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: PlanUpdateRequest;
    }) => AdminPricingPlanApi.updatePlan(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: pricingPlanKeys.list() });
      qc.invalidateQueries({
        queryKey: pricingPlanKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteAdminPricingPlan = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AdminPricingPlanApi.deletePlan(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pricingPlanKeys.list() });
    },
  });
};
