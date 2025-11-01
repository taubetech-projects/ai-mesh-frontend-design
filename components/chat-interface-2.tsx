"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModelColumns } from "@/components/model-columns-2";
import { ModelSelector } from "@/components/model-selector";
import { RouteSel } from "@/types/models";
import { Send, Mic, Paperclip, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { streamChat } from "@/lib/chatApi";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessages,
  concateDelta,
  endStreaming,
  startStreaming,
  toggleModelSelector,
  updateInputMessage,
} from "@/redux/chat-interface-slice";

var count = 0;

export function ChatInterface() {
  const { showModelSelector, selectedModels, inputMessage, isStreaming } =
    useSelector((store: any) => store.chatInterface);
  const dispatch = useDispatch();

  const { t } = useLanguage();

  function modeSelection() {
    const model = selectedModels.find(
      (model: RouteSel) => model.model === "consensus"
    );
    return model ? "consensus" : "multi";
  }

  // ---- Send / Stream ----
  const onSend = async (userMessage: string) => {
    if (selectedModels.length === 0) return;
    // Initialize messages state for each selected model if not already present
    dispatch(addMessages(userMessage));
    // console.log("Messages", messages);
    const bodyRoutes = selectedModels
      .filter((model: RouteSel) => model.model !== "consensus")
      .map((model: RouteSel) => ({
        provider: model.provider,
        model: model.model,
      }));
    // console.log("Body Routes: ", bodyRoutes);
    const ac = new AbortController();
    // console.log("Selected mode: ", modeSelection());

    var body = {
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

    await streamChat(
      body,
      (evt) => {
        const e = evt.event;
        const d = evt.data || {};
        if (e === "chat.response.created") {
          dispatch(startStreaming());
        }
        // console.log(e, d); // You can uncomment this for debugging
        if (e === "chat.response.delta") {
          const modelId = d.model;
          const contentChunk = d.delta.text || "";

          if (!modelId || !contentChunk) return;
          dispatch(concateDelta(modelId, contentChunk));
        }
        if (e === "chat.response.completed") {
          count++;
          if (count === bodyRoutes.length) {
            dispatch(endStreaming());
            count = 0;
          }
        }
        if (e === "consensus") {
          console.log("This is a consensus event", d.delta.text);
          const modelId = "consensus";
          const contentChunk = d.delta.text || "";

          if (!modelId || !contentChunk) return;
          dispatch(concateDelta(modelId, contentChunk));
          // Since consensus is the last event, we can end streaming here
          dispatch(endStreaming());
        }
        // console.log("Messages", messages);
      },
      ac.signal
    ).catch((err) => {
      console.error("SSE error", err);
    });
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
