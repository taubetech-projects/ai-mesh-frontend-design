"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModelColumns } from "@/components/model-columns";
import { ModelSelector } from "@/components/model-selector";
import { ModelProvider, RouteSel } from "@/types/models";
import { Send, Mic, Paperclip, Settings, X } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { streamChat } from "@/lib/chatApi";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessages,
  concateDelta,
  endStreaming,
  startStreaming,
  toggleModelSelector,
  updateInputMessage,
} from "@/redux/chat-interface-slice";
import { API_BASE } from "@/lib/http";

var count = 0;

export function ChatInterface() {
  const { showModelSelector, selectedModels, inputMessage, isStreaming } =
    useSelector((store: any) => store.chatInterface);
  const dispatch = useDispatch();
  const { t } = useLanguage();

  // 🔹 File handling
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  type ContentItem =
    | { type: "input_text"; text: string }
    | { type: "input_image"; image_url: string; image_analyzed_text: string }
    | { type: "input_file"; file_id: string;file_base64: string ;file_analyzed_text: string };

  interface Message {
    role: "user" | "assistant";
    content: ContentItem[] | string;
  }

  interface FileUploadItem {
    type: "application/pdf" | "image/png" | "image/jpeg" | string;
    filename: string;
    output: string;
  }

  interface UploadApiResponse {
    providers: {
      [provider: string]: FileUploadItem[];
    };
  }



  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setSelectedFiles((prev) => [...prev, ...files]);
    console.log("Selected files:", files);

    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove a specific file
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload files function
  const uploadFiles = async (files: File[], providers: string): Promise<UploadApiResponse | null> => {
    if (files.length === 0) return null;

    console.log("Uploading files to providers:", providers);
    setUploadingFiles(true);

    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("providers", providers);

      console.log("Uploading files:", Array.from(formData.entries()));

      const response = await fetch(`${API_BASE}/v1/upload`, {
        method: "POST",
        headers: {
          Authorization:
            "Bearer amk_live_dev_1f3b2c9a.$2a$12$d6rQGxp8lQo1TyhdR4Qq7uPb4knRJhLKF47pea4j0ilI/TS1HarHS",
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed:", errorText);
        throw new Error(`File upload failed: ${response.status} ${response.statusText}`);
      }

      const uploadResponse: UploadApiResponse = await response.json();
      console.log("Upload response:", uploadResponse);
      return uploadResponse;
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    } finally {
      setUploadingFiles(false);
    }
  };

  const isImageFile = (file: File): boolean => {
    const imageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    return imageTypes.includes(file.type);
  };

  const processUploadedFiles = (
    uploadResponse: UploadApiResponse,
    providers: string
  ): ContentItem[] => {
    // Extract providers array from comma-separated string
    const providerArray = providers.split(",").map((p) => p.trim());

    // Get the first provider (or use consensus if available)
    const firstProvider = providerArray[0];
    const baseFileItems = uploadResponse.providers[firstProvider];

    if (!baseFileItems || baseFileItems.length === 0) {
      return [];
    }

    const contentItems: ContentItem[] = baseFileItems.map((baseItem, index) => {
      const isImage = baseItem.type.includes("image");

      let imageAnalyzedText = "";
      let fileAnalyzedText = "";
      let fileId="";
      let fileBase64="";

      if (isImage && (providerArray.includes("deepseek") || providerArray.includes("ollama"))) {
        // Prefer deepseek's output, fallback to ollama's if deepseek is not present.
        const deepseekFiles = uploadResponse.providers["deepseek"];
        const ollamaFiles = uploadResponse.providers["ollama"];

        if (deepseekFiles && deepseekFiles[index]) {
          imageAnalyzedText = deepseekFiles[index].output;
        } else if (ollamaFiles && ollamaFiles[index]) {
          imageAnalyzedText = ollamaFiles[index].output;
        }
      }
      if(!isImage && (providerArray.includes("openai"))){
        const openaiFiles = uploadResponse.providers["openai"];
        if(openaiFiles && openaiFiles[index]){
          fileId = openaiFiles[index].output;
        }
      }

      if (!isImage && (providerArray.includes("deepseek") || providerArray.includes("ollama") || providerArray.includes("grok"))) {
        // Prefer deepseek, then grok,  then ollama.
        const deepseekFiles = uploadResponse.providers["deepseek"];
        const grokFiles = uploadResponse.providers["grok"];
        const ollamaFiles = uploadResponse.providers["ollama"];

        if (deepseekFiles && deepseekFiles[index]) {
          fileAnalyzedText = deepseekFiles[index].output;
        } else if (grokFiles && grokFiles[index]) {
          fileAnalyzedText = grokFiles[index].output;
        } else if (ollamaFiles && ollamaFiles[index]) {
          fileAnalyzedText = ollamaFiles[index].output;
        }
      }

      if (!isImage && (providerArray.includes("anthropic") || providerArray.includes("gemini") || providerArray.includes("perplexity"))) {
        const anthropicFiles = uploadResponse.providers["anthropic"];
        const geminiFiles = uploadResponse.providers["gemini"];
        const perplexityFiles = uploadResponse.providers["perplexity"];

        if (anthropicFiles && anthropicFiles[index]) {
          fileBase64 = anthropicFiles[index].output;
        } else if (geminiFiles && geminiFiles[index]) {
          fileBase64 = geminiFiles[index].output;
        } else if (perplexityFiles && perplexityFiles[index]) {
          fileBase64 = perplexityFiles[index].output;
        }
      }

      if (isImage) {
        return {
          type: "input_image",
          image_url: baseItem.output,
          image_analyzed_text: imageAnalyzedText,
        };
      } else {
        return {
          type: "input_file",
          file_id: fileId,
          file_analyzed_text: fileAnalyzedText,
          file_base64: fileBase64
        };
      }
    });

    return contentItems;
  };


  // ---- Send / Stream ----
  const onSend = async (userMessage: string) => {
    if (selectedModels.length === 0) {
      console.warn("No models selected");
      return;
    }

    dispatch(addMessages(userMessage));

    const bodyRoutes = selectedModels
      .filter((model: RouteSel) => model.model !== "consensus")
      .map((model: RouteSel) => ({
        provider: model.provider,
        model: model.model,
      }));

    const providers = bodyRoutes
      .map((r: { provider: ModelProvider }) => r.provider)
      .join(",");

    let uploadResponse = null;

    try {
      let contentItems: ContentItem[] = [];
      // Upload files first (if any)
      if (selectedFiles.length > 0) {
        console.log(`Uploading ${selectedFiles.length} file(s)...`);
        uploadResponse = await uploadFiles(selectedFiles, providers);
        console.log("Files uploaded successfully:", uploadResponse);

        if (uploadResponse) {
          const uploadedContent = processUploadedFiles(
            uploadResponse,
            providers
          );
          contentItems.push(...uploadedContent);
          console.log("Processed uploaded files:", uploadedContent);
        } else {
          console.warn("Upload failed, continuing without files");
        }
      }

      // Step 3: Add user message text
      contentItems.push({
        type: "input_text",
        text: userMessage,
      });

      // Step 4: Prepare main API body
      const body = {
        mode: modeSelection(),
        routes: bodyRoutes.length > 0 ? bodyRoutes : null,
        messages: [
          {
            role: "user",
            content: contentItems,
          },
        ],
        stream: true,
        provider_response: false,
      };

      console.log("Final request body:", body);

      // Prepare main API body
      // const body = {
      //   mode: modeSelection(),
      //   routes: bodyRoutes.length > 0 ? bodyRoutes : null,
      //   messages: [
      //     {
      //       role: "user",
      //       content: userMessage,
      //       // Optionally include file references here if needed
      //       // ...(uploadResponse && { files: uploadResponse }),
      //     },
      //   ],
      //   stream: true,
      //   provider_response: false,
      // };

      const ac = new AbortController();

      // Call main API
      await streamChat(
        body,
        (evt) => {
          const e = evt.event;
          const d = evt.data || {};

          if (e === "chat.response.created") {
            dispatch(startStreaming());
          }

          if (e === "chat.response.delta") {
            const modelId = d.model;
            const contentChunk = d.delta.text || "";
            if (!modelId || !contentChunk) return;
            dispatch(concateDelta(modelId, contentChunk));
          }

          if (e === "chat.response.completed") {
            count++;
            if (count === bodyRoutes.length) {
              dispatch(endStreaming());
              count = 0;
            }
          }

          if (e === "consensus") {
            const modelId = "consensus";
            const contentChunk = d.delta.text || "";
            if (!modelId || !contentChunk) return;
            dispatch(concateDelta(modelId, contentChunk));
            dispatch(endStreaming());
          }
        },
        ac.signal
      );
    } catch (err) {
      console.error("Error while sending message:", err);
      // Optionally show error to user
      alert("Failed to send message. Please check console for details.");
    }
  };

  const modeSelection = () => {
    const model = selectedModels.find(
      (model: RouteSel) => model.model === "consensus"
    );
    return model ? "consensus" : "multi";
  };

  const handleSendMessage = () => {
    if (inputMessage !== undefined && inputMessage.trim()) {
      onSend(inputMessage);
      console.log("Sending message:", inputMessage, "Files:", selectedFiles);
      dispatch(updateInputMessage(""));
      dispatch(toggleModelSelector(false));
      setSelectedFiles([]); // clear files after sending
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <div className="flex-1 relative h-full" style={{ minHeight: 0 }}>
        <ModelColumns />
      </div>

      <div className="sticky bottom-0 z-10 p-4 border-t border-border bg-background">
        <div className="max-w-4xl mx-auto">
          {showModelSelector && (
            <div className="mb-4 absolute left-0 right-0 bottom-16 z-20 flex justify-center">
              <div className="max-w-4xl w-full">
                <ModelSelector />
              </div>
            </div>
          )}

          {/* Show selected files with preview */}
          {selectedFiles.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md text-sm"
                >
                  <span className="text-muted-foreground truncate max-w-[200px]">
                    {file.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-muted-foreground hover:text-foreground"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative">
            <Input
              value={inputMessage}
              onChange={(e) => dispatch(updateInputMessage(e.target.value))}
              onKeyPress={handleKeyPress}
              placeholder={t.chat.askAnything}
              className="pr-32 py-3 text-base bg-muted border-border text-primary placeholder:text-muted-foreground"
              disabled={uploadingFiles || isStreaming}
            />

            {/* Hidden file input */}
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
            />

            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  dispatch(toggleModelSelector(!showModelSelector))
                }
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Select Models"
                disabled={uploadingFiles || isStreaming}
              >
                <Settings className="w-4 h-4" />
              </Button>

              {/* 📎 File upload button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFileButtonClick}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Attach Files"
                disabled={uploadingFiles || isStreaming}
              >
                <Paperclip className="w-4 h-4" />
                {selectedFiles.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {selectedFiles.length}
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                disabled={uploadingFiles || isStreaming}
              >
                <Mic className="w-4 h-4" />
              </Button>

              <Button
                onClick={handleSendMessage}
                size="icon"
                className="h-8 w-8 bg-teal-500 hover:bg-teal-600 text-white"
                disabled={
                  (inputMessage !== undefined && !inputMessage.trim()) ||
                  isStreaming ||
                  uploadingFiles
                }
              >
                {uploadingFiles ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Upload status */}
          {uploadingFiles && (
            <div className="mt-2 text-sm text-muted-foreground">
              Uploading files...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}