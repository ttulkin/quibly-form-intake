
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormData } from "@/types/form";
import FormField from "./FormField";

interface Step1Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
}

const Step1CompanyInfo = ({ formData, updateFormData, onNext }: Step1Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
    
    if (!formData.companyWebsite.trim()) {
      newErrors.companyWebsite = "Company website is required";
    } else if (!/^https?:\/\/(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]+)+[\/\w\.-]*$/.test(formData.companyWebsite)) {
      newErrors.companyWebsite = "Please enter a valid URL";
    }
    
    if (!formData.contactName.trim()) newErrors.contactName = "Contact name is required";
    
    if (!formData.workEmail.trim()) {
      newErrors.workEmail = "Work email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail)) {
      newErrors.workEmail = "Please enter a valid email address";
    }
    
    if (!formData.role.trim()) newErrors.role = "Role/Title is required";
    if (!formData.companySize) newErrors.companySize = "Company size is required";
    if (!formData.timeZoneOverlap) newErrors.timeZoneOverlap = "Time zone overlap is required";
    
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Company & Contact Information</h2>
        <p className="text-gray-600">Tell us about your company and how we can reach you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Company Name" required error={errors.companyName}>
          <Input
            value={formData.companyName}
            onChange={(e) => updateFormData({ companyName: e.target.value })}
            placeholder="Acme Inc."
            className="w-full"
          />
        </FormField>

        <FormField label="Company Website" required error={errors.companyWebsite}>
          <Input
            value={formData.companyWebsite}
            onChange={(e) => updateFormData({ companyWebsite: e.target.value })}
            placeholder="https://acme.com"
            className="w-full"
            type="url"
          />
        </FormField>

        <FormField label="Contact Name" required error={errors.contactName}>
          <Input
            value={formData.contactName}
            onChange={(e) => updateFormData({ contactName: e.target.value })}
            placeholder="Your full name"
            className="w-full"
          />
        </FormField>

        <FormField label="Work Email" required error={errors.workEmail}>
          <Input
            value={formData.workEmail}
            onChange={(e) => updateFormData({ workEmail: e.target.value })}
            placeholder="you@company.com"
            className="w-full"
            type="email"
          />
        </FormField>

        <FormField label="Role/Title" required error={errors.role}>
          <Input
            value={formData.role}
            onChange={(e) => updateFormData({ role: e.target.value })}
            placeholder="CTO, HR Director, etc."
            className="w-full"
          />
        </FormField>

        <FormField label="Company Size" required error={errors.companySize}>
          <Select 
            value={formData.companySize}
            onValueChange={(value) => updateFormData({ companySize: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1–10">1–10 employees</SelectItem>
              <SelectItem value="11–50">11–50 employees</SelectItem>
              <SelectItem value="51–200">51–200 employees</SelectItem>
              <SelectItem value="200+">200+ employees</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Time Zone Overlap" required error={errors.timeZoneOverlap} className="md:col-span-2">
          <Select 
            value={formData.timeZoneOverlap}
            onValueChange={(value) => updateFormData({ timeZoneOverlap: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select preferred time zone overlap" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full US hours">Full US hours</SelectItem>
              <SelectItem value="Partial US hours">Partial US hours</SelectItem>
              <SelectItem value="No preference">No preference</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <div className="mt-8 flex justify-end">
        <Button type="submit" className="px-8">
          Next: Developer Roles
        </Button>
      </div>
    </form>
  );
};

export default Step1CompanyInfo;
