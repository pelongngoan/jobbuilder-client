import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import HomePage from "./pages/Home";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./context/useAuth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
