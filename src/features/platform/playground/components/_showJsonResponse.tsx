"use client";

import { Fragment, useState } from "react";
import { ChevronDown, ChevronUp, ArrowDown, Check, Copy } from "lucide-react"; // or any icon lib
import JSONPretty from "react-json-pretty";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

interface JsonAreaProps {
  activeModel: string;
}
export function ChatAreaJsonResponse({ activeModel }: JsonAreaProps) {
  const { textMessagesWithMsgId, jsonMessagesWithMsgId } = useSelector(
    (store: RootState) => store.playgroundSlice
  );

  const [expandedJsonIndex, setExpandedJsonIndex] = useState<number | null>(0);
  const [messageId, setMessageId] = useState<number | null>(0);
  const [outputType, setOutputType] = useState<string | null>("json");
  const handleTypeClick = (index: number) => {
    setExpandedJsonIndex(expandedJsonIndex === index ? null : index);
  };
  const handleToggleMessage = (messageId: string) => {
    setMessageId(Number(messageId));
    setOutputType(outputType === "json" ? "text" : "json");
  };

  const modelTextMessagesWithMsgId = textMessagesWithMsgId[activeModel];
  const modeljsonMessagesWithMsgId = jsonMessagesWithMsgId[activeModel];

  if (
    modeljsonMessagesWithMsgId &&
    Object.keys(modeljsonMessagesWithMsgId).length > 0
  ) {
    console.log("modelMessagesWithConvId", modelTextMessagesWithMsgId);

    return (
      <div className="p-4 space-y-4">
        <div className=" overflow-hidden">
          {Object.entries(modeljsonMessagesWithMsgId).map(
            ([msgId, messages]) => (
              <>
                {Number(msgId) === messageId && outputType === "text" && (
                  <>
                    <div>
                      <div className="rounded-lg border p-3 mb-4 bg-muted">
                        <div className="text-xs font-medium mb-1 text-blue-300">
                          Question
                        </div>
                        <div className="text-sm text-primary">
                          {modelTextMessagesWithMsgId[Number(msgId)][0].content}
                        </div>
                      </div>
                      <div className="text font-medium mb-1 text-blue-300">
                        {modelTextMessagesWithMsgId[Number(msgId)][1].content}
                      </div>
                    </div>
                  </>
                )}
                <div className="flex justify-end">
                  <button
                    className="bg-amber-300 rounded-lg border p-2 cursor-pointer text-sm text-primary"
                    onClick={() => handleToggleMessage(msgId)}
                  >
                    {outputType === "json" ? "Text" : "JSON"}
                  </button>
                </div>
                {(messageId !== Number(msgId) || outputType === "json") && (
                  <div key={msgId} className="mb-8">
                    {(messages as any[]).map((msg, index) => {
                      const isExpanded = expandedJsonIndex === index;
                      const uniqueKey = `${msgId}-${index}`;
                      return (
                        <Fragment key={uniqueKey}>
                          {msg.role === "user" && (
                            <div className="rounded-lg border p-3 mb-4 bg-muted">
                              <div className="text-xs font-medium mb-1 text-blue-300">
                                Question
                              </div>
                              <div className="text-sm text-primary">
                                {msg.content}
                              </div>
                            </div>
                          )}

                          {msg.role === "assistant" && (
                            <div className="border-b border-foreground/10 last:border-b-0">
                              <button
                                onClick={() => handleTypeClick(index)}
                                className="flex items-center justify-between w-full p-3 text-left"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="bg-muted-foreground/20 p-1.5 rounded-md">
                                    <ArrowDown className="w-4 h-4 text-muted-foreground" />
                                  </div>
                                  <span className="text-sm p-1.5 rounded-md text-stream-front">
                                    {msg?.content?.type || "N/A"}{" "}
                                  </span>
                                </div>
                                {isExpanded ? (
                                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                )}
                              </button>
                              {isExpanded && (
                                <div className="px-3 pb-3 text-sm">
                                  <JSONPretty
                                    id={`json-pretty-${uniqueKey}`}
                                    json={msg.content}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </Fragment>
                      );
                    })}
                  </div>
                )}
              </>
            )
          )}
        </div>
      </div>
    );
  }
}
