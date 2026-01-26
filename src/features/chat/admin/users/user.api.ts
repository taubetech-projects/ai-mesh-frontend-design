// api/adminUserApi.ts
import { chatProxyApi } from '@/lib/api/axiosApi';
import {
  UserSummaryView,
  UserDetailsView,
  AdminCreateUserRequest,
  AdminUpdateUserRequest,
  UUID,
} from './user.types';

const BASE_URL = '/v1/api/chat/admin/users';

export class AdminUserApi {
  static listUsers(): Promise<UserSummaryView[]> {
    return chatProxyApi.get(BASE_URL).then(res => res.data);
  }

  static getUser(id: UUID): Promise<UserDetailsView> {
    return chatProxyApi.get(`${BASE_URL}/${id}`).then(res => res.data);
  }

  static createUser(req: AdminCreateUserRequest): Promise<UserDetailsView> {
    return chatProxyApi.post(BASE_URL, req).then(res => res.data);
  }

  static updateUser(
    id: UUID,
    req: AdminUpdateUserRequest
  ): Promise<UserDetailsView> {
    return chatProxyApi.patch(`${BASE_URL}/${id}`, req).then(res => res.data);
  }

  static deleteUser(id: UUID): Promise<void> {
    return chatProxyApi.delete(`${BASE_URL}/${id}`).then(res => res.data);
  }
}
