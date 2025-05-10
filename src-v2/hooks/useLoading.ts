import { useAppSelector } from "../redux/store";

/**
 * Hook to check if a specific API operation is loading
 * @param key - The unique loading state key
 * @returns Boolean indicating if the operation is loading
 */
export function useLoading(key: string): boolean {
  return useAppSelector((state) => !!state.loading[key]);
}

export default useLoading;
