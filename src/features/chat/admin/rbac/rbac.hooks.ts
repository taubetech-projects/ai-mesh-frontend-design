// rbac.hooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RbacAdminApi } from "./rbac.api";
import { rbacQueryKeys } from "./rbac.query-keys";
import {
  CreateRoleRequest,
  UpdateRoleRequest,
  CreateAuthorityRequest,
  UpdateAuthorityRequest,
  UpdateRoleAuthoritiesRequest,
  UpdateUserRolesRequest,
} from "./rbac.types";
import { handleApiErrorToast } from "@/shared/utils/toast.helper";

// ---------- ROLES ----------

export const useRoles = () =>
  useQuery({
    queryKey: rbacQueryKeys.roles(),
    queryFn: RbacAdminApi.listRoles,
  });

export const useRole = (id: string) =>
  useQuery({
    queryKey: rbacQueryKeys.role(id),
    queryFn: () => RbacAdminApi.getRole(id),
    enabled: !!id,
  });

export const useCreateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: CreateRoleRequest) => RbacAdminApi.createRole(req),
    onSuccess: () => qc.invalidateQueries({ queryKey: rbacQueryKeys.roles() }),
    onError: handleApiErrorToast
  });
};

export const useUpdateRole = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: UpdateRoleRequest) =>
      RbacAdminApi.updateRole(id, req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: rbacQueryKeys.roles() });
      qc.invalidateQueries({ queryKey: rbacQueryKeys.role(id) });
    },
    onError: handleApiErrorToast
  });
};

export const useDeleteRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => RbacAdminApi.deleteRole(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: rbacQueryKeys.roles() }),
    onError: handleApiErrorToast
  });
};

// ---------- AUTHORITIES ----------

export const useAuthorities = () =>
  useQuery({
    queryKey: rbacQueryKeys.authorities(),
    queryFn: RbacAdminApi.listAuthorities,
  });

export const useCreateAuthority = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: CreateAuthorityRequest) =>
      RbacAdminApi.createAuthority(req),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: rbacQueryKeys.authorities() }),
    onError: handleApiErrorToast
  });
};

export const useUpdateAuthority = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: UpdateAuthorityRequest) =>
      RbacAdminApi.updateAuthority(id, req),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: rbacQueryKeys.authorities() }),
    onError: handleApiErrorToast
  });
};

export const useDeleteAuthority = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => RbacAdminApi.deleteAuthority(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: rbacQueryKeys.authorities() }),
    onError: handleApiErrorToast
  });
};

// ---------- ROLE_AUTHORITIES ----------

export const useRoleAuthorities = (roleId: string) =>
  useQuery({
    queryKey: rbacQueryKeys.roleAuthorities(roleId),
    queryFn: () => RbacAdminApi.getRoleAuthorities(roleId),
    enabled: !!roleId,
  });

export const useSetRoleAuthorities = (roleId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: UpdateRoleAuthoritiesRequest) =>
      RbacAdminApi.setRoleAuthorities(roleId, req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: rbacQueryKeys.roles() });
      qc.invalidateQueries({ queryKey: rbacQueryKeys.roleAuthorities(roleId) });
    },
    onError: handleApiErrorToast
  });
};

// ---------- USER_ROLES ----------

export const useUserRoles = (userId: string) =>
  useQuery({
    queryKey: rbacQueryKeys.userRoles(userId),
    queryFn: () => RbacAdminApi.getUserRoles(userId),
    enabled: !!userId,
  });

export const useSetUserRoles = (userId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: UpdateUserRolesRequest) =>
      RbacAdminApi.setUserRoles(userId, req),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: rbacQueryKeys.userRoles(userId) }),
    onError: handleApiErrorToast
  });
};
