// src/types/team.types.ts

export interface TeamView {
  id: string; // UUID
  name: string;
  ownerUserId: string; // UUID
  subscriptionId: string; // UUID
}

export interface CreateTeamRequest {
  name: string;
}

export interface UpdateTeamRequest {
  name: string;
}

export interface CreateInviteRequest {
  email: string;
}

export type SeatInvitationStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED';

export interface SeatInvitation {
  id: string;
  teamId: string;
  email: string;
  token: string;
  status: SeatInvitationStatus;
  expiresAt: string; // ISO string
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
