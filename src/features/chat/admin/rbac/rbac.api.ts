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

  static async listRoles(): Promise<RoleView[]> {
    const res = await chatProxyApi.get<RoleView[]>(`${BASE}/roles`);
    return res.data;
  }

  static async getRole(id: string): Promise<RoleView> {
    const res = await chatProxyApi.get<RoleView>(`${BASE}/roles/${id}`);
    return res.data;
  }

  static async createRole(req: CreateRoleRequest): Promise<RoleView> {
    const res = await chatProxyApi.post<RoleView>(`${BASE}/roles`, req);
    return res.data;
  }

  static async updateRole(id: string, req: UpdateRoleRequest): Promise<RoleView> {
    const res = await chatProxyApi.patch<RoleView>(`${BASE}/roles/${id}`, req);
    return res.data;
  }

  static async deleteRole(id: string): Promise<void> {
    await chatProxyApi.delete(`${BASE}/roles/${id}`);
  }

  // ---------- AUTHORITIES ----------

  static async listAuthorities(): Promise<AuthorityView[]> {
    const res = await chatProxyApi.get<AuthorityView[]>(`${BASE}/authorities`);
    return res.data;
  }

  static async getAuthority(id: string): Promise<AuthorityView> {
    const res = await chatProxyApi.get<AuthorityView>(`${BASE}/authorities/${id}`);
    return res.data;
  }

  static async createAuthority(req: CreateAuthorityRequest): Promise<AuthorityView> {
    const res = await chatProxyApi.post<AuthorityView>(`${BASE}/authorities`, req);
    return res.data;
  }

  static async updateAuthority(id: string, req: UpdateAuthorityRequest): Promise<AuthorityView> {
    const res = await chatProxyApi.patch<AuthorityView>(`${BASE}/authorities/${id}`, req);
    return res.data;
  }

  static async deleteAuthority(id: string): Promise<void> {
    await chatProxyApi.delete(`${BASE}/authorities/${id}`);
  }

  // ---------- ROLE_AUTHORITIES ----------

  static async getRoleAuthorities(roleId: string): Promise<RoleView> {
    const res = await chatProxyApi.get<RoleView>(`${BASE}/roles/${roleId}/authorities`);
    return res.data;
  }

  static async setRoleAuthorities(
    roleId: string,
    req: UpdateRoleAuthoritiesRequest
  ): Promise<RoleView> {
    const res = await chatProxyApi.put<RoleView>(`${BASE}/roles/${roleId}/authorities`, req);
    return res.data;
  }

  // ---------- USER_ROLES ----------

  static async getUserRoles(userId: string): Promise<string[]> {
    const res = await chatProxyApi.get<string[]>(`${BASE}/users/${userId}/roles`);
    return res.data;
  }

  static async setUserRoles(
    userId: string,
    req: UpdateUserRolesRequest
  ): Promise<string[]> {
    const res = await chatProxyApi.put<string[]>(`${BASE}/users/${userId}/roles`, req);
    return res.data;
  }
}
