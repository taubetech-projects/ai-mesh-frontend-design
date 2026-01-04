export const projectApiKeyKeys = {
  all: ["project-api-keys"] as const,

  lists: () => [...projectApiKeyKeys.all, "list"] as const,

  listAllForUser: () =>
    [...projectApiKeyKeys.lists(), "all"] as const,

  listByProject: (projectId: string) =>
    [...projectApiKeyKeys.lists(), "project", projectId] as const,

  details: () =>
    [...projectApiKeyKeys.all, "detail"] as const,

  detail: (keyId: string) =>
    [...projectApiKeyKeys.details(), keyId] as const,
};
