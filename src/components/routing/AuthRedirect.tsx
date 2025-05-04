
/**
 * AuthRedirect.tsx
 * 
 * This component handles authentication redirection after magic link verification
 * and tracks the context of where the user came from (e.g., form submission)
 */
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/use-toast";

const AuthRedirect = () => {
  const { user, loading, profile, profileLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verificationAttempted, setVerificationAttempted] = useState(false);
  
  // Extract context information from URL if present
  const fromForm = searchParams.get("from_form") === "true";
  
  console.log("AuthRedirect: Handling magic link verification", { 
    user, 
    loading,
    profile,
    profileLoading,
    fromForm,
    verificationAttempted,
    searchParams: Object.fromEntries(searchParams.entries())
  });
  
  // Effect to handle navigation once auth state is determined
  useEffect(() => {
    // Wait until both auth and profile loading have completed
    if (loading || (user && profileLoading)) {
      console.log("AuthRedirect: Still loading", { authLoading: loading, profileLoading });
      return;
    }
    
    // Make sure we only handle verification once to prevent loops
    if (verificationAttempted) return;
    setVerificationAttempted(true);
    
    if (user) {
      console.log("Verified user, redirecting to dashboard", { email: user.email, hasProfile: !!profile });
      
      // If this was from a form submission, set the flag in localStorage
      if (fromForm) {
        localStorage.setItem('just_submitted_form', 'true');
        console.log("Form flag set in localStorage");
      }
      
      toast({
        title: "Successfully logged in",
        description: "Welcome back! You've been successfully authenticated.",
        duration: 5000,
      });
      
      // Increased delay to ensure profile has time to load
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);
    } else {
      console.log("No user found after verification, redirecting to login");
      toast({
        title: "Authentication Failed",
        description: "We couldn't verify your login. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      navigate("/login", { replace: true });
    }
  }, [user, loading, profile, profileLoading, navigate, verificationAttempted, toast, fromForm]);
  
  // While checking auth status, show loading indicator
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
        <p className="text-sm text-gray-500">Verifying your email...</p>
        <p className="text-xs text-gray-400 mt-2">You'll be redirected to your dashboard momentarily.</p>
      </div>
    </div>
  );
};

export default AuthRedirect;
