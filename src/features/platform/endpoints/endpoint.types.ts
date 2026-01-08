export type EndpointType =
  | "CHAT"
  | "EMBED"
  | "IMAGE"
  | "MODELS"
  | "SAMPLE"
  | "TOKENIZE";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface EndpointView {
  id: string; // UUID
  code: EndpointType;
  path: string;
  description?: string;
  httpMethod: HttpMethod;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface EndpointCreateRequest {
  code: EndpointType;
  path: string;
  description?: string;
  httpMethod?: HttpMethod;
}

export interface EndpointUpdateRequest
  extends Partial<EndpointCreateRequest> {}
