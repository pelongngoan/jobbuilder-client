import { ReactNode, createElement, Fragment } from "react";
import useLoading from "./useLoading";

interface LoadingOptions {
  fallback?: ReactNode;
  showChildren?: boolean;
}

/**
 * Hook to create a loading indicator based on a Redux loading state
 * @param key - The unique loading state key
 * @param options - Options for the loading indicator
 * @returns A component that shows a loading indicator or children
 */
export function useLoadingIndicator(key: string, options: LoadingOptions = {}) {
  const isLoading = useLoading(key);
  const fallback =
    options.fallback !== undefined
      ? options.fallback
      : createElement("div", {}, "Loading...");
  const showChildren = options.showChildren || false;

  const LoadingComponent = ({ children }: { children: ReactNode }) => {
    if (isLoading) {
      if (showChildren) {
        return createElement(Fragment, {}, [fallback, children]);
      }
      return createElement(Fragment, {}, fallback);
    }
    return createElement(Fragment, {}, children);
  };

  return { isLoading, LoadingComponent };
}

export default useLoadingIndicator;
