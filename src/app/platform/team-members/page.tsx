"use client";

import { useState } from "react";
import { Plus, Mail, Users } from "lucide-react";
import { DashboardLayout } from "@/features/platform/components/layouts";
import {
  PageHeader,
  DataTable,
  EmptyState,
} from "@/features/platform/components/platform";
import { Button } from "@/shared/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { useOwnedProjectsQuery } from "@/features/platform/projects/hooks/useProjectQueries";
import { useSelector } from "react-redux";
import {
  useAcceptInvite,
  useCreateInvites,
  useDeclineInvite,
  useReceivedInvites,
  useRevokeInvite,
  useSentInvites,
} from "@/features/platform/invitation/invitation.hooks";
import {
  useRemoveMember,
  useTeamMembers,
  useTransferOwnership,
  useUpdateMember,
} from "@/features/platform/team/team.queries";
import {
  CreateInviteRequest,
  TeamMemberInvitationStatus,
} from "@/features/platform/invitation/invitation.types";
import {
  TeamMemberAccessMode,
  TeamMemberRole,
  TeamMembership,
  UpdateMemberRequest,
  UUID,
} from "@/features/platform/team/team.types";
import { Invite, TeamMember } from "@/features/platform/invitation/invitation.types";
import {
  getInviteColumns,
  getMemberColumns,
  getReceivedInviteColumns,
} from "../../../features/platform/invitation/components/columns";
import { InviteMemberDialog } from "../../../features/platform/invitation/components/InviteMemberDialog";
import { UpdateMemberDialog } from "../../../features/platform/invitation/components/UpdateMemberDialog";

const mockInvites: Invite[] = [
  {
    id: "1",
    email: "alice@example.com",
    role: "MEMBER",
    sentAt: "2024-01-20",
    expiresAt: "2024-01-27",
  },
];

export default function TeamMembers() {
  const [invites, setInvites] = useState<Invite[]>(mockInvites);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [memberToUpdate, setMemberToUpdate] = useState<TeamMember | null>(null);

  const selectedTeam = useSelector((state: any) => state.team?.selectedTeam);

  //hooks
  const { data: projects } = useOwnedProjectsQuery();
  const { data: rawMembers } = useTeamMembers(selectedTeam?.id);
  const { data: sentInvites } = useSentInvites();
  const { data: receivedInvites } = useReceivedInvites();

  const createInvitations = useCreateInvites(selectedTeam?.id);
  const acceptInvite = useAcceptInvite();
  const declineInvite = useDeclineInvite();
  const revokeInvite = useRevokeInvite();
  const transferOwnership = useTransferOwnership(selectedTeam?.id);
  const updateMember = useUpdateMember(selectedTeam?.id);
  const removeMember = useRemoveMember(selectedTeam?.id);

  const teamMembers: TeamMember[] = (rawMembers || []).map(
    (member: TeamMembership) => ({
      id: member.id,
      name: member.userName || "Unknown",
      email: member.userEmail || "Unknown",
      userId: member.userId,
      role: (member.role as TeamMemberRole) || "MEMBER",
      status: (member.status as TeamMemberInvitationStatus) || "ACTIVE",
      accessMode: member.accessMode as TeamMemberAccessMode,
      createdAt: member.createdAt,
      projects: member.projectIds,
    })
  );

  const handleInvite = async (body: CreateInviteRequest) => {
    try {
      console.log("Invite request: ", body);
      await createInvitations.mutateAsync(body);
    } catch (error) {
      // Error handling is typically done in the mutation hook or global error handler
      console.error(error);
    }
  };

  const handleRemoveMember = (id: UUID) => {
    removeMember.mutateAsync(id);
  };

  const openUpdateDialog = (member: TeamMember) => {
    setMemberToUpdate(member);
    setIsUpdateOpen(true);
  };

  const handleUpdateMember = async (
    memberUserId: string,
    body: UpdateMemberRequest
  ) => {
    try {
      console.log("Update request: ", body);
      await updateMember.mutateAsync({ memberUserId, req: body });
      setMemberToUpdate(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTransferOwnership = (ownerUserId: string) => {
    transferOwnership.mutateAsync({ newOwnerUserId: ownerUserId });
  };

  const handleCancelInvite = (tokenHash: string) => {
    declineInvite.mutateAsync({ token: tokenHash });
    // setInvites((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAcceptInvite = (tokenHash: string) => {
    acceptInvite.mutateAsync({ token: tokenHash });
  };

  const handleRevokeInvite = (id: string) => {
    revokeInvite.mutateAsync(id);
  };

  const memberColumns = getMemberColumns(
    handleTransferOwnership,
    openUpdateDialog,
    handleRemoveMember
  );

  const inviteColumns = getInviteColumns(
    handleAcceptInvite,
    handleCancelInvite
  );

  const recievedInvitesColumns = getReceivedInviteColumns(handleRevokeInvite);

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Team"
          description="Manage your team members and invitations"
        >
          <Button onClick={() => setIsInviteOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </PageHeader>
        <Tabs defaultValue="members" className="space-y-6">
          <TabsList>
            <TabsTrigger value="members">
              Members ({teamMembers?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="invites">
              Recieved Invites ({receivedInvites?.length})
            </TabsTrigger>
            <TabsTrigger value="sentInvites">
              Sent Invites ({sentInvites?.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            {teamMembers?.length ?? 0 > 0 ? (
              <DataTable columns={memberColumns} data={teamMembers ?? []} />
            ) : (
              <EmptyState
                icon={Users}
                title="No team members"
                description="Invite your first team member to collaborate."
                actionLabel="Invite Member"
                onAction={() => setIsInviteOpen(true)}
              />
            )}
          </TabsContent>

          <TabsContent value="invites">
            {invites.length > 0 ? (
              <DataTable columns={inviteColumns} data={receivedInvites ?? []} />
            ) : (
              <EmptyState
                icon={Mail}
                title="No pending invites"
                description="All invitations have been accepted or expired."
                actionLabel="Send Invite"
                onAction={() => setIsInviteOpen(true)}
              />
            )}
          </TabsContent>

          <TabsContent value="sentInvites">
            {sentInvites?.length ?? 0 > 0 ? (
              <DataTable
                columns={recievedInvitesColumns}
                data={sentInvites ?? []}
              />
            ) : (
              <EmptyState
                icon={Mail}
                title="No pending invites"
                description="All invitations have been accepted or expired."
                actionLabel="Send Invite"
                onAction={() => setIsInviteOpen(true)}
              />
            )}
          </TabsContent>
        </Tabs>
        <InviteMemberDialog
          open={isInviteOpen}
          onOpenChange={setIsInviteOpen}
          projects={projects || []}
          onSubmit={handleInvite}
        />
        <UpdateMemberDialog
          open={isUpdateOpen}
          onOpenChange={setIsUpdateOpen}
          member={memberToUpdate}
          projects={projects || []}
          onSubmit={handleUpdateMember}
        />
      </div>
    </DashboardLayout>
  );
}
