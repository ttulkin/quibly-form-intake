
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
import { supabase } from "@/integrations/supabase/client";

const AuthRedirect = () => {
  const { user, loading, profile, profileLoading, signOut } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verificationAttempted, setVerificationAttempted] = useState(false);
  const [maxWaitReached, setMaxWaitReached] = useState(false);
  
  // Extract context information from URL if present
  const fromForm = searchParams.get("from_form") === "true";
  const isSignup = searchParams.get("type") === "signup";
  
  console.log("AuthRedirect: Handling magic link verification", { 
    user, 
    loading,
    profile,
    profileLoading,
    fromForm,
    isSignup,
    verificationAttempted,
    maxWaitReached,
    searchParams: Object.fromEntries(searchParams.entries())
  });

  // Set a maximum wait time for profile loading
  useEffect(() => {
    if (loading === false && user && profileLoading) {
      // Set a 3-second maximum wait time for profile to load
      const timer = setTimeout(() => {
        console.log("AuthRedirect: Maximum wait time for profile reached");
        setMaxWaitReached(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [loading, user, profileLoading]);
  
  // Effect to handle navigation once auth state is determined
  useEffect(() => {
    // Wait until both auth loading has completed
    if (loading) {
      console.log("AuthRedirect: Auth still loading");
      return;
    }
    
    // Make sure we only handle verification once to prevent loops
    if (verificationAttempted) return;
    
    if (user) {
      console.log("AuthRedirect: User verified, checking profile status", { 
        hasProfile: !!profile, 
        profileLoading,
        isSignup,
        maxWaitReached
      });
      
      // For new signups, we give some time for profile to be created by the database trigger
      if (isSignup && profileLoading && !maxWaitReached) {
        console.log("AuthRedirect: New signup - waiting for profile creation...");
        return; // Wait for profile to load or max wait time to be reached
      }
      
      // If this was from a form submission, set the flag in localStorage
      if (fromForm) {
        localStorage.setItem('just_submitted_form', 'true');
        console.log("Form flag set in localStorage");
      }
      
      // Handle case where user is authenticated but profile doesn't exist
      if (!profileLoading && !profile && (isSignup || maxWaitReached)) {
        console.log("AuthRedirect: User authenticated but no profile found. Creating profile...");
        
        // Mark verification as attempted to prevent loops
        setVerificationAttempted(true);
        
        // Show toast to inform user
        toast({
          title: "Creating your account",
          description: "We're setting up your profile. Please wait a moment.",
          duration: 5000,
        });
        
        // Create a default company profile if none exists
        const createDefaultProfile = async () => {
          try {
            const { error } = await supabase
              .from("profiles")
              .insert({ 
                id: user.id,
                user_type: "company" 
              });
            
            if (error) throw error;
            
            console.log("AuthRedirect: Created default company profile");
            
            // Navigate to root which will handle further redirection
            setTimeout(() => {
              navigate("/", { replace: true });
            }, 1500);
          } catch (error) {
            console.error("Failed to create profile:", error);
            toast({
              title: "Profile Setup Failed",
              description: "We couldn't set up your profile. Please try again or contact support.",
              variant: "destructive",
              duration: 5000,
            });
          }
        };
        
        createDefaultProfile();
        return;
      }

      // We have a profile or don't need to wait anymore - proceed with navigation
      if (!profileLoading || maxWaitReached) {
        setVerificationAttempted(true);
        
        toast({
          title: "Successfully logged in",
          description: "Welcome back! You've been successfully authenticated.",
          duration: 5000,
        });
        
        console.log("AuthRedirect: Redirecting to root for proper routing");
        
        // Redirect to root, which will handle routing based on profile
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1500);
      }
    } else {
      // No user found after verification
      setVerificationAttempted(true);
      
      console.log("AuthRedirect: No user found after verification, redirecting to login");
      toast({
        title: "Authentication Failed",
        description: "We couldn't verify your login. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      
      navigate("/login", { replace: true });
    }
  }, [user, loading, profile, profileLoading, navigate, verificationAttempted, toast, fromForm, isSignup, maxWaitReached]);
  
  // While checking auth status, show loading indicator
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
        <p className="text-sm text-gray-500">Verifying your email...</p>
        <p className="text-xs text-gray-400 mt-2">You'll be redirected to your dashboard momentarily.</p>
        {profileLoading && user && (
          <p className="text-xs text-gray-400 mt-2">Setting up your profile...</p>
        )}
      </div>
    </div>
  );
};

export default AuthRedirect;
