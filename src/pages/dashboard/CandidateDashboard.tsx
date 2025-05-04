
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const CandidateDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Ensure user has the correct role
    if (profile && profile.user_type !== "candidate") {
      navigate("/");
    }
  }, [profile, navigate]);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Candidate Dashboard</h1>
        <p className="text-gray-500">View your opportunities</p>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Welcome to Your Dashboard</h2>
        <p className="text-gray-600">
          The candidate portal is currently under development. Soon, you'll be able to:
        </p>
        <ul className="list-disc ml-5 mt-2 text-gray-600">
          <li>Browse available job opportunities</li>
          <li>Submit applications</li>
          <li>Track your application status</li>
          <li>Update your profile and resume</li>
        </ul>
      </div>
    </DashboardLayout>
  );
};

export default CandidateDashboard;
