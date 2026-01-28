"use client";

import { ModelColumns } from "@/features/chat/components/model-columns";
import { ModelSelector } from "@/features/chat/components/chat-model-selector";
import {
  ChatMode,
  ChatModeSelector,
} from "@/features/chat/components/chat-mode-selector";
import {
  ChatRequestBody,
  ContentItem,
  // FileUploadItem, // Removed as it's not directly used here anymore or imported from models
  ModelProvider,
  RouteSel,
} from "@/features/chat/types/models";
import { useLanguage } from "@/shared/contexts/language-context";
import { useDispatch, useSelector } from "react-redux";
import {
  clearModelResponses,
  setEditMessageId,
  toggleModelSelector,
  updateInputMessage,
  addModel,
  removeModel,
  setSelectedModels,
  // triggerFileUploading, // Removed as it's handled in the hook
  startRecorder,
  stopRecorder,
  clearChatState,
  initialSelectedModels,
} from "@/features/chat/store/chat-interface-slice";
import { useCreateMessages } from "@/features/chat/text-chat/hooks/useCreateMessages";
import { useUpdateMessages } from "@/features/chat/text-chat/hooks/useUpdateMessages";
import { useEffect, useState, useRef } from "react";
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
import { ConvCreateRequest } from "../conversation/types/conversationTypes";
import { useFileHandler } from "@/features/chat/hooks/use-file-handler";

export function HomeChatInterface() {
  const {
    editedMessageId,
    showModelSelector,
    selectedModels,
    inputMessage,
    isStreaming,
    triggerSend,
    // uploadingFiles, // usage replaced by hook's state if we want, or keep it if we want to rely on redux
    showRecorder,
    providers,
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

  // Track previous multi-select models to restore them
  const previousMultiModels = useRef<RouteSel[]>([]);
  // Also track previous chat mode to know where we came from
  const previousMode = useRef<ChatMode>("multi");

  // 🔹 File handling
  const { 
    selectedFiles, 
    handleFilesSelected, 
    removeFile, 
    clearFiles,
    uploadAndProcessFiles, 
    isUploading: isHandlingFile 
  } = useFileHandler();

  const [isImageGenSelected, setIsImageGenSelected] = useState(false);
  const [isWebSearchSelected, setIsWebSearchSelected] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>("multi");

  const handleModeChange = (mode: ChatMode) => {
    // Save current selection if we are leaving "multi" mode
    if (chatMode === "multi" && mode !== "multi") {
      // Filter out consensus if it happens to be there (unlikely in multi but possible if manually added)
      const cleanMulti = selectedModels.filter(
        (m: RouteSel) => m.model !== "consensus"
      );
      if (cleanMulti.length > 0) {
        previousMultiModels.current = cleanMulti;
      }
    }

    setChatMode(mode);
    previousMode.current = chatMode;

    if (mode === "single") {
      // Enforce single selection
      if (selectedModels.length > 1) {
        // Keep the first one, disregard others
        const firstModel = selectedModels.find(
          (m: RouteSel) => m.model !== "consensus"
        );
        if (firstModel) {
          dispatch(setSelectedModels([firstModel]));
        } else if (selectedModels.length > 0) {
           // Fallback to first available
          dispatch(setSelectedModels([selectedModels[0]]));
        }
      } else if (selectedModels.length === 0) {
         // If nothing selected, maybe select default?
         dispatch(setSelectedModels([initialSelectedModels[0]]));
      }
    } else if (mode === "multi") {
      // Switching to multi
      // Restore previous models if available, otherwise use defaults
      // But only if we are currently looking at a "single" leftover (or consensus)
      // If the user manually selected multiple while in another mode (shouldn't happen in single), we might respect it?
      // User requirement: "on the multi chat i want to show all the models from my model preferences"
      
      let modelsToRestore = previousMultiModels.current;
      if (modelsToRestore.length === 0) {
        modelsToRestore = initialSelectedModels;
      }

      // Filter out consensus from restoration just in case
      modelsToRestore = modelsToRestore.filter(m => m.model !== "consensus");

      // Apply restoration
      dispatch(setSelectedModels(modelsToRestore));
      
    } else if (mode === "consensus") {
      // Add consensus model if not present
      const isConsensusSelected = selectedModels.some(
        (m: RouteSel) => m.model === "consensus"
      );
      if (!isConsensusSelected) {
        // Find consensus provider
        const consensusProvider = providers.find((p: ModelProvider) =>
          p.models.some((m) => m.id === "consensus")
        );
        if (consensusProvider) {
          dispatch(addModel(consensusProvider, "consensus"));
        } else {
          console.warn("Consensus provider/model not found");
        }
      }
    }
  };

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

  // Removed local file handling functions (handleFilesSelected, removeFile, uploadFiles, processUploadedFiles) as they are now in the hook

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
        const convRequest = new ConvCreateRequest(userMessage.substring(0, 50), activeInterface);
        const newConversation = await createConversation.mutateAsync(convRequest);
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
    const providers = Array.from(new Set(bodyRoutes.map((r: RouteSel) => r.provider))).join(",");

    try {
      let contentItems: ContentItem[] = [];
      // Upload files first (if any)
      if (selectedFiles.length > 0) {
        console.log(`Uploading ${selectedFiles.length} file(s)...`);
        const uploadedContent = await uploadAndProcessFiles(providers);
        console.log("Files uploaded/processed: ", uploadedContent);
        
        if (uploadedContent === null) {
            console.error("Upload failed, aborting message send.");
            setIsAnimating(false);
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
      dispatch(toggleModelSelector(false));
      clearFiles(); // clear files after sending
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
          {/* Chat Mode Selector */}
          <div
            className={`flex justify-center transition-all duration-500 ease-in-out ${
              isAnimating
                ? "opacity-0 h-0 mb-0 overflow-hidden"
                : "opacity-100 mb-4 h-auto"
            }`}
          >
            <ChatModeSelector mode={chatMode} onModeChange={handleModeChange} />
          </div>

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
                <ModelSelector isSingleMode={chatMode === "single"} />
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

          {/* Chip Buttons */}
          <div
            className={`transition-all duration-500 ease-in-out ${
              isAnimating
                ? "opacity-0 h-0 mt-0 overflow-hidden"
                : "opacity-100 mt-3 h-auto"
            }`}
          >
            <ChatActionChips
              isImageGenSelected={isImageGenSelected}
              onToggleImageGen={handleGenerateImageClick}
              isWebSearchSelected={isWebSearchSelected}
              onToggleWebSearch={handleWebSearchClick}
              className="justify-center"
            />
          </div>
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
