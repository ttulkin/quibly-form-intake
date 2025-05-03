import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormContainer from "@/components/form/FormContainer";
import Step1CompanyInfo from "@/components/form/Step1CompanyInfo";
import Step2DeveloperRoles from "@/components/form/Step2DeveloperRoles";
import Step3BudgetTimeline from "@/components/form/Step3BudgetTimeline";
import ConfirmationScreen from "@/components/form/ConfirmationScreen";
import StepIndicator from "@/components/form/StepIndicator";
import { FormData } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { validateFormSubmission, prepareFormDataForSubmission } from "@/utils/formValidation";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    // Step 1: Company & Contact Info
    companyName: "",
    companyWebsite: "",
    contactName: "",
    workEmail: "",
    role: "",
    companySize: "",
    timeZoneRegion: "",
    timeZoneOverlap: "",
    
    // Step 2: Developer Role(s) Needed
    developerRoles: [
      {
        id: Date.now().toString(),
        roleTitle: "",
        requiredTechStack: [],
        niceToHaveSkills: "",
        seniorityLevel: "",
        preferredLanguages: [],
        numberOfDevelopers: 1
      }
    ],
    hasJobDescription: false,
    jobDescription: "",
    
    // Step 3: Budget & Timeline
    startDate: undefined,
    isASAP: false,
    estimatedDuration: "",
    weeklyHours: "",
    monthlyBudget: "",
    notes: ""
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    // First validate the form data
    const { isValid, errors } = validateFormSubmission(formData);
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors and try again.",
        variant: "destructive",
        duration: 5000,
      });
      setSubmitting(false);
      return;
    }
    
    try {
      // First send magic link to user
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: formData.workEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (authError) throw authError;

      // Get the current user's session 
      const { data: sessionData } = await supabase.auth.getSession();
      
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

      if (requestError) {
        // Check if the error is related to RLS or authentication
        if (requestError.message && requestError.message.includes('violates row-level security policy')) {
          throw new Error("Authentication required. We've sent you a magic link - please check your email and try submitting again after login.");
        }
        throw requestError;
      }

      // Insert developer roles
      if (insertedRequestData && insertedRequestData.length > 0) {
        const requestId = insertedRequestData[0].id;

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

      toast({
        title: "Request Submitted Successfully!",
        description: "We've sent you a magic link to access your dashboard.",
        duration: 5000,
      });

      nextStep();
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit your request",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Step1CompanyInfo 
            formData={formData} 
            updateFormData={updateFormData}
            onNext={nextStep}
          />
        );
      case 1:
        return (
          <Step2DeveloperRoles 
            formData={formData} 
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 2:
        return (
          <Step3BudgetTimeline 
            formData={formData} 
            updateFormData={updateFormData}
            onNext={handleSubmit}
            onPrev={prevStep}
            submitting={submitting}
          />
        );
      case 3:
        return <ConfirmationScreen onViewDashboard={() => navigate("/login")} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quibly</h1>
          <p className="text-gray-600">Your shortcut to startup-ready engineers</p>
          {currentStep < 1 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Already submitted a request?{" "}
                <Link to="/login" className="text-blue-600 hover:text-blue-800 underline">
                  Log in
                </Link>
              </p>
            </div>
          )}
        </div>
        
        {currentStep < 3 && (
          <StepIndicator 
            currentStep={currentStep} 
            totalSteps={3} 
          />
        )}
        
        <FormContainer>
          {renderStep()}
        </FormContainer>
      </div>
    </div>
  );
};

export default Index;
