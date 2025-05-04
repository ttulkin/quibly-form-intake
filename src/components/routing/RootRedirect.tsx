
/**
 * RootRedirect.tsx
 * 
 * This component handles automatic redirection based on user authentication state and role.
 * - Authenticated users are redirected to their role-specific dashboard
 * - Unauthenticated users are redirected to the login page
 */

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/use-toast";

const RootRedirect = () => {
  const { profile, profileLoading, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Wait until both auth loading and profile loading finish
    if (loading || profileLoading) {
      console.log("RootRedirect: Still loading", { authLoading: loading, profileLoading });
      return;
    }
    
    // Prevent multiple redirects
    if (redirectAttempted) return;
    setRedirectAttempted(true);
    
    console.log("RootRedirect: Handling navigation", { 
      isAuthenticated: !!user,
      hasProfile: !!profile,
      profileLoading,
      userType: profile?.user_type,
      path: window.location.pathname,
      currentLocation: location.pathname
    });
    
    if (!user) {
      console.log("User not authenticated, redirecting to login");
      navigate("/login", { replace: true });
      return;
    }
    
    // Check if this is a redirect after form submission
    const justSubmittedForm = localStorage.getItem('just_submitted_form') === 'true';
    if (justSubmittedForm) {
      console.log("User just submitted form, clearing flag and showing welcome toast");
      localStorage.removeItem('just_submitted_form');
      toast({
        title: "Welcome to your dashboard!",
        description: "You've successfully accessed your dashboard. You can now view your requests.",
        duration: 5000,
      });
    }
    
    // User is authenticated but check if profile exists
    // We now know it's genuinely null because profileLoading is false
    if (!profile) {
      console.log("User authenticated but no profile found after loading completed, showing generic dashboard");
      navigate("/dashboard", { replace: true });
      return;
    }
    
    // Redirect based on user type
    const userType = profile.user_type;
    console.log(`Redirecting authenticated user to ${userType} dashboard`);
    
    switch (userType) {
      case "company":
        navigate("/dashboard/company", { replace: true });
        break;
      case "candidate":
        navigate("/dashboard/candidate", { replace: true });
        break;
      case "admin":
        navigate("/dashboard/admin", { replace: true });
        break;
      default:
        console.error("Unknown user type:", userType);
        toast({
          title: "Navigation Error",
          description: "We couldn't determine your dashboard type. Please contact support.",
          variant: "destructive",
        });
        // Fallback to generic dashboard
        navigate("/dashboard", { replace: true });
    }
  }, [loading, profileLoading, user, profile, navigate, toast, location, redirectAttempted]);

  // Show loading spinner while checking authentication
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
        <p className="text-sm text-gray-500">Loading your dashboard...</p>
        {profileLoading && user && (
          <p className="text-xs text-gray-400 mt-2">Retrieving your profile information...</p>
        )}
      </div>
    </div>
  );
};

export default RootRedirect;
