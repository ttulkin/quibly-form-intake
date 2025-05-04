
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useSearchParams, useNavigate } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import CompanyIntake from "./pages/CompanyIntake";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import { useAuth } from "./components/auth/AuthProvider";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Enhanced AuthRedirect component to properly handle magic link verification
const AuthRedirect = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Extract context information from URL if present
  const fromForm = searchParams.get("from_form") === "true";
  const verifyType = searchParams.get("type");
  
  console.log("AuthRedirect: Handling magic link verification", { 
    user, 
    loading, 
    fromForm, 
    verifyType,
    searchParams: Object.fromEntries(searchParams.entries())
  });
  
  // Effect to handle navigation once auth state is determined
  useEffect(() => {
    if (loading) return; // Wait until auth check completes
    
    if (user) {
      console.log("Verified user, redirecting to dashboard", { email: user.email });
      // Always redirect to dashboard after successful verification
      navigate("/", { replace: true });
    } else {
      console.log("No user found after verification, redirecting to login");
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);
  
  // While checking auth status, show loading indicator
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Verifying your email...</p>
          <p className="text-xs text-gray-400 mt-2">You'll be redirected to your dashboard momentarily.</p>
        </div>
      </div>
    );
  }
  
  // This return statement should rarely be shown as the effect above handles redirects
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes - accessible without authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/form" element={<Index />} />
            <Route path="/company-intake" element={<CompanyIntake />} />
            
            {/* Protected routes - require authentication */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Enhanced verification route */}
            <Route path="/verify" element={<AuthRedirect />} />
            
            {/* Catch-all routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
