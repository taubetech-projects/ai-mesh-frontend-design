export interface MemberView {
  id: string;          // UUID
  teamId: string;      // UUID
  userId: string;      // UUID
  username: string;
  email: string;
  joinedAt: string;    // ISO OffsetDateTime
}

export interface SeatInvitationView {
  id: string;          // UUID
  teamId: string;      // UUID
  email: string;
  status: string;
  expiresAt: string;  // ISO OffsetDateTime
  createdAt: string;  // ISO OffsetDateTime
}
