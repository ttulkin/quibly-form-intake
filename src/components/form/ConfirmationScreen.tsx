
import { Button } from "@/components/ui/button";

interface ConfirmationScreenProps {
  onViewDashboard?: () => void;
}

const ConfirmationScreen = ({ onViewDashboard }: ConfirmationScreenProps) => {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Request Submitted!
      </h2>
      
      <div className="text-gray-600 mb-8 max-w-md mx-auto">
        <p className="mb-4">
          Thank you for your developer request. We'll review your needs and start matching you with the perfect developers.
        </p>
        <p>
          Check your inbox for a magic link to access your dashboard. You can track the status of your request there.
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
