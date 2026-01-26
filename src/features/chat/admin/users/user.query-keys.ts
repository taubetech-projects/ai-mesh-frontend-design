// queries/adminUserKeys.ts

export const adminUserKeys = {
  all: ['admin-users'] as const,

  lists: () => [...adminUserKeys.all, 'list'] as const,
  list: () => [...adminUserKeys.lists()] as const,

  details: () => [...adminUserKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminUserKeys.details(), id] as const,
};
