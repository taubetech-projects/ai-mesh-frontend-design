import { Button } from "@/shared/components/ui/button";
import {
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Share2,
  Pencil,
  Archive,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import Link from "next/link";

interface SidebarHistorySectionProps {
  title: string;
  icon: React.ReactNode;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  isLoading: boolean;
  isError: boolean;
  data: any[];
  selectedConvId: string | null;
  onSelectConversation: (conv: any) => void;
  renamingConvId: string | null;
  newTitle: string;
  setNewTitle: (val: string) => void;
  onRenameKeyDown: (e: React.KeyboardEvent) => void;
  setRenamingConvId: (id: string | null) => void;
  onDeleteClick: (id: string) => void;
  baseRoute?: string;
}

export function SidebarHistorySection({
  title,
  icon,
  isCollapsed,
  toggleCollapse,
  isLoading,
  isError,
  data,
  selectedConvId,
  onSelectConversation,
  renamingConvId,
  newTitle,
  setNewTitle,
  onRenameKeyDown,
  setRenamingConvId,
  onDeleteClick,
  baseRoute,
}: SidebarHistorySectionProps) {
  return (
    <div className="p-4 flex flex-col min-h-[150px] overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-sidebar-foreground">
          {icon}
          {title}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="w-5 h-5 text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={toggleCollapse}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
      </div>
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto gpt-scrollbar">
          {isLoading && <div>Loading...</div>}
          {isError && <div>Error</div>}
          {data?.map((conversation: any) => (
            <div
              key={conversation.id}
              className={`group flex items-center justify-between text-sm text-sidebar-foreground cursor-pointer hover:bg-sidebar-accent p-2 rounded ${
                selectedConvId === conversation.id ? "bg-sidebar-ring" : ""
              }`}
            >
              {renamingConvId === conversation.id ? (
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={onRenameKeyDown}
                  onBlur={() => setRenamingConvId(null)}
                  className="flex-1 bg-transparent border border-sidebar-border rounded px-1 text-sm focus:outline-none focus:ring-1 focus:ring-sidebar-ring"
                  autoFocus
                />
              ) : (
                <>
                  {baseRoute ? (
                    <Link href={baseRoute + `/${conversation.id}`} className="flex-1 truncate">
                      <span
                        className="flex-1 truncate"
                        onClick={() => onSelectConversation(conversation)}
                      >
                        {conversation.title}
                      </span>
                    </Link>
                  ) : (
                    <span
                      className="flex-1 truncate"
                      onClick={() => onSelectConversation(conversation)}
                    >
                      {conversation.title}
                    </span>
                  )}
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
                    <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
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
                        onClick={() => onDeleteClick(conversation.id)}
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
  );
}