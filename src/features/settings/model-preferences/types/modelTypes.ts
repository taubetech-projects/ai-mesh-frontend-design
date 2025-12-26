export interface ModelResponse {
  id: string;
  name: string;
  displayName: string;
  provider: string;
  providerDisplayName: string;
  description: string;
  isPremium: boolean;
  enabled: boolean;
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}
