import { useState, useCallback } from "react";
import { useAppDispatch } from "../redux/store";
import { setLoading, clearLoading } from "../redux/slices/loadingSlice";

/**
 * Custom hook for handling API calls with loading states
 * @param key - Unique key identifier for this loading state
 * @param withRedux - Whether to use Redux loading state (default) or local state
 * @returns Functions and state for handling the API call
 */
export function useApiCall<T>(key: string, withRedux = true) {
  const dispatch = useAppDispatch();
  // Local loading state as fallback if not using Redux
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async <R>(
      apiFunction: () => Promise<R>,
      onSuccess?: (result: R) => void,
      onError?: (error: any) => void
    ): Promise<R | null> => {
      // Clear previous error
      setError(null);

      // Set loading state (either in Redux or locally)
      if (withRedux) {
        dispatch(setLoading({ key, isLoading: true }));
      } else {
        setLocalLoading(true);
      }

      try {
        // Execute the API call
        const result = await apiFunction();

        // Set success data
        setData(result as unknown as T);

        // Call success callback if provided
        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err: any) {
        // Handle error
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "An unknown error occurred";
        setError(errorMessage);

        // Call error callback if provided
        if (onError) {
          onError(err);
        }

        return null;
      } finally {
        // Clear loading state
        if (withRedux) {
          dispatch(clearLoading(key));
        } else {
          setLocalLoading(false);
        }
      }
    },
    [dispatch, key, withRedux]
  );

  return {
    execute,
    loading: withRedux ? undefined : localLoading, // Local loading state only used when not using Redux
    error,
    data,
    setData,
    clearError: () => setError(null),
  };
}

export default useApiCall;
