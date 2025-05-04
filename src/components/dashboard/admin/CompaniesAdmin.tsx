
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const CompaniesAdmin = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_type", "company");

        if (error) throw error;
        setCompanies(data || []);
      } catch (error: any) {
        toast({
          title: "Error fetching companies",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">No companies found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">All Companies</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company: any) => (
          <Card key={company.id}>
            <CardHeader>
              <h3 className="font-semibold">
                {company.first_name} {company.last_name}
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{company.id}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompaniesAdmin;
