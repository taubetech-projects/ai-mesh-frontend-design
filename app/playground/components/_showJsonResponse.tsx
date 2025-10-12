"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ArrowDown } from "lucide-react"; // or any icon lib
import JSONPretty from "react-json-pretty";

interface JsonAreaProps {
  jsonModelMessages: any[];
}
export function ChatAreaJsonResponse({ jsonModelMessages }: JsonAreaProps) {
  const [expandedJsonIndex, setExpandedJsonIndex] = useState<number | null>(
    null
  );
  const handleTypeClick = (index: number) => {
    setExpandedJsonIndex(expandedJsonIndex === index ? null : index);
  };

  console.log("Json model message: ", jsonModelMessages);

  if (jsonModelMessages && jsonModelMessages.length > 0) {
    return (
      <div className="p-4 space-y-4">
        <div className=" overflow-hidden">
          {jsonModelMessages.map((msg, index) => {
            const isExpanded = expandedJsonIndex === index;
            return (
              <>
                <div key={index} className="bg-muted">
                  {msg.role === "user" && (
                    <div className="rounded-lg border p-3">
                      <div className="text-xs font-medium mb-1 text-blue-300">
                        Question
                      </div>
                      <div className="text-sm text-primary">{msg.content}</div>
                    </div>
                  )}{" "}
                </div>

                {msg.role === "user" && <div className="mt-10"> </div>}
                <div
                  key={index}
                  className="border-b border-foreground/10 last:border-b-0"
                >
                  {msg.role === "assistant" && (
                    <button
                      onClick={() => handleTypeClick(index)}
                      className="flex items-center justify-between w-full p-3 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-muted-foreground/20 p-1.5 rounded-md">
                          <ArrowDown className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm p-1.5 rounded-md text-stream-front">
                          {msg?.content?.type || "N/A"}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                  )}
                  {isExpanded && (
                    <div className="px-3 pb-3 text-sm">
                      <JSONPretty
                        id={`json-pretty-${index}`}
                        json={msg.content}
                      />
                    </div>
                  )}
                </div>
              </>
            );
          })}
        </div>
      </div>
    );
  }
}
