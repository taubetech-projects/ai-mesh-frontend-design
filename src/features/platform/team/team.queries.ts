import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TeamService } from "./team.service";
import { teamKeys } from "./team.keys";
import {
  CreateTeamRequest,
  UpdateTeamRequest,
  UpdateMemberRequest,
  TeamTransferOwnershipRequest,
  UUID,
} from "./team.types";
import {
  handleApiErrorToast,
  showSuccessToast,
} from "@/shared/utils/toast.helper";

/* =======================
   Queries
======================= */
export const useMyTeams = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: teamKeys.listMine(),
    queryFn: TeamService.getMyTeams,
    enabled: options?.enabled ?? true,
  });

export const useTeam = (teamId: UUID) =>
  useQuery({
    queryKey: teamKeys.detail(teamId),
    queryFn: () => TeamService.getTeam(teamId),
    enabled: !!teamId,
  });

export const useTeamMembers = (teamId: UUID) => {
  return useQuery({
    queryKey: teamKeys.members(teamId),
    queryFn: () => TeamService.getMembers(teamId),
    enabled: !!teamId,
  });
};

/* =======================
   Mutations
======================= */
export const useCreateTeam = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (req: CreateTeamRequest) => TeamService.createTeam(req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: teamKeys.listMine() });
      showSuccessToast("Team created successfully");
    },
    onError: handleApiErrorToast,
  });
};

export const useUpdateTeam = (teamId: UUID) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (req: UpdateTeamRequest) => TeamService.updateTeam(teamId, req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: teamKeys.detail(teamId) });
      qc.invalidateQueries({ queryKey: teamKeys.listMine() });
      showSuccessToast("Team updated successfully!");
    },
  });
};

export const useDeleteTeam = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (teamId: UUID) => TeamService.deleteTeam(teamId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: teamKeys.listMine() });
      showSuccessToast("Team deleted successfully!");
    },
    onError: handleApiErrorToast,
  });
};

export const useUpdateMember = (teamId: UUID) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberUserId,
      req,
    }: {
      memberUserId: UUID;
      req: UpdateMemberRequest;
    }) => TeamService.updateMember(teamId, memberUserId, req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: teamKeys.members(teamId) });
      showSuccessToast("Member updated successfully!");
    },
    onError: handleApiErrorToast,
  });
};

export const useRemoveMember = (teamId: UUID) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (memberUserId: UUID) =>
      TeamService.removeMember(teamId, memberUserId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: teamKeys.members(teamId) });
      showSuccessToast("Member removed successfully!");
    },
    onError: handleApiErrorToast,
  });
};

export const useTransferOwnership = (teamId: UUID) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (req: TeamTransferOwnershipRequest) =>
      TeamService.transferOwnership(teamId, req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: teamKeys.detail(teamId) });
      qc.invalidateQueries({ queryKey: teamKeys.members(teamId) });
      showSuccessToast("Ownership transferred successfully!");
    },
    onError: handleApiErrorToast,
  });
};
