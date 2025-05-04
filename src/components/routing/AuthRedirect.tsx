
/**
 * AuthRedirect.tsx
 * 
 * This component handles authentication redirection after magic link verification
 * and tracks the context of where the user came from (e.g., form submission)
 */
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";

const AuthRedirect = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Extract context information from URL if present
  const fromForm = searchParams.get("from_form") === "true";
  
  console.log("AuthRedirect: Handling magic link verification", { 
    user, 
    loading, 
    fromForm,
    searchParams: Object.fromEntries(searchParams.entries())
  });
  
  // Effect to handle navigation once auth state is determined
  useEffect(() => {
    if (loading) return; // Wait until auth check completes
    
    if (user) {
      console.log("Verified user, redirecting to dashboard", { email: user.email });
      // Always redirect to root which will then route to appropriate dashboard
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

export default AuthRedirect;
