"use client";

import { useLanguage } from "@/shared/contexts/language-context";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Check, Copy } from "lucide-react"; // or any icon lib
import { useState } from "react";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { useDispatch, useSelector } from "react-redux";
import {
  ChatAreaProps,
  CopyButtonProps,
  MessagePage,
  MessageView,
  SaveMessageRequest,
} from "@/features/chat/types/models";
import {
  useCreateMessages,
  useGetMessagesByConversationId,
  useUpdateMessages,
} from "@/features/chat/text-chat/hooks/messageHook";
import { fi, se } from "date-fns/locale";
import {
  setEditMessageId,
  triggerParentSend,
  updateInputMessage,
} from "@/features/chat/store/chat-interface-slice";

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

// utils/formatLLMContent.ts
export function formatLLMContent(provider: string, content: string): string {
  if (!content) return "";

  let formatted = content;

  switch (provider?.toLowerCase()) {
    case "anthropic":
      // Convert triple single quotes to code fences
      formatted = formatted.replace(
        /'''(\w+)?\n([\s\S]*?)'''/g,
        "```$1\n$2```"
      );
      break;

    case "gemini":
      // Sometimes Gemini returns incomplete lists or extra spaces, quick fix
      formatted = formatted.replace(/\n-\s+/g, "\n- ");
      break;

    case "perplexity":
      // Citations like [1] or (source)
      // You can later render citations at the bottom if metadata is provided
      break;

    case "grok":
      // If plain text JSON is returned, try to prettify it
      if (formatted.startsWith("{") || formatted.startsWith("[")) {
        try {
          const obj = JSON.parse(formatted);
          formatted = "```json\n" + JSON.stringify(obj, null, 2) + "\n```";
        } catch (_) {}
      }
      break;
  }

  return formatted.trim();
}

const getModelMessages = (
  activeModel: string,
  messagePage?: MessagePage
): MessageView[] => {
  if (!messagePage?.messages?.length) return [];

  const messages = messagePage.messages;
  const result: MessageView[] = [];

  let lastUserMessage: MessageView | undefined;

  for (const msg of messages) {
    if (msg.role === "user") {
      lastUserMessage = msg;
    } else if (
      msg.role === "assistant" &&
      msg.model === activeModel &&
      lastUserMessage
    ) {
      result.push(lastUserMessage, msg);
    }
  }

  return result;
};

const getModelGrouppedMessages = (
  activeModel: string,
  messagePage?: MessagePage
): Map<string, Map<string, MessageView[]>> | {} => {
  if (!messagePage?.messages?.length) return {};

  const result = new Map<string, Map<string, MessageView[]>>();
  let lastUserMsg: MessageView | undefined;

  for (const msg of messagePage.messages) {
    if (msg.role === "user") {
      lastUserMsg = msg;
      continue;
    }
    // Suppose you have model and groupId:
    const model = msg.model;
    const groupId = String(msg.groupId);

    // Only group assistant messages for the active model and only if we have a preceding user
    if (msg.role === "assistant" && msg.model === activeModel && lastUserMsg) {
      if (!result.has(model)) {
        result.set(model, new Map());
      }
      const groupMap = result.get(model)!;

      if (!groupMap.has(groupId)) {
        groupMap.set(groupId, []);
      }
      groupMap.get(groupId)!.push(lastUserMsg, msg);
    }
  }

  return result;
};

