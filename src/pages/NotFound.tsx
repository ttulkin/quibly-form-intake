
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-2">Page Not Found</p>
        <p className="text-sm text-gray-500 mb-6">
          The page <code className="bg-gray-100 px-1 py-0.5 rounded">{location.pathname}</code> could not be found
        </p>
        
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm">
            <p className="font-medium">If you just clicked a magic link:</p>
            <p className="mt-1">Try navigating directly to the dashboard using the button below.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link to="/">Go to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/company-intake">Submit Request</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
