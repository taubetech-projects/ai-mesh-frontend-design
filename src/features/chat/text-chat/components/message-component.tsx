import { MessageView } from "@/features/chat/types/models";
import React, { useMemo, useState } from "react";
import AssistantMessageComponent from "./assistant-message-component";
import UserMessageComponent from "./user-message-component";

interface MessageComponentProps {
  messageGroup: MessageView[];
  onDelete: (messageId: number) => void;
}

function MessageComponent({ messageGroup, onDelete }: MessageComponentProps) {
  const userMessages = useMemo(
    () => messageGroup.filter((m) => m.role === "user"),
    [messageGroup]
  );
  const assistantMessages = useMemo(
    () => messageGroup.filter((m) => m.role === "assistant"),
    [messageGroup]
  );

  const len = Math.min(userMessages.length, assistantMessages.length);
  if (len === 0) return null;

  // 0 = latest, 1 = one step back, ...
  const [offsetFromLatest, setOffsetFromLatest] = useState(0);

  // keep offset always valid even if len changes
  const safeOffset = ((offsetFromLatest % len) + len) % len;

  // displayedIndex is derived from len => when len grows and safeOffset=0, it becomes the new last index automatically
  const displayedIndex = (len - 1 - safeOffset + len) % len;

  const userMessage = userMessages[displayedIndex];
  const assistantMessage = assistantMessages[displayedIndex];

  const handleVersionChange = (direction: "next" | "prev") => {
    setOffsetFromLatest((o) => {
      const next = direction === "prev" ? o + 1 : o - 1; // prev = older, next = newer
      return ((next % len) + len) % len;
    });
  };

  return (
    <div className="flex flex-col group relative">
      <UserMessageComponent
        key={`user-${displayedIndex}`}
        message={userMessage}
        onDelete={onDelete}
        messageLength={len}
        handleVersionChange={handleVersionChange}
        currentVersion={displayedIndex}
      />
      <AssistantMessageComponent
        key={`assistant-${displayedIndex}`}
        message={assistantMessage}
      />
    </div>
  );
}

export default MessageComponent;
