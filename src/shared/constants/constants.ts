export enum HTTP_METHODS {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
}

export enum CONVERSATION_TYPES {
  CHAT = "CHAT",
  IMAGE = "IMAGE",
}

export enum INTERFACE_TYPES {
  CHAT = "CHAT",
  IMAGE = "IMAGE",
}

export enum CHAT_MODES {
  SINGLE = "single",
  MULTI = "multi",
  CONSENSUS = "consensus",
}

export enum MESSAGE_PART_TYPES {
  TEXT = "text",
  IMAGE = "image",
  AUDIO = "audio",
  FILE = "file",
  VIDEO = "video",
  DOCUMENT = "document",
}

export enum MIME_TYPES {
  PDF = "application/pdf",
  PNG = "image/png",
  JPEG = "image/jpeg",
}

export enum CONTENT_INPUT_TYPES {
  INPUT_TEXT = "input_text",
  INPUT_IMAGE = "input_image",
  INPUT_FILE = "input_file",
}

export enum ROLES {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
  MODEL = "model",
  DEVELOPER = "developer",
}

export enum STORAGE_TYPES {
  EXTERNAL_URL = "external_url",
  BASE64 = "base64",
  CLOUD_STORAGE = "cloud_storage",
}

export enum PROVIDER_TYPES {
  OPENAI = "openai",
  ANTHROPIC = "anthropic",
}

export enum IMAGE_GENERATION_MODES {
  IMAGE = "IMAGE",
  TEXT_TO_IMAGE = "TEXT_TO_IMAGE",
}

export enum AUDIO_GENERATION_MODES {
  AUDIO = "AUDIO",
  TEXT_TO_SPEECH = "TEXT_TO_SPEECH",
}

export enum VIDEO_GENERATION_MODES {
  VIDEO = "VIDEO",
  TEXT_TO_VIDEO = "TEXT_TO_VIDEO",
}

export enum CHAT_STREAM_EVENT_TYPES {
  CHAT_RESPONSE_CREATED = "chat.response.created",
  CHAT_RESPONSE_DELTA = "chat.response.delta",
  CHAT_RESPONSE_COMPLETED = "chat.response.completed",
  CONSENSUS = "consensus",
  CONVERSATION_SAVE_SUCCESS = "conversation.save.success",
  CONVERSATION_SAVE_FAILED = "conversation.save.failed",
  CONVERSATION_CREATED_SUCCESS = "conversation.created.success",
}

export const BACKEND_BASE_URL = "http://localhost:8080/";

export const API_VERSION_V1 = "v1";
export const CHAT_API_STEM = "api/chat";

export const BILLING_API_PATHS = {
  PLANS: `${API_VERSION_V1}/${CHAT_API_STEM}/plans`,
  BILLING_START: `${API_VERSION_V1}/${CHAT_API_STEM}/billing/start`,
  SUBSCRIPTION_CURRENT: `${API_VERSION_V1}/${CHAT_API_STEM}/subscription/current`,
} as const;

export const IMAGE_API_PATHS = {
  GENERATE: (modelId: number | string) =>
    `${API_VERSION_V1}/${CHAT_API_STEM}/images/generations/${modelId}`,
  SAVE_BASE64: `${API_VERSION_V1}/save-base64-image`,
} as const;

export const CHAT_API_PATHS = {
  CONVERSATIONS: {
    BASE: `${API_VERSION_V1}/${CHAT_API_STEM}/conversations`,
    BY_ID: (id: string | number) =>
      `${API_VERSION_V1}/${CHAT_API_STEM}/conversations/${id}`,
    BY_TYPE: (type: string) =>
      `${API_VERSION_V1}/${CHAT_API_STEM}/conversations/type/${type}`,
    MESSAGES: {
      BASE: (conversationId: string | number) =>
        `${API_VERSION_V1}/${CHAT_API_STEM}/conversations/${conversationId}/messages`,
      BY_ID: (conversationId: string | number, messageId: string | number) =>
        `${API_VERSION_V1}/${CHAT_API_STEM}/conversations/${conversationId}/messages/${messageId}`,
    },
    COMPLETIONS: (
      conversationId: string | number | null,
      editedMessageId: number | null
    ) => {
      let url = `${API_VERSION_V1}/${CHAT_API_STEM}/completions/streaming-and-non-streaming`;

      if (conversationId) {
        url += `/${conversationId}`;
      }

      if (editedMessageId !== null) {
        url += `?editedMessageId=${editedMessageId}`;
      }
      return url;
    },
  },
  USERS: {
    BASE: `${API_VERSION_V1}/${CHAT_API_STEM}/users`,
  },
  IMAGE: {
    BASE: (conversationId: string) =>
      `${API_VERSION_V1}/${CHAT_API_STEM}/images/generations/${conversationId}`,
  },
} as const;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const STALE_TIME = 300_000; // 5 minutes

export const EMPTY_STRING = "";

// Minimal API key storage (client-side)
export const ACCESS_TOKEN_KEY = "AI_MESH_ACCESS_TOKEN";
export const REFRESH_TOKEN_KEY = "AI_MESH_REFRESH_TOKEN";

export const UNDEFINED = "undefined";

export const CONTENT_TYPE = "Content-Type";
export const APPLICATION_JSON = "application/json";
export const APPLICATION_OCTET_STREAM = "application/octet-stream";
export const MULTIPART_FORM_DATA = "multipart/form-data";
export const TEXT_PLAIN = "text/plain";
export const TEXT_HTML = "text/html";
export const AUTHORIZATION = "Authorization";
export const BEARER = "Bearer";
export const WWW_AUTHENTICATE = "www-authenticate";
export const RETRY_ATTEMPT = "_retry";
export const ACCEPT = "Accept";
export const ACCEPT_ENCODING = "Accept-Encoding";
export const CONTENT_ENCODING = "Content-Encoding";
export const CONTENT_LENGTH = "Content-Length";
export const CONTENT_DISPOSITION = "Content-Disposition";
export const TRANSFER_ENCODING = "Transfer-Encoding";
export const CACHE_NO_STORE = "no-store";

export const EVENT_NAME_START_WITH = "event:";
export const EVENT_NAME_SLICE_START = 6;
export const EVENT_DATA_START_WITH = "data:";
export const EVENT_DATA_SLICE_START = 5;
