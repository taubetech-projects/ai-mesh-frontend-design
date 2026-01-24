"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Edit, Trash2, UserPlus, Crown } from "lucide-react";
import type { TeamView } from "../team.types";
import { useTeamPermissions } from "../hooks/use-team-permissions";
import { useChatAuth } from "@/features/chat/auth/ChatAuthProvider";
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
import { useDeleteTeam } from "../team.hook";
import { toast } from "sonner";

interface TeamCardProps {
  team: TeamView;
  onEdit?: (team: TeamView) => void;
  onInvite?: (team: TeamView) => void;
}

export function TeamCard({ team, onEdit, onInvite }: TeamCardProps) {
  const { me } = useChatAuth();
  const { canUpdateTeam, canDeleteTeam, canInviteMembers } = useTeamPermissions();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteTeamMutation = useDeleteTeam();

  const isOwner = me?.id && team.ownerUserId === me.id;

  const handleDelete = async () => {
    try {
      await deleteTeamMutation.mutateAsync(team.id);
      toast.success("Team deleted successfully");
      setShowDeleteDialog(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Failed to delete team");
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex flex-row justify-between items-center space-x-2  space-y-1">
              <CardTitle className="flex items-center gap-2">
                {team.name}
                {isOwner && (
                  <Badge variant="secondary" className="text-xs">
                    <Crown className="h-3 w-3 mr-1" />
                    Owner
                  </Badge>
                )}
              </CardTitle>
              {canDeleteTeam && (
              <Trash2 className="h-4 w-4 mr-2 text-red-600 hover:text-red-700 " onClick={() => setShowDeleteDialog(true)}/>
            )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Team ID: {team.id}</p>
            <p>Subscription: {team.subscriptionId}</p>
          </div>
        </CardContent>

        {isOwner && (
          <CardFooter className="flex gap-2 border-t pt-4">
            {canUpdateTeam && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(team)}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}

            {canInviteMembers && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onInvite?.(team)}
                className="flex-1"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Invite
              </Button>
            )}


          </CardFooter>
        )}
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{team.name}</strong>? This action cannot be
              undone. All team members will lose access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteTeamMutation.isPending}
            >
              {deleteTeamMutation.isPending ? "Deleting..." : "Delete Team"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
