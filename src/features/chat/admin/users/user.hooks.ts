// queries/useAdminUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {AdminUserApi} from './user.api';
import { adminUserKeys } from './user.query-keys';
import {
  AdminCreateUserRequest,
  AdminUpdateUserRequest,
  UUID,
} from './user.types';
import { handleApiErrorToast } from '@/shared/utils/toast.helper';

// LIST USERS
export const useAdminUsers = () =>
  useQuery({
    queryKey: adminUserKeys.list(),
    queryFn: AdminUserApi.listUsers,
  });

// GET SINGLE USER
export const useAdminUser = (id: UUID) =>
  useQuery({
    queryKey: adminUserKeys.detail(id),
    queryFn: () => AdminUserApi.getUser(id),
    enabled: !!id,
  });

// CREATE USER
export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: AdminCreateUserRequest) =>
      AdminUserApi.createUser(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.list() });
    },
    onError: handleApiErrorToast
  });
};

// UPDATE USER
export const useUpdateAdminUser = (id: UUID) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: AdminUpdateUserRequest) =>
      AdminUserApi.updateUser(id, req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.list() });
      queryClient.invalidateQueries({
        queryKey: adminUserKeys.detail(id),
      });
    },
    onError: handleApiErrorToast
  });
};

// DELETE USER
export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: UUID) => AdminUserApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.list() });
    },
    onError: handleApiErrorToast
  });
};
