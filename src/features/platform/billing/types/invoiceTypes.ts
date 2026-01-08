export type InvoiceView = {
  id: string;
  billedUserId: string;
  periodStart: Date;
  periodEnd: Date;
  totalAmountCents: number;
  status: string;
};

export type InvoicePreview = {
  billedUserId: string; // UUID
  periodStart: Date;
  periodEnd: Date;
  totalAmountCents: number;
  lines: TokenUsageSummary[];
};

export type TokenUsageSummary = {
  id: string;
  projectId: string;
  apiKeyId: string;
  providerName: string;
  modelName: string;
  endpointCode: string;
  tokens: number;
  amountNanoUsd: number;
  model?: string;
  requests?: number;
  cost?: number;
};

export type InvoiceWithLinesView = {
  invoice: InvoiceView;
  lines: TokenUsageSummary[];
};

export type CreateInvoiceRequest = {
  periodStart: Date;
  periodEnd: Date;
};
