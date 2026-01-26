import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TokenSharingApi } from "../token-sharing.api";
import { tokenSharingKeys } from "../token-sharing.query-keys";
import { CreateSharingInviteRequest } from "../token-sharing.types";
import { UUID } from "@/features/platform/team/team.types";

// --------------------
// Queries
// --------------------

export const useOutgoingShares = () =>
  useQuery({
    queryKey: tokenSharingKeys.outgoing(),
    queryFn: () => TokenSharingApi.getOutgoing(),
  });

export const useIncomingShares = () =>
  useQuery({
    queryKey: tokenSharingKeys.incoming(),
    queryFn: () => TokenSharingApi.getIncoming(),
  });

// --------------------
// Mutations
// --------------------

export const useInviteFriend = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSharingInviteRequest) =>
      TokenSharingApi.inviteFriend(payload),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tokenSharingKeys.outgoing() });
    },
  });
};

export const useRenewShare = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TokenSharingApi.renewShare(id),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tokenSharingKeys.outgoing() });
    },
  });
};

export const useChangePortion = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      fixedAmount,
      percent,
    }: {
      id: string;
      fixedAmount?: number;
      percent?: number;
    }) =>
      TokenSharingApi.changePortion(id, { fixedAmount, percent }),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tokenSharingKeys.outgoing() });
      qc.invalidateQueries({ queryKey: tokenSharingKeys.incoming() });
    },
  });
};

export const useAcceptShare = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: UUID) => TokenSharingApi.acceptShare(id),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tokenSharingKeys.incoming() });
      qc.invalidateQueries({ queryKey: tokenSharingKeys.outgoing() });
    },
  });
};

export const useRejectShare = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: UUID) => TokenSharingApi.rejectShare(id),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tokenSharingKeys.incoming() });
    },
  });
};
