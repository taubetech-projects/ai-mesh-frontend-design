export const invoiceKeys = {
  all: ["invoices"] as const,
  preview: () => [...invoiceKeys.all, "preview"] as const,
  lists: () => [...invoiceKeys.all, "list"] as const,
  details: () => [...invoiceKeys.all, "detail"] as const,
  detail: (keyId: string) => [...invoiceKeys.details(), keyId] as const,
};
