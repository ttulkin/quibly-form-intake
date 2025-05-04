
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import RequestsList from "@/components/dashboard/RequestsList";
import ContractorsList from "@/components/dashboard/ContractorsList";
import { useState } from "react";

/**
 * Dashboard specifically for company users
 */
const CompanyDashboard = () => {
  const [activeTab, setActiveTab] = useState<"requests" | "contractors">("requests");
  const { profile, profileLoading, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("CompanyDashboard: Checking profile", { 
      hasProfile: !!profile, 
      profileLoading, 
      userType: profile?.user_type,
      userId: user?.id
    });
    
    // Wait for profile loading to complete
    if (profileLoading) {
      return;
    }
    
    // Handle missing profile (redirect to generic dashboard)
    if (!profile) {
      console.log("CompanyDashboard: No profile found, redirecting to dashboard");
      navigate("/dashboard", { replace: true });
      return;
    }
    
    // Ensure user has the correct role
    if (profile.user_type !== "company") {
      console.log("CompanyDashboard: User is not a company, redirecting to root");
      navigate("/", { replace: true });
    }
  }, [profile, profileLoading, navigate, user]);

  // Don't render content until profile is loaded and confirmed to be company type
  if (profileLoading || !profile || profile.user_type !== "company") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Company Dashboard</h1>
        <p className="text-gray-500">Manage your requests and contractors</p>
      </div>
      
      <div className="mb-6 flex border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "requests"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("requests")}
        >
          Requests
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "contractors"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("contractors")}
        >
          Contractors
        </button>
      </div>

      {activeTab === "requests" ? (
        <RequestsList />
      ) : (
        <ContractorsList />
      )}
    </DashboardLayout>
  );
};

export default CompanyDashboard;
