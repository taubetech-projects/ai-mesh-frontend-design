export const platformProjectKeys = {
  all: ["projects"] as const,

  owned: () => [...platformProjectKeys.all, "owned"] as const,

  memberOf: () => [...platformProjectKeys.all, "memberOf"] as const,

  detail: (projectId: string) =>
    [...platformProjectKeys.all, "detail", projectId] as const,
};
