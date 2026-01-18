import { MoreHorizontal, Mail, Shield, Lock } from "lucide-react";
import { StatusBadge, Column } from "@/features/platform/components/platform";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { TeamMember } from "../invitation.types";
import {
  Invitation,
  TeamMemberInvitationStatus,
} from "@/features/platform/invitation/invitation.types";
import { UUID } from "@/features/platform/team/team.types";

export const getMemberColumns = (
  onTransferOwnership: (userId: string) => void,
  onUpdate: (member: TeamMember) => void,
  onRemove: (userId: UUID) => void
): Column<TeamMember>[] => [
  {
    header: "Member",
    accessor: (row) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
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
            <DropdownMenuItem onClick={() => onTransferOwnership(row.userId)}>
              Make Owner
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdate(row)}>
              Change Permission
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onRemove(row.userId)}
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

export const getInviteColumns = (
  onAccept: (token: string) => void,
  onDecline: (token: string) => void
): Column<Invitation>[] => [
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
          onClick={() => onAccept(row?.tokenHash)}
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
          onClick={() => onDecline(row?.tokenHash)}
          className="text-destructive"
        >
          Decline
        </Button>
      ),
    className: "w-24",
  },
];

export const getReceivedInviteColumns = (
  onRevoke: (id: string) => void
): Column<Invitation>[] => [
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
          onClick={() => onRevoke(row?.id)}
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
