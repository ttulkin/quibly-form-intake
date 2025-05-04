
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useToast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      console.log("User not authenticated, redirecting to login");
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this page",
        variant: "destructive",
      });
    }
  }, [loading, user, toast]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log(`Redirecting to login from protected route: ${location.pathname}`);
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
