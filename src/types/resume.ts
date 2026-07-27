export interface SkillsCategory {
  technical: string[];
  soft: string[];
  tools: string[];
  languages: string[];
}

export interface GrammarSuggestion {
  id: string;
  original: string;
  suggestion: string;
  reason: string;
  type: "grammar" | "spelling" | "impact" | "conciseness";
}

export interface FormattingSuggestion {
  id: string;
  category: "Layout" | "Length" | "Typography" | "Structure" | "ATS Alignment";
  issue: string;
  recommendation: string;
  severity: "low" | "medium" | "high";
}

export interface AnalysisReport {
  id: string;
  resumeId: string;
  fileName: string;
  uploadedAt: string;
  atsScore: number;
  resumeScore: number;
  wordCount: number;
  pageCount: number;
  parsedText: string;
  skillsDetected: SkillsCategory;
  missingKeywords: string[];
  grammarSuggestions: GrammarSuggestion[];
  formattingSuggestions: FormattingSuggestion[];
  strengths: string[];
  weaknesses: string[];
  summary: string;
  targetedRole?: string;
}

export interface JobMatchReport {
  id: string;
  resumeId: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  improvementSuggestions: string[];
  tailoredSummary: string;
  createdAt: string;
}

export interface CoverLetter {
  id: string;
  resumeId?: string;
  companyName: string;
  jobTitle: string;
  jobDescription?: string;
  tone: "Professional" | "Enthusiastic" | "Executive" | "Creative";
  content: string;
  createdAt: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  link?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
}

export interface ResumeBuilderData {
  id: string;
  title: string;
  updatedAt: string;
  personalInfo: {
    fullName: string;
    headline: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: {
    category: string;
    items: string[];
  }[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  targetRole: string;
  targetIndustry: string;
  apiKey?: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "suspended";
  resumesCount: number;
  avgScore: number;
  lastActive: string;
  joinedAt: string;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalResumesParsed: number;
  averageATSScore: number;
  activeUsersToday: number;
  missingSkillsRank: { skill: string; count: number }[];
  dailyAnalyses: { date: string; count: number; avgScore: number }[];
}
