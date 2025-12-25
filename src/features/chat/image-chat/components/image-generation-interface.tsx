"use client";

import { useLanguage } from "@/shared/contexts/language-context";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleModelSelector,
  updatePrompt,
  addUploadedImage,
  removeUploadedImage,
  clearUploadedImages,
  setIsGenerating,
} from "@/features/chat/store/image-generation-slice";
import { setSelectedConvId } from "@/features/conversation/store/conversation-slice";
import { ImageDisplayColumns } from "./image-display-columns";
import { RootState } from "@/lib/store/store";
import {
  useAddImageMessage,
  useImageGenerationApi,
} from "@/features/chat/image-chat/hooks/imageGenerationHook";
import {
  ImageInput,
  ImageRequestBody,
} from "@/features/chat/types/imageModels";
import { useCreateConversationApi } from "@/features/conversation/hooks/conversationHook";
import { ImageModelSelector } from "./image-model-selector";
import { ChatInputArea } from "../../components/chat-input-area";

export function ImageGenerationInterface() {
  const {
    prompt,
    showModelSelector,
    selectedModels,
    uploadedImages,
    isGenerating,
  } = useSelector((store: RootState) => store.imageGeneration);

  const { selectedConvId } = useSelector(
    (store: any) => store.conversationSlice
  );

  console.log("Image Generation Interface");

  const createConversation = useCreateConversationApi();
  const saveImageMessage = useAddImageMessage();
  const dispatch = useDispatch();
  const generateImage = useImageGenerationApi();

  // 🔹 File handling
  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const base64 = loadEvent.target?.result as string;
        const imageFile: ImageInput = {
          type: file.type,
          mimeType: file.type,
          base64: base64,
          fileName: file.name,
        };
        if (base64) {
          dispatch(addUploadedImage(imageFile));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove a specific file
  const handleRemoveImage = (index: number) => {
    dispatch(removeUploadedImage(index));
  };

  const { t } = useLanguage();

  const handleSendMessage = async () => {
    if (selectedModels.length === 0) return;

    // setIsAnimating(true);

    let currentConvId = selectedConvId;

    // If there's no selected conversation, create one first.
    if (!currentConvId) {
      try {
        const newConversation = await createConversation.mutateAsync({
          title: prompt.substring(0, 50), // Use first 50 chars as title
          convoType: "IMAGE",
        });
        currentConvId = newConversation.id;
        dispatch(setSelectedConvId(newConversation.id));
        console.log("New conversation created and selected:", currentConvId);
      } catch (error) {
        console.error("Failed to create conversation:", error);
        // setIsAnimating(false);
        return; // Stop if conversation creation fails
      }
    }

    if (prompt.trim() || uploadedImages.length > 0) {
      // TODO: Implement your image generation API call here
      console.log(
        "Generating image with prompt:",
        prompt,
        "and images:",
        uploadedImages,
        "for models:",
        selectedModels
      );
      dispatch(setIsGenerating(true));
      const imageRequestBody: ImageRequestBody = {
        mode: "multi",
        routes: selectedModels,
        prompt: prompt,
        images: uploadedImages.length > 0 ? uploadedImages : null,
        stream: false,
        provider_response: false,
      };
      console.log("Image Request body:", imageRequestBody);
      const response = await generateImage.mutateAsync({
        data: imageRequestBody,
        conversationId: String(currentConvId),
      });
      // saveImageMessage.mutate({
      //   requestBody: imageRequestBody,
      //   conversationId: currentConvId,
      //   imageResponse: response,
      // });
      dispatch(setIsGenerating(false));

      // Simulate API call
      // setTimeout(() => {
      // }, 2000);

      dispatch(updatePrompt(""));
      dispatch(clearUploadedImages());
      dispatch(toggleModelSelector(false));
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <div className="flex-1 relative h-full" style={{ minHeight: 0 }}>
        <ImageDisplayColumns />
      </div>

      <div className="sticky bottom-0 z-10 p-4 border-t border-border bg-background">
        <div className="max-w-4xl mx-auto" />

        {/* Model Selector */}
        {showModelSelector && (
          <div
            className="mb-4 absolute left-0 right-0 bottom-16 z-20 flex justify-center"
            style={{ pointerEvents: "auto" }}
          >
            <div className="max-w-4xl w-full">
              <ImageModelSelector />
            </div>
          </div>
        )}

        <ChatInputArea
          value={prompt}
          onChange={(val) => dispatch(updatePrompt(val))}
          onSend={handleSendMessage}
          isStreaming={isGenerating}
          selectedFiles={uploadedImages.map(
            (img) =>
              ({
                name: img.fileName,
                type: img.mimeType || img.type,
              } as File)
          )}
          onFilesSelected={handleFilesSelected}
          onFileRemove={handleRemoveImage}
          showModelSelector={showModelSelector}
          onToggleModelSelector={() =>
            dispatch(toggleModelSelector(!showModelSelector))
          }
          placeholder={t.chat.askAnything}
          disabled={isGenerating}
        />
      </div>
    </div>
    // </div>
  );
}
