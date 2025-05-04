
/**
 * Dashboard.tsx - Legacy dashboard component
 * 
 * This file is kept for backward compatibility and redirects to the new
 * dashboard structure based on user type.
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";

const Dashboard = () => {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (profile) {
        // Redirect to the appropriate dashboard based on user type
        const userType = profile.user_type;
        
        if (userType === "company") {
          navigate("/dashboard/company", { replace: true });
        } else if (userType === "candidate") {
          navigate("/dashboard/candidate", { replace: true });
        } else if (userType === "admin") {
          navigate("/dashboard/admin", { replace: true });
        } else {
          // Fallback to generic dashboard
          navigate("/dashboard", { replace: true });
        }
      } else {
        // If no profile but authenticated, go to generic dashboard
        navigate("/dashboard", { replace: true });
      }
    }
  }, [profile, loading, navigate]);

  // Show loading spinner while redirecting
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-sm text-gray-500 mt-4">Loading your dashboard...</p>
      </div>
    </div>
  );
};

export default Dashboard;
