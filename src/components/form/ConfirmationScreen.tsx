
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

const ConfirmationScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="text-green-500 mb-6">
        <CheckCircle size={64} />
      </div>
      
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
        🎉 You're In!
      </h2>
      
      <p className="text-lg text-gray-600 text-center mb-6 max-w-lg">
        We're spinning up your match. A real human will reach out in the next 24 hours with next steps.
      </p>
      
      <div className="grid gap-4 w-full max-w-md">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-2">What happens next?</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <ArrowRight size={18} className="text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">We'll review your request</span>
            </li>
            <li className="flex items-start">
              <ArrowRight size={18} className="text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Hop on a quick call to align</span>
            </li>
            <li className="flex items-start">
              <ArrowRight size={18} className="text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Get a curated shortlist of pre-vetted, startup-ready engineers</span>
            </li>
          </ul>
        </div>
        
        <Button 
          className="w-full"
          onClick={() => window.location.href = "/"}
        >
          🏠 Back to Quibly HQ
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationScreen;
