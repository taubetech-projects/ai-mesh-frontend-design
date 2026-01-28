"use client";

import { ModelColumns } from "@/features/chat/components/model-columns";
import { ModelSelector } from "@/features/chat/components/chat-model-selector";
import {
  ChatRequestBody,
  ContentItem,
  // FileUploadItem,
  RouteSel,
} from "@/features/chat/types/models";
import { useLanguage } from "@/shared/contexts/language-context";
import { useDispatch, useSelector } from "react-redux";
import {
  clearModelResponses,
  setEditMessageId,
  toggleModelSelector,
  updateInputMessage,
  // triggerFileUploading,
  startRecorder,
  stopRecorder,
} from "@/features/chat/store/chat-interface-slice";
import { useCreateMessages } from "@/features/chat/text-chat/hooks/useCreateMessages";
import { useUpdateMessages } from "@/features/chat/text-chat/hooks/useUpdateMessages";
import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api/http";
import { AudioRecorderModal } from "@/features/chat/components/audio-recorder-model";
import { authHeader } from "@/features/chat/auth/utils/auth";
import { useCreateConversationApi } from "@/features/chat/conversation/hooks/conversationHook";
import { RootState } from "@/lib/store/store";
import { CONTENT_INPUT_TYPES, ROLES } from "@/shared/constants/constants";
import { ChatInputArea } from "./chat-input-area";
import { useFileHandler } from "@/features/chat/hooks/use-file-handler";

export function ChatInterface() {
  const {
    editedMessageId,
    showModelSelector,
    selectedModels,
    inputMessage,
    isStreaming,
    triggerSend,
    // uploadingFiles,
    showRecorder,
  } = useSelector((store: any) => store.chatInterface);
  const { activeInterface } = useSelector((store: RootState) => store.ui);
  const { selectedConvId } = useSelector(
    (store: any) => store.conversationSlice
  );
  const dispatch = useDispatch();
  const createMessages = useCreateMessages(selectedConvId); // Will get convId at time of mutation
  const updateMessages = useUpdateMessages(selectedConvId);
  const createConversation = useCreateConversationApi();

  // 🔹 File handling
  const { 
    selectedFiles, 
    handleFilesSelected, 
    removeFile, 
    clearFiles,
    uploadAndProcessFiles, 
    isUploading: isHandlingFile 
  } = useFileHandler();

  const { t } = useLanguage();

  function modeSelection() {
    const model = selectedModels.find(
      (model: RouteSel) => model.model === "consensus"
    );
    return model ? "consensus" : "multi";
  }

  // ✅ React to the trigger
  useEffect(() => {
    handleSendMessage();
  }, [triggerSend]); // fires whenever child toggles triggerSend

  // ---- Send / Stream ----
  const onSend = async (userMessage: string) => {
    if (selectedModels.length === 0) return;

    let currentConvId = selectedConvId;
    const bodyRoutes: RouteSel[] = selectedModels
      .filter((model: RouteSel) => model.model !== "consensus")
      .map((model: RouteSel) => ({
        provider: model.provider,
        model: model.model,
      }));
    const providers = Array.from(new Set(bodyRoutes.map((r: RouteSel) => r.provider))).join(",");

    try {
      let contentItems: ContentItem[] = [];
      // Upload files first (if any)
      if (selectedFiles.length > 0) {
        const uploadedContent = await uploadAndProcessFiles(providers);
        if (uploadedContent === null) {
            console.error("Upload failed, aborting message send.");
            return; // Abort if upload failed
        }

        if (uploadedContent.length > 0) {
           contentItems.push(...uploadedContent);
        }
      }

      // Step 3: Add user message text
      contentItems.push({
        type: CONTENT_INPUT_TYPES.INPUT_TEXT,
        text: userMessage,
      });

      // Step 4: Prepare main API body
      const chatRequestBody: ChatRequestBody = {
        mode: modeSelection(),
        routes: bodyRoutes.length > 0 ? bodyRoutes : null,
        messages: [
          {
            role: ROLES.USER,
            content: contentItems,
          },
        ],
        stream: true,
        provider_response: false,
      };

      // console.log("Final request body:", chatRequestBody);
      // console.log("editedMessageId", editedMessageId);
      if (editedMessageId) {
        await updateMessages.mutateAsync({
          messageId: editedMessageId,
          chatRequestBody,
        }); // Update existing message
      } else {
        await createMessages.mutateAsync(chatRequestBody); // Create message
      }
      dispatch(setEditMessageId(null));
      dispatch(clearModelResponses());
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSendMessage = () => {
    if (inputMessage !== undefined && inputMessage.trim()) {
      // Handle message sending logic here
      onSend(inputMessage);
      console.log(
        "Sending message:",
        inputMessage,
        "to models:",
        selectedModels
      );
      dispatch(updateInputMessage(""));
      dispatch(toggleModelSelector(false));
      dispatch(toggleModelSelector(false));
      clearFiles(); // clear files after sending
    }
  };

  // 🎤 Handle audio recording
  // const handleMicClick = () => {
  //     setShowRecorder(true);
  // };

  const handleTranscriptionComplete = (transcription: string) => {
    console.log("Transcription complete:", transcription);
    dispatch(updateInputMessage(transcription));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* ModelColumns is now always visible */}
      <div className="flex-1 relative h-full" style={{ minHeight: 0 }}>
        <ModelColumns />
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
                <ModelSelector />
              </div>
            </div>
          )}

          <ChatInputArea
            value={inputMessage || ""}
            onChange={(val) => dispatch(updateInputMessage(val))}
            onSend={handleSendMessage}
            isStreaming={isStreaming}
            isUploading={isHandlingFile}
            selectedFiles={selectedFiles}
            onFilesSelected={handleFilesSelected}
            onFileRemove={removeFile}
            showModelSelector={showModelSelector}
            onToggleModelSelector={() =>
              dispatch(toggleModelSelector(!showModelSelector))
            }
            onStartRecording={() => dispatch(startRecorder())}
            placeholder={t.chat.askAnything}
            disabled={isHandlingFile || isStreaming}
          />
        </div>
      </div>
      {/* 🎤 Audio Recorder Modal */}
      {showRecorder && (
        <AudioRecorderModal
          onClose={() => dispatch(stopRecorder())}
          onTranscriptionComplete={handleTranscriptionComplete}
        />
      )}
    </div>
  );
}
