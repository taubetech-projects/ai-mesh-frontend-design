export type ApiKeyView = {
  id: string; // UUID
  projectName: string;
  name: string;
  createdBy: string;
  active: boolean;
  allowAllModels: boolean;
  allowAllEndpoints: boolean;
  models: string[];
  endpoints: EndpointType[];
  tpmLimit: number | null;
  rpmLimit: number | null;
  maskedKey: string;
};


export enum EndpointType {
  CHAT,
  EMBED,
  IMAGE,
  MODEL,
  SAMPLE,
  TOKENIZE,
}

export type ApiKeyCreateRequest = {
  name: string;
  allowAllModels?: boolean | null;
  allowAllEndpoints?: boolean | null;
  models?: string[] | null;     // UUID[]
  endpoints?: string[] | null;  // UUID[]
  tpmLimit?: number | null;
  rpmLimit?: number | null;
};

export type ApiKeyUpdateRequest = {
  name?: string | null;
  allowAllModels?: boolean | null;
  allowAllEndpoints?: boolean | null;
  models?: string[] | null;     // UUID[]
  endpoints?: string[] | null;  // UUID[]
  tpmLimit?: number | null;
  rpmLimit?: number | null;
  active?: Boolean | null;
};

export type ApiKeyCreateResponse = {
    apiKey: string,
    key: ApiKeyView
}

