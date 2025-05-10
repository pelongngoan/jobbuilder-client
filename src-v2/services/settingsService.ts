import apiClient from "./api";
import { Settings, SettingsUpdateRequest } from "../types";
import { ApiResponse } from "../types/common.types";

// Settings service
const settingsService = {
  // Get user settings
  getSettings: async () => {
    const response = await apiClient.get<ApiResponse<Settings>>("/settings");
    return response.data;
  },

  // Update user settings
  updateSettings: async (settingsData: SettingsUpdateRequest) => {
    const response = await apiClient.put<ApiResponse<Settings>>(
      "/settings",
      settingsData
    );
    return response.data;
  },

  // Reset settings to defaults
  resetSettings: async () => {
    const response = await apiClient.post<ApiResponse<Settings>>(
      "/settings/reset"
    );
    return response.data;
  },
};

export default settingsService;
