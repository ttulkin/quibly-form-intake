
/**
 * RootRedirect.tsx
 * 
 * This component handles automatic redirection based on user authentication state and role.
 * - Authenticated users are redirected to their role-specific dashboard
 * - Unauthenticated users are redirected to the login page
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/use-toast";

const RootRedirect = () => {
  const { profile, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log("User not authenticated, redirecting to login");
        navigate("/login");
        return;
      }
      
      // User is authenticated but check if profile exists
      if (!profile) {
        console.log("User authenticated but no profile, showing generic dashboard");
        navigate("/dashboard");
        return;
      }
      
      // Redirect based on user type
      const userType = profile.user_type;
      console.log(`Redirecting authenticated user to ${userType} dashboard`);
      
      switch (userType) {
        case "company":
          navigate("/dashboard/company");
          break;
        case "candidate":
          navigate("/dashboard/candidate");
          break;
        case "admin":
          navigate("/dashboard/admin");
          break;
        default:
          console.error("Unknown user type:", userType);
          toast({
            title: "Navigation Error",
            description: "We couldn't determine your dashboard type. Please contact support.",
            variant: "destructive",
          });
          // Fallback to generic dashboard
          navigate("/dashboard");
      }
    }
  }, [loading, user, profile, navigate, toast]);

  // Show loading spinner while checking authentication
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
};

export default RootRedirect;
