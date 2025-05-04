
import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail } from "lucide-react";
import { Link } from "react-router-dom";

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
          <div className="flex items-center gap-2 font-medium mb-2">
            <Mail className="h-4 w-4" />
            <p>Important Email Instructions:</p>
          </div>
          <ol className="list-decimal pl-5 text-left space-y-2">
            <li>Check your email inbox for a <strong>magic link</strong> from Quibly</li>
            <li><strong>Click the magic link</strong> to verify your email and access your dashboard</li>
            <li>After clicking, you'll be taken directly to your dashboard where you can view your request</li>
            <li>If you're not automatically redirected, try refreshing your browser</li>
          </ol>
          <p className="mt-3 font-medium">Need help? Contact support@quibly.com</p>
        </div>
        <p className="text-sm text-gray-500">
          Don't see the email? Check your spam folder or try submitting again.
        </p>
      </div>
      
      {onViewDashboard && (
        <Button onClick={onViewDashboard} className="mt-4">
          Try Accessing Dashboard
        </Button>
      )}
    </div>
  );
};

export default ConfirmationScreen;
