// types/model-preferences.ts

export interface ModelOption {
  id: string;
  name: string;
}

export interface AIProvider {
  id: string;
  name: string;
  icon: string; // URL or icon component identifier
  isLocked: boolean;
  availableModels: ModelOption[];
}

export interface UserPreference {
  providerId: string;
  enabled: boolean;
  selectedModelId: string;
  order: number;
}

// Combined type for the UI
export interface ModelUIState extends AIProvider {
  enabled: boolean;
  selectedModelId: string;
}


export interface UserModelPreference {
  id: string;
  userId: string;
  modelId: string;
  modelName: string;
  modelDisplayName: string;
  provider: string;
  providerDisplayName: string,
  description: string;
  isPremium: boolean;
  position: number;
  isActive: boolean;
  createdAt: string; // ISO 8601 date-time string
  updatedAt: string; // ISO 8601 date-time string
}

export interface AddNewPreferenceRequest{
  modelId: string;
}

export interface ModelPreferenceResponse {
  id: string;                  // UUID
  userId: string;              // UUID
  modelId: string;             // UUID
  modelName: string;
  modelDisplayName: string;
  provider: string;
  providerDisplayName: string;
  description: string;
  isPremium: boolean;
  position: number;
  isActive: boolean;
  createdAt: string;           // ISO 8601 (OffsetDateTime)
  updatedAt: string;           // ISO 8601 (OffsetDateTime)
}

export interface UpdateModelPreferenceRequest{
  id: string;
  modelId: string | null;
  position: number | null;
  isActive: boolean | null;
}

