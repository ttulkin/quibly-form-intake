
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FormData } from "@/types/form";
import FormField from "./FormField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Step3Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  submitting?: boolean; // Add submitting prop
}

const Step3BudgetTimeline = ({ formData, updateFormData, onNext, onPrev, submitting = false }: Step3Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.isASAP && !formData.startDate) {
      newErrors.startDate = "Please select a start date or mark as ASAP";
    }
    
    if (!formData.estimatedDuration) newErrors.estimatedDuration = "Project duration is required";
    if (!formData.weeklyHours) newErrors.weeklyHours = "Weekly hours are required";
    if (!formData.monthlyBudget) newErrors.monthlyBudget = "Monthly budget is required";
    
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Timeline & Budget</h2>
        <p className="text-gray-600">Help us understand your project needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="When do you need to start?" error={errors.startDate}>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center space-x-2">
              <Switch 
                id="asap" 
                checked={formData.isASAP}
                onCheckedChange={(checked) => {
                  updateFormData({ isASAP: checked });
                  if (checked) {
                    updateFormData({ startDate: undefined });
                  }
                }}
              />
              <label htmlFor="asap" className="text-sm">As Soon As Possible</label>
            </div>

            {!formData.isASAP && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => updateFormData({ startDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </FormField>

        <FormField label="Estimated Project Duration" required error={errors.estimatedDuration}>
          <Select
            value={formData.estimatedDuration}
            onValueChange={(value) => updateFormData({ estimatedDuration: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<1 month">&lt;1 month</SelectItem>
              <SelectItem value="1–3 months">1–3 months</SelectItem>
              <SelectItem value="3–6 months">3–6 months</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Weekly Hours Per Developer" required error={errors.weeklyHours}>
          <Select
            value={formData.weeklyHours}
            onValueChange={(value) => updateFormData({ weeklyHours: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select weekly hours" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20">Part-time: 20 hours/week</SelectItem>
              <SelectItem value="30">Mid-time: 30 hours/week</SelectItem>
              <SelectItem value="40">Full-time: 40 hours/week</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Monthly Budget Per Developer" required error={errors.monthlyBudget}>
          <Select
            value={formData.monthlyBudget}
            onValueChange={(value) => updateFormData({ monthlyBudget: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select budget range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<$3k">&lt;$3,000/month</SelectItem>
              <SelectItem value="$3k–$5k">$3,000–$5,000/month</SelectItem>
              <SelectItem value="$5k–$8k">$5,000–$8,000/month</SelectItem>
              <SelectItem value="$8k+">$8,000+/month</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <div className="md:col-span-2">
          <FormField label="Additional Notes" error={errors.notes}>
            <Textarea 
              placeholder="Any other requirements or information that might help us find the right match for you?"
              value={formData.notes}
              onChange={(e) => updateFormData({ notes: e.target.value })}
              className="h-32"
            />
          </FormField>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          Back: Developer Roles
        </Button>
        <Button type="submit" className="px-8" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </form>
  );
};

export default Step3BudgetTimeline;
