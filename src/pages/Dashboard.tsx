
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import RequestsList from "@/components/dashboard/RequestsList";
import ContractorsList from "@/components/dashboard/ContractorsList";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"requests" | "contractors">("requests");
  const { profile, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log("Dashboard mounted, auth state:", { 
      loading, 
      profile, 
      userEmail: user?.email 
    });
    
    // Check if we just came from a form submission flow
    const justSubmittedForm = localStorage.getItem('just_submitted_form') === 'true';
    
    if (justSubmittedForm) {
      console.log("User just submitted a form before logging in");
      // Clear the flag
      localStorage.removeItem('just_submitted_form');
    }
  }, [profile, loading, user]);

  // If profile is loaded but user is not an admin or company, show appropriate message
  useEffect(() => {
    if (!loading && profile) {
      if (profile.user_type === 'candidate') {
        toast({
          title: "Candidate Portal Coming Soon",
          description: "The candidate portal is under development.",
          variant: "default",
        });
      }
    }
  }, [profile, loading, navigate, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-gray-500 mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (profile?.user_type === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <DashboardLayout>
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

export default Dashboard;
