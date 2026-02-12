import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AuctionProvider } from "@/context/AuctionContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import RoleSelection from "./pages/RoleSelection";
import ViewerDashboard from "./pages/ViewerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user has no role yet, redirect to role selection
  if (!user.role) {
    return <Navigate to="/role-selection" replace />;
  }

  return <>{children}</>;
};

// Host-only route
const HostRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'host') {
    return <Navigate to="/viewer" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/role-selection" element={<ProtectedRoute><RoleSelection /></ProtectedRoute>} />
      
      {/* Host routes */}
      <Route
        path="/"
        element={
          <HostRoute>
            <AuctionProvider>
              <Index />
            </AuctionProvider>
          </HostRoute>
        }
      />

      {/* Viewer routes */}
      <Route
        path="/viewer"
        element={
          <ProtectedRoute>
            <AuctionProvider>
              <ViewerDashboard />
            </AuctionProvider>
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
