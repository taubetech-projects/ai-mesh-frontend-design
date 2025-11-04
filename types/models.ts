export interface AIModel {
  id: string;
  name: string;
  icon: string;
}

export interface ModelProvider {
  id: string;
  name: string;
  models: AIModel[];
}

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  modelId: string;
  timestamp: Date;
}

export interface ChatTab {
  id: string;
  modelId: string;
  messages: ChatMessage[];
  isActive: boolean;
}

export type AssistantMsg = {
  role: "assistant";
  content: string;
  meta?: {
    provider: string;
    model: string;
    label?: string;
    latency_ms?: number;
  };
};

export interface Message {
  role: "user" | "assistant";
  content: ContentItem[] ;
}

export type ContentItem =
  | { type: "input_text"; text: string }
  | { type: "input_image"; image_url: string; image_analyzed_text: string }
  | { type: "input_file"; file_id: string; file_base64: string; file_analyzed_text: string };

export interface FileUploadItem {
  type: "application/pdf" | "image/png" | "image/jpeg" | string;
  filename: string;
  output: string;
}

export type UserMsg = { role: "user"; content: string };
// export type Message = UserMsg | AssistantMsg;
export type RouteSel = { provider: string; model: string };

export type ChatMsg = {
  role: any; //"user" | "assistant" | "system";
  content: string;
};

export type ChatStreamBody = {
  // NEW request contract
  mode?: any;
  messages: ChatMsg[];
  routes: RouteSel[] | null; // multi/consensus: array, single: null
  stream?: boolean; // new
  provider_response?: boolean; // new
};

export interface ChatAreaProps {
  activeModel: string;
}

export interface CopyButtonProps {
  code: string;
}

// Type representing your ConversationView record
export interface ConversationView {
  id: number;
  externalId: string | null;
  title: string | null;
  isArchived: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ConversationRequest {
  title: string;
}

export interface MessagePartRequest {
  type: string;
  text?: string;
  mimeType?: string;
  attachments?: AttachmentRequest[];
  attachmentIds?: number[];
  jsonData?: string;
}

export interface AttachmentRequest {
  storageType?: string; // "object" | "provider" | "external_url"
  provider?: string; // "openai" | "anthropic" | "vertex" | "none"
  providerFileId?: string;
  objectPath?: string; // e.g., "s3://bucket/key"
  externalUrl?: string;
  fileName?: string;
  mimeType?: string;
  bytes?: number;
  sha256?: string;
  status?: string; // "pending" | "available" | "failed" | "deleted"
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AttachmentView {
  id?: number;
  fileName?: string;
  mimeType?: string;
  bytes?: number;
  url?: string;
}

export interface PartView {
  type?: string;
  text?: string;
  mimeType?: string;
  seq?: number;
  attachments?: AttachmentView[];
  jsonData?: string;
}

export interface MessageView {
  id?: number;
  conversationId?: number;
  role?: string;
  authorId?: string;
  replyToMessageId?: number;
  provider: string;
  model: string;
  groupId?: string; // UUID represented as a string in TypeScript
  versionIndex?: number;
  groupTs?: Date;
  createdAt?: Date;
  parts?: PartView[];
}

export interface SaveMessageRequest {
  externalConversationId?: string;
  authorId: string;
  role: string;
  model?: string;
  parts: MessagePartRequest[];
}

// types/local.ts (or wherever you keep shared types)
export type MessagePage = {
  messages: MessageView[];
  nextCursor?: string | null;
};

export interface ChatRequestBody {
  mode: string | null;
  routes: RouteSel[] | null;
  messages: Message[];
  stream: boolean;
  provider_response: boolean;
}
