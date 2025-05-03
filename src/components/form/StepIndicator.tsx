
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  const steps = [
    { name: "Company Info", step: 0 },
    { name: "Developer Roles", step: 1 },
    { name: "Budget & Timeline", step: 2 },
  ];

  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-between w-full relative">
        {/* Progress bar background - positioned below the steps */}
        <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200 z-0"></div>
        
        {/* Active progress bar - dynamically sized based on current step */}
        <div 
          className="absolute top-6 left-0 h-0.5 bg-primary z-0 transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
        
        {steps.map((step, index) => (
          <li 
            key={step.name} 
            className={cn(
              "relative flex items-center z-10",
              index < steps.length - 1 ? "flex-1" : ""
            )}
          >
            <div className="flex items-center justify-center w-full">
              <div className="flex-shrink-0 flex items-center justify-center relative">
                <div 
                  className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center transition-colors duration-200",
                    currentStep >= step.step
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-100 text-gray-400"
                  )}
                >
                  <span className="text-lg font-semibold">{index + 1}</span>
                </div>
              </div>
              <div className="hidden sm:block ml-4 w-full">
                <div className="text-sm font-medium text-gray-900">{step.name}</div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default StepIndicator;
