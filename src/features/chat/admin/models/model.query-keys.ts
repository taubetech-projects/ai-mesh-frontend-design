// lib/react-query/modelKeys.ts

export const modelKeys = {
  all: ["models"] as const,

  lists: () => [...modelKeys.all, "list"] as const,
  list: () => [...modelKeys.lists()] as const,

  details: () => [...modelKeys.all, "detail"] as const,
  detail: (id: string) => [...modelKeys.details(), id] as const,
};
