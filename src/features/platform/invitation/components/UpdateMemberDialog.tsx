import { useEffect, useState } from "react";
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
import { Label } from "@/shared/components/ui/label";
import {
  TeamMemberAccessMode,
  UpdateMemberRequest,
} from "@/features/platform/team/team.types";
import { TeamMember } from "../invitation.types";

interface UpdateMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember | null;
  projects: any[];
  onSubmit: (memberId: string, data: UpdateMemberRequest) => Promise<void>;
}

export function UpdateMemberDialog({
  open,
  onOpenChange,
  member,
  projects,
  onSubmit,
}: UpdateMemberDialogProps) {
  const [updateRole, setUpdateRole] = useState<"ADMIN" | "MEMBER">("MEMBER");
  const [updateProjectIds, setUpdateProjectIds] = useState<string[]>([]);
  const [updateAccessMode, setUpdateAccessMode] =
    useState<TeamMemberAccessMode>("ALL_PROJECTS");

  useEffect(() => {
    if (member) {
      setUpdateRole(member.role === "OWNER" ? "ADMIN" : member.role);
      setUpdateAccessMode(member.accessMode);
      setUpdateProjectIds(member.projects?.map((p) => p) ?? []);
    }
  }, [member]);

  const handleUpdateMember = async () => {
    if (!member) return;
    const body: UpdateMemberRequest = {
      role: updateRole,
      accessMode: updateAccessMode,
      projectIds: updateAccessMode === "ALL_PROJECTS" ? [] : updateProjectIds,
    };
    await onSubmit(member.userId, body);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Permissions</DialogTitle>
          <DialogDescription>
            Update role and project access for {member?.name}.
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
                    <div key={project.id} className="flex items-center gap-2">
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
                              updateProjectIds.filter((id) => id !== project.id)
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdateMember}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
