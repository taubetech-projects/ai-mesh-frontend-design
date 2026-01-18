import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InvitationService } from "./invitation.service";
import { invitationKeys } from "./invitation.keys";
import { teamKeys } from "../team/team.keys";
import { CreateInviteRequest, TokenBody } from "./invitation.types";
import { UUID } from "../team/team.types";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { ErrorResponse } from "@/features/chat/auth/types/authModels";
import {
  handleApiErrorToast,
  showSuccessToast,
} from "@/shared/utils/toast.helper";

export const useTeamInvites = (teamId: UUID) =>
  useQuery({
    queryKey: invitationKeys.team(teamId),
    queryFn: () => InvitationService.listTeamInvites(teamId),
    enabled: !!teamId,
  });

export const useSentInvites = () =>
  useQuery({
    queryKey: invitationKeys.sent(),
    queryFn: InvitationService.listSentInvites,
  });

export const useReceivedInvites = () =>
  useQuery({
    queryKey: invitationKeys.received(),
    queryFn: InvitationService.listReceivedInvites,
  });

/* =======================
   Mutations
======================= */
export const useCreateInvites = (selectedTeam: UUID) => {
  const qc = useQueryClient();
  // const selectedTeam = useSelector((state: any) => state.team?.selectedTeam);

  return useMutation({
    mutationFn: (req: CreateInviteRequest) =>
      InvitationService.createInvites(selectedTeam, req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: invitationKeys.team(selectedTeam) });
      qc.invalidateQueries({ queryKey: invitationKeys.sent() });
      showSuccessToast("Invites sent successfully!");
    },
    onError: handleApiErrorToast,
  });
};

export const useResendInvite = () => {
  const qc = useQueryClient();
  const selectedTeam = useSelector((state: any) => state.team?.selectedTeam);

  return useMutation({
    mutationFn: (invitationId: UUID) =>
      InvitationService.resendInvite(selectedTeam.id, invitationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: invitationKeys.team(selectedTeam.id) });
      showSuccessToast("Invite resent successfully!");
    },
    onError: handleApiErrorToast,
  });
};

export const useRevokeInvite = () => {
  const qc = useQueryClient();
  const selectedTeam = useSelector((state: any) => state.team?.selectedTeam);

  return useMutation({
    mutationFn: (inviteId: UUID) =>
      InvitationService.revokeInvite(selectedTeam?.id, inviteId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: invitationKeys.team(selectedTeam.id) });
      qc.invalidateQueries({ queryKey: invitationKeys.sent() });
      showSuccessToast("Invite revoked successfully!");
    },
    onError: handleApiErrorToast,
  });
};

export const useIssueInviteToken = () =>
  useMutation({
    mutationFn: (invitationId: UUID) =>
      InvitationService.issueToken(invitationId),
    onSuccess: () => {
      showSuccessToast("Invite token issued successfully!");
    },
    onError: handleApiErrorToast,
  });

export const useAcceptInvite = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (req: TokenBody) => InvitationService.acceptInvite(req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: invitationKeys.received() });
      qc.invalidateQueries({ queryKey: teamKeys.listMine() });
      showSuccessToast("Invite accepted successfully!");
    },
    onError: handleApiErrorToast,
  });
};

export const useDeclineInvite = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (req: TokenBody) => InvitationService.declineInvite(req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: invitationKeys.received() });
      showSuccessToast("Invite declined successfully!");
    },
    onError: handleApiErrorToast,
  });
};
