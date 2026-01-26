"use client";

import { useState, useEffect } from "react";
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
import { useUpdateTeam } from "../team.hook";
import { toast } from "sonner";
import type { TeamView } from "../team.types";

interface EditTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: TeamView | null;
}

export function EditTeamDialog({ open, onOpenChange, team }: EditTeamDialogProps) {
  const [teamName, setTeamName] = useState(team?.name || "");
  const updateTeamMutation = useUpdateTeam(team?.id || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!team) return;

    if (!teamName.trim() || teamName.length < 3) {
      toast.error("Team name must be at least 3 characters");
      return;
    }

    if (teamName.length > 50) {
      toast.error("Team name must be less than 50 characters");
      return;
    }

    try {
      await updateTeamMutation.mutateAsync({ name: teamName.trim() });
      toast.success("Team updated successfully!");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Failed to update team");
    }
  };

  const handleClose = () => {
    setTeamName(team?.name || "");
    onOpenChange(false);
  };

  // Update local state when team prop changes
  useEffect(() => {
    if (team) {
      setTeamName(team.name);
    }
  }, [team]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogDescription>
              Update your team's name.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-team-name">Team Name</Label>
              <Input
                id="edit-team-name"
                placeholder="Enter team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                maxLength={50}
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                {teamName.length}/50 characters
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updateTeamMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={updateTeamMutation.isPending || !teamName.trim()}
            >
              {updateTeamMutation.isPending ? "Updating..." : "Update Team"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
