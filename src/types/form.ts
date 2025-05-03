
export type CompanySize = "1–10" | "11–50" | "51–200" | "200+" | "";
export type TimeZoneRegion = "US Eastern" | "US Central" | "US Mountain" | "US Pacific" | "UK/Ireland" | "Central Europe" | "Eastern Europe" | "Other" | "";
export type TimeZoneOverlap = "Full overlap" | "Partial overlap" | "No preference" | "";
export type RoleTitle = "Frontend" | "Backend" | "Full-stack" | "Mobile" | "DevOps" | "AI/ML" | "Tech Lead" | "Product Engineer" | "Other" | "";
export type SeniorityLevel = "Junior" | "Mid" | "Senior" | "Lead" | "";
export type EstimatedDuration = "<1 month" | "1–3 months" | "3–6 months" | "Ongoing" | "";
export type WeeklyHours = "20" | "30" | "40" | "";
export type MonthlyBudget = "<$3k" | "$3k–$5k" | "$5k–$8k" | "$8k+" | "";

export interface DeveloperRole {
  id: string;
  roleTitle: RoleTitle | string;
  requiredTechStack: string[];
  niceToHaveSkills: string;
  seniorityLevel: SeniorityLevel | string;
  preferredLanguages: string[];
  numberOfDevelopers: number;
}

export interface FormData {
  // Step 1: Company & Contact Info
  companyName: string;
  companyWebsite: string;
  contactName: string;
  workEmail: string;
  role: string;
  companySize: CompanySize | string;
  timeZoneRegion: TimeZoneRegion | string;
  timeZoneOverlap: TimeZoneOverlap | string;
  
  // Step 2: Developer Role(s) Needed
  developerRoles: DeveloperRole[];
  hasJobDescription: boolean;
  jobDescription: string;
  
  // Step 3: Budget & Timeline
  startDate?: Date;
  isASAP: boolean;
  estimatedDuration: EstimatedDuration | string;
  weeklyHours: WeeklyHours | string;
  monthlyBudget: MonthlyBudget | string;
  notes: string;
}
