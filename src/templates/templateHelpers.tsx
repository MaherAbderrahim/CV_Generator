import { CVData, CVSection } from "../types/cv";

type CVLanguage = NonNullable<CVData["language"]>;

const labels: Record<CVLanguage, {
  sections: Record<string, string>;
  profile: string;
  professionalProfile: string;
  summary: string;
  techSkills: string;
  contact: string;
  contactMe: string;
  socialLinks: string;
  phone: string;
  email: string;
  website: string;
  location: string;
  link: string;
  skillsInline: string;
  languagesInline: string;
  interestsInline: string;
}> = {
  fr: {
    sections: {
      experience: "Expériences professionnelles",
      education: "Formations",
      projects: "Projets",
      skills: "Compétences",
      languages: "Langues",
      interests: "Centres d'intérêt",
      certifications: "Certifications",
      references: "Références",
    },
    profile: "Profil",
    professionalProfile: "Profil professionnel",
    summary: "Résumé",
    techSkills: "Compétences techniques",
    contact: "Contact",
    contactMe: "Contact",
    socialLinks: "Réseaux sociaux",
    phone: "Téléphone",
    email: "Email",
    website: "Site web",
    location: "Adresse",
    link: "Lien",
    skillsInline: "Compétences",
    languagesInline: "Langues",
    interestsInline: "Centres d'intérêt",
  },
  en: {
    sections: {
      experience: "Professional Experience",
      education: "Education",
      projects: "Projects",
      skills: "Skills",
      languages: "Languages",
      interests: "Interests",
      certifications: "Certifications",
      references: "References",
    },
    profile: "Profile",
    professionalProfile: "Professional Profile",
    summary: "Summary",
    techSkills: "Tech Skills",
    contact: "Contact",
    contactMe: "Contact Me",
    socialLinks: "Social Networks",
    phone: "Phone",
    email: "Email",
    website: "Website",
    location: "Location",
    link: "Link",
    skillsInline: "Skills",
    languagesInline: "Languages",
    interestsInline: "Interests",
  },
};

export const cvLabels = (language?: CVData["language"]) => labels[language || "fr"];

export const sectionTitle = (section: CVSection, language?: CVData["language"]) => {
  if (section.type === "custom") return section.title;
  return cvLabels(language).sections[section.type] ?? section.title;
};

export interface TemplateProps {
  data: CVData;
}

export const orderedSections = (data: CVData, side?: "left" | "right") => {
  const order = data.layout.sectionsOrder ?? [];
  return (data.sections ?? [])
    .filter((section) => section.visible && (!side || section.side === side))
    .sort((a, b) => {
      const idxA = order.indexOf(a.id);
      const idxB = order.indexOf(b.id);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });
};

export const photoCropStyle = (personalInfo: CVData["personalInfo"]) => {
  const zoom = Math.max(personalInfo.photoZoom ?? 100, 100);
  const x = personalInfo.photoPositionX ?? 50;
  const y = personalInfo.photoPositionY ?? 50;

  return {
    position: "absolute" as const,
    width: `${zoom}%`,
    height: `${zoom}%`,
    left: `${((100 - zoom) * x) / 100}%`,
    top: `${((100 - zoom) * y) / 100}%`,
    objectFit: "cover" as const,
    objectPosition: `${x}% ${y}%`,
  };
};

export const sectionByType = (sections: CVSection[], type: string) =>
  sections.find((section) => section.type === type && section.items.length > 0);

export const bulletLines = (text?: string) =>
  (text ?? "")
    .split("\n")
    .map((line) => line.replace(/^[•\-\s]+/, "").trim())
    .filter(Boolean);

export const dateRange = (item: { startDate?: string; endDate?: string }) =>
  [item.startDate, item.endDate].filter(Boolean).join(" - ");

export const allBut = (sections: CVSection[], hiddenTypes: string[]) =>
  sections.filter((section) => !hiddenTypes.includes(section.type) && section.items.length > 0);

// ─────────────────────────────────────────────────────────────────
// PAGINATION — Section-aware page break calculation
//
// Measures all .section-group elements in a container and determines
// the optimal page break positions so that no section is ever cut
// across two pages. A section that doesn't fit on the current page
// is pushed entirely to the next page.
// ─────────────────────────────────────────────────────────────────

export interface PageBreakInfo {
  /** Section indices where a page-break-before should be inserted */
  breaksBefore: number[];
  /** Total number of pages needed */
  totalPages: number;
}

/**
 * Calculate page break positions for a list of measured sections.
 * @param sectionHeights - Array of { top, height } for each .section-group,
 *   measured relative to the #cv-capture-area container, in DOM order.
 * @param pageHeight - Height of one page in px (default 1123 for A4 at 96dpi).
 * @returns PageBreakInfo with break positions and total page count.
 */
export function calculatePageBreaks(
  sectionHeights: Array<{ top: number; height: number }>,
  pageHeight: number = 1123
): PageBreakInfo {
  if (sectionHeights.length === 0) {
    return { breaksBefore: [], totalPages: 1 };
  }

  const breaksBefore: number[] = [];
  let pageStart = 0;
  let currentPage = 0;

  for (let i = 0; i < sectionHeights.length; i++) {
    const sectionTop = sectionHeights[i].top;
    const sectionBottom = sectionTop + sectionHeights[i].height;
    const pageEnd = pageStart + pageHeight;

    // Check if this section extends beyond the current page boundary
    if (sectionBottom > pageEnd && sectionTop >= pageStart) {
      // This section would be cut — push it to the next page
      breaksBefore.push(i);
      pageStart = sectionTop;
      currentPage++;
    }
  }

  // Total pages = number of page breaks + 1 (each break starts a new page)
  const totalPages = Math.max(1, breaksBefore.length + 1);

  return { breaksBefore, totalPages };
}
