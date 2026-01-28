import { api } from "@/lib/api/axiosApi";

export function createAuthService(basePath: string) {
  return {
    login: async <TReq, TRes>(data: TReq): Promise<TRes> => {
      const res = await api.post<TRes>(`${basePath}/login`, data);
      return res.data;
    },

    me: async <TMe>(): Promise<TMe> => {
      const res = await api.get<TMe>(`${basePath}/me`);
      return res.data;
    },

    refreshToken: async <TReq, TRes>(data: TReq): Promise<TRes> => {
      const res = await api.post<TRes>(`${basePath}/refresh`, data);
      return res.data;
    },

    logout: async (): Promise<void> => {
      await api.post(`${basePath}/logout`);
    },

    signup: async <TReq, TRes>(data: TReq): Promise<TRes> => {
      const res = await api.post<TRes>(`${basePath}/signup`, data);
      return res.data;
    },

    resendEmail: async (email: string): Promise<string> => {
      const res = await api.post<string>(
        `${basePath}/resend-email?email=${encodeURIComponent(email)}`
      );
      return res.data;
    },

    forgotPassword: async <TReq>(data: TReq): Promise<void> => {
      await api.post(`${basePath}/forgot-password`, data);
    },

    resetPassword: async <TReq>(data: TReq): Promise<void> => {
      await api.post(`${basePath}/reset-password`, data);
    },

    verifyEmail: async (token: string): Promise<void> => {
      await api.post(`${basePath}/verify-email?token=${encodeURIComponent(token)}`);
    }
  };
}
