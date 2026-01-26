// types/adminUser.ts

export type UUID = string;

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'; // adjust to your enum

export interface UserSummaryView {
  id: UUID;
  username: string;
  email: string;
  userStatus: UserStatus;
  twofaEnabled: boolean;
  roles: string[];
}

export interface UserDetailsView {
  id: UUID;
  username: string;
  email: string;
  firstname: string;
  lastName: string;
  phoneNumber: string;
  userStatus: UserStatus;
  twofaEnabled: boolean;
  roles: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminCreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastName: string;
  phoneNumber: string;
  roles: string[];
  userStatus: UserStatus;
}

export interface AdminUpdateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userStatus: UserStatus;
  roles: string[];
}
