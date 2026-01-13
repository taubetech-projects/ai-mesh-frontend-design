"use client";

import { useState } from "react";
import {
  Plus,
  MoreHorizontal,
  Mail,
  Shield,
  Users,
  Trash2,
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
  useCreateInvites,
  useReceivedInvites,
  useSentInvites,
} from "@/features/platform/invitation/invitation.hooks";
import { useTeamMembers } from "@/features/platform/team/team.queries";
import { CreateInviteRequest } from "@/features/platform/invitation/invitation.types";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  status: "active" | "pending";
  joinedAt: string;
  avatar?: string;
}

interface Invite {
  id: string;
  email: string;
  role: "admin" | "member";
  sentAt: string;
  expiresAt: string;
}

const mockMembers: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "owner",
    status: "active",
    joinedAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "admin",
    status: "active",
    joinedAt: "2024-01-10",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "member",
    status: "active",
    joinedAt: "2024-01-15",
  },
];

const mockInvites: Invite[] = [
  {
    id: "1",
    email: "alice@example.com",
    role: "member",
    sentAt: "2024-01-20",
    expiresAt: "2024-01-27",
  },
];

export default function TeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>(mockMembers);
  const [invites, setInvites] = useState<Invite[]>(mockInvites);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmails, setInviteEmails] = useState<string[]>([""]);
  const [inviteRole, setInviteRole] = useState<"ADMIN" | "MEMBER">("MEMBER");
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);

  const selectedTeam = useSelector((state: any) => state.team?.selectedTeam);

  //hooks
  const { data: projects } = useOwnedProjectsQuery();
  const createInvitations = useCreateInvites(selectedTeam.id);
  const { data: teamMembers } = useTeamMembers();
  const { data: sentInvites } = useSentInvites();
  const { data: receivedInvites } = useReceivedInvites();

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
        accessMode: inviteRole === "ADMIN" ? "ALL_PROJECTS" : "SCOPED_PROJECTS",
        projectIds: inviteRole === "ADMIN" ? [] : selectedProjectIds,
        expiresHours: 24,
      };
      console.log("Invite request: ", body);
      await createInvitations.mutateAsync(body);

      setIsInviteOpen(false);
      setInviteEmails([""]);
      setSelectedProjectIds([]);
    } catch (error) {
      // Error handling is typically done in the mutation hook or global error handler
      console.error(error);
    }
  };

  const handleRemoveMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    toast({
      title: "Member Removed",
      description: "The team member has been removed.",
    });
  };

  const handleCancelInvite = (id: string) => {
    setInvites((prev) => prev.filter((i) => i.id !== id));
    toast({
      title: "Invite Cancelled",
      description: "The invitation has been cancelled.",
    });
  };

  const memberColumns: Column<TeamMember>[] = [
    {
      header: "Member",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.avatar} />
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
      header: "Role",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <span className="capitalize">{row.role}</span>
        </div>
      ),
    },
    {
      header: "Joined",
      accessor: "joinedAt",
    },
    {
      header: "Status",
      accessor: (row) => (
        <StatusBadge
          status={row.status === "active" ? "Active" : "Pending"}
          variant={row.status === "active" ? "success" : "warning"}
        />
      ),
    },
    {
      header: "",
      accessor: (row) =>
        row.role !== "owner" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-secondary rounded">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Change Role</DropdownMenuItem>
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

  const inviteColumns: Column<Invite>[] = [
    {
      header: "Email",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{row.email}</span>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: (row) => <span className="capitalize">{row.role}</span>,
    },
    {
      header: "Sent",
      accessor: "sentAt",
    },
    {
      header: "Expires",
      accessor: "expiresAt",
    },
    {
      header: "",
      accessor: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleCancelInvite(row.id)}
          className="text-destructive hover:text-destructive"
        >
          Cancel
        </Button>
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
              Members ({members.length})
            </TabsTrigger>
            <TabsTrigger value="invites">
              Pending Invites ({invites.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            {members.length > 0 ? (
              <DataTable columns={memberColumns} data={members} />
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
              <DataTable columns={inviteColumns} data={invites} />
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

              {inviteRole === "MEMBER" && projects && projects.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Select Projects</Label>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0"
                      onClick={() => {
                        if (selectedProjectIds.length === projects.length) {
                          setSelectedProjectIds([]);
                        } else {
                          setSelectedProjectIds(projects.map((p: any) => p.id));
                        }
                      }}
                    >
                      {selectedProjectIds.length === projects.length
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                  </div>
                  <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto space-y-2">
                    {projects.map((project: any) => (
                      <div key={project.id} className="flex items-center gap-2">
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
      </div>
    </DashboardLayout>
  );
}
