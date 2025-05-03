
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormData, DeveloperRole } from "@/types/form";
import DeveloperRoleCard from "./DeveloperRoleCard";
import { ChevronLeft, Plus } from "lucide-react";

interface Step2Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Step2DeveloperRoles = ({ formData, updateFormData, onNext, onPrev }: Step2Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddRole = () => {
    const newRole: DeveloperRole = {
      id: Date.now().toString(),
      roleTitle: "",
      requiredTechStack: [],
      niceToHaveSkills: "",
      seniorityLevel: "",
      preferredLanguages: [],
      numberOfDevelopers: 1
    };
    
    updateFormData({
      developerRoles: [...formData.developerRoles, newRole]
    });
  };

  const handleUpdateRole = (id: string, updates: Partial<DeveloperRole>) => {
    updateFormData({
      developerRoles: formData.developerRoles.map(role => 
        role.id === id ? { ...role, ...updates } : role
      )
    });
  };

  const handleRemoveRole = (id: string) => {
    updateFormData({
      developerRoles: formData.developerRoles.filter(role => role.id !== id)
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    formData.developerRoles.forEach((role) => {
      if (!role.roleTitle) newErrors[`roleTitle-${role.id}`] = "Role title is required";
      if (role.requiredTechStack.length === 0) newErrors[`requiredTechStack-${role.id}`] = "At least one technology is required";
      if (!role.seniorityLevel) newErrors[`seniorityLevel-${role.id}`] = "Seniority level is required";
      if (!role.numberOfDevelopers || role.numberOfDevelopers < 1) newErrors[`numberOfDevelopers-${role.id}`] = "Number of developers must be at least 1";
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Developer Role(s)</h2>
        <p className="text-gray-600">Describe the developer roles you're looking to fill</p>
      </div>

      {formData.developerRoles.map((role, index) => (
        <DeveloperRoleCard
          key={role.id}
          role={role}
          onUpdate={handleUpdateRole}
          onRemove={handleRemoveRole}
          canBeRemoved={formData.developerRoles.length > 1}
          errors={errors}
        />
      ))}

      <div className="mb-8">
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleAddRole}
        >
          <Plus size={16} />
          Add Another Role
        </Button>
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2"
          onClick={onPrev}
        >
          <ChevronLeft size={16} />
          Previous
        </Button>
        <Button type="submit" className="px-8">
          Next: Budget & Timeline
        </Button>
      </div>
    </form>
  );
};

export default Step2DeveloperRoles;
