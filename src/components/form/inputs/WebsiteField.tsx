
import { useState } from "react";
import { Input } from "@/components/ui/input";
import FormField from "../FormField";

interface WebsiteFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const WebsiteField = ({ value, onChange, error }: WebsiteFieldProps) => {
  // Helper function to format website URL
  const formatWebsiteUrl = (url: string): string => {
    if (!url) return "";
    
    // Add https:// prefix if not present and URL is not empty
    if (!url.match(/^https?:\/\//i) && url.trim() !== "") {
      return `https://${url}`;
    }
    
    return url;
  };

  // Handle website input change
  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Format URL on blur
  const handleWebsiteBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const formattedUrl = formatWebsiteUrl(e.target.value);
    onChange(formattedUrl);
  };

  return (
    <FormField label="Company Website" required error={error}>
      <Input
        value={value}
        onChange={handleWebsiteChange}
        onBlur={handleWebsiteBlur}
        placeholder="yourdomain.com"
        className="w-full"
      />
    </FormField>
  );
};

export default WebsiteField;
