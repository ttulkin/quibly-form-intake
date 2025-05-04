
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CompanyRequest {
  id: string;
  created_at: string;
  company_name: string;
  status: string;
  developer_roles: DeveloperRole[];
}

interface DeveloperRole {
  id: string;
  role_title: string;
  number_of_developers: number;
}

const statusColors: Record<string, string> = {
  "Awaiting Match": "bg-amber-100 text-amber-800",
  "In Review": "bg-blue-100 text-blue-800",
  "Interviewing": "bg-purple-100 text-purple-800",
  "Hired": "bg-green-100 text-green-800",
};

const RequestsList = () => {
  const [requests, setRequests] = useState<CompanyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Function to fetch requests data with improved error handling and logging
  const fetchRequests = async () => {
    if (!user) {
      console.log("No user found, skipping request fetch");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log("Fetching requests for user:", user.id);
      
      // Try to get company requests linked to the current user
      // First try by user_id
      let { data: requestsData, error: requestsError } = await supabase
        .from("company_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      console.log("User ID-based request query results:", { count: requestsData?.length || 0, error: requestsError });
        
      // If no results, try by work_email as fallback
      if ((!requestsData || requestsData.length === 0) && user.email) {
        console.log("No requests found by user_id, trying by email:", user.email);
        const { data: emailRequests, error: emailError } = await supabase
          .from("company_requests")
          .select("*")
          .eq("work_email", user.email)
          .order("created_at", { ascending: false });
          
        if (emailRequests && emailRequests.length > 0) {
          console.log("Found requests by email match:", emailRequests.length);
          requestsData = emailRequests;
          requestsError = emailError;
        }
      }

      if (requestsError) {
        console.error("Error fetching requests:", requestsError);
        setFetchError(requestsError.message);
        return;
      }
      
      console.log("Fetched requests:", requestsData?.length || 0);

      // For each request, get the associated developer roles
      if (requestsData) {
        const requestsWithRoles = await Promise.all(
          requestsData.map(async (request) => {
            const { data: rolesData } = await supabase
              .from("developer_roles")
              .select("*")
              .eq("request_id", request.id);

            return {
              ...request,
              developer_roles: rolesData || [],
            };
          })
        );

        setRequests(requestsWithRoles);
        setFetchError(null);
      }
    } catch (error: any) {
      console.error("Error fetching requests:", error);
      setFetchError(error.message);
      toast({
        title: "Error fetching requests",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch requests on component mount and when user changes
  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  // Handle page visibility changes to refresh data when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user) {
        console.log("Tab became visible, refreshing requests");
        fetchRequests();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="text-center p-12">
        <h3 className="text-lg font-medium text-red-600">Error loading requests</h3>
        <p className="mt-1 text-sm text-gray-500">{fetchError}</p>
        <Button onClick={fetchRequests} className="mt-4">Try Again</Button>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center p-12">
        <h3 className="text-lg font-medium text-gray-900">No requests yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Submit your first developer request to get started
        </p>
        <Button 
          onClick={() => navigate('/company-intake')} 
          className="mt-4"
        >
          Submit a Request
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-medium">
                {request.company_name}
              </CardTitle>
              <Badge className={statusColors[request.status] || "bg-gray-100"}>
                {request.status}
              </Badge>
            </div>
            <div className="text-sm text-gray-500">
              Submitted {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium">Developer Roles:</h4>
                <div className="mt-1 space-y-1">
                  {request.developer_roles.map((role) => (
                    <div key={role.id} className="text-sm">
                      {role.number_of_developers}x {role.role_title || "Developer"}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RequestsList;
