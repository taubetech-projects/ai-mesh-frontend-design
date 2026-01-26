import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InvoiceAndBillingService } from "../api/invoiceAndBillingService";
import { invoiceKeys } from "./queryKeys";
import { toast } from "sonner";
import { CreateInvoiceRequest } from "../types/invoiceTypes";
import { handleApiErrorToast, showSuccessToast } from "@/shared/utils/toast.helper";

/* =======================
   Queries
======================= */
// GET /v1/api/platform/billing/invoices/preview
export const useInvoicePreviewQuery = () => {
  return useQuery({
    queryKey: invoiceKeys.preview(),
    queryFn: InvoiceAndBillingService.getCurrentMonthInvoicePreview,
  });
};

// GET /v1/api/platform/billing/invoices
export const useInvoicesQuery = () => {
  return useQuery({
    queryKey: invoiceKeys.lists(),
    queryFn: InvoiceAndBillingService.list,
  });
};

// GET /v1/api/platform/billing/invoices/{invoiceId}
export const useInvoiceByIdQuery = (invoiceId: string) => {
  return useQuery({
    queryKey: invoiceKeys.detail(invoiceId),
    queryFn: () => InvoiceAndBillingService.get(invoiceId),
    enabled: !!invoiceId,
  });
};

/* =======================
   Mutations
======================= */

// POST /v1/api/platform/billing/invoices
export const useCreateInvoiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateInvoiceRequest) =>
      InvoiceAndBillingService.create(body),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: invoiceKeys.lists(),
      });
      showSuccessToast("Your new invoice has been created successfully.");
    },
    onError: handleApiErrorToast
  });
};
