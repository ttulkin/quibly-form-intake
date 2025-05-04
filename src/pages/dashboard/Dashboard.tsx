
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

/**
 * Generic dashboard shown when a user is authenticated 
 * but doesn't have a specific role or when role-based redirection fails
 */
const Dashboard = () => {
  const { profile, profileLoading, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect when we're sure profile loading is complete
    if (!loading && !profileLoading && profile) {
      // If profile exists with a specific type, redirect to the appropriate dashboard
      const userType = profile.user_type;
      
      if (userType === "company") {
        navigate("/dashboard/company", { replace: true });
      } else if (userType === "candidate") {
        navigate("/dashboard/candidate", { replace: true });
      } else if (userType === "admin") {
        navigate("/dashboard/admin", { replace: true });
      }
    }
  }, [profile, loading, profileLoading, navigate]);

  // Show appropriate content based on the state
  return (
    <DashboardLayout>
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Welcome to Quibly</h1>
        
        {profileLoading ? (
          <div>
            <p className="text-gray-600 mb-6">
              We're retrieving your profile information...
            </p>
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto"></div>
          </div>
        ) : !profile ? (
          <div>
            <p className="text-gray-600 mb-6">
              Your account is missing profile information. Please contact support or complete the onboarding process.
            </p>
            <button 
              onClick={() => navigate("/company-intake")} 
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Complete Onboarding
            </button>
          </div>
        ) : (
          <p className="text-gray-600 mb-6">
            Your account is being set up. You'll be redirected to the appropriate dashboard shortly.
          </p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
