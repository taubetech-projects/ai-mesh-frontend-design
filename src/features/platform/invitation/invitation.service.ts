import {
  CreateInviteRequest,
  CreateInviteResponse,
  Invitation,
  TokenBody,
} from "./invitation.types";
import { UUID } from "../team/team.types";
import { platformProxyApi } from "@/lib/api/axiosApi";

const BASE = "/v1/api/platform";

export const InvitationService = {
  /* Team admin / owner */
  createInvites: (teamId: UUID, req: CreateInviteRequest) =>
    platformProxyApi
      .post<CreateInviteResponse[]>(`${BASE}/teams/${teamId}/invites`, req)
      .then(r => r.data),

  resendInvite: (teamId: UUID, invitationId: UUID) =>
    platformProxyApi.post<void>(
      `${BASE}/teams/${teamId}/invites/${invitationId}/resend`
    ),

  revokeInvite: (teamId: UUID, inviteId: UUID) =>
    platformProxyApi.post<void>(
      `${BASE}/teams/${teamId}/invites/${inviteId}/revoke`
    ),

  /* Listings */
  listTeamInvites: (teamId: UUID) =>
    platformProxyApi
      .get<Invitation[]>(`${BASE}/teams/${teamId}/invites`)
      .then(r => r.data),

  listSentInvites: () =>
    platformProxyApi
      .get<Invitation[]>(`${BASE}/invites/sent`)
      .then(r => r.data),

  listReceivedInvites: () =>
    platformProxyApi
      .get<Invitation[]>(`${BASE}/invites/received`)
      .then(r => r.data),

  /* Token lifecycle */
  issueToken: (invitationId: UUID) =>
    platformProxyApi
      .post<string>(`${BASE}/invites/${invitationId}/token`)
      .then(r => r.data),

  acceptInvite: (req: TokenBody) =>
    platformProxyApi.post(`${BASE}/invites/accept`, req),

  declineInvite: (req: TokenBody) =>
    platformProxyApi.post<void>(`${BASE}/invites/decline`, req),
};
