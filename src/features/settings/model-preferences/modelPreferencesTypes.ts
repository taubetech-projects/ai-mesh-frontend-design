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