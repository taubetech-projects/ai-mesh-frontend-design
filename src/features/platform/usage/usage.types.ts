export interface TokenUsageEvent {
  id: string;
  apiKeyId: string;
  projectId: string;
  billedUserId: string;
  requestId: string;
  mode: string;
  providerName: string;
  modelName: string;
  endpointCode: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  latencyMs?: number;
  costNanoUsd?: number;
  status: string;
  errorCode?: string;
  errorMessage?: string;
  createdAt: string; // OffsetDateTime → ISO string
}

export interface TokenUsagePageResponse<T> {
  data: T[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}
