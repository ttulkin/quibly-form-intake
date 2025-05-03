
export const validateStep1 = (formData: {
  companyName: string;
  companyWebsite: string;
  contactName: string;
  workEmail: string;
  role: string;
  companySize: string;
  timeZoneRegion: string;
  timeZoneOverlap: string;
}) => {
  const errors: Record<string, string> = {};
  
  if (!formData.companyName.trim()) {
    errors.companyName = "Company name is required";
  }
  
  if (!formData.companyWebsite.trim()) {
    errors.companyWebsite = "Company website is required";
  } else {
    // Validate URL format - more permissive pattern
    if (!/^https?:\/\/(?:www\.)?[\w-]+(\.[\w-]+)+(?:[\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/.test(formData.companyWebsite)) {
      errors.companyWebsite = "Please enter a valid website address";
    }
  }
  
  if (!formData.contactName.trim()) {
    errors.contactName = "Contact name is required";
  }
  
  if (!formData.workEmail.trim()) {
    errors.workEmail = "Work email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail)) {
    errors.workEmail = "Please enter a valid email address";
  }
  
  if (!formData.role.trim()) {
    errors.role = "Role/Title is required";
  }
  
  if (!formData.companySize) {
    errors.companySize = "Company size is required";
  }
  
  if (!formData.timeZoneRegion) {
    errors.timeZoneRegion = "Time zone region is required";
  }
  
  if (!formData.timeZoneOverlap) {
    errors.timeZoneOverlap = "Time zone overlap preference is required";
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};
