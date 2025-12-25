"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Plus,
  Folder,
} from "lucide-react";
import { ImageIcon } from "lucide-react"; // New import for image icon
import { useLanguage } from "@/shared/contexts/language-context";
import { useEffect, useState } from "react";
import {
  useDeleteConversationApi,
  useGetConversationsApi,
  useGetConversationsForChat,
  useGetConversationsForImage,
  useUpdateConversationApi,
} from "@/features/conversation/hooks/conversationHook";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedConvId } from "@/features/conversation/store/conversation-slice";
import {
  clearChatState,
  setSelectedModels,
  setInitialSelectedModels,
} from "@/features/chat/store/chat-interface-slice";
import { setActiveInterface as setGlobalActiveInterface } from "@/features/chat/store/ui-slice"; // Renamed import
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import {
  clearTokens,
  getRefreshToken,
} from "@/features/auth/utils/auth";
import { AuthService } from "@/features/auth/api/authApi";
import { useGetMessagesByConversationId } from "@/features/chat/text-chat/hooks/messageHook";
import { MessageView } from "@/features/chat/types/models";
import { APP_ROUTES } from "@/shared/constants/routingConstants";
import {
  CONVERSATION_TYPES,
  INTERFACE_TYPES,
} from "@/shared/constants/constants";
import { SidebarHeader } from "./sidebar-header";
import { SidebarHistorySection } from "./sidebar-history-section";
import { SidebarFooter } from "./sidebar-footer";

interface SidebarProps {
  activeInterface: "CHAT" | "IMAGE";
}

export function Sidebar({ activeInterface }: SidebarProps) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isChatHistoryCollapsed, setIsChatHistoryCollapsed] = useState(false);
  const [isImageHistoryCollapsed, setIsImageHistoryCollapsed] = useState(false);
  const { t } = useLanguage();
  const { selectedConvId } = useSelector(
    (store: any) => store.conversationSlice
  );

  const dispatch = useDispatch();
  const { mutate: deleteConversation } = useDeleteConversationApi(); // For deleting
  const { mutate: updateConversation } = useUpdateConversationApi(); // For renaming

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [conversationIdToDelete, setConversationIdToDelete] = useState<
    string | null
  >(null);
  const [renamingConvId, setRenamingConvId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

  // const { isPending, data: conversations, isError } = useGetConversationsApi();
  // Filter conversations into chat and image history
  const {
    isPending: isChatPending,
    data: chatHistory,
    isError: isChatError,
  } = useGetConversationsForChat();
  const {
    isPending: isImagePending,
    data: imageHistory,
    isError: isImageError,
  } = useGetConversationsForImage();
  console.log("Chat History: ", chatHistory, "Image History: ", imageHistory);

  const { data: conversationMessages } =
    useGetMessagesByConversationId(selectedConvId);

  useEffect(() => {
    if (conversationMessages?.messages) {
      const uniqueModels = Array.from(
        new Set(
          conversationMessages.messages
            .map((message: MessageView) => message.model)
            .filter((model: any) => model)
        )
      );
      const conversationModels = uniqueModels.map((model) => ({ model }));
      dispatch(setSelectedModels(conversationModels));
    }
  }, [conversationMessages, dispatch]);

  const handleNewChat = () => {
    dispatch(setSelectedConvId(null));
    dispatch(clearChatState());
    dispatch(setGlobalActiveInterface(CONVERSATION_TYPES.CHAT)); // Ensure chat interface is active
    dispatch(setInitialSelectedModels());
    router.push(APP_ROUTES.CHAT);
  };

  const handleDeleteConversation = () => {
    if (conversationIdToDelete) {
      deleteConversation(conversationIdToDelete);
      setConversationIdToDelete(null);
    }
    setShowDeleteDialog(false); // Close the dialog
  };

  const handleRenameConversation = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && renamingConvId && newTitle.trim() !== "") {
      updateConversation({
        id: renamingConvId,
        conversation: { title: newTitle },
      });
      setRenamingConvId(null);
      setNewTitle("");
    } else if (e.key === "Escape") {
      setRenamingConvId(null);
      setNewTitle("");
    }
  };

  const handleUpgradePlan = () => {
    router.push(APP_ROUTES.PRICING);
  };

  async function handleLogout() {
    console.log("Response Token before log out:", getRefreshToken() ?? "");
    const response = await AuthService.logout({
      refreshToken: getRefreshToken() ?? "",
    });
    console.log("Response Token :", getRefreshToken() ?? "");
    console.log("Logout response:", response);
    if (response === "200") {
      // setApiKey(response.accessToken);
      clearTokens();
      router.push(APP_ROUTES.SIGNIN);
    } else {
      alert("Logout failed. Please try again.");
    }
  }

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`${
        isCollapsed ? "w-18" : "w-80"
      } h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 flex-shrink-0`}
    >
      {/* Header */}
      <SidebarHeader
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
        onNewChat={handleNewChat}
        activeInterface={activeInterface}
        t={t}
      />

      {/* Projects Section */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm text-sidebar-foreground">
              <Folder className="w-4 h-4 flex-shrink-0" />
              {t.nav.project}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="w-5 h-5 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      {/* History Sections Wrapper */}
      {!isCollapsed && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chat History Section */}
          <SidebarHistorySection
            title="Chat History"
            icon={<Folder className="w-4 h-4 flex-shrink-0" />}
            isCollapsed={isChatHistoryCollapsed}
            toggleCollapse={() =>
              setIsChatHistoryCollapsed(!isChatHistoryCollapsed)
            }
            isLoading={isChatPending}
            isError={isChatError}
            data={chatHistory}
            selectedConvId={selectedConvId}
            onSelectConversation={() => {
              dispatch(setGlobalActiveInterface(CONVERSATION_TYPES.CHAT));
              dispatch(clearChatState());
            }}
            renamingConvId={renamingConvId}
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            onRenameKeyDown={handleRenameConversation}
            setRenamingConvId={setRenamingConvId}
            onDeleteClick={(id) => {
              setConversationIdToDelete(id);
              setShowDeleteDialog(true);
            }}
            baseRoute={APP_ROUTES.CHAT}
          />

          {/* Image History Section */}
          <SidebarHistorySection
            title="Image History"
            icon={<ImageIcon className="w-4 h-4 flex-shrink-0" />}
            isCollapsed={isImageHistoryCollapsed}
            toggleCollapse={() =>
              setIsImageHistoryCollapsed(!isImageHistoryCollapsed)
            }
            isLoading={isImagePending}
            isError={isImageError}
            data={imageHistory}
            selectedConvId={selectedConvId}
            onSelectConversation={(conversation) => {
              dispatch(setGlobalActiveInterface(CONVERSATION_TYPES.IMAGE));
              dispatch(clearChatState());
              dispatch(setSelectedConvId(conversation.id));
            }}
            renamingConvId={renamingConvId}
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            onRenameKeyDown={handleRenameConversation}
            setRenamingConvId={setRenamingConvId}
            onDeleteClick={(id) => {
              setConversationIdToDelete(id);
              setShowDeleteDialog(true);
            }}
          />
        </div>
      )}

      {/* Bottom Section */}
      <SidebarFooter
        isCollapsed={isCollapsed}
        handleUpgradePlan={handleUpgradePlan}
        handleLogout={handleLogout}
        t={t}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this conversation? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConversation}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
