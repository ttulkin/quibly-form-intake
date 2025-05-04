
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

/**
 * Generic dashboard shown when a user is authenticated 
 * but doesn't have a specific role or when role-based redirection fails
 */
const Dashboard = () => {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && profile) {
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
  }, [profile, loading, navigate]);

  return (
    <DashboardLayout>
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Welcome to Quibly</h1>
        <p className="text-gray-600 mb-6">
          Your account is being set up. You'll be redirected to the appropriate dashboard shortly.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
