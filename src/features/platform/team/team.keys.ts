import { UUID } from "./team.types";

export const teamKeys = {
  all: ["teams"] as const,

  lists: () => [...teamKeys.all, "list"] as const,
  listMine: () => [...teamKeys.lists(), "mine"] as const,

  details: () => [...teamKeys.all, "detail"] as const,
  detail: (teamId: UUID) => [...teamKeys.details(), teamId] as const,

  members: (teamId: UUID) =>
    [...teamKeys.detail(teamId), "members"] as const,
};
