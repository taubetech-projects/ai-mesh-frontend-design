export const projectKeys = {
  all: ["projects"] as const,

  owned: () => [...projectKeys.all, "owned"] as const,

  memberOf: () => [...projectKeys.all, "memberOf"] as const,

  detail: (projectId: string) =>
    [...projectKeys.all, "detail", projectId] as const,
};
