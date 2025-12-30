// --- Mock Data (Replace with your actual API calls) ---

import { chatProxyApi } from "@/lib/api/axiosApi";
import {
  AddNewPreferenceRequest,
  UpdateModelPreferenceRequest,
  UserModelPreference,
} from "../types/modelPreferencesTypes";

export const modelPreferencesService = {
  getPreferences: async (): Promise<UserModelPreference[]> => {
    const res = await chatProxyApi.get<UserModelPreference[]>(
      "v1/api/chat/model-preferences"
    );
    return res.data;
  },

  addPreference: async (preference: AddNewPreferenceRequest) => {
    const res = await chatProxyApi.post<AddNewPreferenceRequest>(
      "v1/api/chat/model-preferences",
      preference
    );
    return res.data;
  },

  updatePreference: async (preference: UpdateModelPreferenceRequest[]) => {
    const res = await chatProxyApi.put<UpdateModelPreferenceRequest[]>(
      `v1/api/chat/model-preferences`,
      preference
    );
    return res.data;
  },

  deletePreference: async (preferenceId: string) => {
    const res = await chatProxyApi.delete(
      `v1/api/chat/model-preferences/${preferenceId}`
    );
    return res.data;
  },
};
