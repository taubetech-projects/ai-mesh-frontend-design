"use client";

import { useIncomingShares, useAcceptShare, useRejectShare } from "../hooks/useTokenSharing";
import { ShareStatus, IncomingShareView } from "../token-sharing.types";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { toast } from "sonner";
import { Check, X, Download, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { UUID } from "@/features/platform/team/team.types";
import { showSuccessToast } from "@/shared/utils/toast.helper";

export function IncomingSharesList() {
  const { data: shares, isLoading } = useIncomingShares();
  console.log("shares", shares)
  const acceptMutation = useAcceptShare();
  const rejectMutation = useRejectShare();

  const handleAccept = async (id: UUID) => {
    await acceptMutation.mutateAsync(id);
    showSuccessToast("Share accepted successfully");
  };

  const handleReject = async (id: UUID) => {
    await rejectMutation.mutateAsync(id);
    showSuccessToast("Share rejected successfully");
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
          <Download className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No Incoming Shares</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-[250px]">
          No one has shared tokens with you yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {shares.map((share) => (
        <div
          key={share.id}
          className="relative flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-border/50 bg-secondary/5 hover:bg-secondary/10 hover:border-primary/20 transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <User className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {share.senderUsername}
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
            {share.status === ShareStatus.PENDING ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReject(share.id)}
                  disabled={rejectMutation.isPending}
                  className="h-8 gap-1 border-border/50 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30"
                >
                  <X className="h-3.5 w-3.5" />
                  Reject
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleAccept(share.id)}
                  disabled={acceptMutation.isPending}
                  className="h-8 gap-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  <Check className="h-3.5 w-3.5" />
                  Accept
                </Button>
              </>
            ) : null}
          </div>
        </div>
      ))}
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
