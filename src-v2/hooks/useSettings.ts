import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  setSettingsLoading,
  setSettingsError,
  setSettings,
  updateSettings as updateSettingsAction,
  resetSettings as resetSettingsAction,
} from "../redux/slices/settingsSlice";
import { settingsService } from "../services";
import { SettingsUpdateRequest } from "../types";

/**
 * Hook for managing user settings
 */
const useSettings = () => {
  const dispatch = useAppDispatch();
  const { settings, loading, error } = useAppSelector(
    (state) => state.settings
  );

  // API loading states
  const getSettingsApi = useApiCall("getSettings");
  const updateSettingsApi = useApiCall("updateSettings");
  const resetSettingsApi = useApiCall("resetSettings");

  // Fetch user settings
  const fetchSettings = useCallback(async () => {
    dispatch(setSettingsLoading(true));
    const result = await getSettingsApi.execute(
      () => settingsService.getSettings(),
      (data) => {
        if (data.data) {
          dispatch(setSettings(data.data));
        }
        dispatch(setSettingsLoading(false));
      }
    );
    if (result && !result.success) {
      dispatch(setSettingsError(result.error || "Failed to fetch settings"));
      dispatch(setSettingsLoading(false));
    }
    return result;
  }, [dispatch, getSettingsApi]);

  // Update user settings
  const updateSettings = useCallback(
    async (settingsData: SettingsUpdateRequest) => {
      dispatch(setSettingsLoading(true));
      const result = await updateSettingsApi.execute(
        () => settingsService.updateSettings(settingsData),
        (data) => {
          if (data.data) {
            dispatch(updateSettingsAction(data.data));
          }
          dispatch(setSettingsLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(setSettingsError(result.error || "Failed to update settings"));
        dispatch(setSettingsLoading(false));
      }
      return result;
    },
    [dispatch, updateSettingsApi]
  );

  // Reset settings to defaults
  const resetSettings = useCallback(async () => {
    dispatch(setSettingsLoading(true));
    const result = await resetSettingsApi.execute(
      () => settingsService.resetSettings(),
      (data) => {
        if (data.data) {
          dispatch(resetSettingsAction());
          dispatch(setSettings(data.data));
        }
        dispatch(setSettingsLoading(false));
      }
    );
    if (result && !result.success) {
      dispatch(setSettingsError(result.error || "Failed to reset settings"));
      dispatch(setSettingsLoading(false));
    }
    return result;
  }, [dispatch, resetSettingsApi]);

  return {
    // State
    settings,
    loading,
    error,

    // Methods
    fetchSettings,
    updateSettings,
    resetSettings,
  };
};

export default useSettings;
