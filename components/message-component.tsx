import { MessageView } from "@/types/models";
import React, { useState } from "react";
import AssistantMessageComponent from "./assistant-message-component";
import UserMessageComponent from "./user-message-component";

interface MessageComponentProps {
    messageGroup: MessageView[];
    onDelete: (messageId: number) => void;
}

function MessageComponent({
    messageGroup,
    onDelete,
}: MessageComponentProps) {
    const [currentVersion, setCurrentVersion] = useState(0);
    const userMessages = messageGroup.filter(m => m.role === 'user');
    const assistantMessages = messageGroup.filter(m => m.role === 'assistant');
    const assistantMessage = assistantMessages[currentVersion]; // The message to display actions for
    const userMessage = userMessages[currentVersion]; // The message to display actions for

    if (!userMessage || !assistantMessage) return null;

    const handleVersionChange = (direction: 'next' | 'prev') => {
        if (direction === 'next') {
            setCurrentVersion(v => (v + 1) % assistantMessages.length);
        } else {
            setCurrentVersion(v => (v - 1 + assistantMessages.length) % assistantMessages.length);
        }
    };

    return (
        <div className="flex flex-col group relative">
            <UserMessageComponent
                message={userMessage}
                onDelete={onDelete}
                messageLength={userMessages.length}
                handleVersionChange={handleVersionChange}
                currentVersion={currentVersion}
            />
            <AssistantMessageComponent message={assistantMessage} />

        </div>
    );
}

export default MessageComponent;