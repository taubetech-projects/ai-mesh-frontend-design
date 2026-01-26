export const tokenSharingKeys = {
  all: ["tokenSharing"] as const,

  outgoing: () => [...tokenSharingKeys.all, "outgoing"] as const,
  incoming: () => [...tokenSharingKeys.all, "incoming"] as const,
};
