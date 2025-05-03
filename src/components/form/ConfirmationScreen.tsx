
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface ConfirmationScreenProps {
  onViewDashboard?: () => void;
}

const ConfirmationScreen = ({ onViewDashboard }: ConfirmationScreenProps) => {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="h-8 w-8 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Request Submitted!
      </h2>
      
      <div className="text-gray-600 mb-8 max-w-md mx-auto">
        <p className="mb-4">
          Thank you for your developer request. We'll review your needs and start matching you with the perfect developers.
        </p>
        <div className="bg-blue-50 p-4 rounded-md text-blue-800 text-sm mb-4">
          <p className="font-medium mb-2">Next Step:</p>
          <p>We've sent a magic link to your email. Click it to securely access your dashboard where you can track your request status.</p>
        </div>
        <p className="text-sm text-gray-500">
          Don't see the email? Check your spam folder or try accessing the dashboard below.
        </p>
      </div>
      
      {onViewDashboard && (
        <Button onClick={onViewDashboard} className="mt-4">
          Access Dashboard
        </Button>
      )}
    </div>
  );
};

export default ConfirmationScreen;
