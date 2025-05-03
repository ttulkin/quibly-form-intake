
import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("requests");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 
              className="text-2xl font-bold text-gray-900 cursor-pointer" 
              onClick={() => navigate('/dashboard')}
            >
              Quibly
            </h1>
          </div>
          <div>
            <Button variant="outline" onClick={() => signOut()}>Sign Out</Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div className="flex space-x-4">
            <Button 
              variant={activePage === "requests" ? "default" : "outline"}
              onClick={() => setActivePage("requests")}
            >
              Requests
            </Button>
            <Button 
              variant={activePage === "contractors" ? "default" : "outline"}
              onClick={() => setActivePage("contractors")}
            >
              Contractors
            </Button>
          </div>
          <Button 
            onClick={() => navigate('/')}
          >
            Submit New Request
          </Button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
