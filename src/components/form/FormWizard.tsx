
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormData } from "@/types/form";
import { useToast } from "@/components/ui/use-toast";
import Step1CompanyInfo from "@/components/form/Step1CompanyInfo";
import Step2DeveloperRoles from "@/components/form/Step2DeveloperRoles";
import Step3BudgetTimeline from "@/components/form/Step3BudgetTimeline";
import ConfirmationScreen from "@/components/form/ConfirmationScreen";
import StepIndicator from "@/components/form/StepIndicator";
import { useFormSubmission } from "@/hooks/useFormSubmission";

const defaultFormData: FormData = {
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
};

const FormWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { submitForm, submitting } = useFormSubmission();

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
    try {
      await submitForm(formData);
      nextStep(); // Move to confirmation screen on success
      toast({
        title: "Request Submitted Successfully!",
        description: "Check your email for a magic link to access your dashboard.",
        duration: 6000,
      });
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit your request",
        variant: "destructive",
        duration: 5000,
      });
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
        return <ConfirmationScreen onViewDashboard={() => navigate("/dashboard")} />;
      default:
        return null;
    }
  };

  return (
    <>
      {currentStep < 3 && <StepIndicator currentStep={currentStep} totalSteps={3} />}
      {renderStep()}
    </>
  );
};

export default FormWizard;
