"use client";
import { Check, Copy } from "lucide-react"; // or any icon lib
import { useSelector } from "react-redux";
import {
  ChatAreaProps,
  CopyButtonProps,
  MessagePage,
  MessageView,
} from "@/types/models";
import {
  useGetMessagesByConversationId,
  useDeleteForAllModels,
  useDeleteForSingleModel,
} from "@/lib/hooks/messageHook";

import MessageComponent from "./message-component";
import { useState } from "react";

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
  const { mutate: deleteForAll, isPending: isDeletingForAll } =
    useDeleteForAllModels(selectedConvId);
  const { mutate: deleteForModel, isPending: isDeletingForModel } =
    useDeleteForSingleModel(selectedConvId);

  const isDeleting = isDeletingForAll || isDeletingForModel;
  console.log("Selected Conversations Data : ", data);

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    messageId: number | null;
  }>({ isOpen: false, messageId: null });

  const openDeleteDialog = (messageId: number) => {
    setDeleteDialog({ isOpen: true, messageId });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, messageId: null });
  };

  // The deleteMessage hook's mutate function might need to be updated
  // to accept an object like { messageId, modelName } for model-specific deletion.

  const groupedMessagesMap = getModelGrouppedMessages(activeModel, data);
  // console.log("groupedMessagesMap", groupedMessagesMap);

  const messageGroups = Array.from(groupedMessagesMap.get(activeModel)?.values() ?? []);
  console.log(`[ChatArea] Rendering for model "${activeModel}". Found ${messageGroups.length} message groups.`, messageGroups);

  // if (isPending) {
  //   return <div className="flex-1 p-4 text-center">Loading messages...</div>;
  // }

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
                onDelete={openDeleteDialog}
              />
              <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-2"></div>
            </div>
          );
        })}

        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-2"></div>
      </div>

      {deleteDialog.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Delete Message</h3>
            <p className="text-gray-300 mb-6">
              How would you like to delete this message?
            </p>
            <div className="flex flex-col space-y-3">
              <button
                disabled={isDeleting}
                onClick={() => {
                  if (deleteDialog.messageId) {
                    deleteForModel({
                      messageId: deleteDialog.messageId,
                      model: activeModel,
                    });
                  }
                  // We can close the dialog on success via the hook's onSettled/onSuccess
                  // For now, let's keep it simple and close immediately.
                  // If the API call fails, the user might want the dialog to stay open.
                  // Let's close it after the click for now.
                  if (!isDeleting) closeDeleteDialog();
                }}
                className="w-full px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeletingForModel ? "Deleting..." : `Delete for This Model (${activeModel})`}
              </button>
              <button
                disabled={isDeleting}
                onClick={() => {
                  if (deleteDialog.messageId) {
                    deleteForAll(deleteDialog.messageId);
                  }
                  if (!isDeleting) closeDeleteDialog();
                }}
                className="w-full px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeletingForAll ? "Deleting..." : "Delete for All Models"}
              </button>
              <button
                onClick={closeDeleteDialog}
                disabled={isDeleting}
                className="w-full px-4 py-2 mt-2 rounded-md text-gray-300 hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
