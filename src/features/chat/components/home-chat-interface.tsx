"use client";

import { ModelColumns } from "@/features/chat/components/model-columns";
import { ModelSelector } from "@/features/chat/components/chat-model-selector";
import {
  ChatRequestBody,
  ContentItem,
  FileUploadItem,
  RouteSel,
} from "@/features/chat/types/models";
import { useLanguage } from "@/shared/contexts/language-context";
import { useDispatch, useSelector } from "react-redux";
import {
  clearModelResponses,
  setEditMessageId,
  toggleModelSelector,
  updateInputMessage,
  triggerFileUploading,
  startRecorder,
  stopRecorder,
  clearChatState,
} from "@/features/chat/store/chat-interface-slice";
import { useCreateMessages } from "@/features/chat/text-chat/hooks/useCreateMessages";
import { useUpdateMessages } from "@/features/chat/text-chat/hooks/useUpdateMessages";
import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api/http";
import { AudioRecorderModal } from "@/features/chat/components/audio-recorder-model";
import { authHeader } from "@/features/chat/auth/utils/auth";
import { setSelectedConvId } from "@/features/chat/conversation/store/conversation-slice";
import { RootState } from "@/lib/store/store";
import {
  CONTENT_INPUT_TYPES,
  CONVERSATION_TYPES,
  ROLES,
} from "@/shared/constants/constants";
import { useRouter } from "next/navigation";
import { ChatInputArea } from "./chat-input-area";
import { ChatActionChips } from "./chat-action-chips";
import { setActiveInterface as setGlobalActiveInterface } from "@/features/chat/store/ui-slice"; // Renamed import
import { useCreateConversationApi } from "@/features/chat/conversation/hooks/conversationHook";

