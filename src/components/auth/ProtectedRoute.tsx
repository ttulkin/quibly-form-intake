
import { useEffect, useState } from "react";
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
  const [justSubmittedForm, setJustSubmittedForm] = useState<boolean>(false);

  useEffect(() => {
    // Check if this is a user who just submitted a form
    const formSubmitted = localStorage.getItem('just_submitted_form') === 'true';
    setJustSubmittedForm(formSubmitted);
    
    if (!loading) {
      if (!user) {
        console.log("User not authenticated, redirecting to login");
        toast({
          title: "Authentication Required",
          description: "Please sign in to access this page",
          variant: "destructive",
        });
      } else {
        console.log(`User authenticated: ${user.email} at path: ${location.pathname}`);
        
        // Check if this is a redirect from email verification
        const params = new URLSearchParams(window.location.search);
        const isVerification = params.has('type') && (
          params.get('type') === 'signup' || 
          params.get('type') === 'magiclink'
        );
        
        if (isVerification || formSubmitted) {
          console.log("User arrived from magic link verification or form submission");
          
          // Clear the form submission flag if it was set
          if (formSubmitted) {
            localStorage.removeItem('just_submitted_form');
            setJustSubmittedForm(false);
          }
          
          toast({
            title: "Welcome to your dashboard!",
            description: "You've successfully signed in. You can now view your requests.",
            duration: 5000,
          });
        }
      }
    }
  }, [loading, user, toast, location.pathname]);

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
