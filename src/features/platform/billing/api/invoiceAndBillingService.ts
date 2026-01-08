import { platformProxyApi } from "@/lib/api/axiosApi";
import {
  CreateInvoiceRequest,
  InvoicePreview,
  InvoiceView,
  InvoiceWithLinesView,
} from "../types/invoiceTypes";

const basePath = "/v1/api/platform/billing/invoices";

export const InvoiceAndBillingService = {
  getCurrentMonthInvoicePreview: async (): Promise<InvoicePreview[]> => {
    const now = new Date();
    // First day of current month
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    // Current date (today)
    const to = now;
    // Or if you want end of today (23:59:59.999)
    to.setHours(23, 59, 59, 999);

    const params = {
      from: from.toISOString(),
      to: to.toISOString(),
    };

    const res = await platformProxyApi.get(`${basePath}/preview`, { params });
    return res.data;
  },

  list: async (): Promise<InvoiceView[]> => {
    const res = await platformProxyApi.get<InvoiceView[]>(basePath);
    return res.data;
  },

  get: async (id: string): Promise<InvoiceWithLinesView> => {
    const res = await platformProxyApi.get<InvoiceWithLinesView>(
      `${basePath}/${id}`
    );
    return res.data;
  },

  create: async (data: CreateInvoiceRequest): Promise<InvoiceWithLinesView> => {
    const res = await platformProxyApi.post<InvoiceWithLinesView>(
      basePath,
      data
    );
    return res.data;
  },
};
