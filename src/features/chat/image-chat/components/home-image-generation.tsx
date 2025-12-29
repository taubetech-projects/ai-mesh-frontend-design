"use client";

import { ModelSelector } from "@/features/chat/components/chat-model-selector";
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
import { setSelectedConvId } from "@/features/chat/conversation/store/conversation-slice";
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
import { useCreateConversationApi } from "@/features/chat/conversation/hooks/conversationHook";
import { ImageModelSelector } from "./image-model-selector";
import { ChatInputArea } from "../../components/chat-input-area";
import { ChatActionChips } from "../../components/chat-action-chips";
import { useState } from "react";
import { setActiveInterface as setGlobalActiveInterface } from "@/features/chat/store/ui-slice"; // Renamed import
import { CONVERSATION_TYPES } from "@/shared/constants/constants";
import { useRouter } from "next/navigation";

export function HomeImageGeneration() {
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

  const { activeInterface } = useSelector((state: RootState) => state.ui);
  console.log("Active interface:", activeInterface);

  const createConversation = useCreateConversationApi();
  const saveImageMessage = useAddImageMessage();
  const dispatch = useDispatch();
  const generateImage = useImageGenerationApi();
  const router = useRouter();

  const [isImageGenSelected, setIsImageGenSelected] = useState(true);
  const [isWebSearchSelected, setIsWebSearchSelected] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleGenerateImageClick = () => {
    setIsImageGenSelected(!isImageGenSelected);
    dispatch(setGlobalActiveInterface(CONVERSATION_TYPES.CHAT));
  };

  const handleWebSearchClick = () => {
    setIsWebSearchSelected(!isWebSearchSelected);
  };

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

    setIsAnimating(true);
    const startTime = Date.now();

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
        setIsAnimating(false);
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
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 500 - elapsedTime);
      setTimeout(() => {
        router.push(`/chat/${currentConvId}`);
      }, remainingTime);

      // Simulate API call
      // setTimeout(() => {
      // }, 2000);

      dispatch(updatePrompt(""));
      dispatch(clearUploadedImages());
      dispatch(toggleModelSelector(false));
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative">
      <div className="absolute inset-0 z-0">
        <ImageDisplayColumns />
      </div>

      <div className="flex-1 flex flex-col items-center z-10 pointer-events-none w-full">
        <div className="flex-1 w-full" />

        {/* Greeting Heading */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            isAnimating
              ? "opacity-0 h-0 mb-0 overflow-hidden"
              : "opacity-100 mb-8"
          }`}
        >
          <h1 className="text-3xl md:text-4xl font-medium text-foreground text-center tracking-tight">
            Good to see you, Tahsin
          </h1>
        </div>

        <div className="w-full max-w-4xl p-4 pointer-events-auto relative">
          {/* Gradient effect behind input box */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[100%] bg-gradient-to-r from-teal-500/20 via-purple-500/20 to-pink-500/20 blur-3xl -z-10 rounded-full pointer-events-none transition-opacity duration-500 opacity-100`}
          />

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
          {!isGenerating && (
            <ChatActionChips
              isImageGenSelected={isImageGenSelected}
              onToggleImageGen={handleGenerateImageClick}
              isWebSearchSelected={isWebSearchSelected}
              onToggleWebSearch={handleWebSearchClick}
              className="mt-3 justify-center"
              disableWebSearch={true}
            />
          )}
        </div>
        <div
          className={`w-full transition-all duration-500 ease-in-out ${
            isAnimating ? "flex-none" : "flex-1"
          }`}
        />
      </div>
    </div>
  );
}
