export const hasRole = (roles: string[] | undefined, role: string) =>
  !!roles?.includes(role);

export const hasAnyRole = (roles: string[] | undefined, allowed: string[]) =>
  !!roles?.some((r) => allowed.includes(r));

export const hasAuthority = (auths: string[] | undefined, auth: string) =>
  !!auths?.includes(auth);
