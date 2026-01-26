// rbac.admin.api.ts
import { chatProxyApi } from "@/lib/api/axiosApi";
import {
  RoleView,
  AuthorityView,
  CreateRoleRequest,
  UpdateRoleRequest,
  CreateAuthorityRequest,
  UpdateAuthorityRequest,
  UpdateRoleAuthoritiesRequest,
  UpdateUserRolesRequest,
} from "./rbac.types";

const BASE = "/v1/api/chat/admin/rbac";

export class RbacAdminApi {
  // ---------- ROLES ----------

  static listRoles(): Promise<RoleView[]> {
    return chatProxyApi.get(`${BASE}/roles`);
  }

  static getRole(id: string): Promise<RoleView> {
    return chatProxyApi.get(`${BASE}/roles/${id}`);
  }

  static createRole(req: CreateRoleRequest): Promise<RoleView> {
    return chatProxyApi.post(`${BASE}/roles`, req);
  }

  static updateRole(id: string, req: UpdateRoleRequest): Promise<RoleView> {
    return chatProxyApi.patch(`${BASE}/roles/${id}`, req);
  }

  static deleteRole(id: string): Promise<void> {
    return chatProxyApi.delete(`${BASE}/roles/${id}`);
  }

  // ---------- AUTHORITIES ----------

  static listAuthorities(): Promise<AuthorityView[]> {
    return chatProxyApi.get(`${BASE}/authorities`);
  }

  static getAuthority(id: string): Promise<AuthorityView> {
    return chatProxyApi.get(`${BASE}/authorities/${id}`);
  }

  static createAuthority(req: CreateAuthorityRequest): Promise<AuthorityView> {
    return chatProxyApi.post(`${BASE}/authorities`, req);
  }

  static updateAuthority(id: string, req: UpdateAuthorityRequest): Promise<AuthorityView> {
    return chatProxyApi.patch(`${BASE}/authorities/${id}`, req);
  }

  static deleteAuthority(id: string): Promise<void> {
    return chatProxyApi.delete(`${BASE}/authorities/${id}`);
  }

  // ---------- ROLE_AUTHORITIES ----------

  static getRoleAuthorities(roleId: string): Promise<RoleView> {
    return chatProxyApi.get(`${BASE}/roles/${roleId}/authorities`);
  }

  static setRoleAuthorities(
    roleId: string,
    req: UpdateRoleAuthoritiesRequest
  ): Promise<RoleView> {
    return chatProxyApi.put(`${BASE}/roles/${roleId}/authorities`, req);
  }

  // ---------- USER_ROLES ----------

  static getUserRoles(userId: string): Promise<string[]> {
    return chatProxyApi.get(`${BASE}/users/${userId}/roles`);
  }

  static setUserRoles(
    userId: string,
    req: UpdateUserRolesRequest
  ): Promise<string[]> {
    return chatProxyApi.put(`${BASE}/users/${userId}/roles`, req);
  }
}
