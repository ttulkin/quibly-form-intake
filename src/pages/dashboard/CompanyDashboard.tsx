
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import RequestsList from "@/components/dashboard/RequestsList";
import ContractorsList from "@/components/dashboard/ContractorsList";
import { useState } from "react";

const CompanyDashboard = () => {
  const [activeTab, setActiveTab] = useState<"requests" | "contractors">("requests");
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Ensure user has the correct role
    if (profile && profile.user_type !== "company") {
      navigate("/");
    }
  }, [profile, navigate]);

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
