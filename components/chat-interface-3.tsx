"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModelColumns } from "@/components/model-columns-2";
import { ModelSelector } from "@/components/model-selector";
import { ChatRequestBody, ContentItem, FileUploadItem, ModelProvider, RouteSel } from "@/types/models";
import { Send, Mic, Paperclip, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useDispatch, useSelector } from "react-redux";
import {
    clearModelResponses,
    setEditMessageId,
    toggleModelSelector,
    updateInputMessage,
} from "@/redux/chat-interface-slice";
import { useCreateMessages, useUpdateMessages } from "@/lib/hooks/messageHook";
import { useEffect, useRef, useState } from "react";
import { API_BASE } from "@/lib/http";

export function ChatInterface() {
    const {
        editedMessageId,
        showModelSelector,
        selectedModels,
        inputMessage,
        isStreaming,
        triggerSend,
    } = useSelector((store: any) => store.chatInterface);
    const { selectedConvId } = useSelector(
        (store: any) => store.conversationSlice
    );
    const dispatch = useDispatch();
    const createMessages = useCreateMessages(selectedConvId);
    const updateMessages = useUpdateMessages(selectedConvId, editedMessageId);

    // 🔹 File handling
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadingFiles, setUploadingFiles] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // 🎤 Audio recording state
    const [showRecorder, setShowRecorder] = useState(false);



    interface UploadApiResponse {
        providers: {
            [provider: string]: FileUploadItem[];
        };
    }

    //Handling Files here

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
            let fileId = "";
            let fileBase64 = "";

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
            if (!isImage && (providerArray.includes("openai"))) {
                const openaiFiles = uploadResponse.providers["openai"];
                if (openaiFiles && openaiFiles[index]) {
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

    const { t } = useLanguage();

    function modeSelection() {
        const model = selectedModels.find(
            (model: RouteSel) => model.model === "consensus"
        );
        return model ? "consensus" : "multi";
    }

    // ✅ React to the trigger
    useEffect(() => {
        handleSendMessage();
    }, [triggerSend]); // fires whenever child toggles triggerSend

    // ---- Send / Stream ----
    const onSend = async (userMessage: string) => {
        if (selectedModels.length === 0) return;
        const bodyRoutes: RouteSel[] = selectedModels
            .filter((model: RouteSel) => model.model !== "consensus")
            .map((model: RouteSel) => ({
                provider: model.provider,
                model: model.model,
            }));
        // console.log("Body Routes: ", bodyRoutes);
        const providers = bodyRoutes
            .map((r: RouteSel) => r.provider)
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
            const chatRequestBody: ChatRequestBody = {
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

            console.log("Final request body:", chatRequestBody);

            // const ac = new AbortController();        // console.log("Selected mode: ", modeSelection());

            // const chatRequestBody: ChatRequestBody = {
            //     mode: modeSelection(),
            //     routes: bodyRoutes.length > 0 ? bodyRoutes : null,
            //     messages: [
            //         {
            //             role: "user",
            //             content: userMessage,
            //         },
            //     ],
            //     stream: true,
            //     provider_response: false,
            // };

            console.log("editedMessageId", editedMessageId)
            console.log("editedMessageId", editedMessageId);
            if (editedMessageId && editedMessageId > 0) {
                await updateMessages.mutateAsync({ messageId: editedMessageId, chatRequestBody });
            } else {
                await createMessages.mutateAsync(chatRequestBody);
            }
            dispatch(setEditMessageId(null));
            dispatch(clearModelResponses());
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }



    const handleSendMessage = () => {
        if (inputMessage !== undefined && inputMessage.trim()) {
            // Handle message sending logic here
            onSend(inputMessage);
            console.log(
                "Sending message:",
                inputMessage,
                "to models:",
                selectedModels
            );
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

    // 🎤 Handle audio recording
    const handleMicClick = () => {
        setShowRecorder(true);
    };

    const handleTranscriptionComplete = (transcription: string) => {
        console.log("Transcription complete:", transcription);
        dispatch(updateInputMessage(transcription));
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-background">
            <div className="flex-1 relative h-full" style={{ minHeight: 0 }}>
                <ModelColumns />
            </div>

            <div className="sticky bottom-0 z-10 p-4 border-t border-border bg-background">
                <div className="max-w-4xl mx-auto">
                    {/* Model Selector */}
                    {showModelSelector && (
                        <div
                            className="mb-4 absolute left-0 right-0 bottom-16 z-20 flex justify-center"
                            style={{ pointerEvents: "auto" }}
                        >
                            <div className="max-w-4xl w-full">
                                <ModelSelector />
                            </div>
                        </div>
                    )}

                    {/* Input Field */}
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

                            {/* 🎤 Microphone button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleMicClick}
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                disabled={uploadingFiles || isStreaming}
                                title="Voice Input"
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
                </div>
            </div>
        </div>
    );
}
