import { MessageView } from "@/types/models";
import React, { useEffect, useState } from "react";
import ImageUserMessageComponent from "./image-user-message-component";
import ImageAssistantMessageComponent from "./image-assistant-message-component";

interface MessageComponentProps {
  messageGroup: MessageView[];
  onDelete: (messageId: number) => void;
}

function ImageMessageComponent({ messageGroup, onDelete }: MessageComponentProps) {
  // split once per render (keep it simple)
  const userMessages = messageGroup.filter((m) => m.role === "user");
  const assistantMessages = messageGroup.filter((m) => m.role === "assistant");

  // index user/assistant pairs by position
  const len = Math.min(userMessages.length, assistantMessages.length);

  // currentVersion = what the user *wants* to see (may be out of bounds after data changes)
  const [currentVersion, setCurrentVersion] = useState(len - 1);

  // clamp at render time so we never go OOB
  const displayedIndex = Math.min(currentVersion, Math.max(0, len - 1));

  if (len === 0) return null;

  const userMessage = userMessages[displayedIndex];
  const assistantMessage = assistantMessages[displayedIndex];
  console.log("userMessage", userMessage);
  console.log("assistantMessage", assistantMessage);


  const handleVersionChange = (direction: "next" | "prev") => {
    if (len === 0) return;
    setCurrentVersion((cv) =>
      direction === "next" ? (cv + 1) % len : (cv - 1 + len) % len
    );
  };

  return (
    <div className="flex flex-col group relative">
      {/* key forces re-mount so children can’t keep the initial props */}
      <ImageUserMessageComponent
        key={`user-${displayedIndex}`}
        message={userMessage}
        onDelete={onDelete}
        messageLength={len}
        handleVersionChange={handleVersionChange}
        currentVersion={displayedIndex}
      />
      <ImageAssistantMessageComponent
        key={`assistant-${displayedIndex}`}
        message={assistantMessage}
      />
    </div>
  );
}

export default ImageMessageComponent;
