
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RootRedirect from "./components/routing/RootRedirect";

import Login from "./pages/Login";
import CompanyIntake from "./pages/CompanyIntake";
import CandidateIntake from "./pages/CandidateIntake";
import NotFound from "./pages/NotFound";
import AuthRedirect from "./components/routing/AuthRedirect";

// Dashboard components
import Dashboard from "./pages/dashboard/Dashboard";
import CompanyDashboard from "./pages/dashboard/CompanyDashboard";
import CandidateDashboard from "./pages/dashboard/CandidateDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Root route with automatic redirection */}
            <Route path="/" element={<RootRedirect />} />
            
            {/* Public routes - accessible without authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/company-intake" element={<CompanyIntake />} />
            <Route path="/candidate-intake" element={<CandidateIntake />} />
            
            {/* Protected dashboard routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/company" 
              element={
                <ProtectedRoute>
                  <CompanyDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/candidate" 
              element={
                <ProtectedRoute>
                  <CandidateDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
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
