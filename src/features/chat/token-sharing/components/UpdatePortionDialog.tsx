"use client";

import { useEffect, useState } from "react";
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
import { useChangePortion } from "../hooks/useTokenSharing";
import { SharingInviteView } from "../token-sharing.types";
import { toast } from "sonner";
import { Edit3, Hash, Percent } from "lucide-react";
import { showSuccessToast } from "@/shared/utils/toast.helper";

interface UpdatePortionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invite: SharingInviteView | null;
}

export function UpdatePortionDialog({
  open,
  onOpenChange,
  invite,
}: UpdatePortionDialogProps) {
  const [shareType, setShareType] = useState<"fixed" | "percent">("fixed");
  const [amount, setAmount] = useState<string>("");
  const [percentage, setPercentage] = useState<string>("");

  const changePortionMutation = useChangePortion();

  useEffect(() => {
    if (invite) {
      if (invite.fixedAmount !== undefined && invite.fixedAmount !== null) {
        setShareType("fixed");
        setAmount(invite.fixedAmount.toString());
        setPercentage("10");
      } else if (invite.percent !== undefined && invite.percent !== null) {
        setShareType("percent");
        setPercentage(invite.percent.toString());
        setAmount("1000");
      }
    }
  }, [invite]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invite) return;

    await changePortionMutation.mutateAsync({
      id: invite.id,
      fixedAmount: shareType === "fixed" ? parseInt(amount) : undefined,
      percent: shareType === "percent" ? parseInt(percentage) : undefined,
    });
    showSuccessToast("Sharing portion updated successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] border-border/50 bg-background/95 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Edit3 className="h-5 w-5 text-primary" />
              Update Portion
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Modify the amount of tokens you're sharing with{" "}
              <strong>{invite?.receiverEmail || "your friend"}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
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
                <Label htmlFor="update-amount" className="text-sm font-medium">
                  Tokens per Period
                </Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="update-amount"
                    type="number"
                    className="pl-10 bg-secondary/30 border-border/50 focus:border-primary/50"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="update-percent" className="text-sm font-medium">
                  Percent per Period
                </Label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="update-percent"
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

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={changePortionMutation.isPending}
              className="hover:bg-secondary/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={changePortionMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
            >
              {changePortionMutation.isPending ? "Updating..." : "Update Portion"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
