export interface ModelView {
  id: string; // UUID
  name: string;
  displayName: string;
  provider: string;
  providerDisplayName: string;
  active: boolean;
  inputPpmCents?: number;
  outputPpmCents?: number;
  inputPpmNanoUsd?: number;
  outputPpmNanoUsd?: number;
  tokensPerMinute?: number;
  requestsPerMinute?: number;
  contextWindowTokens?: number;
  inputModalities: string[];
  outputModalities: string[];
  capabilities: string[];
  description?: string;
}

export interface ModelCreateRequest {
  name: string;
  displayName: string;
  provider: string;
  providerDisplayName: string;
  active: boolean;
  inputPpmCents?: number;
  outputPpmCents?: number;
  tokensPerMinute?: number;
  requestsPerMinute?: number;
  contextWindowTokens?: number;
  inputModalities: string[];
  outputModalities: string[];
  capabilities: string[];
  description?: string;
}

export interface ModelUpdateRequest
  extends Partial<ModelCreateRequest> {}
