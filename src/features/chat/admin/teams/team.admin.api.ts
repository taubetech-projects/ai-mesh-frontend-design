import { MemberView, SeatInvitationView } from './team.admin.types';
import { chatProxyApi } from '@/lib/api/axiosApi';

const BASE_URL = '/v1/api/chat/admin/teams';

export class AdminTeamApi {
  // -------- MEMBERS --------

  static async getAllMembers(): Promise<MemberView[]> {
    const res = await chatProxyApi.get<MemberView[]>(`${BASE_URL}/members`);
    return res.data;
  }

  static async getMembersByTeam(teamId: string): Promise<MemberView[]> {
    const res = await chatProxyApi.get<MemberView[]>(
      `${BASE_URL}/${teamId}/members`
    );
    return res.data;
  }

  static async removeMember(memberId: string): Promise<void> {
    await chatProxyApi.delete(`${BASE_URL}/members/${memberId}`);
  }

  // -------- INVITATIONS --------

  static async getAllInvitations(): Promise<SeatInvitationView[]> {
    const res = await chatProxyApi.get<SeatInvitationView[]>(
      `${BASE_URL}/invitations`
    );
    return res.data;
  }

  static async getInvitationsByTeam(
    teamId: string
  ): Promise<SeatInvitationView[]> {
    const res = await chatProxyApi.get<SeatInvitationView[]>(
      `${BASE_URL}/${teamId}/invitations`
    );
    return res.data;
  }

  static async cancelInvitation(invitationId: string): Promise<void> {
    await chatProxyApi.delete(
      `${BASE_URL}/invitations/${invitationId}`
    );
  }
}
