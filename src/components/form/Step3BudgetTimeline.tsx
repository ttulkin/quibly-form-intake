
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormData } from "@/types/form";
import FormField from "./FormField";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface Step3Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Step3BudgetTimeline = ({ formData, updateFormData, onNext, onPrev }: Step3Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.isASAP && !formData.startDate) newErrors.startDate = "Start date is required when not ASAP";
    if (!formData.estimatedDuration) newErrors.estimatedDuration = "Estimated duration is required";
    if (!formData.weeklyHours) newErrors.weeklyHours = "Weekly hours is required";
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

  const handleASAPToggle = (checked: boolean) => {
    updateFormData({ 
      isASAP: checked,
      startDate: checked ? undefined : formData.startDate
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Timeline & Budget</h2>
        <p className="text-gray-600">Tell us how soon, how long, and how much you're working with</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="When do you want to start?" required error={errors.startDate} className="flex flex-col">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="asap" 
                checked={formData.isASAP}
                onCheckedChange={handleASAPToggle}
              />
              <label 
                htmlFor="asap" 
                className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                ASAP
              </label>
            </div>
            
            {!formData.isASAP && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => updateFormData({ startDate: date })}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </FormField>

        <FormField label="How long do you need them?" required error={errors.estimatedDuration}>
          <Select 
            value={formData.estimatedDuration}
            onValueChange={(value) => updateFormData({ estimatedDuration: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select estimated duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<1 month">Less than 1 month</SelectItem>
              <SelectItem value="1–3 months">1–3 months</SelectItem>
              <SelectItem value="3–6 months">3–6 months</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Hours per week per dev" required error={errors.weeklyHours}>
          <Select 
            value={formData.weeklyHours}
            onValueChange={(value) => updateFormData({ weeklyHours: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select weekly hours" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20 hours per week</SelectItem>
              <SelectItem value="30">30 hours per week</SelectItem>
              <SelectItem value="40">40 hours per week (full-time)</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Max budget per dev/month" required error={errors.monthlyBudget}>
          <Select 
            value={formData.monthlyBudget}
            onValueChange={(value) => updateFormData({ monthlyBudget: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select monthly budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<$3k">Less than $3,000</SelectItem>
              <SelectItem value="$3k–$5k">$3,000–$5,000</SelectItem>
              <SelectItem value="$5k–$8k">$5,000–$8,000</SelectItem>
              <SelectItem value="$8k+">$8,000+</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Anything else we should know?" className="md:col-span-2">
          <Textarea
            value={formData.notes}
            onChange={(e) => updateFormData({ notes: e.target.value })}
            placeholder="Any other details about your project that you would like us to know"
            className="w-full h-32 resize-none"
          />
        </FormField>
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
          🚀 Submit & Match Me
        </Button>
      </div>
    </form>
  );
};

export default Step3BudgetTimeline;
