"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useInviteFriend } from "../hooks/useTokenSharing";
import { ShareDurationType } from "../token-sharing.types";
import { toast } from "sonner";
import { Coins, Mail, Calendar, Hash, Percent } from "lucide-react";
import { showSuccessToast } from "@/shared/utils/toast.helper";

interface InviteFriendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteFriendDialog({
  open,
  onOpenChange,
}: InviteFriendDialogProps) {
  const [email, setEmail] = useState("");
  const [shareType, setShareType] = useState<"fixed" | "percent">("fixed");
  const [amount, setAmount] = useState<string>("1000");
  const [percentage, setPercentage] = useState<string>("10");
  const [durationType, setDurationType] = useState<ShareDurationType>(
    ShareDurationType.MONTHLY
  );
  const [totalPeriods, setTotalPeriods] = useState<string>("12");

  const inviteMutation = useInviteFriend();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    await inviteMutation.mutateAsync({
      receiverEmail: email.trim(),
      fixedAmount: shareType === "fixed" ? parseInt(amount) : undefined,
      percent: shareType === "percent" ? parseInt(percentage) : undefined,
      durationType,
      totalPeriods:
        durationType === ShareDurationType.MONTHLY
            ? parseInt(totalPeriods)
            : undefined,
    });
    showSuccessToast(`Token sharing invite sent to ${email}`);
    handleClose();
  };

  const handleClose = () => {
    setEmail("");
    setAmount("1000");
    setPercentage("10");
    setDurationType(ShareDurationType.MONTHLY);
    setTotalPeriods("12");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px] border-border/50 bg-background/95 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Coins className="h-5 w-5 text-primary" />
              Share Tokens
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Invite a friend to use your tokens. You can set a fixed amount or a
              percentage for each period.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Friend's Email */}
            <div className="space-y-2">
              <Label htmlFor="friend-email" className="text-sm font-medium">
                Friend's Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="friend-email"
                  type="email"
                  placeholder="friend@example.com"
                  className="pl-10 bg-secondary/30 border-border/50 focus:border-primary/50 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            {/* Sharing Method */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Sharing Method</Label>
                <Select
                  value={shareType}
                  onValueChange={(v: "fixed" | "percent") => setShareType(v)}
                >
                  <SelectTrigger className="bg-secondary/30 border-border/50">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="percent">Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {shareType === "fixed" ? (
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium">
                    Tokens per Period
                  </Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      className="pl-10 bg-secondary/30 border-border/50 focus:border-primary/50"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="percent" className="text-sm font-medium">
                    Percent per Period
                  </Label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="percent"
                      type="number"
                      max="100"
                      min="1"
                      className="pl-10 bg-secondary/30 border-border/50 focus:border-primary/50"
                      value={percentage}
                      onChange={(e) => setPercentage(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Renew Types</Label>
                <Select
                  value={durationType}
                  onValueChange={(v: ShareDurationType) => setDurationType(v)}
                >
                  <SelectTrigger className="bg-secondary/30 border-border/50">
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ShareDurationType.MONTHLY}>
                      Monthly
                    </SelectItem>
                    <SelectItem value={ShareDurationType.YEARLY}>
                      Yearly
                    </SelectItem>
                    <SelectItem value={ShareDurationType.UNLIMITED}>
                      Unlimited
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {durationType === ShareDurationType.MONTHLY && (
                <div className="space-y-2">
                  <Label htmlFor="periods" className="text-sm font-medium">
                    Total Periods (Months)
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="periods"
                      type="number"
                      className="pl-10 bg-secondary/30 border-border/50 focus:border-primary/50"
                      value={totalPeriods}
                      onChange={(e) => setTotalPeriods(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={inviteMutation.isPending}
              className="hover:bg-secondary/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={inviteMutation.isPending || !email.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
            >
              {inviteMutation.isPending ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
