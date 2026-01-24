// src/react-query/team.query-keys.ts

export const teamQueryKeys = {
  all: ['teams'] as const,

  myTeams: () => [...teamQueryKeys.all, 'my'] as const,

  myMemberships: () => [...teamQueryKeys.all, 'my-memberships'] as const,

  detail: (teamId: string) =>
    [...teamQueryKeys.all, 'detail', teamId] as const,
};
