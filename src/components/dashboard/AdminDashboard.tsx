
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RequestsAdmin from "./admin/RequestsAdmin";
import CompaniesAdmin from "./admin/CompaniesAdmin";
import CandidatesAdmin from "./admin/CandidatesAdmin";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("requests");

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Manage all resources and users</p>
      </div>

      <Tabs defaultValue="requests" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests">
          <RequestsAdmin />
        </TabsContent>
        
        <TabsContent value="companies">
          <CompaniesAdmin />
        </TabsContent>
        
        <TabsContent value="candidates">
          <CandidatesAdmin />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminDashboard;
