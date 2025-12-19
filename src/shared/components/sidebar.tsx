"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Plus,
  Search,
  Settings,
  Folder,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ChevronDown,
  Share2,
  Pencil,
  Archive,
  Trash2,
} from "lucide-react";
import { ImageIcon } from "lucide-react"; // New import for image icon
import { LanguageSelector } from "@/shared/components/language-selector";
import { useLanguage } from "@/shared/contexts/language-context";
import { ThemeToggle } from "./theme-toggle";
import { useEffect, useState } from "react";
import {
  useDeleteConversationApi,
  useGetConversationsApi,
  useGetConversationsForChat,
  useGetConversationsForImage,
  useUpdateConversationApi,
} from "@/features/conversation/hooks/conversationHook";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedConvId } from "@/redux/conversation-slice";
import { clearChatState } from "@/redux/chat-interface-slice";
import { setActiveInterface as setGlobalActiveInterface } from "@/redux/ui-slice"; // Renamed import
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
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

interface SidebarProps {
  activeInterface: "CHAT" | "IMAGE";
}

export function Sidebar({ activeInterface }: SidebarProps) {
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

  const handleNewChat = () => {
    dispatch(setSelectedConvId(null));
    dispatch(clearChatState());
    dispatch(setGlobalActiveInterface("CHAT")); // Ensure chat interface is active
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

  const handleGenerateImage = () => {
    dispatch(setSelectedConvId(null));
    dispatch(clearChatState());
    dispatch(setGlobalActiveInterface("IMAGE")); // Ensure image interface is active
  };

  // 👇 When conversations load, select the last one automatically
  // useEffect(() => {
  //   if (conversations && conversations.length > 0 && !selectedConvId) {
  //     const last = conversations[0];
  //     dispatch(setSelectedConvId(last.id));
  //   }
  // }, [conversations, selectedConvId]);

  return (
    <div
      className={`${
        isCollapsed ? "w-18" : "w-80"
      } h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 flex-shrink-0`}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`flex items-center gap-2 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
              </div>
            </div>
            {!isCollapsed && (
              <span className="font-semibold text-sidebar-foreground">
                AI MESH
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {!isCollapsed && (
          <Button
            onClick={handleNewChat}
            className={`w-full justify-start gap-2 ${
              activeInterface === "CHAT"
                ? "bg-sidebar-primary"
                : "bg-sidebar-primary"
            } text-sidebar-primary-foreground hover:bg-sidebar-primary/90`}
          >
            <Plus className="w-4 h-4" />
            {t.nav.newChat}
          </Button>
        )}

        {isCollapsed && (
          <Button
            onClick={handleNewChat}
            className={`w-full justify-center ${
              activeInterface === "CHAT"
                ? "bg-sidebar-ring"
                : "bg-sidebar-primary"
            } text-sidebar-primary-foreground hover:bg-sidebar-primary/90`}
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className={`${
            isCollapsed ? "w-full" : "mt-2"
          } text-sidebar-foreground hover:bg-sidebar-accent`}
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>

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
          <div className="p-4 flex flex-col min-h-[150px] overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-sidebar-foreground">
                <Folder className="w-4 h-4 flex-shrink-0" />
                Chat History
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="w-5 h-5 text-sidebar-foreground hover:bg-sidebar-accent"
                onClick={() =>
                  setIsChatHistoryCollapsed(!isChatHistoryCollapsed)
                }
              >
                {isChatHistoryCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
            {!isChatHistoryCollapsed && (
              <div className="flex-1 overflow-y-auto no-scrollbar">
                {isChatPending && <div>Loading...</div>}
                {isChatError && <div>Error</div>}
                {chatHistory?.map((conversation: any) => (
                  <div // Use a group to show menu on hover
                    key={conversation.id}
                    className={`group flex items-center justify-between text-sm text-sidebar-foreground cursor-pointer hover:bg-sidebar-accent p-2 rounded ${
                      selectedConvId === conversation.id
                        ? "bg-sidebar-ring"
                        : ""
                    }`}
                  >
                    {renamingConvId === conversation.id ? (
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={handleRenameConversation}
                        onBlur={() => setRenamingConvId(null)}
                        className="flex-1 bg-transparent border border-sidebar-border rounded px-1 text-sm focus:outline-none focus:ring-1 focus:ring-sidebar-ring"
                        autoFocus
                      />
                    ) : (
                      <>
                        <span
                          className="flex-1 truncate"
                          onClick={() => {
                            dispatch(setGlobalActiveInterface("CHAT"));
                            dispatch(clearChatState());
                            dispatch(setSelectedConvId(conversation.id));
                          }}
                        >
                          {conversation.title}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100"
                              onClick={(e) => e.stopPropagation()} // Prevent row click
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DropdownMenuItem>
                              <Share2 className="mr-2 h-4 w-4" />
                              <span>Share</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setRenamingConvId(conversation.id);
                                setNewTitle(conversation.title);
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              <span>Rename</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="mr-2 h-4 w-4" />
                              <span>Archive</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-500"
                              onClick={() => {
                                setConversationIdToDelete(conversation.id);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image History Section */}
          <div className="p-4 flex flex-col min-h-[150px] overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-sidebar-foreground">
                <ImageIcon className="w-4 h-4 flex-shrink-0" />
                Image History
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="w-5 h-5 text-sidebar-foreground hover:bg-sidebar-accent"
                onClick={() =>
                  setIsImageHistoryCollapsed(!isImageHistoryCollapsed)
                }
              >
                {isImageHistoryCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
            {!isImageHistoryCollapsed && (
              <div className="flex-1 overflow-y-auto no-scrollbar">
                {isImagePending && <div>Loading...</div>}
                {isImageError && <div>Error</div>}
                {imageHistory?.map((conversation: any) => (
                  <div
                    key={conversation.id}
                    className={`group flex items-center justify-between text-sm text-sidebar-foreground cursor-pointer hover:bg-sidebar-accent p-2 rounded ${
                      selectedConvId === conversation.id
                        ? "bg-sidebar-ring"
                        : ""
                    }`}
                  >
                    {renamingConvId === conversation.id ? (
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={handleRenameConversation}
                        onBlur={() => setRenamingConvId(null)}
                        className="flex-1 bg-transparent border border-sidebar-border rounded px-1 text-sm focus:outline-none focus:ring-1 focus:ring-sidebar-ring"
                        autoFocus
                      />
                    ) : (
                      <>
                        <span
                          className="flex-1 truncate"
                          onClick={() => {
                            dispatch(setGlobalActiveInterface("IMAGE")); // Set to image interface
                            dispatch(clearChatState());
                            dispatch(setSelectedConvId(conversation.id));
                          }}
                        >
                          {conversation.title}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DropdownMenuItem
                              onClick={() => {
                                setRenamingConvId(conversation.id);
                                setNewTitle(conversation.title);
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              <span>Rename</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-500"
                              onClick={() => {
                                setConversationIdToDelete(conversation.id);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Section */}
      <div className="p-4 border-t border-sidebar-border space-y-4">
        {!isCollapsed && (
          <div className="flex justify-center">
            <LanguageSelector />
          </div>
        )}

        {/* New: Generate Image Button */}
        <Button
          onClick={() => handleGenerateImage()}
          variant="ghost"
          className={`w-full justify-start gap-2 ${
            activeInterface === "IMAGE"
              ? "bg-sidebar-ring"
              : "bg-sidebar-primary"
          } text-sidebar-primary-foreground hover:bg-sidebar-primary/90`}
        >
          <ImageIcon className="w-4 h-4" />
          {!isCollapsed && "Generate Image"}
        </Button>

        {/* Settings */}
        <div
          className={`flex ${
            isCollapsed ? "flex-col gap-2" : "items-center justify-between"
          }`}
        >
          <ThemeToggle />

          <Link href="/setting" passHref legacyBehavior>
            <Button
              variant="ghost"
              className={`${
                isCollapsed ? "h-8 w-8 p-0" : "flex-1 justify-start gap-2 ml-2"
              } text-sidebar-foreground hover:bg-sidebar-accent`}
            >
              <Settings className="w-4 h-4" />
              {!isCollapsed && t.nav.settings}
            </Button>
          </Link>
        </div>
      </div>

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
