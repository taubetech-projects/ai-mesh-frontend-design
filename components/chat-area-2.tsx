"use client";
import { Check, Copy } from "lucide-react"; // or any icon lib
import {  useSelector } from "react-redux";
import {
  ChatAreaProps,
  CopyButtonProps,
  MessagePage,
  MessageView,
} from "@/types/models";
import {
  useGetMessagesByConversationId,
  useDeleteMessage,
} from "@/lib/hooks/messageHook";

import MessageComponent from "./message-component";

const getModelMessages = (
  activeModel: string,
  messagePage?: MessagePage
): MessageView[] => {
  if (!messagePage?.messages?.length) return [];

  const messages = messagePage.messages;
  const result: MessageView[] = [];

  let lastUserMessage: MessageView | undefined;

  for (const msg of messages) {
    if (msg.role === "user") {
      lastUserMessage = msg;
    } else if (
      msg.role === "assistant" &&
      msg.model === activeModel &&
      lastUserMessage
    ) {
      result.push(lastUserMessage, msg);
    }
  }

  return result;
};

const getModelGrouppedMessages = (
  activeModel: string,
  messagePage?: MessagePage
): Map<string, Map<string, MessageView[]>> => {
  if (!messagePage?.messages?.length) return new Map();

  const result = new Map<string, Map<string, MessageView[]>>();
  let lastUserMsg: MessageView | undefined;

  for (const msg of messagePage.messages) {
    if (msg.role === "user") {
      lastUserMsg = msg;
      continue;
    }
    // Suppose you have model and groupId:
    const model = msg.model;
    const groupId = String(msg.groupId);

    // Only group assistant messages for the active model and only if we have a preceding user
    if (msg.role === "assistant" && msg.model === activeModel && lastUserMsg) {
      if (!result.has(model)) {
        result.set(model, new Map());
      }
      const groupMap = result.get(model)!;

      if (!groupMap.has(groupId)) {
        groupMap.set(groupId, []);
      }
      groupMap.get(groupId)!.push(lastUserMsg, msg);
    }
  }

  return result;
};

export function ChatArea({ activeModel }: ChatAreaProps) {
  const { selectedConvId } = useSelector(
    (store: any) => store.conversationSlice
  );

  const { isPending, data, isError } =
  useGetMessagesByConversationId(selectedConvId);
  const deleteMessage = useDeleteMessage(selectedConvId);

  const handleDeleteMessage = (messageId: number) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      deleteMessage.mutate(messageId);
    }
  };


  const modelMessages = getModelMessages(activeModel, data);
  if (modelMessages === undefined) return null;

  const groupedMessagesMap = getModelGrouppedMessages(activeModel, data);
  // console.log("groupedMessagesMap", groupedMessagesMap);

  const messageGroups = Array.from(groupedMessagesMap.get(activeModel)?.values() ?? []);

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex-1 p-4 space-y-4 overflow-y-auto overflow-x-auto gpt-scrollbar"
        style={{ minHeight: 0, minWidth: 0 }} // important
      >
        {messageGroups.map((group, index) => {
          if (group.length === 0) return null;
          return (
            <div key={group[0].groupId ?? index}>
              <MessageComponent
                messageGroup={group}
                onDelete={handleDeleteMessage}
              />
              <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-2"></div>
            </div>
          );
        })}

        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-2"></div>
      </div>
    </div>
  );
}
