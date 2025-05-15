import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Settings } from "../../types";

// Define settings state structure
interface SettingsState {
  settings: Settings | null;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: null,
  loading: false,
  error: null,
};

// Create the settings slice
const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    // Loading and error states
    setSettingsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSettingsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Settings actions
    setSettings: (state, action: PayloadAction<Settings>) => {
      state.settings = action.payload;
    },
    updateSettings: (state, action: PayloadAction<Partial<Settings>>) => {
      if (state.settings) {
        state.settings = { ...state.settings, ...action.payload };
      } else {
        state.settings = action.payload as Settings;
      }
    },

    // Reset state
    resetSettings: (state) => {
      state.settings = null;
      state.loading = false;
      state.error = null;
    },
  },
});

// Export actions and reducer
export const {
  setSettingsLoading,
  setSettingsError,
  setSettings,
  updateSettings,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
