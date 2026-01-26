// types/models.ts

export interface Model {
  id: string; // UUID as string
  name: string;
  displayName: string;
  provider: string;
  isPremium: boolean;
  providerDisplayName: string;
  enabled: boolean;
  description: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface ModelRequestDto {
  modelName: string;
  isPremium: boolean;
}
