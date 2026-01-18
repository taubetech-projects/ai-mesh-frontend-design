import { UUID } from "../team/team.types";

export const invitationKeys = {
  all: ["invitations"] as const,

  sent: () => [...invitationKeys.all, "sent"] as const,
  received: () => [...invitationKeys.all, "received"] as const,

  team: (teamId: UUID) =>
    [...invitationKeys.all, "team", teamId] as const,
};
