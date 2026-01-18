import { platformProxyApi } from "@/lib/api/axiosApi";
import {
  Team,
  CreateTeamRequest,
  UpdateTeamRequest,
  TeamMembership,
  UpdateMemberRequest,
  TeamTransferOwnershipRequest,
  UUID,
} from "./team.types";

const BASE = "/v1/api/platform/teams";

/* =======================
   Teams
======================= */
export const TeamService = {
  createTeam: (req: CreateTeamRequest) =>
    platformProxyApi.post<Team>(BASE, req).then(r => r.data),

  getMyTeams: () =>
    platformProxyApi.get<Team[]>(BASE).then(r => r.data),

  getTeam: (teamId: UUID) =>
    platformProxyApi.get<Team>(`${BASE}/${teamId}`).then(r => r.data),

  updateTeam: (teamId: UUID, req: UpdateTeamRequest) =>
    platformProxyApi.patch<Team>(`${BASE}/${teamId}`, req).then(r => r.data),

  deleteTeam: (teamId: UUID) =>
    platformProxyApi.delete<void>(`${BASE}/${teamId}`),

  /* =======================
     Members
  ======================= */
  getMembers: (teamId: UUID) =>
    platformProxyApi.get<TeamMembership[]>(`${BASE}/${teamId}/members`).then(r => r.data),

  updateMember: (
    teamId: UUID,
    memberUserId: UUID,
    req: UpdateMemberRequest
  ) =>
    platformProxyApi.patch<TeamMembership>(
      `${BASE}/${teamId}/members/${memberUserId}`,
      req
    ).then(r => r.data),

  removeMember: (teamId: UUID, memberUserId: UUID) =>
    platformProxyApi.delete<void>(`${BASE}/${teamId}/members/${memberUserId}`),

  /* =======================
     Ownership
  ======================= */
  transferOwnership: (
    teamId: UUID,
    req: TeamTransferOwnershipRequest
  ) =>
    platformProxyApi.post<Team>(
      `${BASE}/${teamId}/transfer-ownership`,
      req
    ).then(r => r.data),
};
