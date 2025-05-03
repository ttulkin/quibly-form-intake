
import { useState } from "react";
import FormContainer from "@/components/form/FormContainer";
import Step1CompanyInfo from "@/components/form/Step1CompanyInfo";
import Step2DeveloperRoles from "@/components/form/Step2DeveloperRoles";
import Step3BudgetTimeline from "@/components/form/Step3BudgetTimeline";
import ConfirmationScreen from "@/components/form/ConfirmationScreen";
import StepIndicator from "@/components/form/StepIndicator";
import { FormData } from "@/types/form";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    // Step 1: Company & Contact Info
    companyName: "",
    companyWebsite: "",
    contactName: "",
    workEmail: "",
    role: "",
    companySize: "",
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
    
    // Step 3: Budget & Timeline
    startDate: undefined,
    isASAP: false,
    estimatedDuration: "",
    weeklyHours: "",
    monthlyBudget: "",
    communicationTools: [],
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

  const handleSubmit = () => {
    // This would be replaced with API call to backend
    console.log("Form submitted:", formData);
    nextStep();
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
          />
        );
      case 3:
        return <ConfirmationScreen />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Talent Path</h1>
          <p className="text-gray-600">Find the perfect developers for your project</p>
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
