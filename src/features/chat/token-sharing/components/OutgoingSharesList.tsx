"use client";

import { useState } from "react";
import {
  useOutgoingShares,
  useRenewShare,
} from "../hooks/useTokenSharing";
import { SharingInviteView, ShareStatus } from "../token-sharing.types";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { UpdatePortionDialog } from "./UpdatePortionDialog";
import { toast } from "sonner";
import {
  RotateCcw,
  Edit2,
  Clock,
  Send,
  User,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/lib/utils/utils";

export function OutgoingSharesList() {
  const { data: shares, isLoading } = useOutgoingShares();
  const renewMutation = useRenewShare();
  const [selectedInvite, setSelectedInvite] = useState<SharingInviteView | null>(
    null
  );
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const handleRenew = async (id: string) => {
    try {
      await renewMutation.mutateAsync(id);
      toast.success("Share renewed successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Failed to renew share");
    }
  };

  const handleUpdatePortion = (invite: SharingInviteView) => {
    setSelectedInvite(invite);
    setIsUpdateOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-24 w-full bg-secondary/20 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (!shares || shares.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-border/50 rounded-2xl bg-secondary/5">
        <div className="bg-secondary/20 p-4 rounded-full mb-4">
          <Send className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No Outgoing Shares</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-[250px]">
          You haven't shared tokens with anyone yet. Invite a friend to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {shares.map((share) => (
        <div
          key={share.id}
          className="group relative flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-border/50 bg-secondary/5 hover:bg-secondary/10 hover:border-primary/20 transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <User className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {share.receiverEmail || "Unknown User"}
                </span>
                <StatusBadge status={share.status} />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-primary">
                    {share.fixedAmount
                      ? `${share.fixedAmount} tokens`
                      : `${share.percent}% tokens`}
                  </span>
                  <span>/ period</span>
                </div>
                {share.totalPeriods && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {share.periodsConsumed} / {share.totalPeriods} periods
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRenew(share.id)}
              disabled={renewMutation.isPending}
              className="h-8 gap-1.5 border-border/50 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
            >
              <RotateCcw className={cn("h-3.5 w-3.5", renewMutation.isPending && "animate-spin")} />
              Renew
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => handleUpdatePortion(share)}>
                  <Edit2 className="h-3.5 w-3.5 mr-2" />
                  Update Portion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}

      <UpdatePortionDialog
        open={isUpdateOpen}
        onOpenChange={setIsUpdateOpen}
        invite={selectedInvite}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: ShareStatus }) {
  const styles = {
    [ShareStatus.PENDING]: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    [ShareStatus.ACCEPTED]: "bg-green-500/10 text-green-500 border-green-500/20",
    [ShareStatus.REJECTED]: "bg-red-500/10 text-red-500 border-red-500/20",
    [ShareStatus.EXPIRED]: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  };

  return (
    <Badge
      variant="outline"
      className={cn("px-2 py-0 text-[10px] font-bold uppercase tracking-wider", styles[status])}
    >
      {status}
    </Badge>
  );
}
