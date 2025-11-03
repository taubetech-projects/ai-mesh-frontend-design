"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModelColumns } from "@/components/model-columns-2";
import { ModelSelector } from "@/components/model-selector";
import { ChatRequestBody, RouteSel } from "@/types/models";
import { Send, Mic, Paperclip, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useDispatch, useSelector } from "react-redux";
import {
  clearModelResponses,
  setEditMessageId,
  toggleModelSelector,
  updateInputMessage,
} from "@/redux/chat-interface-slice";
import { useCreateMessages, useUpdateMessages } from "@/lib/hooks/messageHook";
import { useEffect } from "react";

export function ChatInterface() {
  const {
    messageId,
    showModelSelector,
    selectedModels,
    inputMessage,
    isStreaming,
    triggerSend,
  } = useSelector((store: any) => store.chatInterface);
  const { selectedConvId } = useSelector(
    (store: any) => store.conversationSlice
  );
  const dispatch = useDispatch();
  const createMessages = useCreateMessages(selectedConvId);
  const updateMessages = useUpdateMessages(selectedConvId, messageId);

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
    const bodyRoutes: RouteSel[] = selectedModels
      .filter((model: RouteSel) => model.model !== "consensus")
      .map((model: RouteSel) => ({
        provider: model.provider,
        model: model.model,
      }));
    // console.log("Body Routes: ", bodyRoutes);
    const ac = new AbortController();
    // console.log("Selected mode: ", modeSelection());

    const chatRequestBody: ChatRequestBody = {
      mode: modeSelection(),
      routes: bodyRoutes.length > 0 ? bodyRoutes : null,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
      stream: true,
      provider_response: false,
    };

    messageId && messageId > 0
      ? await updateMessages.mutateAsync(chatRequestBody)
      : await createMessages.mutateAsync(chatRequestBody);
    dispatch(setEditMessageId(null));
    dispatch(clearModelResponses());
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

          {/* Input Field */}
          <div className="relative">
            <Input
              value={inputMessage}
              onChange={(e) => dispatch(updateInputMessage(e.target.value))}
              onKeyPress={handleKeyPress}
              placeholder={t.chat.askAnything}
              className="pr-32 py-3 text-base bg-muted border-border text-primary placeholder:text-muted-foreground"
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

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Mic className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleSendMessage}
                size="icon"
                className="h-8 w-8 bg-teal-500 hover:bg-teal-600 text-white"
                disabled={
                  (inputMessage !== undefined && !inputMessage.trim()) ||
                  isStreaming
                }
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
