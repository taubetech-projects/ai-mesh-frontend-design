export type UUID = string;

/* =======================
   Team
======================= */
export interface Team {
  id: UUID;
  name: string;
  description?: string;
  ownerUserId: UUID;
  createdAt: string;   // ISO string
  updatedAt: string;
}

/* =======================
   Requests
======================= */
export interface CreateTeamRequest {
  name: string;
  description?: string;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
}

export interface TeamTransferOwnershipRequest {
  newOwnerUserId: UUID;
}

/* =======================
   Team Membership
======================= */
export type TeamMemberRole = "OWNER" | "ADMIN" | "MEMBER";
export type TeamMemberAccessMode = "ALL_PROJECTS" | "SCOPED_PROJECTS";
export type TeamMemberStatus = "ACTIVE" | "SUSPENDED";

export interface TeamMembership {
  id: UUID;
  teamId: UUID;
  userId: UUID;
  role: TeamMemberRole;
  accessMode: TeamMemberAccessMode;
  status: TeamMemberStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateMemberRequest {
  role?: TeamMemberRole;
  accessMode?: TeamMemberAccessMode;
  status?: TeamMemberStatus;
}
