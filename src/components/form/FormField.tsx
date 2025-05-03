
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}

const FormField = ({ label, required = false, error, className, children }: FormFieldProps) => {
  return (
    <div className={cn("mb-6", className)}>
      <label className="block text-gray-700 font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormField;
