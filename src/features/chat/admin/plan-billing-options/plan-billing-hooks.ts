// react-query/plan-billing-option.queries.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlanBillingOptionApi } from "./plan-billing.api";
import { planBillingOptionKeys } from "./plan-billing.keys";
import {
  PlanBillingOptionCreateRequest,
  PlanBillingOptionUpdateRequest,
} from "./plan-billing.types";
import { handleApiErrorToast } from "@/shared/utils/toast.helper";

// -------- LIST --------
export const usePlanBillingOptions = () => {
  return useQuery({
    queryKey: planBillingOptionKeys.lists(),
    queryFn: PlanBillingOptionApi.list,
  });
};

// -------- GET BY ID --------
export const usePlanBillingOption = (id?: string) => {
  return useQuery({
    queryKey: id ? planBillingOptionKeys.detail(id) : [],
    queryFn: () => PlanBillingOptionApi.get(id!),
    enabled: !!id,
  });
};

// -------- CREATE --------
export const useCreatePlanBillingOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PlanBillingOptionCreateRequest) =>
      PlanBillingOptionApi.create(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: planBillingOptionKeys.lists(),
      });
    },
    onError: handleApiErrorToast
  });
};

// -------- UPDATE --------
export const useUpdatePlanBillingOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: PlanBillingOptionUpdateRequest;
    }) => PlanBillingOptionApi.update(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: planBillingOptionKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: planBillingOptionKeys.detail(variables.id),
      });
    },
    onError: handleApiErrorToast
  });
};

// -------- DELETE --------
export const useDeletePlanBillingOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => PlanBillingOptionApi.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: planBillingOptionKeys.lists(),
      });
    },
    onError: handleApiErrorToast
  });
};
