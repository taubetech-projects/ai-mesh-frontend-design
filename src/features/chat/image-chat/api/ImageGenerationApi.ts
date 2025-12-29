import type {
  ImageRequestBody,
  MultiImageResponse,
} from "@/features/chat/types/imageModels";
import { chatProxyApi } from "@/lib/api/axiosApi";
import { IMAGE_API_PATHS } from "@/shared/constants/constants";

const DEFAULT_IMAGE_MODEL_ID = 45;

// Helper to detect external URLs
const isAbsoluteUrl = (url: string) => /^https?:\/\//i.test(url);

export const ImageGenerationService = {
  generateImage: async (
    data: ImageRequestBody,
    conversationId: string
  ): Promise<MultiImageResponse> => {
    const res = await chatProxyApi.post<MultiImageResponse>(
      IMAGE_API_PATHS.GENERATE(DEFAULT_IMAGE_MODEL_ID),
      data
    );
    return res.data;
  },

  base64ToImageUrl: async (base64: string): Promise<any> => {
    const payload = { image: base64 };
    const res = await chatProxyApi.post<any>(
      IMAGE_API_PATHS.SAVE_BASE64,
      payload
    );
    return res.data;
  },

  getImageByUrl: async (url: string): Promise<Blob> => {
    // External image (CDN, S3, etc.) → fetch directly
    if (isAbsoluteUrl(url)) {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load image");
      return await res.blob();
    }

    // Backend-relative image → go through proxy
    const normalized = url.startsWith("/") ? url.slice(1) : url;
    const res = await chatProxyApi.get<Blob>(normalized, {
      responseType: "blob",
    });
    return res.data;
  },
};

// addImageMessageInConversation: async (data: ImageRequestBody): Promise<MultiImageResponse> => {
//     const res = await proxyApi.post<MultiImageResponse>("v1/save-base63-image", data);
//     console.log("Image generation response:", res.data);
//     return res.data;
// },
