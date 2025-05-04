
import { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useToast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log("ProtectedRoute checking auth state:", { 
      loading, 
      isAuthenticated: !!user, 
      path: location.pathname 
    });

    // If authentication check is complete and user is not logged in
    if (!loading && !user) {
      console.log("User not authenticated, redirecting to login");
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this page",
        variant: "destructive",
      });
    } else if (!loading && user) {
      console.log("User authenticated:", user.email);
      // Ensure we're on the right path based on user type
      if (location.pathname === "/" && profile) {
        console.log("User authenticated at root with profile type:", profile.user_type);
      }
    }
  }, [loading, user, toast, location.pathname, profile]);

  if (loading) {
    console.log("Auth state still loading...");
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Checking authentication...</p>
          <p className="text-xs text-gray-400 mt-2">If you just clicked a magic link, please wait a moment...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("Redirecting to login from protected route");
    // Store the intended destination to redirect after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  console.log("Authentication successful, rendering protected content");
  return <>{children}</>;
};

export default ProtectedRoute;
