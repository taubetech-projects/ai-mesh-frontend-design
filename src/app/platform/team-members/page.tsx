"use client";

import { useState } from "react";
import {
  Plus,
  MoreHorizontal,
  Mail,
  Shield,
  Users,
  Trash2,
  Lock,
} from "lucide-react";
import { DashboardLayout } from "@/features/platform/components/layouts";
import {
  PageHeader,
  DataTable,
  StatusBadge,
  EmptyState,
  Column,
} from "@/features/platform/components/platform";
import { Button } from "@/shared/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { toast } from "@/shared/hooks/use-toast";
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
  useTeamMembers,
  useTransferOwnership,
  useUpdateMember,
} from "@/features/platform/team/team.queries";
import {
  CreateInviteRequest,
  Invitation,
  TeamMemberInvitationStatus,
} from "@/features/platform/invitation/invitation.types";
import {
  TeamMemberAccessMode,
  TeamMemberRole,
  TeamMembership,
  UpdateMemberRequest,
  UUID,
} from "@/features/platform/team/team.types";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  userId: UUID;
  role: TeamMemberRole;
  status: TeamMemberInvitationStatus;
  accessMode: TeamMemberAccessMode;
  createdAt: string;
  projects: UUID[];
}

interface Invite {
  id: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  sentAt: string;
  expiresAt: string;
}

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
  const [inviteEmails, setInviteEmails] = useState<string[]>([""]);
  const [inviteRole, setInviteRole] = useState<"ADMIN" | "MEMBER">("MEMBER");
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [memberToUpdate, setMemberToUpdate] = useState<TeamMember | null>(null);
  const [updateRole, setUpdateRole] = useState<"ADMIN" | "MEMBER">("MEMBER");
  const [updateProjectIds, setUpdateProjectIds] = useState<string[]>([]);
  const [updateAccessMode, setUpdateAccessMode] =
    useState<TeamMemberAccessMode>("ALL_PROJECTS");
  const [inviteAccessMode, setInviteAccessMode] =
    useState<TeamMemberAccessMode>("ALL_PROJECTS");

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

  const handleAddEmail = () => {
    setInviteEmails([...inviteEmails, ""]);
  };

  const handleRemoveEmail = (index: number) => {
    const newEmails = [...inviteEmails];
    newEmails.splice(index, 1);
    setInviteEmails(newEmails);
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...inviteEmails];
    newEmails[index] = value;
    setInviteEmails(newEmails);
  };

  const handleInvite = async () => {
    const validEmails = inviteEmails.filter((email) => email.trim());
    if (validEmails.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one email address",
        variant: "destructive",
      });
      return;
    }

    try {
      const body: CreateInviteRequest = {
        emails: validEmails,
        role: inviteRole,
        accessMode: inviteAccessMode,
        projectIds:
          inviteAccessMode === "ALL_PROJECTS" ? [] : selectedProjectIds,
        expiresHours: 24,
      };
      console.log("Invite request: ", body);
      await createInvitations.mutateAsync(body);

      setIsInviteOpen(false);
      setInviteEmails([""]);
      setSelectedProjectIds([]);
      setInviteAccessMode("ALL_PROJECTS");
    } catch (error) {
      // Error handling is typically done in the mutation hook or global error handler
      console.error(error);
    }
  };

  const handleRemoveMember = (id: string) => {
    toast({
      title: "Member Removed",
      description: "The team member has been removed.",
    });
  };

  const openUpdateDialog = (member: TeamMember) => {
    setMemberToUpdate(member);
    setUpdateRole(member.role === "OWNER" ? "ADMIN" : member.role);
    setUpdateAccessMode(member.accessMode);
    setUpdateProjectIds(member.projects?.map((p) => p) ?? []);
    setIsUpdateOpen(true);
  };

  const handleUpdateMember = async () => {
    if (!memberToUpdate) return;
    try {
      const body: UpdateMemberRequest = {
        role: updateRole,
        accessMode: updateAccessMode,
        projectIds: updateAccessMode === "ALL_PROJECTS" ? [] : updateProjectIds,
      };
      console.log("Update request: ", body);
      await updateMember.mutateAsync({memberUserId : memberToUpdate.userId, req : body});
      setIsUpdateOpen(false);
      setMemberToUpdate(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTransferOwnership = (ownerUserId: string ) => {
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

  const memberColumns: Column<TeamMember>[] = [
    {
      header: "Member",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            {/* <AvatarImage src={row.avatar} /> */}
            <AvatarFallback className="bg-primary/20 text-primary text-sm">
              {row.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{row.name}</p>
            <p className="text-sm text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Email",
      accessor: (row) => row.email,
    },
    {
      header: "Role",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <span className="capitalize">{row.role}</span>
        </div>
      ),
    },
    {
      header: "Access Mode",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <span className="capitalize">{row.accessMode}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (row) => (
        <StatusBadge
          status={
            row.status === ("ACTIVE" as TeamMemberInvitationStatus)
              ? "Active"
              : "Pending"
          }
          variant={
            row.status === ("ACTIVE" as TeamMemberInvitationStatus)
              ? "success"
              : "warning"
          }
        />
      ),
    },
    {
      header: "",
      accessor: (row) =>
        row.role !== "OWNER" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-secondary rounded">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleTransferOwnership(row.userId)}>
                Make Owner
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openUpdateDialog(row)}>
                Change Permission
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleRemoveMember(row.id)}
                className="text-destructive"
              >
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      className: "w-12",
    },
  ];

  const inviteColumns: Column<Invitation>[] = [
    {
      header: "Email",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{row?.invitedEmail}</span>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: (row) => <span className="capitalize">{row?.roleToGrant}</span>,
    },
    {
      header: "Sent",
      accessor: (row) => (
        <span className="text-muted-foreground">
          {row?.createdAt
            ? new Date(row.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "-"}
        </span>
      ),
    },
    {
      header: "Expires",
      accessor: (row) => (
        <span className="text-muted-foreground">
          {row?.expiresAt
            ? new Date(row.expiresAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "-"}
        </span>
      ),
    },
    {
      header: "",
      accessor: (row) =>
        row?.status === "PENDING" ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAcceptInvite(row?.tokenHash)}
            className="text-success"
          >
            Accept
          </Button>
        ) : (
          <StatusBadge
            status={row?.status}
            variant={row.status === "ACCEPTED" ? "success" : "warning"}
          />
        ),
      className: "w-24",
    },
    {
      header: "",
      accessor: (row) =>
        row?.status === "PENDING" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCancelInvite(row?.tokenHash)}
            className="text-destructive"
          >
            Decline
          </Button>
        ),
      className: "w-24",
    },
  ];

  const recievedInvitesColumns: Column<Invitation>[] = [
    {
      header: "Email",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{row?.invitedEmail}</span>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: (row) => <span className="capitalize">{row?.roleToGrant}</span>,
    },
    {
      header: "Sent",
      accessor: (row) => (
        <span className="text-muted-foreground">
          {row?.createdAt
            ? new Date(row.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "-"}
        </span>
      ),
    },
    {
      header: "Expires",
      accessor: (row) => (
        <span className="text-muted-foreground">
          {row?.expiresAt
            ? new Date(row.expiresAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "-"}
        </span>
      ),
    },
    {
      header: "",
      accessor: (row) =>
        row?.status === "PENDING" ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRevokeInvite(row?.id)}
            className="text-destructive "
          >
            Revoke
          </Button>
        ) : (
          <StatusBadge
            status={row?.status}
            variant={row.status === "ACCEPTED" ? "success" : "warning"}
          />
        ),
      className: "w-24",
    },
  ];

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

        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your team. They'll receive an email
                with instructions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <Label>Email Addresses</Label>
                {inviteEmails.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="colleague@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                    />
                    {inviteEmails.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveEmail(index)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddEmail}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Another Email
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={inviteRole}
                  onValueChange={(value: "ADMIN" | "MEMBER") =>
                    setInviteRole(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MEMBER">Member</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="update-permission">Permission</Label>
                <Select
                  value={inviteAccessMode}
                  onValueChange={(value: TeamMemberAccessMode) =>
                    setInviteAccessMode(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL_PROJECTS">All Permission</SelectItem>
                    <SelectItem value="SCOPED_PROJECTS">
                      Scoped Permission
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {inviteAccessMode === "SCOPED_PROJECTS" &&
                projects &&
                projects.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Select Projects</Label>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0"
                        onClick={() => {
                          if (
                            projects &&
                            selectedProjectIds.length === projects.length
                          ) {
                            setSelectedProjectIds([]);
                          } else if (projects) {
                            setSelectedProjectIds(
                              projects.map((p: any) => p.id)
                            );
                          }
                        }}
                      >
                        {projects &&
                        selectedProjectIds.length === projects.length
                          ? "Deselect All"
                          : "Select All"}
                      </Button>
                    </div>
                    <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto space-y-2">
                      {projects.map((project: any) => (
                        <div
                          key={project.id}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            id={`project-${project.id}`}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={selectedProjectIds.includes(project.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProjectIds([
                                  ...selectedProjectIds,
                                  project.id,
                                ]);
                              } else {
                                setSelectedProjectIds(
                                  selectedProjectIds.filter(
                                    (id) => id !== project.id
                                  )
                                );
                              }
                            }}
                          />
                          <Label
                            htmlFor={`project-${project.id}`}
                            className="font-normal cursor-pointer"
                          >
                            {project.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInvite}>Send Invite</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Permissions</DialogTitle>
              <DialogDescription>
                Update role and project access for {memberToUpdate?.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="update-role">Role</Label>
                <Select
                  value={updateRole}
                  onValueChange={(value: "ADMIN" | "MEMBER") =>
                    setUpdateRole(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MEMBER">Member</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="update-dialog-permission">Permission</Label>
                <Select
                  value={updateAccessMode}
                  onValueChange={(value: TeamMemberAccessMode) =>
                    setUpdateAccessMode(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL_PROJECTS">All Permission</SelectItem>
                    <SelectItem value="SCOPED_PROJECTS">
                      Scoped Permission
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {updateAccessMode === "SCOPED_PROJECTS" &&
                projects &&
                projects.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Select Projects</Label>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0"
                        onClick={() => {
                          if (
                            projects &&
                            updateProjectIds.length === projects.length
                          ) {
                            setUpdateProjectIds([]);
                          } else if (projects) {
                            setUpdateProjectIds(projects.map((p: any) => p.id));
                          }
                        }}
                      >
                        {projects && updateProjectIds.length === projects.length
                          ? "Deselect All"
                          : "Select All"}
                      </Button>
                    </div>
                    <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto space-y-2">
                      {projects.map((project: any) => (
                        <div
                          key={project.id}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            id={`update-project-${project.id}`}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={updateProjectIds.includes(project.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setUpdateProjectIds([
                                  ...updateProjectIds,
                                  project.id,
                                ]);
                              } else {
                                setUpdateProjectIds(
                                  updateProjectIds.filter(
                                    (id) => id !== project.id
                                  )
                                );
                              }
                            }}
                          />
                          <Label
                            htmlFor={`update-project-${project.id}`}
                            className="font-normal cursor-pointer"
                          >
                            {project.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUpdateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateMember}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
