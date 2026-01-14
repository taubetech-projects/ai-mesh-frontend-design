import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
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
import { CreateInviteRequest } from "@/features/platform/invitation/invitation.types";
import { TeamMemberAccessMode } from "@/features/platform/team/team.types";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: any[];
  onSubmit: (data: CreateInviteRequest) => Promise<void>;
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  projects,
  onSubmit,
}: InviteMemberDialogProps) {
  const [inviteEmails, setInviteEmails] = useState<string[]>([""]);
  const [inviteRole, setInviteRole] = useState<"ADMIN" | "MEMBER">("MEMBER");
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [inviteAccessMode, setInviteAccessMode] =
    useState<TeamMemberAccessMode>("ALL_PROJECTS");

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

    const body: CreateInviteRequest = {
      emails: validEmails,
      role: inviteRole,
      accessMode: inviteAccessMode,
      projectIds: inviteAccessMode === "ALL_PROJECTS" ? [] : selectedProjectIds,
      expiresHours: 24,
    };

    await onSubmit(body);

    // Reset state
    setInviteEmails([""]);
    setSelectedProjectIds([]);
    setInviteAccessMode("ALL_PROJECTS");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join your team. They'll receive an email with
            instructions.
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
                        setSelectedProjectIds(projects.map((p: any) => p.id));
                      }
                    }}
                  >
                    {projects && selectedProjectIds.length === projects.length
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInvite}>Send Invite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
