export const adminTeamQueryKeys = {
  all: ['admin', 'teams'] as const,

  members: () => [...adminTeamQueryKeys.all, 'members'] as const,
  membersByTeam: (teamId: string) =>
    [...adminTeamQueryKeys.members(), 'team', teamId] as const,

  invitations: () => [...adminTeamQueryKeys.all, 'invitations'] as const,
  invitationsByTeam: (teamId: string) =>
    [...adminTeamQueryKeys.invitations(), 'team', teamId] as const,
};
