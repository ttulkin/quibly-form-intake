
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";

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
  const { toast } = useToast();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Get company requests
        const { data: requestsData, error: requestsError } = await supabase
          .from("company_requests")
          .select("*")
          .order("created_at", { ascending: false });

        if (requestsError) throw requestsError;

        // For each request, get the associated developer roles
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
      } catch (error: any) {
        toast({
          title: "Error fetching requests",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
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
