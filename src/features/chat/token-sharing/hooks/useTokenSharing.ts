import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TokenSharingApi } from "../token-sharing.api";
import { tokenSharingKeys } from "../token-sharing.query-keys";
import { CreateSharingInviteRequest } from "../token-sharing.types";

// --------------------
// Queries
// --------------------

export const useOutgoingShares = () =>
  useQuery({
    queryKey: tokenSharingKeys.outgoing(),
    queryFn: async () => {
      const res = await TokenSharingApi.getOutgoing();
      return res.data;
    },
  });

export const useIncomingShares = () =>
  useQuery({
    queryKey: tokenSharingKeys.incoming(),
    queryFn: async () => {
      const res = await TokenSharingApi.getIncoming();
      return res.data;
    },
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
    mutationFn: (id: string) => TokenSharingApi.acceptShare(id),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tokenSharingKeys.incoming() });
      qc.invalidateQueries({ queryKey: tokenSharingKeys.outgoing() });
    },
  });
};

export const useRejectShare = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TokenSharingApi.rejectShare(id),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tokenSharingKeys.incoming() });
    },
  });
};
