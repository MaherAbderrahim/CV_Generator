export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  photoUrl: string;
  photoPositionX: number;
  photoPositionY: number;
  photoZoom: number;
  summary: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  username: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  location?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  location?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  url?: string;
  technologies?: string;
  startDate?: string;
  endDate?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: number; // 0 to 100
  category?: string; // Hard / Soft
}

export interface LanguageItem {
  id: string;
  name: string;
  level: string; // e.g. Débutant, Intermédiaire, Avancé, Courant, Bilingue, Maternel
  percentage: number; // 0 to 100 for visual progress bars
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface InterestItem {
  id: string;
  name: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description: string;
}

export type SectionType =
  | "experience"
  | "education"
  | "projects"
  | "skills"
  | "languages"
  | "interests"
  | "certifications"
  | "references"
  | "custom";

export interface CVSection {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  side: "left" | "right"; // Where the section is displayed in 2-column templates
  items: any[];
}

export interface CVColors {
  primary: string;
  secondary: string;
  text: string;
  background: string;
  sidebarBg: string;
  sidebarText: string;
  accent: string;
}

export interface CVTypography {
  fontFamily: string; // Inter, Poppins, Manrope, DM Sans, Plus Jakarta Sans, Outfit, Source Sans 3, Nunito Sans, Lora, Merriweather, etc.
  fontSize: "small" | "medium" | "large";
  lineHeight: "compact" | "normal" | "loose";
}

export interface CVLayout {
  sidebarSide: "left" | "right";
  sectionsOrder: string[]; // List of section IDs to specify drag & drop order
  spacing: "compact" | "normal" | "loose";
}

export interface CVData {
  id: string;
  language?: "fr" | "en";
  title: string;
  template: string;
  colors: CVColors;
  typography: CVTypography;
  layout: CVLayout;
  personalInfo: PersonalInfo;
  socialLinks: SocialLink[];
  sections: CVSection[];
}
