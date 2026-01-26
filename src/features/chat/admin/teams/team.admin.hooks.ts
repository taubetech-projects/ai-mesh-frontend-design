import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminTeamApi } from './team.admin.api';
import { adminTeamQueryKeys } from './team.admin.keys';
import { handleApiErrorToast } from '@/shared/utils/toast.helper';

// -------- MEMBERS --------

export const useAdminAllMembers = () => {
  return useQuery({
    queryKey: adminTeamQueryKeys.members(),
    queryFn: AdminTeamApi.getAllMembers,
  });
};

export const useAdminMembersByTeam = (teamId?: string) => {
  return useQuery({
    queryKey: adminTeamQueryKeys.membersByTeam(teamId!),
    queryFn: () => AdminTeamApi.getMembersByTeam(teamId!),
    enabled: !!teamId,
  });
};

export const useAdminRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) =>
      AdminTeamApi.removeMember(memberId),
    onSuccess: () => {
      // Invalidate all member lists
      queryClient.invalidateQueries({
        queryKey: adminTeamQueryKeys.members(),
      });
    },
    onError: handleApiErrorToast
  });
};

// -------- INVITATIONS --------

export const useAdminAllInvitations = () => {
  return useQuery({
    queryKey: adminTeamQueryKeys.invitations(),
    queryFn: AdminTeamApi.getAllInvitations,
  });
};

export const useAdminInvitationsByTeam = (teamId?: string) => {
  return useQuery({
    queryKey: adminTeamQueryKeys.invitationsByTeam(teamId!),
    queryFn: () => AdminTeamApi.getInvitationsByTeam(teamId!),
    enabled: !!teamId,
  });
};

export const useAdminCancelInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      AdminTeamApi.cancelInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminTeamQueryKeys.invitations(),
      });
    },
    onError: handleApiErrorToast
  });
};
