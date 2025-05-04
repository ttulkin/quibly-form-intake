
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FormData } from "@/types/form";
import { useToast } from "@/components/ui/use-toast";
import { validateFormSubmission, prepareFormDataForSubmission } from "@/utils/formValidation";

export const useFormSubmission = () => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const submitForm = async (formData: FormData) => {
    setSubmitting(true);
    
    try {
      // First validate the form data
      const { isValid, errors } = validateFormSubmission(formData);
      if (!isValid) {
        toast({
          title: "Validation Error",
          description: "Please check the form for errors and try again.",
          variant: "destructive",
          duration: 5000,
        });
        throw new Error("Form validation failed");
      }
      
      console.log(`Sending magic link to: ${formData.workEmail}`);
      console.log(`Current origin for redirect: ${window.location.origin}`);
      
      // Send magic link to user
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: formData.workEmail,
        options: {
          emailRedirectTo: window.location.origin + "/verify", // Ensure consistent redirect to verify route
        },
      });

      if (authError) throw authError;

      // Get the current user's session 
      const { data: sessionData } = await supabase.auth.getSession();
      
      try {
        // Prepare the request data
        const requestData = prepareFormDataForSubmission(
          formData, 
          sessionData?.session?.user?.id
        );

        // Now try to insert the request
        const { data: insertedRequestData, error: requestError } = await supabase
          .from("company_requests")
          .insert(requestData)
          .select();

        // If there's an RLS policy error, we'll just proceed to success - the user is not logged in yet
        // but the magic link has been sent, which is what matters at this point
        if (requestError) {
          if (requestError.message && requestError.message.includes('violates row-level security policy')) {
            console.log("RLS policy error - proceeding to success view since magic link was sent");
            // We'll just return true to show the success screen - user will need to click the magic link
            toast({
              title: "Magic Link Sent!",
              description: "Check your email and click the magic link to access your dashboard.",
              duration: 5000,
            });
            return true;
          }
          throw requestError;
        }

        // If the request was successfully inserted, try to insert the developer roles
        if (insertedRequestData && insertedRequestData.length > 0) {
          const requestId = insertedRequestData[0].id;
          console.log("Created request with ID:", requestId);

          // Map developer roles to the format for insertion
          const developerRolesToInsert = formData.developerRoles.map(role => ({
            request_id: requestId,
            role_title: role.roleTitle,
            required_tech_stack: role.requiredTechStack,
            nice_to_have_skills: role.niceToHaveSkills,
            seniority_level: role.seniorityLevel,
            preferred_languages: role.preferredLanguages,
            number_of_developers: role.numberOfDevelopers,
            job_description: formData.hasJobDescription ? formData.jobDescription : null,
          }));

          const { error: rolesError } = await supabase
            .from("developer_roles")
            .insert(developerRolesToInsert);

          if (rolesError) throw rolesError;
        }
      } catch (dbError: any) {
        // If we encounter a database error but already sent the magic link,
        // we'll still show success since the main goal is user authentication
        console.error("Database submission error:", dbError);
        
        // Only show a toast if it's not an RLS policy error (which is expected)
        if (!dbError.message || !dbError.message.includes('violates row-level security policy')) {
          toast({
            title: "Note",
            description: "We've sent you a magic link, but there was an issue saving your request. Please try again after logging in.",
            duration: 6000,
          });
        }
      }

      toast({
        title: "Magic Link Sent!",
        description: "Check your email for a magic link to access your dashboard.",
        duration: 5000,
      });

      return true;
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit your request",
        variant: "destructive",
        duration: 5000,
      });
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return { submitForm, submitting };
};
