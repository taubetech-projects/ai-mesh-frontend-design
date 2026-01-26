// rbac.queryKeys.ts

export const rbacQueryKeys = {
  all: ["rbac"] as const,

  roles: () => [...rbacQueryKeys.all, "roles"] as const,
  role: (id: string) => [...rbacQueryKeys.roles(), id] as const,

  authorities: () => [...rbacQueryKeys.all, "authorities"] as const,
  authority: (id: string) => [...rbacQueryKeys.authorities(), id] as const,

  roleAuthorities: (roleId: string) =>
    [...rbacQueryKeys.role(roleId), "authorities"] as const,

  userRoles: (userId: string) =>
    [...rbacQueryKeys.all, "users", userId, "roles"] as const,
};
