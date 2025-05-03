
import { FormData } from "@/types/form";

/**
 * Validates form data before submission to ensure it meets requirements
 * @param formData The form data to validate
 * @returns An object containing validation result and errors if any
 */
export const validateFormSubmission = (formData: FormData) => {
  const errors: Record<string, string> = {};
  
  // Company & Contact Info validation
  if (!formData.companyName?.trim()) {
    errors.companyName = "Company name is required";
  }
  
  if (!formData.contactName?.trim()) {
    errors.contactName = "Contact name is required";
  }
  
  if (!formData.workEmail?.trim()) {
    errors.workEmail = "Work email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail)) {
    errors.workEmail = "Please enter a valid email address";
  }
  
  // Developer Roles validation
  if (!formData.developerRoles?.length) {
    errors.developerRoles = "At least one developer role is required";
  } else {
    // Check if each role has required fields
    formData.developerRoles.forEach((role, index) => {
      if (!role.roleTitle?.trim()) {
        errors[`developerRoles[${index}].roleTitle`] = "Role title is required";
      }
      
      if (!role.requiredTechStack?.length) {
        errors[`developerRoles[${index}].requiredTechStack`] = "At least one technology is required";
      }
    });
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Prepares form data for submission by ensuring all fields are properly formatted
 * @param formData The form data to prepare
 * @param userId Optional user ID to associate with the request
 * @returns The prepared data ready for Supabase insertion
 */
export const prepareFormDataForSubmission = (formData: FormData, userId?: string) => {
  return {
    company_name: formData.companyName,
    company_website: formData.companyWebsite ? formatWebsiteUrl(formData.companyWebsite) : null,
    contact_name: formData.contactName,
    work_email: formData.workEmail,
    role: formData.role,
    company_size: formData.companySize,
    time_zone_region: formData.timeZoneRegion,
    time_zone_overlap: formData.timeZoneOverlap,
    is_asap: formData.isASAP,
    start_date: formData.startDate ? formData.startDate.toISOString() : null,
    estimated_duration: formData.estimatedDuration,
    weekly_hours: formData.weeklyHours,
    monthly_budget: formData.monthlyBudget,
    notes: formData.notes,
    // Include user_id if provided
    ...(userId ? { user_id: userId } : {})
  };
};

/**
 * Helper function to format website URLs consistently
 * @param url The URL to format
 * @returns Properly formatted URL with https:// prefix if needed
 */
export const formatWebsiteUrl = (url: string): string => {
  if (!url) return '';
  
  // Add https:// prefix if not present and URL is not empty
  if (!url.match(/^https?:\/\//i) && url.trim() !== "") {
    return `https://${url}`;
  }
  
  return url;
};