export function ChatArea({ activeModel }: ChatAreaProps) {
  const { selectedConvId } = useSelector(
    (store: any) => store.conversationSlice
  );

  const dispatch = useDispatch();

  const handleSetEditMessageId = async (
    messageId?: number,
    editedMessage: string = ""
  ) => {
    if (messageId === undefined) return;
    dispatch(setEditMessageId(messageId));
    // ✅ trigger parent via redux
    dispatch(triggerParentSend());
    dispatch(updateInputMessage(editedMessage));
  };

  const { isPending, data, isError } =
    useGetMessagesByConversationId(selectedConvId);

  const getModelIcon = (modelId: string) => {
    return (
      <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
        <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
          <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
        </div>
      </div>
    );
  };

  const modelMessages = getModelMessages(activeModel, data);
  if (modelMessages === undefined) return null;

  console.log(
    "getModelGrouppedMessages:",
    getModelGrouppedMessages(activeModel, data)
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header 
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
      */}

      {/* Messages */}
      <div
        className="flex-1 p-4 space-y-4 overflow-y-auto overflow-x-auto gpt-scrollbar"
        style={{ minHeight: 0, minWidth: 0 }} // important
      >
        {modelMessages.map((message: MessageView, index: number) => {
          const contentToRender =
            message.role === "assistant" && message.model
              ? formatLLMContent(
                  message.provider,
                  message.parts?.at(0)?.text ?? ""
                )
              : message.parts?.at(0)?.text;
          return (
            <div
              key={index}
              className={`p-3 ${
                message.role === "user" ? "bg-muted rounded-lg border" : ""
              }`}
            >
              {message.role === "user" ? (
                <button
                  onClick={() =>
                    handleSetEditMessageId(
                      message.id,
                      message.parts?.at(0)?.text
                    )
                  }
                  className="inline-flex items-center justify-center w-full px-4 py-1 text-base font-bold leading-6 text-white bg-indigo-600 border border-transparent rounded-full md:w-auto hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                >
                  Edit
                </button>
              ) : (
                ""
              )}
              {/* Label (Question / Answer) */}
              <div
                className={`text-xs font-medium mb-1 ${
                  message.role === "user" ? "text-blue-300" : "text-emerald-300"
                }`}
              >
                {message.role === "user" ? "Question" : ""}
              </div>

              {/* Markdown Rendering */}
              <div className="prose prose-invert max-w-none text-sm leading-relaxed text-primary prose-ul:list-disc prose-ul:pl-5 prose-li:marker:text-blue-400 break-words">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeRaw, rehypeKatex]}
                  components={{
                    ul: ({ children }) => (
                      <ul className="list-disc pl-5 my-2">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-5 my-2">{children}</ol>
                    ),
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold text-primary mt-4 mb-2">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-semibold text-primary mt-3 mb-2">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-semibold text-primary mt-3 mb-1">
                        {children}
                      </h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="text-base font-semibold text-primary mt-2 mb-1">
                        {children}
                      </h4>
                    ),
                    h5: ({ children }) => (
                      <h5 className="text-sm font-semibold text-primary mt-2 mb-1">
                        {children}
                      </h5>
                    ),
                    h6: ({ children }) => (
                      <h6 className="text-xs font-semibold text-gray-300 mt-2 mb-1 uppercase">
                        {children}
                      </h6>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-2">
                        <table className="min-w-full border border-gray-600 text-sm">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="border border-gray-600 px-2 py-1 bg-gray-800 font-semibold">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-gray-600 px-2 py-1">
                        {children}
                      </td>
                    ),
                    code({ inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <div
                          style={{
                            position: "relative",
                          }}
                        >
                          <span className="absolute top-2 left-3 text-xs text-amber-600 select-none">
                            {match[1]}
                          </span>
                          <CopyButton
                            code={String(children).replace(/\n$/, "")}
                          />
                          <SyntaxHighlighter
                            style={tomorrow}
                            language={match[1]}
                            PreTag="div"
                            className="gpt-scrollbar bg-sidebar"
                            customStyle={{
                              overflowX: "auto",
                              paddingTop: "2.5rem", // Make space for controls
                              borderRadius: "0.7rem",
                              fontSize: "0.9rem",
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
                  {contentToRender}
                </ReactMarkdown>
              </div>
            </div>
          );
        })}

        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-2"></div>
      </div>
    </div>
  );
}
