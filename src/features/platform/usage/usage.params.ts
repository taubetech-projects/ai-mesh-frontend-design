export interface UsageQueryParams {
  projectId?: string;
  apiKeyId?: string;
  billedUserId?: string;
  from?: string; // ISO OffsetDateTime
  to?: string;   // ISO OffsetDateTime
  page?: number;
  size?: number;
  sortDir?: "ASC" | "DESC";
}
