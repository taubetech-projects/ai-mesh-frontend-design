import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Send,
  Mic,
  Paperclip,
  Settings,
  X,
  File as FileIcon,
  FileImage,
  FileText,
  FileAudio,
  FileVideo,
} from "lucide-react";
import { useRef, useState } from "react";
import { ChatActionChips } from "./chat-action-chips";

interface ChatInputAreaProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isStreaming?: boolean;
  isUploading?: boolean;
  selectedFiles?: File[];
  onFilesSelected?: (files: File[]) => void;
  onFileRemove?: (index: number) => void;
  showModelSelector?: boolean;
  onToggleModelSelector?: () => void;
  onStartRecording?: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function ChatInputArea({
  value,
  onChange,
  onSend,
  isStreaming = false,
  isUploading = false,
  selectedFiles = [],
  onFilesSelected,
  onFileRemove,
  showModelSelector,
  onToggleModelSelector,
  onStartRecording,
  placeholder = "Type a message...",
  className = "",
  disabled = false,
}: ChatInputAreaProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) {
        onSend();
      }
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (onFilesSelected) {
      onFilesSelected(files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/"))
      return (
        <FileImage className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      );
    if (fileType.startsWith("audio/"))
      return (
        <FileAudio className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      );
    if (fileType.startsWith("video/"))
      return (
        <FileVideo className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      );
    if (fileType === "application/pdf")
      return (
        <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      );
    return <FileIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Show selected files with preview */}
      {selectedFiles.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md text-sm"
            >
              {isUploading ? (
                <div className="w-4 h-4 border-2 border-primary/50 border-t-primary rounded-full animate-spin flex-shrink-0" />
              ) : (
                getFileIcon(file.type)
              )}
              <span className="text-foreground truncate max-w-[200px]">
                {file.name}
              </span>
              {onFileRemove && (
                <button
                  onClick={() => onFileRemove(index)}
                  className="text-muted-foreground hover:text-foreground"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="pr-32 h-16 py-4 pl-6 text-lg rounded-3xl bg-muted/80 border-border/50 backdrop-blur-xl text-primary placeholder:text-muted-foreground shadow-lg focus-visible:ring-1 focus-visible:ring-ring transition-all"
          disabled={disabled || isUploading || isStreaming}
        />

        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {onToggleModelSelector && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleModelSelector}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              title="Select Models"
            >
              <Settings className="w-4 h-4" />
            </Button>
          )}

          {onFilesSelected && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFileButtonClick}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              title="Attach Files"
              disabled={disabled || isUploading || isStreaming}
            >
              <Paperclip className="w-4 h-4" />
              {selectedFiles.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {selectedFiles.length}
                </span>
              )}
            </Button>
          )}

          {onStartRecording && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onStartRecording}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              disabled={disabled || isUploading || isStreaming}
              title="Voice Input"
            >
              <Mic className="w-4 h-4" />
            </Button>
          )}

          <Button
            onClick={onSend}
            size="icon"
            className="h-8 w-8 bg-teal-500 hover:bg-teal-600 text-white"
            disabled={
              disabled ||
              (value !== undefined && !value.trim()) ||
              isStreaming ||
              isUploading
            }
          >
            {isUploading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}