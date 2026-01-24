// src/api/team.api.ts
import { BILLING_API_PATHS, TEAMS_API_PATHS } from '@/shared/constants/constants';
import {
  TeamView,
  CreateTeamRequest,
  UpdateTeamRequest,
  CreateInviteRequest,
  SeatInvitation,
  TeamMember,   
} from './team.types';
import { chatProxyApi } from '@/lib/api/axiosApi';

// const BASE = '/v1/api/chat/teams';

export class TeamApi {
  // CREATE TEAM
  static async createTeam(req: CreateTeamRequest): Promise<TeamView> {
    const { data } = await chatProxyApi.post<TeamView>(TEAMS_API_PATHS.BASE, req);
    return data;
  }

  // LIST TEAMS I OWN
  static async getMyTeams(): Promise<TeamView[]> {
    const { data } = await chatProxyApi.get<TeamView[]>(TEAMS_API_PATHS.BASE + '/my');
    return data;
  }

  // LIST TEAMS WHERE I'M MEMBER
  static async getMyMemberships(): Promise<TeamView[]> {
    const { data } = await chatProxyApi.get<TeamView[]>(TEAMS_API_PATHS.BASE + '/my-memberships');
    return data;
  }

  // GET TEAM DETAILS
  static async getTeam(teamId: string): Promise<TeamView> {
    const { data } = await chatProxyApi.get<TeamView>(TEAMS_API_PATHS.BASE + '/' + teamId);
    return data;
  }

  // UPDATE TEAM
  static async updateTeam(teamId: string, req: UpdateTeamRequest): Promise<TeamView> {
    const { data } = await chatProxyApi.patch<TeamView>(TEAMS_API_PATHS.BASE + '/' + teamId, req);
    return data;
  }

  // DELETE TEAM
  static async deleteTeam(teamId: string): Promise<void> {
    await chatProxyApi.delete(TEAMS_API_PATHS.BASE + '/' + teamId);
  }

  // INVITE MEMBER
  static async inviteMember(
    teamId: string,
    req: CreateInviteRequest
  ): Promise<SeatInvitation> {
    const { data } = await chatProxyApi.post<SeatInvitation>(
      TEAMS_API_PATHS.BASE + '/' + teamId + '/invite',
      req
    );
    return data;
  }

  // ACCEPT INVITE
  static async acceptInvite(token: string): Promise<TeamMember> {
    const { data } = await chatProxyApi.post<TeamMember>(
      TEAMS_API_PATHS.BASE + '/invite/' + token + '/accept'
    );
    return data;
  }
}
