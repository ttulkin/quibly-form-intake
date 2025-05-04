
import FormContainer from "@/components/form/FormContainer";
import FormWizard from "@/components/form/FormWizard";
import PageHeader from "@/components/form/PageHeader";

const CompanyIntake = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <PageHeader showLoginLink={true} />
        <FormContainer>
          <FormWizard />
        </FormContainer>
      </div>
    </div>
  );
};

export default CompanyIntake;
