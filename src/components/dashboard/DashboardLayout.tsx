
import { useAuth } from "../auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 
              className="text-2xl font-bold text-gray-900 cursor-pointer" 
              onClick={() => navigate('/')}
            >
              Quibly
            </h1>
            
            {profile?.user_type && (
              <span className="ml-4 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                {profile.user_type.charAt(0).toUpperCase() + profile.user_type.slice(1)}
              </span>
            )}
          </div>
          <div>
            <Button variant="outline" onClick={() => signOut()}>Sign Out</Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {profile?.user_type !== 'admin' && (
          <div className="mb-8 flex justify-between items-center">
            <div className="flex-1"></div>
            <Button 
              onClick={() => navigate('/company-intake')}
            >
              Submit New Request
            </Button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
