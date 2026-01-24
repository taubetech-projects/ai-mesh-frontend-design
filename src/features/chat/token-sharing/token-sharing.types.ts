// enums

export enum ShareStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
}

export enum ShareDurationType {
  UNLIMITED = "UNLIMITED",
  FIXED_PERIOD = "FIXED_PERIOD",
}

// requests

export interface CreateSharingInviteRequest {
  receiverEmail?: string;
  receiverUserId?: string; // UUID
  fixedAmount?: number;   // Long
  percent?: number;       // Integer
  durationType: ShareDurationType;
  totalPeriods?: number;  // nullable for unlimited
  invitationExpiresAt?: string; // ISO string
}

// responses

export interface SharingInviteView {
  id: string;
  receiverEmail?: string;
  receiverUserId?: string;
  fixedAmount?: number;
  percent?: number;
  status: ShareStatus;
  durationType: ShareDurationType;
  totalPeriods?: number;
  periodsConsumed: number;
  invitationExpiresAt?: string;
  lastRenewedAt?: string;
}

export interface IncomingShareView {
  id: string;
  senderUsername: string;
  fixedAmount?: number;
  percent?: number;
  durationType: ShareDurationType;
  totalPeriods?: number;
  periodsConsumed: number;
  status: ShareStatus;
}
