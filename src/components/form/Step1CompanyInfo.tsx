
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
import WebsiteField from "./inputs/WebsiteField";
import { validateStep1 } from "@/utils/step1Validation";

interface Step1Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
}

const Step1CompanyInfo = ({ formData, updateFormData, onNext }: Step1Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { errors, isValid } = validateStep1(formData);
    setErrors(errors);
    
    if (isValid) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's Get to Know You</h2>
        <p className="text-gray-600">Quick intro so we can send the right talent your way</p>
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

        <WebsiteField 
          value={formData.companyWebsite}
          onChange={(value) => updateFormData({ companyWebsite: value })}
          error={errors.companyWebsite}
        />

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

        <FormField label="Where's your team based?" required error={errors.timeZoneRegion}>
          <Select 
            value={formData.timeZoneRegion}
            onValueChange={(value) => updateFormData({ timeZoneRegion: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your primary time zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US Eastern">US Eastern (EST/EDT, UTC-5/4)</SelectItem>
              <SelectItem value="US Central">US Central (CST/CDT, UTC-6/5)</SelectItem>
              <SelectItem value="US Mountain">US Mountain (MST/MDT, UTC-7/6)</SelectItem>
              <SelectItem value="US Pacific">US Pacific (PST/PDT, UTC-8/7)</SelectItem>
              <SelectItem value="UK/Ireland">UK/Ireland (GMT/BST, UTC+0/1)</SelectItem>
              <SelectItem value="Central Europe">Central Europe (CET/CEST, UTC+1/2)</SelectItem>
              <SelectItem value="Eastern Europe">Eastern Europe (EET/EEST, UTC+2/3)</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="How much overlap do you need with your devs?" required error={errors.timeZoneOverlap}>
          <Select 
            value={formData.timeZoneOverlap}
            onValueChange={(value) => updateFormData({ timeZoneOverlap: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select overlap preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full overlap">Full overlap with my time zone</SelectItem>
              <SelectItem value="Partial overlap">Partial overlap is sufficient</SelectItem>
              <SelectItem value="No preference">No preference</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <div className="mt-8 flex justify-end">
        <Button type="submit" className="px-8">
          Next: Pick Your Dev Dream Team
        </Button>
      </div>
    </form>
  );
};

export default Step1CompanyInfo;
