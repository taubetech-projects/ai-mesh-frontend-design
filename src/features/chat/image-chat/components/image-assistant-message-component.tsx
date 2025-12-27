import { CopyButtonProps, MessageView } from "@/features/chat/types/models";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Check, Copy } from "lucide-react";

import { ImageGenerationService } from "@/features/chat/image-chat/api/ImageGenerationApi";
// This function can be moved to a utils file later

function CopyButton({ code }: CopyButtonProps) {
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
function formatLLMContent(provider: string, content: string): string {
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

interface ImageAssistantMessageComponentProps {
  message: MessageView;
}

function ImageAssistantMessageComponent({
  message,
}: ImageAssistantMessageComponentProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const imageUrlPath = message.parts?.at(1)?.attachments?.at(0)?.url ?? "";

useEffect(() => {
  if (!imageUrlPath) return;

  let objectUrl: string | null = null;

  const fetchImage = async () => {
    try {
      const imageBlob = await ImageGenerationService.getImageByUrl(imageUrlPath);
      objectUrl = URL.createObjectURL(imageBlob);
      setImageSrc(objectUrl);
    } catch (err) {
      console.error(err);
      setImageError("Could not load image");
    }
  };

  fetchImage();

  return () => {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  };
}, [imageUrlPath]);


  const contentToRender = message.model
    ? formatLLMContent(message.provider, message.parts?.at(0)?.text ?? "")
    : message.parts?.at(0)?.text ?? "";

  return (
    <div className="p-3">
      {imageSrc && (
        <div className="mb-4">
          <img
            src={imageSrc}
            alt="Assistant content"
            className="max-w-full h-auto rounded-lg border border-gray-700"
          />
        </div>
      )}
      {imageError && (
        <div className="mb-4 p-2 text-center text-red-400 bg-red-900/30 rounded-md border border-red-700">
          <p>{imageError}</p>
        </div>
      )}
      <div className="text-xs font-medium mb-1 text-emerald-300">
        {/* Assistant response, no "Question" label */}
      </div>
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
              <td className="border border-gray-600 px-2 py-1">{children}</td>
            ),
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <div style={{ position: "relative" }}>
                  <span className="absolute top-2 left-3 text-xs text-amber-600 select-none">
                    {match[1]}
                  </span>
                  <CopyButton code={String(children).replace(/\n$/, "")} />
                  <SyntaxHighlighter
                    style={tomorrow}
                    language={match[1]}
                    PreTag="div"
                    className="gpt-scrollbar bg-sidebar"
                    customStyle={{
                      overflowX: "auto",
                      paddingTop: "2.5rem",
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
}

export default ImageAssistantMessageComponent;