export function HomeChatInterface() {
  const {
    editedMessageId,
    showModelSelector,
    selectedModels,
    inputMessage,
    isStreaming,
    triggerSend,
    uploadingFiles,
    showRecorder,
  } = useSelector((store: any) => store.chatInterface);
  const { activeInterface } = useSelector((store: RootState) => store.ui);
  const { selectedConvId } = useSelector(
    (store: any) => store.conversationSlice
  );
  const dispatch = useDispatch();
  const createMessages = useCreateMessages(selectedConvId ?? null); // Will get convId at time of mutation
  const updateMessages = useUpdateMessages(selectedConvId);
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const createConversation = useCreateConversationApi();

  // 🔹 File handling
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isImageGenSelected, setIsImageGenSelected] = useState(false);
  const [isWebSearchSelected, setIsWebSearchSelected] = useState(false);

  const handleGenerateImageClick = () => {
    setIsImageGenSelected(!isImageGenSelected);
    dispatch(setSelectedConvId(null));
    dispatch(clearChatState());
    dispatch(setGlobalActiveInterface(CONVERSATION_TYPES.IMAGE));
    isImageGenSelected
      ? setIsImageGenSelected(false)
      : setIsImageGenSelected(true);
  };

  const handleWebSearchClick = () => {
    setIsWebSearchSelected(!isWebSearchSelected);
  };

  interface UploadApiResponse {
    providers: {
      [provider: string]: FileUploadItem[];
    };
  }

  //Handling Files here

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles((prev) => [...prev, ...files]);
    console.log("Selected files:", files);
  };

  // Remove a specific file
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload files function
  const uploadFiles = async (
    files: File[],
    providers: string
  ): Promise<UploadApiResponse | null> => {
    if (files.length === 0) return null;

    console.log("Uploading files to providers:", providers);
    // setUploadingFiles(true);
    dispatch(triggerFileUploading(true));

    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("providers", providers);

      console.log("Uploading files:", Array.from(formData.entries()));

      const response = await fetch(`${API_BASE}/v1/upload`, {
        method: "POST",
        headers: authHeader(),
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed:", errorText);
        throw new Error(
          `File upload failed: ${response.status} ${response.statusText}`
        );
      }

      const uploadResponse: UploadApiResponse = await response.json();
      console.log("Upload response:", uploadResponse);
      return uploadResponse;
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    } finally {
      dispatch(triggerFileUploading(false));
    }
  };

  const processUploadedFiles = (
    uploadResponse: UploadApiResponse,
    providers: string
  ): ContentItem[] => {
    // Extract providers array from comma-separated string
    const providerArray = providers.split(",").map((p) => p.trim());

    // Get the first provider (or use consensus if available)
    const firstProvider = providerArray[0];
    const baseFileItems = uploadResponse.providers[firstProvider];

    if (!baseFileItems || baseFileItems.length === 0) {
      return [];
    }

    const contentItems: ContentItem[] = baseFileItems.map((baseItem, index) => {
      const isImage = baseItem.type.includes("image");

      let imageAnalyzedText = "";
      let fileAnalyzedText = "";
      let fileId = "";
      let fileBase64 = "";

      if (
        isImage &&
        (providerArray.includes("deepseek") || providerArray.includes("ollama"))
      ) {
        // Prefer deepseek's output, fallback to ollama's if deepseek is not present.
        const deepseekFiles = uploadResponse.providers["deepseek"];
        const ollamaFiles = uploadResponse.providers["ollama"];

        if (deepseekFiles && deepseekFiles[index]) {
          imageAnalyzedText = deepseekFiles[index].output;
        } else if (ollamaFiles && ollamaFiles[index]) {
          imageAnalyzedText = ollamaFiles[index].output;
        }
      }
      if (!isImage && providerArray.includes("openai")) {
        const openaiFiles = uploadResponse.providers["openai"];
        if (openaiFiles && openaiFiles[index]) {
          fileId = openaiFiles[index].output;
        }
      }

      if (
        !isImage &&
        (providerArray.includes("deepseek") ||
          providerArray.includes("ollama") ||
          providerArray.includes("grok"))
      ) {
        // Prefer deepseek, then grok,  then ollama.
        const deepseekFiles = uploadResponse.providers["deepseek"];
        const grokFiles = uploadResponse.providers["grok"];
        const ollamaFiles = uploadResponse.providers["ollama"];

        if (deepseekFiles && deepseekFiles[index]) {
          fileAnalyzedText = deepseekFiles[index].output;
        } else if (grokFiles && grokFiles[index]) {
          fileAnalyzedText = grokFiles[index].output;
        } else if (ollamaFiles && ollamaFiles[index]) {
          fileAnalyzedText = ollamaFiles[index].output;
        }
      }

      if (
        !isImage &&
        (providerArray.includes("anthropic") ||
          providerArray.includes("gemini") ||
          providerArray.includes("perplexity"))
      ) {
        const anthropicFiles = uploadResponse.providers["anthropic"];
        const geminiFiles = uploadResponse.providers["gemini"];
        const perplexityFiles = uploadResponse.providers["perplexity"];

        if (anthropicFiles && anthropicFiles[index]) {
          fileBase64 = anthropicFiles[index].output;
        } else if (geminiFiles && geminiFiles[index]) {
          fileBase64 = geminiFiles[index].output;
        } else if (perplexityFiles && perplexityFiles[index]) {
          fileBase64 = perplexityFiles[index].output;
        }
      }

      if (isImage) {
        return {
          type: "input_image",
          image_url: baseItem.output,
          image_analyzed_text: imageAnalyzedText,
        };
      } else {
        return {
          type: "input_file",
          file_id: fileId,
          file_analyzed_text: fileAnalyzedText,
          file_base64: fileBase64,
        };
      }
    });

    return contentItems;
  };

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

    setIsAnimating(true);
    const startTime = Date.now();

    let currentConvId = selectedConvId;

    // If there's no selected conversation, create one first.
    console.log("Active Interface: ", activeInterface);
    if (!currentConvId) {
      try {
        const newConversation = await createConversation.mutateAsync({
          title: userMessage.substring(0, 50), // Use first 50 chars as title
          convoType: activeInterface,
        });
        currentConvId = newConversation.id;
        dispatch(setSelectedConvId(newConversation.id));
        console.log("New conversation created and selected: ", currentConvId);
        router.push(`/chat/${currentConvId}`);
      } catch (error) {
        console.error("Failed to create conversation:", error);
        return; // Stop if conversation creation fails
      }
    }
    const bodyRoutes: RouteSel[] = selectedModels
      .filter((model: RouteSel) => model.model !== "consensus")
      .map((model: RouteSel) => ({
        provider: model.provider,
        model: model.model,
      }));
    // console.log("Body Routes: ", bodyRoutes);
    const providers = bodyRoutes.map((r: RouteSel) => r.provider).join(",");

    let uploadResponse = null;

    try {
      let contentItems: ContentItem[] = [];
      // Upload files first (if any)
      if (selectedFiles.length > 0) {
        console.log(`Uploading ${selectedFiles.length} file(s)...`);
        uploadResponse = await uploadFiles(selectedFiles, providers);
        console.log("Files uploaded successfully: ", uploadResponse);

        if (uploadResponse) {
          const uploadedContent = processUploadedFiles(
            uploadResponse,
            providers
          );
          contentItems.push(...uploadedContent);
          console.log("Processed uploaded files: ", uploadedContent);
        } else {
          console.warn("Upload failed, continuing without files");
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

      // const elapsedTime = Date.now() - startTime;
      // const remainingTime = Math.max(0, 500 - elapsedTime);
      // setTimeout(() => {
      //   router.push(`/chat/${currentConvId}`);
      // }, remainingTime);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsAnimating(false);
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
      setSelectedFiles([]); // clear files after sending
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
    <div className="flex-1 flex flex-col h-full bg-background relative">
      {/* ModelColumns is now always visible */}
      <div className="absolute inset-0 z-0">
        <ModelColumns />
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
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[100%] bg-gradient-to-r from-teal-500/20 via-purple-500/20 to-pink-500/20 blur-3xl -z-10 rounded-full pointer-events-none transition-opacity duration-500 ${
              isAnimating ? "opacity-0" : "opacity-100"
            }`}
          />

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
            isUploading={uploadingFiles}
            selectedFiles={selectedFiles}
            onFilesSelected={handleFilesSelected}
            onFileRemove={removeFile}
            showModelSelector={showModelSelector}
            onToggleModelSelector={() =>
              dispatch(toggleModelSelector(!showModelSelector))
            }
            onStartRecording={() => dispatch(startRecorder())}
            placeholder={t.chat.askAnything}
            disabled={uploadingFiles || isStreaming}
          />

          {/* Chip Buttons */}
          <ChatActionChips
            isImageGenSelected={isImageGenSelected}
            onToggleImageGen={handleGenerateImageClick}
            isWebSearchSelected={isWebSearchSelected}
            onToggleWebSearch={handleWebSearchClick}
            className="mt-3 justify-center"
          />
        </div>
        <div
          className={`w-full transition-all duration-500 ease-in-out ${
            isAnimating ? "flex-none" : "flex-1"
          }`}
        />
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
