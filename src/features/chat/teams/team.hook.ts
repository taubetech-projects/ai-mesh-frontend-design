// src/react-query/team.hooks.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TeamApi } from './team.api';
import { teamQueryKeys } from './team.query-keys';
import { CreateTeamRequest, UpdateTeamRequest, CreateInviteRequest } from './team.types';

// =====================
// QUERIES
// =====================

export const useMyTeams = () => {
  return useQuery({
    queryKey: teamQueryKeys.myTeams(),
    queryFn: TeamApi.getMyTeams,
  });
};

export const useMyMemberships = () => {
  return useQuery({
    queryKey: teamQueryKeys.myMemberships(),
    queryFn: TeamApi.getMyMemberships,
  });
};

export const useTeamDetail = (teamId: string) => {
  return useQuery({
    queryKey: teamQueryKeys.detail(teamId),
    queryFn: () => TeamApi.getTeam(teamId),
    enabled: !!teamId,
  });
};

// =====================
// MUTATIONS
// =====================

export const useCreateTeam = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (req: CreateTeamRequest) => TeamApi.createTeam(req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: teamQueryKeys.myTeams() });
    },
  });
};

export const useUpdateTeam = (teamId: string) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (req: UpdateTeamRequest) =>
      TeamApi.updateTeam(teamId, req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: teamQueryKeys.detail(teamId) });
      qc.invalidateQueries({ queryKey: teamQueryKeys.myTeams() });
    },
  });
};

export const useDeleteTeam = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (teamId: string) => TeamApi.deleteTeam(teamId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: teamQueryKeys.myTeams() });
      qc.invalidateQueries({ queryKey: teamQueryKeys.myMemberships() });
    },
  });
};

export const useInviteMember = (teamId: string) => {
  return useMutation({
    mutationFn: (req: CreateInviteRequest) =>
      TeamApi.inviteMember(teamId, req),
  });
};

export const useAcceptInvite = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => TeamApi.acceptInvite(token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: teamQueryKeys.myTeams() });
      qc.invalidateQueries({ queryKey: teamQueryKeys.myMemberships() });
    },
  });
};
