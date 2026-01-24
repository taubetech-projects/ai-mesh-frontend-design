import { chatProxyApi } from "@/lib/api/axiosApi";
import {
  CreateSharingInviteRequest,
  SharingInviteView,
  IncomingShareView,
} from "./token-sharing.types";

const BASE_URL = "/v1/api/tokens/sharing";

export class TokenSharingApi {
  // Invite friend
  static inviteFriend(payload: CreateSharingInviteRequest) {
    return chatProxyApi.post<SharingInviteView>(`${BASE_URL}/invites`, payload);
  }

  // Outgoing invites
  static getOutgoing() {
    return chatProxyApi.get<SharingInviteView[]>(`${BASE_URL}/outgoing`);
  }

  // Renew share
  static renewShare(id: string) {
    return chatProxyApi.post<void>(`${BASE_URL}/${id}/renew`);
  }

  // Change portion
  static changePortion(
    id: string,
    payload: Pick<CreateSharingInviteRequest, "fixedAmount" | "percent">
  ) {
    return chatProxyApi.patch<SharingInviteView>(
      `${BASE_URL}/${id}/portion`,
      payload
    );
  }

  // Incoming shares
  static getIncoming() {
    return chatProxyApi.get<IncomingShareView[]>(`${BASE_URL}/incoming`);
  }

  // Accept share
  static acceptShare(id: string) {
    return chatProxyApi.post<void>(`${BASE_URL}/${id}/accept`);
  }

  // Reject share
  static rejectShare(id: string) {
    return chatProxyApi.post<void>(`${BASE_URL}/${id}/reject`);
  }
}
