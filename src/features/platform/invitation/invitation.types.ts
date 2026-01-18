import { UUID } from "../team/team.types";
import {
  TeamMemberRole,
  TeamMemberAccessMode,
} from "../team/team.types";

/* =======================
   Requests / Responses
======================= */
export interface CreateInviteRequest {
  emails: string[];
  role: TeamMemberRole;                    // ADMIN | MEMBER
  accessMode: TeamMemberAccessMode;        // ALL_PROJECTS | SCOPED_PROJECTS
  projectIds?: UUID[];                     // required if SCOPED_PROJECTS
  expiresHours?: number;
}

export interface CreateInviteResponse {
  email: string;
  invitationId: UUID;
  token: string; // returned once
}

export interface TokenBody {
  token: string;
}

export type TeamMemberInvitationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED"
  | "EXPIRED"
  | "REVOKED";

/* =======================
   Invitation Entity
======================= */
export interface Invitation {
  id: UUID;
  teamId: UUID;
  invitedEmail: string;
  invitedByUserId: UUID;
  roleToGrant: TeamMemberRole;
  accessModeToGrant: TeamMemberAccessMode;
  expiresAt?: string;
  status: TeamMemberInvitationStatus;
  tokenHash: string;
  acceptedByUserId?: UUID;
  acceptedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
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

export interface Invite {
  id: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  sentAt: string;
  expiresAt: string;
}
