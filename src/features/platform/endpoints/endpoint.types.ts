export type EndpointType =
  | "CHAT"
  | "EMBED"
  | "IMAGE"
  | "MODELS"
  | "SAMPLE"
  | "TOKENIZE";

export interface EndpointView {
  id: string; // UUID
  code: EndpointType;
  path: string;
  description?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface EndpointCreateRequest {
  code: EndpointType;
  path: string;
  description?: string;
}

export interface EndpointUpdateRequest
  extends Partial<EndpointCreateRequest> {}
