
import { ReactNode } from "react";

interface FormContainerProps {
  children: ReactNode;
}

const FormContainer = ({ children }: FormContainerProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 animate-fadeIn">
      {children}
    </div>
  );
};

export default FormContainer;
