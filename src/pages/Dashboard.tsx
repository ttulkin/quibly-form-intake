
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import RequestsList from "@/components/dashboard/RequestsList";
import ContractorsList from "@/components/dashboard/ContractorsList";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"requests" | "contractors">("requests");

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
