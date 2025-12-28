// --- Mock Data (Replace with your actual API calls) ---

import { proxyApi } from "@/lib/api/axiosApi";
import {
  AddNewPreferenceRequest,
  UpdateModelPreferenceRequest,
  UserModelPreference,
} from "../types/modelPreferencesTypes";

export const modelPreferencesService = {
  getPreferences: async (): Promise<UserModelPreference[]> => {
    const res = await proxyApi.get<UserModelPreference[]>(
      "v1/api/chat/model-preferences"
    );
    return res.data;
  },

  addPreference: async (preference: AddNewPreferenceRequest) => {
    const res = await proxyApi.post<AddNewPreferenceRequest>(
      "v1/api/chat/model-preferences",
      preference
    );
    return res.data;
  },

  updatePreference: async (preference: UpdateModelPreferenceRequest[]) => {
    const res = await proxyApi.put<UpdateModelPreferenceRequest[]>(
      `v1/api/chat/model-preferences`,
      preference
    );
    return res.data;
  },

  deletePreference: async (preferenceId: string) => {
    const res = await proxyApi.delete(
      `v1/api/chat/model-preferences/${preferenceId}`
    );
    return res.data;
  },
};
