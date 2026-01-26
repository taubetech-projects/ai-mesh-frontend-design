import { chatProxyApi } from "@/lib/api/axiosApi";
import {
  CreateSharingInviteRequest,
  SharingInviteView,
  IncomingShareView,
} from "./token-sharing.types";
import { TOKEN_SHARING_API_PATHS } from "@/shared/constants/constants";
import { UUID } from "@/features/platform/team/team.types";

export const TokenSharingApi = {
  // Invite friend
    inviteFriend: async(payload: CreateSharingInviteRequest): Promise<SharingInviteView> => {
      console.log("Invite Request : ", payload);
      const res = await chatProxyApi.post<SharingInviteView>(TOKEN_SHARING_API_PATHS.INVITES, payload);
      return res.data;
    },

  // Outgoing invites
  getOutgoing: async() => {
    const res = await chatProxyApi.get<SharingInviteView[]>(TOKEN_SHARING_API_PATHS.OUTGOING);
    return res.data;
  },

  // Renew share
  renewShare: async(id: string) => {
    const res = await chatProxyApi.post<void>(TOKEN_SHARING_API_PATHS.BASE + `/${id}/renew`);
    return res.data;
  },

  // Change portion
  changePortion: async(
    id: string,
    payload: Pick<CreateSharingInviteRequest, "fixedAmount" | "percent">
  ) => {
    const res = await chatProxyApi.patch<SharingInviteView>(
      TOKEN_SHARING_API_PATHS.BASE + `/${id}/portion`,
      payload
    );
    return res.data;
  },

  // Incoming shares
  getIncoming: async() => {
    const res = await chatProxyApi.get<IncomingShareView[]>(TOKEN_SHARING_API_PATHS.INCOMING);
    console.log("incoming", res.data);
    return res.data;
  },

  // Accept share
  acceptShare: async(id: UUID) => {
    console.log("accept", TOKEN_SHARING_API_PATHS +`/${id}/accept`);
    const res = await chatProxyApi.post<void>(TOKEN_SHARING_API_PATHS.BASE+`/${id}/accept`);
    return res.data;
  },

  // Reject share
  rejectShare: async(id: UUID) => {
    const res = await chatProxyApi.post<void>(TOKEN_SHARING_API_PATHS.BASE+`/${id}/reject`);
    return res.data;
  },
}
