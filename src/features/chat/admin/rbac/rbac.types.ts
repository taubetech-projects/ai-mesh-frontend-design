// rbac.types.ts

export interface AuthorityView {
  id: string;
  name: string;
  description: string;
}

export interface RoleView {
  id: string;
  name: string;
  description: string;
  authorities: AuthorityView[];
}

// ---- Requests ----

export interface CreateRoleRequest {
  name: string;
  description: string;
}

export interface UpdateRoleRequest {
  description: string;
}

export interface CreateAuthorityRequest {
  name: string;
  description: string;
}

export interface UpdateAuthorityRequest {
  description: string;
}

export interface UpdateRoleAuthoritiesRequest {
  authorities: string[]; // UUID[]
}

export interface UpdateUserRolesRequest {
  roles: string[]; // UUID[]
}
