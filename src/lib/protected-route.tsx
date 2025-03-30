import { useAuth } from "../context/useAuth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import VerificationAlert from "../components/shared/VerificationAlert";

export function ProtectedRoute({
  path,
  component: Component,
  requireVerification = false,
}: {
  path: string;
  component: () => React.JSX.Element;
  requireVerification?: boolean;
}) {
  const { user, isLoading, isVerified } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  if (requireVerification && !isVerified) {
    return (
      <Route path={path}>
        <Redirect to="/verification-required" />
      </Route>
    );
  }

  // Wrap component with verification alert for pages that don't strictly require verification
  const WrappedComponent = () => (
    <>
      {!isVerified && <VerificationAlert />}
      <Component />
    </>
  );

  return <Route path={path} component={WrappedComponent} />;
}
