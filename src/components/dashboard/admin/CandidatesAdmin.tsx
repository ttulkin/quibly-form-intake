
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const CandidatesAdmin = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_type", "candidate");

        if (error) throw error;
        setCandidates(data || []);
      } catch (error: any) {
        toast({
          title: "Error fetching candidates",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">No candidates found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">All Candidates</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {candidates.map((candidate: any) => (
          <Card key={candidate.id}>
            <CardHeader>
              <h3 className="font-semibold">
                {candidate.first_name} {candidate.last_name}
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{candidate.id}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CandidatesAdmin;
