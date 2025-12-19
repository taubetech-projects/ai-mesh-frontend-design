"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import type { RouteSel } from "@/types/models";
import { Send, Mic, Paperclip, Settings, Beaker } from "lucide-react";
import { useLanguage } from "@/shared/contexts/language-context";
import { streamChat } from "@/features/chat/api/chatApi";
import { ModelColumns } from "./_model-columns";
import { PlaygroundSettings } from "./playground-setting";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserMessagesWithMessageId,
  addJsonAssistantMessage,
  addJsonAssistantMessageWithMessageId,
  addJsonUserMessages,
  addJsonUserMessagesWithMessageId,
  addMessages,
  concateDelta,
  concateDeltaWithMessageId,
  endStreaming,
  startStreaming,
  toggleModelSelector,
  togglePlaygroundSettings,
  updateInputMessage,
} from "@/redux/playground-interface-slice";

var count = 0;

// --- Message Types ---
type AssistantMsg = {
  role: "assistant";
  content: string;
  meta?: {
    provider: string;
    model: string;
    label?: string;
    latency_ms?: number;
  };
};

type UserMsg = { role: "user"; content: string };
type Message = UserMsg | AssistantMsg;
var messageId = 1;

export function ChatInterface() {
  const {
    selectedModels,
    inputMessage,
    isStreaming,
    showPlaygroundSettings,
    temperature,
    maxTokens,
    outputFormat,
    playgroundIsStreaming,
    providerSpecific,
  } = useSelector((store: any) => store.playgroundInterface);

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
    dispatch(addJsonUserMessages(userMessage));
    dispatch(addUserMessagesWithMessageId(messageId, userMessage));
    dispatch(addJsonUserMessagesWithMessageId(messageId, userMessage));
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

    let body: any;

    const messages = [];
    // if (systemPrompt) {
    //   messages.push({ role: "system", content: systemPrompt });
    // }
    messages.push({ role: "user", content: userMessage });

    body = {
      mode: modeSelection(),
      routes: bodyRoutes.length > 0 ? bodyRoutes : null,
      messages: messages,
      stream: playgroundIsStreaming,
      provider_response: providerSpecific,
      temperature: parseFloat(temperature),
      max_tokens: parseInt(maxTokens, 10),
      // reasoning_effort: reasoningEffort,
    };

    console.log("Request Body: ", body);
    console.log("Output Format :", outputFormat);

    await streamChat(
      body,
      (evt) => {
        const e = evt.event;
        const d = evt.data || {};
        if (e === "chat.response.created") {
          const modelId = d.model;
          if (!modelId || !d) return;
          dispatch(addJsonAssistantMessage(modelId, d));
          dispatch(addJsonAssistantMessageWithMessageId(modelId, messageId, d));
          dispatch(startStreaming());
        }
        console.log("Event Name :", e); // You can uncomment this for debugging
        console.log("Event Data :", d);

        if (e === "chat.response.delta") {
          const modelId = d.model;
          if (!modelId || !d) return;
          dispatch(addJsonAssistantMessage(modelId, d));
          dispatch(addJsonAssistantMessageWithMessageId(modelId, messageId, d));
          const contentChunk = d.delta.text || "";
          if (!modelId || !contentChunk) return;
          dispatch(concateDelta(modelId, contentChunk));
          dispatch(concateDeltaWithMessageId(modelId, messageId, contentChunk));
        }
        if (e === "chat.response.completed") {
          const modelId = d.model;
          if (!modelId || !d) return;
          dispatch(addJsonAssistantMessageWithMessageId(modelId, messageId, d));
          count++;
          if (count === bodyRoutes.length) {
            dispatch(endStreaming());
            count = 0;
            messageId++;
            console.log("Message ID: ", messageId);
          }
          dispatch(addJsonAssistantMessage(modelId, d));
        }
        if (e === "consensus") {
          console.log("This is a consensus event", d.delta.text);
          const modelId = "consensus";
          const contentChunk = d.delta.text || "";

          if (!modelId || !contentChunk) return;
          dispatch(concateDelta(modelId, contentChunk));
          dispatch(addJsonAssistantMessage(modelId, d));
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
    if (inputMessage.trim()) {
      // Handle message sending logic here
      onSend(inputMessage);
      console.log(
        "Sending message:",
        inputMessage,
        "to models:",
        selectedModels
      );
      // setInputMessage("");
      dispatch(updateInputMessage(""));
      dispatch(toggleModelSelector(false));
      dispatch(togglePlaygroundSettings(false));
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
        <ModelColumns outputFormat={outputFormat} />
      </div>

      <div className="sticky bottom-0 z-10 p-4 border-t border-border bg-background">
        <div className="max-w-4xl mx-auto">
          {/* Playground Settings */}
          {showPlaygroundSettings && (
            <div
              className="mb-4 absolute left-0 right-0 bottom-16 z-20 flex justify-center"
              style={{ pointerEvents: "auto" }}
            >
              <div className="max-w-4xl w-full">
                <PlaygroundSettings />
              </div>
            </div>
          )}

          {/* Input Field */}
          <div className="relative">
            <Input
              value={inputMessage}
              // onChange={(e) => setInputMessage(e.target.value)}
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
                  dispatch(togglePlaygroundSettings(!showPlaygroundSettings))
                }
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Playground Settings"
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
                disabled={!inputMessage.trim() || isStreaming}
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
