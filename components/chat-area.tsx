"use client";

import { useLanguage } from "@/contexts/language-context";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Check, Copy } from "lucide-react"; // or any icon lib
import { useState } from "react";

interface ChatAreaProps {
  activeModel: string;
  messages: Record<string, Message[]>;
}

interface CopyButtonProps {
  code: string;
}

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

interface Message2 {
  type: "question" | "answer";
  content: string;
}

interface MessageType {
  role: "user" | "assistant";
  content: string;
}

export function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1 rounded-md bg-white/10 hover:bg-white/20 transition"
      title="Copy code"
    >
      {copied ? (
        <Check size={16} className="text-green-400" />
      ) : (
        <Copy size={16} className="text-white" />
      )}
    </button>
  );
}

export function ChatArea({ activeModel, messages }: ChatAreaProps) {
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
      "gemini-2.5-flash-lite": "Gemini-2.5 Flash",
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

  const modelMessages = messages[activeModel];
  const modelDisplayName = getModelDisplayName(activeModel);
  console.log("Model Messages: ", modelMessages);

  if (modelMessages === undefined) return null;

  return (
    <div className="flex flex-col h-full ">
      {/* Header */}
      <div className="flex flex-col items-center justify-center py-8 text-center flex-shrink-0">
        {getModelIcon(activeModel)}
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {modelDisplayName}
        </h2>
        <p className="text-muted-foreground mb-1">
          {t.chat.readyToChat} {modelDisplayName}
        </p>
        <p className="text-sm text-muted-foreground">{t.chat.sendMessage}</p>
      </div>

      {/* Messages */}
      <div
        className="flex-1 p-4 space-y-4 overflow-y-auto overflow-x-auto scrollbar-hide"
        style={{ minHeight: 0 }}
      >
        {modelMessages.map((message: Message, index: number) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${message.role === "user"
              ? "bg-blue-950/50 border-blue-800/50"
              : "bg-emerald-950/50 border-emerald-800/50"
              }`}
          >
            {/* Label (Question / Answer) */}
            <div
              className={`text-xs font-medium mb-1 ${message.role === "user" ? "text-blue-300" : "text-emerald-300"
                }`}
            >
              {message.role === "user" ? "Question" : "Answer"}
            </div>

            {/* Markdown Rendering */}
            <div className="prose prose-invert max-w-none text-sm leading-relaxed text-white/90 prose-ul:list-disc prose-ul:pl-5 prose-li:marker:text-blue-400 break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  ul: ({ children }) => <ul className="list-disc pl-5 my-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 my-2">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  code({
                    inline,
                    className,
                    children,
                    ...props
                  }: React.HTMLAttributes<HTMLElement> & { inline?: boolean; children?: React.ReactNode }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <div style={{ position: "relative" }}>
                        <CopyButton code={String(children).replace(/\n$/, "")} />
                        <SyntaxHighlighter
                          style={tomorrow}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            overflowX: "auto",
                          }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-2"></div>
      </div>
    </div>
  );
}
