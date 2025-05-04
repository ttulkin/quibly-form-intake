
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const RequestsAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data, error } = await supabase
          .from("company_requests")
          .select(`
            *,
            profile:profile_id(
              user_type,
              first_name,
              last_name
            ),
            developer_roles(*)
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setRequests(data || []);
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
      <div className="flex justify-center p-8">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">No requests found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">All Company Requests</h2>
      {requests.map((request: any) => (
        <Card key={request.id}>
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{request.company_name}</h3>
                <p className="text-sm text-gray-500">
                  {request.profile?.first_name} {request.profile?.last_name}
                </p>
              </div>
              <div className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
                {request.status}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Developer roles: {request.developer_roles?.length || 0}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RequestsAdmin;
