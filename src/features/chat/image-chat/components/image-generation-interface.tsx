"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ModelSelector } from "@/features/chat/components/chat-model-selector";
import { Send, Paperclip, Settings, X } from "lucide-react";
import { useLanguage } from "@/shared/contexts/language-context";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleModelSelector,
  updatePrompt,
  addUploadedImage,
  removeUploadedImage,
  clearUploadedImages,
  setIsGenerating,
} from "@/redux/image-generation-slice";
import { setSelectedConvId } from "@/redux/conversation-slice";
import { useRef } from "react";
import { ImageDisplayColumns } from "./image-display-columns";
import { RootState } from "@/redux/store";
import {
  useAddImageMessage,
  useImageGenerationApi,
} from "@/features/chat/image-chat/hooks/imageGenerationHook";
import { ImageInput, ImageRequestBody } from "@/types/imageModels";
import { useCreateConversationApi } from "@/features/conversation/hooks/conversationHook";
import { ImageModelSelector } from "./image-model-selector";

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
  const createConversation = useCreateConversationApi();
  const saveImageMessage = useAddImageMessage();
  const dispatch = useDispatch();
  const generateImage = useImageGenerationApi();

  // 🔹 File handling
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
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

    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove a specific file
  const handleRemoveImage = (index: number) => {
    dispatch(removeUploadedImage(index));
  };

  const { t } = useLanguage();

  const handleSendMessage = async () => {
    if (selectedModels.length === 0) return;

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
        mode: "image",
        routes: selectedModels,
        prompt: prompt,
        images: uploadedImages.length > 0 ? uploadedImages : null,
        stream: false,
        provider_response: false,
      };
      console.log("Image Request body:", imageRequestBody);
      const response = await generateImage.mutateAsync(imageRequestBody);
      saveImageMessage.mutate({
        requestBody: imageRequestBody,
        conversationId: currentConvId,
        imageResponse: response,
      });
      dispatch(setIsGenerating(false));

      // Simulate API call
      // setTimeout(() => {
      // }, 2000);

      dispatch(updatePrompt(""));
      dispatch(clearUploadedImages());
      dispatch(toggleModelSelector(false));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <div className="flex-1 relative h-full" style={{ minHeight: 0 }}>
        <ImageDisplayColumns />
      </div>

      <div className="sticky bottom-0 z-10 p-4 border-t border-border bg-background">
        <div className="max-w-4xl mx-auto">
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

          {/* Show uploaded image previews */}
          {uploadedImages.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {uploadedImages.map((imgeFile, index) => (
                <div key={index} className="relative">
                  <img
                    src={imgeFile.base64}
                    alt={`upload-preview-${index}`}
                    className="h-16 w-16 object-cover rounded-md"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Input Field */}
          <div className="relative">
            <Input
              value={prompt}
              onChange={(e) => dispatch(updatePrompt(e.target.value))}
              onKeyPress={handleKeyPress}
              placeholder={t.chat.askAnything}
              className="pr-32 py-3 text-base bg-muted border-border text-primary placeholder:text-muted-foreground"
              disabled={isGenerating}
            />
            {/* Hidden file input */}
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />

            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  dispatch(toggleModelSelector(!showModelSelector))
                }
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Select Models"
              >
                <Settings className="w-4 h-4" />
              </Button>

              {/* 📎 File upload button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFileButtonClick}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Attach Files"
                disabled={isGenerating}
              >
                <Paperclip className="w-4 h-4" />
                {uploadedImages.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {uploadedImages.length}
                  </span>
                )}
              </Button>

              <Button
                onClick={handleSendMessage}
                size="icon"
                className="h-8 w-8 bg-teal-500 hover:bg-teal-600 text-white"
                disabled={
                  (!prompt.trim() && uploadedImages.length === 0) ||
                  isGenerating
                }
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
