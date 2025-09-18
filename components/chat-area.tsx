"use client";

import { useLanguage } from "@/contexts/language-context";

interface ChatAreaProps {
  activeModel: string;
}

interface Message {
  type: "question" | "answer";
  content: string;
}

export function ChatArea({ activeModel }: ChatAreaProps) {
  const { t } = useLanguage();

  const getModelDisplayName = (modelId: string) => {
    const modelNames: Record<string, string> = {
      "gpt-4": "GPT-4",
      "claude-3": "Claude 3",
      "gemini-pro": "Gemini Pro",
      "deepseek-chat": "DeepSeek Chat",
      "gpt-3.5-turbo": "GPT-3.5 Turbo",
      "claude-2": "Claude 2",
      "palm-2": "PaLM 2",
      "deepseek-coder": "DeepSeek Coder",
    };
    return modelNames[modelId] || modelId;
  };

  const getModelIcon = (modelId: string) => {
    return (
      <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
        <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
          <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
        </div>
      </div>
    );
  };

  const getModelMessages = (modelId: string): Message[] => {
    const messagesByModel: Record<string, Message[]> = {
      "gpt-4": [
        { type: "question", content: t.chat.whatIsAI },
        { type: "answer", content: t.chat.whatIsAIAnswer },
        { type: "question", content: t.chat.howDoesMLWork },
        { type: "answer", content: t.chat.howDoesMLWorkAnswer },
        { type: "question", content: t.chat.explainQuantum },
        { type: "answer", content: t.chat.explainQuantumAnswer },
      ],
      "claude-3": [
        { type: "question", content: t.chat.whatIsFuture },
        { type: "answer", content: t.chat.whatIsFutureAnswer },
        { type: "question", content: t.chat.howToLearn },
        { type: "answer", content: t.chat.howToLearnAnswer },
        { type: "question", content: t.chat.whatIsClimate },
        { type: "answer", content: t.chat.whatIsClimateAnswer },
      ],
      "gemini-pro": [
        { type: "question", content: t.chat.whatIsAI },
        { type: "answer", content: t.chat.whatIsAIAnswer },
        { type: "question", content: t.chat.explainQuantum },
        { type: "answer", content: t.chat.explainQuantumAnswer },
        { type: "question", content: t.chat.howToLearn },
        { type: "answer", content: t.chat.howToLearnAnswer },
      ],
    };

    return (
      messagesByModel[modelId] || [
        { type: "question", content: t.chat.whatIsAI },
        { type: "answer", content: t.chat.whatIsAIAnswer },
      ]
    );
  };

  const messages = getModelMessages(activeModel);
  const modelDisplayName = getModelDisplayName(activeModel);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-center justify-center py-8 text-center flex-shrink-0">
        {getModelIcon(activeModel)}
        <h2 className="text-xl font-semibold text-foreground mb-2 bg">
          {modelDisplayName}
        </h2>
        <p className="text-muted-foreground mb-1">
          {t.chat.readyToChat} {modelDisplayName}
        </p>
        <p className="text-sm text-muted-foreground">{t.chat.sendMessage}</p>
      </div>

      <div
        className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-hide"
        style={{ minHeight: 0 }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${
              message.type === "question"
                ? "bg-blue-950/50 border-blue-800/50"
                : "bg-emerald-950/50 border-emerald-800/50"
            }`}
          >
            <div
              className={`text-xs font-medium mb-1 ${
                message.type === "question"
                  ? "text-blue-300"
                  : "text-emerald-300"
              }`}
            >
              {message.type === "question" ? "Question" : "Answer"}
            </div>
            <div className="text-sm leading-relaxed text-foreground">
              {message.content}
            </div>
          </div>
        ))}

        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-2"></div>
      </div>
    </div>
  );
}
