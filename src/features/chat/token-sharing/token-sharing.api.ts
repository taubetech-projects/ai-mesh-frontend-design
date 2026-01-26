import { chatProxyApi } from "@/lib/api/axiosApi";
import {
  CreateSharingInviteRequest,
  SharingInviteView,
  IncomingShareView,
} from "./token-sharing.types";
import { TOKEN_SHARING_API_PATHS } from "@/shared/constants/constants";

export class TokenSharingApi {
  // Invite friend
  static inviteFriend(payload: CreateSharingInviteRequest) {
    return chatProxyApi.post<SharingInviteView>(TOKEN_SHARING_API_PATHS.INVITES, payload);
  }

  // Outgoing invites
  static getOutgoing() {
    return chatProxyApi.get<SharingInviteView[]>(TOKEN_SHARING_API_PATHS.OUTGOING);
  }

  // Renew share
  static renewShare(id: string) {
    return chatProxyApi.post<void>(TOKEN_SHARING_API_PATHS.OUTGOING + `/${id}/renew`);
  }

  // Change portion
  static changePortion(
    id: string,
    payload: Pick<CreateSharingInviteRequest, "fixedAmount" | "percent">
  ) {
    return chatProxyApi.patch<SharingInviteView>(
      TOKEN_SHARING_API_PATHS.OUTGOING + `/${id}/portion`,
      payload
    );
  }

  // Incoming shares
  static getIncoming() {
    return chatProxyApi.get<IncomingShareView[]>(TOKEN_SHARING_API_PATHS.INCOMING);
  }

  // Accept share
  static acceptShare(id: string) {
    return chatProxyApi.post<void>(TOKEN_SHARING_API_PATHS.INCOMING + `/${id}/accept`);
  }

  // Reject share
  static rejectShare(id: string) {
    return chatProxyApi.post<void>(TOKEN_SHARING_API_PATHS.INCOMING + `/${id}/reject`);
  }
}
