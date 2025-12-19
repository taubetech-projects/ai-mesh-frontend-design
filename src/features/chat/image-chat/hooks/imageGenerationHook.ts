import { useMutation } from "@tanstack/react-query";
import { ImageGenerationService } from "../../../../lib/services/ImageGenerationApi";
import { ImageRequestBody, MultiImageResponse } from "@/types/imageModels";
import {
  AttachmentRequest,
  MessagePartRequest,
  SaveMessageRequest,
} from "@/types/models";
import { messageApi } from "../../text-chat/api/messageApi";
import {
  CHAT_MODES,
  MESSAGE_PART_TYPES,
  MIME_TYPES,
  ROLES,
  STORAGE_TYPES,
} from "@/types/constants";

export const useImageGenerationApi = () => {
  return useMutation({
    mutationFn: (data: ImageRequestBody) =>
      ImageGenerationService.generateImage(data),
  });
};

export const useAddImageMessage = () => {
  return useMutation({
    mutationFn: async ({
      requestBody,
      conversationId,
      imageResponse,
    }: {
      requestBody: ImageRequestBody;
      conversationId: number;
      imageResponse: MultiImageResponse;
    }) => {
      console.log("useAddImageMessage hook triggered with:", {
        requestBody,
        conversationId,
        imageResponse,
      });

      // 1) Optimistically add user message
      let messageParts: MessagePartRequest[] = [];
      let userAttachMents: AttachmentRequest[] = [];

      // Convert base64 images to temporary blob URLs on the client-side
      if (requestBody.images) {
        for (const image of requestBody.images) {
          const savedUrl = await ImageGenerationService.base64ToImageUrl(
            image.base64
          );
          console.log("Saved URL:", savedUrl);
          userAttachMents.push({
            mimeType: image.mimeType,
            externalUrl: savedUrl.url, // Use the temporary blob URL
            fileName: image.fileName,
            storageType: STORAGE_TYPES.EXTERNAL_URL,
          });
        }
      }
      messageParts.push({
        type: MESSAGE_PART_TYPES.TEXT,
        text: requestBody.prompt,
        attachments: userAttachMents,
      });

      const bodies: SaveMessageRequest[] = [];

      // user
      bodies.push({
        role: ROLES.USER,
        mode: CHAT_MODES.MULTI,
        authorId: "user-123",
        parts: messageParts,
      });

      //Assistants

      for (const result of imageResponse.results) {
        let assistantAttachments: AttachmentRequest[] = [];
        const savedUrl = await ImageGenerationService.base64ToImageUrl(
          result.image_data[0].base64_data ?? ""
        );
        console.log("Saved URL:", savedUrl);
        assistantAttachments.push({
          mimeType: MIME_TYPES.PNG,
          externalUrl: savedUrl.url,
          fileName: "assistant_image",
          storageType: STORAGE_TYPES.EXTERNAL_URL,
        });

        bodies.push({
          role: ROLES.ASSISTANT,
          mode: CHAT_MODES.MULTI,
          authorId: "assistant-123",
          model: result.model,
          parts: [
            {
              type: MESSAGE_PART_TYPES.IMAGE,
              text: result.text,
              attachments: assistantAttachments,
            },
          ],
        });
      }

      console.log("Bodies:", bodies);
      const saved = await messageApi.createBatch(conversationId, bodies);
      console.log("Saved message in the conversation :", saved);
      return saved;
    },
  });
};
