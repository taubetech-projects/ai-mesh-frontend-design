import { useState } from "react";
import { toast } from "sonner";
import { API_BASE } from "@/lib/api/http";
import { authHeader } from "@/features/chat/auth/utils/auth";
import { useDispatch } from "react-redux";
import { triggerFileUploading } from "@/features/chat/store/chat-interface-slice";
import { ContentItem, UploadApiResponse } from "@/features/chat/types/models";
import { chatProxyApi } from "@/lib/api/axiosApi";
import { handleApiError } from "../text-chat/api/messageApi";
import { handleApiErrorToast } from "@/shared/utils/toast.helper";

interface UseFileHandlerReturn {
    selectedFiles: File[];
    handleFilesSelected: (files: File[]) => void;
    removeFile: (index: number) => void;
    clearFiles: () => void;
    uploadAndProcessFiles: (providers: string) => Promise<ContentItem[] | null>;
    isUploading: boolean;
}

export const useFileHandler = (): UseFileHandlerReturn => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const dispatch = useDispatch();

    const handleFilesSelected = (files: File[]) => {
        // Validate files if needed (size, type)
        const validFiles = files.filter(file => {
             // Example validation: max size 10MB
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`File ${file.name} is too large. Max size is 10MB.`);
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            setSelectedFiles((prev) => [...prev, ...validFiles]);
            console.log("Selected files:", validFiles);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };
    
    const clearFiles = () => {
        setSelectedFiles([]);
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

            if (
                isImage &&
                (providerArray.includes("deepseek") || providerArray.includes("ollama"))
            ) {
                // Prefer deepseek's output, fallback to ollama's if deepseek is not present.
                const deepseekFiles = uploadResponse.providers["deepseek"];
                const ollamaFiles = uploadResponse.providers["ollama"];

                if (deepseekFiles && deepseekFiles[index]) {
                    imageAnalyzedText = deepseekFiles[index].output;
                } else if (ollamaFiles && ollamaFiles[index]) {
                    imageAnalyzedText = ollamaFiles[index].output;
                }
            }
            if (!isImage && providerArray.includes("openai")) {
                const openaiFiles = uploadResponse.providers["openai"];
                if (openaiFiles && openaiFiles[index]) {
                    fileId = openaiFiles[index].output;
                }
            }

            if (
                !isImage &&
                (providerArray.includes("deepseek") ||
                    providerArray.includes("ollama") ||
                    providerArray.includes("grok"))
            ) {
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

            if (
                !isImage &&
                (providerArray.includes("anthropic") ||
                    providerArray.includes("gemini") ||
                    providerArray.includes("perplexity"))
            ) {
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
                } as ContentItem;
            } else {
                return {
                    type: "input_file",
                    file_id: fileId,
                    file_analyzed_text: fileAnalyzedText,
                    file_base64: fileBase64,
                } as ContentItem;
            }
        });

        return contentItems;
    };

    const uploadAndProcessFiles = async (providers: string): Promise<ContentItem[] | null> => {
        if (selectedFiles.length === 0) return [];

        console.log("Uploading files to providers:", providers);
        setIsUploading(true);
        dispatch(triggerFileUploading(true));
        
        // Show loading toast (optional, or just rely on IsUploading UI)
        // const toastId = toast.loading("Uploading files...");

        try {
            const formData = new FormData();

            selectedFiles.forEach((file) => {
                formData.append("files", file);
            });

            formData.append("providers", providers);

            console.log("Uploading files:", Array.from(formData.entries()));
            const response = await chatProxyApi.post("/v1/upload", formData);

            if (response.status !== 200) {
                handleApiErrorToast(response.data);
                throw new Error(
                    `File upload failed: ${response.status} ${response.statusText}`
                );
            }

            const uploadResponse: UploadApiResponse = response.data;
            console.log("Upload response:", uploadResponse);

            return processUploadedFiles(uploadResponse, providers);

        } catch (error) {
            console.error("Error uploading files:", error);
            toast.error("Failed to upload files. Please try again.");
            return null; // Return null on failure to indicate error
        } finally {
            setIsUploading(false);
            dispatch(triggerFileUploading(false));
        }
    };

    return {
        selectedFiles,
        handleFilesSelected,
        removeFile,
        clearFiles,
        uploadAndProcessFiles,
        isUploading
    };
};
