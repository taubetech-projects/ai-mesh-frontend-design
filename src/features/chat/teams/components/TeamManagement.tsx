"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { Plus, Users, Loader2 } from "lucide-react";
import { useMyTeams, useMyMemberships } from "../team.hook";
import { useTeamPermissions } from "../hooks/use-team-permissions";
import { TeamCard } from "./TeamCard";
import { CreateTeamDialog } from "./CreateTeamDialog";
import { EditTeamDialog } from "./EditTeamDialog";
import { InviteMemberDialog } from "./InviteMemberDialog";
import type { TeamView } from "../team.types";

export function TeamManagement() {
  const { canCreateTeam } = useTeamPermissions();
  const { data: myTeams, isLoading: loadingMyTeams } = useMyTeams();
  const { data: memberships, isLoading: loadingMemberships } = useMyMemberships();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamView | null>(null);

  const handleEdit = (team: TeamView) => {
    setSelectedTeam(team);
    setEditDialogOpen(true);
  };

  const handleInvite = (team: TeamView) => {
    setSelectedTeam(team);
    setInviteDialogOpen(true);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Teams</h3>
          <p className="text-sm text-muted-foreground">
            Manage your teams and collaborate with others.
          </p>
        </div>
        {canCreateTeam && (
          <Button onClick={() => setCreateDialogOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="owned" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="owned">
            <Users className="h-4 w-4 mr-2" />
            My Teams
          </TabsTrigger>
          <TabsTrigger value="member">Teams I'm In</TabsTrigger>
        </TabsList>

        {/* My Teams Tab */}
        <TabsContent value="owned" className="space-y-4 mt-6">
          {loadingMyTeams ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : myTeams && myTeams.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {myTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onEdit={handleEdit}
                  onInvite={handleInvite}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No teams yet"
              description={
                canCreateTeam
                  ? "Create your first team to start collaborating with others."
                  : "You don't own any teams yet."
              }
              action={
                canCreateTeam ? (
                  <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Team
                  </Button>
                ) : undefined
              }
            />
          )}
        </TabsContent>

        {/* Teams I'm In Tab */}
        <TabsContent value="member" className="space-y-4 mt-6">
          {loadingMemberships ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : memberships && memberships.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {memberships.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Not a member yet"
              description="You haven't been invited to any teams yet. Ask a team owner to send you an invitation."
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CreateTeamDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      
      <EditTeamDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        team={selectedTeam}
      />
      
      <InviteMemberDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        teamId={selectedTeam?.id || ""}
        teamName={selectedTeam?.name || ""}
      />
    </div>
  );
}

// Empty State Component
function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Users className="h-12 w-12 text-muted-foreground mb-4" />
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">{description}</p>
      {action}
    </div>
  );
}
