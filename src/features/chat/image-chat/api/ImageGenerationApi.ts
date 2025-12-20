import {
  ImageRequestBody,
  MultiImageResponse,
} from "@/features/chat/types/imageModels";
import { api, authenticatedApi } from "../../../../lib/api/axiosApi";

export const ImageGenerationService = {
  generateImage: async (
    data: ImageRequestBody
  ): Promise<MultiImageResponse> => {
    const res = await authenticatedApi.post<MultiImageResponse>(
      "/v1/api/chat/images/generations",
      data
    );
    console.log("Image generation response:", res.data);
    return res.data;
  },

  base64ToImageUrl: async (data: string): Promise<any> => {
    const payload = { image: data };
    const res = await authenticatedApi.post<any>(
      "/v1/save-base64-image",
      payload
    );
    console.log("Base64 image response:", res.data);
    return res.data;
  },

  getImageByUrl: async (url: string): Promise<Blob> => {
    const res = await authenticatedApi.get<Blob>(url, {
      responseType: "blob", // Important: tells axios to handle the response as a Blob
    });
    // The response data will be the image blob itself
    return res.data;
  },

  // addImageMessageInConversation: async (data: ImageRequestBody): Promise<MultiImageResponse> => {
  //     const res = await authenticatedApi.post<MultiImageResponse>("/v1/save-base63-image", data);
  //     console.log("Image generation response:", res.data);
  //     return res.data;
  // },
};
