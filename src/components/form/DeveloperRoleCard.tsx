
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DeveloperRole } from "@/types/form";
import { X } from "lucide-react";
import FormField from "./FormField";
import MultiSelect from "./MultiSelect";

interface DeveloperRoleCardProps {
  role: DeveloperRole;
  onUpdate: (id: string, updates: Partial<DeveloperRole>) => void;
  onRemove: (id: string) => void;
  canBeRemoved: boolean;
  errors?: Record<string, string>;
}

const techOptions = [
  "React", "Angular", "Vue", "Next.js", "Node.js", "Express", "Nest.js",
  "Python", "Django", "FastAPI", "Ruby", "Ruby on Rails", "PHP", "Laravel",
  "Java", "Spring Boot", "C#", ".NET", "Go", "Rust", "Swift", "Kotlin",
  "TypeScript", "JavaScript", "HTML/CSS", "GraphQL", "REST", "MongoDB",
  "PostgreSQL", "MySQL", "Redis", "AWS", "GCP", "Azure", "Docker", "Kubernetes"
];

const languageOptions = [
  "English", "Spanish", "French", "German", "Portuguese", "Italian",
  "Dutch", "Russian", "Mandarin", "Japanese", "Korean", "Arabic",
  "Hindi", "Bengali", "Polish", "Ukrainian", "Turkish", "Vietnamese"
];

const DeveloperRoleCard = ({ 
  role, 
  onUpdate, 
  onRemove, 
  canBeRemoved,
  errors = {}
}: DeveloperRoleCardProps) => {
  return (
    <div className="border rounded-lg p-6 mb-8 relative bg-white shadow-sm">
      {canBeRemoved && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 text-gray-400 hover:text-gray-700"
          onClick={() => onRemove(role.id)}
        >
          <X size={18} />
        </Button>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Role Title" required error={errors[`roleTitle-${role.id}`]}>
          <Select 
            value={role.roleTitle}
            onValueChange={(value) => onUpdate(role.id, { roleTitle: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select role title" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Frontend">Frontend Developer</SelectItem>
              <SelectItem value="Backend">Backend Developer</SelectItem>
              <SelectItem value="Full-stack">Full-stack Developer</SelectItem>
              <SelectItem value="Mobile">Mobile Developer</SelectItem>
              <SelectItem value="DevOps">DevOps Engineer</SelectItem>
              <SelectItem value="AI/ML">AI/ML Engineer</SelectItem>
              <SelectItem value="Tech Lead">Tech Lead</SelectItem>
              <SelectItem value="Product Engineer">Product Engineer</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Seniority Level" required error={errors[`seniorityLevel-${role.id}`]}>
          <Select 
            value={role.seniorityLevel}
            onValueChange={(value) => onUpdate(role.id, { seniorityLevel: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select seniority level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Junior">Junior</SelectItem>
              <SelectItem value="Mid">Mid</SelectItem>
              <SelectItem value="Senior">Senior</SelectItem>
              <SelectItem value="Lead">Lead</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Required Tech Stack" required className="md:col-span-2" error={errors[`requiredTechStack-${role.id}`]}>
          <MultiSelect 
            options={techOptions}
            selected={role.requiredTechStack}
            onChange={(selected) => onUpdate(role.id, { requiredTechStack: selected })}
            placeholder="Select or type to add technologies"
            allowCustom={true}
          />
        </FormField>

        <FormField label="Nice-to-Have Skills" className="md:col-span-2">
          <Textarea
            value={role.niceToHaveSkills}
            onChange={(e) => onUpdate(role.id, { niceToHaveSkills: e.target.value })}
            placeholder="Enter any additional skills that would be beneficial"
            className="w-full h-24 resize-none"
          />
        </FormField>

        <FormField label="Preferred Spoken Languages" className="md:col-span-2">
          <MultiSelect 
            options={languageOptions}
            selected={role.preferredLanguages}
            onChange={(selected) => onUpdate(role.id, { preferredLanguages: selected })}
            placeholder="Select languages"
          />
        </FormField>

        <FormField label="Number of Developers" required error={errors[`numberOfDevelopers-${role.id}`]}>
          <Input
            type="number"
            min="1"
            value={role.numberOfDevelopers}
            onChange={(e) => onUpdate(role.id, { numberOfDevelopers: parseInt(e.target.value) || 1 })}
            className="w-full"
          />
        </FormField>
      </div>
    </div>
  );
};

export default DeveloperRoleCard;
