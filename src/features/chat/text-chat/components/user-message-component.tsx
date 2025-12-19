import { MessageView } from "@/types/models";
import React, { use, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Edit,
  Copy,
  Trash2,
  File,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import {
  setEditMessageId,
  triggerParentSend,
  updateInputMessage,
} from "@/redux/chat-interface-slice";

interface UserMessageProps {
  message: MessageView;
  onDelete: (messageId: number) => void;
  messageLength: number;
  handleVersionChange: (direction: "next" | "prev") => void;
  currentVersion: number;
}

function UserMessageComponent({
  message,
  onDelete,
  messageLength,
  handleVersionChange,
  currentVersion,
}: UserMessageProps) {
  const dispatch = useDispatch();
  if (!message) return null;
  // const [currentVersion, setCurrentVersion] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const originalText =
    message.parts?.find((p) => p.type === "text")?.text ?? "";
  const [editedText, setEditedText] = useState(originalText);

  const handleSetEditMessageId = async (
    messageId?: number,
    editedMessage: string = ""
  ) => {
    if (messageId === undefined) return;
    console.log("messageId", messageId);
    console.log("editedMessage", editedMessage);
    dispatch(setEditMessageId(messageId));
    // ✅ trigger parent via redux
    dispatch(triggerParentSend());
    dispatch(updateInputMessage(editedMessage));
  };

  const handleCopyMessage = async (message: MessageView) => {
    const textContent =
      message.parts?.find((p) => p.type === "text")?.text ?? "";
    if (textContent) {
      try {
        await navigator.clipboard.writeText(textContent);
        // You could add a toast notification here for user feedback
      } catch (err) {
        console.error("Failed to copy message:", err);
      }
    }
  };

  const handleSave = () => {
    if (message.id) {
      handleSetEditMessageId(message.id, editedText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedText(originalText); // Revert changes
  };

  return (
    <div className="flex flex-col group relative">
      <div className="flex flex-wrap gap-2 mb-2 self-end">
        {message.parts?.map((part, partIndex) => {
          if (part.type === "image" || part.type === "file") {
            return (
              <div
                key={part.seq ?? partIndex}
                className="flex items-center gap-2 px-2 py-1 bg-background border rounded-md text-xs"
              >
                {part.type === "image" ? (
                  <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
                ) : (
                  <File className="w-3.5 h-3.5 text-muted-foreground" />
                )}
                <span className="text-muted-foreground truncate max-w-[150px]">
                  {part.mimeType || part.type}
                </span>
              </div>
            );
          }
          return null;
        })}
      </div>

      {isEditing ? (
        <div className="mb-2">
          <Input
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="bg-background mb-2"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Send
            </Button>
          </div>
        </div>
      ) : (
        <div className="prose prose-invert max-w-none text-sm leading-relaxed text-primary break-words mb-2 bg-muted px-3 py-4 rounded min-h-[60px]">
          <p className="prose dark:prose-invert">{originalText}</p>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2 self-end">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
          title="Edit"
          onClick={() => setIsEditing(true)}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
          title="Copy"
          onClick={() => handleCopyMessage(message)}
        >
          <Copy className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-destructive hover:bg-destructive/20 hover:text-destructive"
          title="Delete"
          onClick={() => onDelete(message.id ?? 0)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        {messageLength > 1 && (
          <>
            <div className="border-l h-4 mx-1 border-border"></div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              title="Previous Version"
              onClick={() => handleVersionChange("prev")}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs text-muted-foreground font-mono">
              {currentVersion + 1}/{messageLength}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              title="Next Version"
              onClick={() => handleVersionChange("next")}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default UserMessageComponent;
