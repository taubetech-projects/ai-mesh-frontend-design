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

export type UserMsg = { role: "user"; content: string };
export type Message = UserMsg | AssistantMsg;
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
