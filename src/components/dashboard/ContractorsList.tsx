
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface MatchedDeveloper {
  id: string;
  developer_name: string;
  seniority_level: string;
  hourly_rate: number;
  status: string;
  start_date: string | null;
  role_id: string;
  developer_skills: string[];
  role: {
    role_title: string;
  } | null;
}

const statusColors: Record<string, string> = {
  "Interviewing": "bg-purple-100 text-purple-800",
  "Hired": "bg-green-100 text-green-800",
};

const ContractorsList = () => {
  const [contractors, setContractors] = useState<MatchedDeveloper[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const { data, error } = await supabase
          .from("matched_developers")
          .select(`
            *,
            role:role_id(role_title)
          `)
          .eq("status", "Hired")
          .order("start_date", { ascending: false });

        if (error) throw error;
        
        setContractors(data || []);
      } catch (error: any) {
        toast({
          title: "Error fetching contractors",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContractors();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (contractors.length === 0) {
    return (
      <div className="text-center p-12">
        <h3 className="text-lg font-medium text-gray-900">No contractors yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Your matched developers will appear here once hired
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {contractors.map((contractor) => (
        <Card key={contractor.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-medium">
                {contractor.developer_name}
              </CardTitle>
              <Badge className="bg-green-100 text-green-800">
                {contractor.status}
              </Badge>
            </div>
            <div className="text-sm text-gray-500">
              {contractor.role?.role_title || "Developer"}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Seniority:</div>
                <div>{contractor.seniority_level}</div>
                
                <div className="text-gray-500">Rate:</div>
                <div>${contractor.hourly_rate}/hour</div>
                
                {contractor.start_date && (
                  <>
                    <div className="text-gray-500">Started:</div>
                    <div>{new Date(contractor.start_date).toLocaleDateString()}</div>
                  </>
                )}
              </div>
              
              {contractor.developer_skills && contractor.developer_skills.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-1">Skills:</div>
                  <div className="flex flex-wrap gap-1">
                    {contractor.developer_skills.map((skill, i) => (
                      <Badge key={i} variant="outline" className="bg-gray-50">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ContractorsList;
