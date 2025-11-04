import { MessageView } from "@/types/models";
import React from "react";
import { Button } from "./ui/button";
import {
    Edit,
    Copy,
    Trash2,
    File,
    Image as ImageIcon,
} from "lucide-react";

interface UserMessageComponentProps {
    message: MessageView;
    onEdit: (messageId?: number, editedMessage?: string) => void;
    onCopy: (message: MessageView) => void;
    onDelete: (messageId: number) => void;
}

function UserMessageComponent({
    message,
    onEdit,
    onCopy,
    onDelete,
}: UserMessageComponentProps) {
    const textContent = message.parts?.find((p) => p.type === "text")?.text ?? "";

    return (
        <div className="flex flex-col group relative">
            <div className="flex flex-wrap gap-2 mb-2 self-end">
                {message.parts?.map((part, partIndex) => {
                    if (part.type === "image" || part.type === "file") {
                        return (
                            <div
                                key={partIndex}
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
            <div className="prose prose-invert max-w-none text-sm leading-relaxed text-primary break-words mb-2 bg-muted px-3 py-4 rounded">
                {message.parts?.map((part, index) => {
                    if (part.type === "text") {
                        return (
                            <p key={part.seq ?? index} className="prose dark:prose-invert">
                                {part.text}
                            </p>
                        );
                    }
                    return null;
                })}
            </div>
            <div className="flex items-center gap-1 self-end">
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" title="Edit" onClick={() => onEdit(message.id, textContent)}>
                    <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" title="Copy" onClick={() => onCopy(message)}>
                    <Copy className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground hover:text-destructive" title="Delete" onClick={() => onDelete(message.id ?? 0)}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

export default UserMessageComponent;