import { create } from "zustand";
import {
  CVData,
  PersonalInfo,
  SocialLink,
  CVSection,
  CVColors,
  CVTypography,
  CVLayout,
  SectionType,
} from "../types/cv";

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// Professional mock data to wow the user immediately on first load
export const defaultCVData: CVData = {
  id: "default-cv",
  language: "fr",
  title: "Mon CV Professionnel",
  template: "primary", // 'primary' (our main CV.fr design), 'classic', 'modern', 'minimal', 'creative', 'ats'
  colors: {
    primary: "#00bcd4", // Vibrant Pastel Cyan
    secondary: "#0f172a", // Dark Slate
    text: "#334155", // Slate 700
    background: "#ffffff",
    sidebarBg: "#0f172a", // Dark Slate sidebar
    sidebarText: "#f8fafc", // Off-white text
    accent: "#00bcd4",
  },
  typography: {
    fontFamily: "Inter",
    fontSize: "medium",
    lineHeight: "normal",
  },
  layout: {
    sidebarSide: "left",
    sectionsOrder: [
      "experience",
      "education",
      "projects",
      "certifications",
      "skills",
      "languages",
      "interests",
    ],
    spacing: "normal",
  },
  personalInfo: {
    firstName: "Thomas",
    lastName: "Bernard",
    title: "Développeur Full-Stack Senior",
    email: "thomas.bernard@email.com",
    phone: "+33 6 12 34 56 78",
    address: "Paris, France",
    website: "https://thomasb.dev",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80", // placeholder image that will be rendered beautifully
    photoPositionX: 50,
    photoPositionY: 50,
    photoZoom: 100,
    summary:
      "Ingénieur passionné par le développement d'applications web modernes et performantes. Fort de plus de 5 ans d'expérience dans la conception d'architectures scalables avec React, Next.js, Node.js et PostgreSQL. Adepte des bonnes pratiques de développement, du Clean Code et des designs UI/UX premium.",
  },
  socialLinks: [
    { id: "1", platform: "GitHub", username: "thomasdev", url: "https://github.com/thomasdev" },
    { id: "2", platform: "LinkedIn", username: "thomas-bernard", url: "https://linkedin.com/in/thomas-bernard" },
    { id: "3", platform: "Twitter", username: "thomas_codes", url: "https://twitter.com/thomas_codes" },
  ],
  sections: [
    {
      id: "experience",
      type: "experience",
      title: "Expériences Professionnelles",
      visible: true,
      side: "right",
      items: [
        {
          id: "exp1",
          company: "Veloce SaaS",
          position: "Lead Développeur Full-Stack",
          startDate: "2023-03",
          endDate: "Présent",
          current: true,
          location: "Paris, France (Hybride)",
          description:
            "• Direction d'une équipe de 4 développeurs sur le produit SaaS principal.\n• Migration réussie de l'architecture legacy vers Next.js (App Router), augmentant la vitesse de chargement de 40%.\n• Conception et mise en production de microservices en Node.js/TypeScript gérant plus de 100k requêtes/jour.\n• Optimisation SEO et amélioration du score Lighthouse de 65 à 98.",
        },
        {
          id: "exp2",
          company: "Innova Corp",
          position: "Développeur Full-Stack",
          startDate: "2020-09",
          endDate: "2023-02",
          current: false,
          location: "Lyon, France",
          description:
            "• Développement de nouvelles fonctionnalités d'abonnement avec l'API Stripe.\n• Conception de schémas de base de données PostgreSQL hautement optimisés avec Prisma ORM.\n• Réduction de 30% des coûts d'infrastructure AWS en déplaçant certains calculs lourds vers des fonctions Serverless Lambda.",
        },
      ],
    },
    {
      id: "education",
      type: "education",
      title: "Formations",
      visible: true,
      side: "right",
      items: [
        {
          id: "edu1",
          institution: "Sorbonne Université",
          degree: "Master en Ingénierie Informatique",
          fieldOfStudy: "Spécialité Génie Logiciel & Cloud",
          startDate: "2018-09",
          endDate: "2020-06",
          current: false,
          location: "Paris, France",
          description: "Major de promotion. Spécialisation en architectures distribuées et sécurité web.",
        },
        {
          id: "edu2",
          institution: "Université de Paris",
          degree: "Licence en Informatique",
          fieldOfStudy: "Sciences de l'ordinateur",
          startDate: "2015-09",
          endDate: "2018-06",
          current: false,
          location: "Paris, France",
          description: "Bases solides en algorithmique, structures de données, POO, et réseaux.",
        },
      ],
    },
    {
      id: "projects",
      type: "projects",
      title: "Projets Personnels",
      visible: true,
      side: "right",
      items: [
        {
          id: "proj1",
          name: "TaskFlow App",
          description: "Une application SaaS de gestion de tâches inspirée de Trello, développée avec Next.js 14, Tailwind CSS, et Zustand. Intègre des notifications en temps réel avec WebSocket.",
          url: "https://taskflow.thomasb.dev",
          technologies: "Next.js, TailwindCSS, WebSocket, PostgreSQL",
        },
        {
          id: "proj2",
          name: "Climatix IoT",
          description: "Dashboard de suivi et d'analyse des conditions climatiques intérieures pour stations météo connectées via ESP32. Visualisation de données sous forme de graphes dynamiques.",
          url: "https://github.com/thomasdev/climatix",
          technologies: "React, Chart.js, Tailwind, InfluxDB",
        },
      ],
    },
    {
      id: "certifications",
      type: "certifications",
      title: "Certifications",
      visible: true,
      side: "right",
      items: [
        {
          id: "cert1",
          name: "AWS Solutions Architect - Associate",
          issuer: "Amazon Web Services",
          date: "2024-01",
          url: "https://aws.amazon.com",
        },
        {
          id: "cert2",
          name: "Professional Scrum Master I (PSM I)",
          issuer: "Scrum.org",
          date: "2022-11",
          url: "https://scrum.org",
        },
      ],
    },
    {
      id: "skills",
      type: "skills",
      title: "Compétences",
      visible: true,
      side: "left",
      items: [
        { id: "sk1", name: "TypeScript & JavaScript", level: 95, category: "Hard" },
        { id: "sk2", name: "React & Next.js (App Router)", level: 90, category: "Hard" },
        { id: "sk3", name: "Node.js (Express, NestJS)", level: 85, category: "Hard" },
        { id: "sk4", name: "Tailwind CSS & Framer Motion", level: 95, category: "Hard" },
        { id: "sk5", name: "Prisma, Postgres & SQLite", level: 80, category: "Hard" },
        { id: "sk6", name: "Docker & AWS Services", level: 75, category: "Hard" },
        { id: "sk7", name: "Communication & Leadership", level: 85, category: "Soft" },
        { id: "sk8", name: "Esprit d'équipe & Mentorat", level: 90, category: "Soft" },
      ],
    },
    {
      id: "languages",
      type: "languages",
      title: "Langues",
      visible: true,
      side: "left",
      items: [
        { id: "lang1", name: "Français", level: "Langue maternelle", percentage: 100 },
        { id: "lang2", name: "Anglais", level: "Courant (C1 - 925 au TOEIC)", percentage: 85 },
        { id: "lang3", name: "Espagnol", level: "Intermédiaire (B1)", percentage: 50 },
      ],
    },
    {
      id: "interests",
      type: "interests",
      title: "Centres d'intérêt",
      visible: true,
      side: "left",
      items: [
        { id: "int1", name: "Photographie numérique & argentique" },
        { id: "int2", name: "Randonnée en haute montagne" },
        { id: "int3", name: "Impression 3D & domotique" },
        { id: "int4", name: "Veille technologique & IA" },
      ],
    },
  ],
};

// Robust helper to sanitize loaded or imported CV data to prevent runtime crashes
export const sanitizeCVData = (input: any): CVData => {
  if (!input) return { ...defaultCVData };
  
  return {
    id: input.id || "cv-" + Math.random().toString(36).substring(2, 9),
    title: input.title || "Mon CV",
    template: input.template || "primary",
    colors: {
      primary: input.colors?.primary ?? defaultCVData.colors.primary,
      secondary: input.colors?.secondary ?? defaultCVData.colors.secondary,
      text: input.colors?.text ?? defaultCVData.colors.text,
      background: input.colors?.background ?? defaultCVData.colors.background,
      sidebarBg: input.colors?.sidebarBg ?? defaultCVData.colors.sidebarBg,
      sidebarText: input.colors?.sidebarText ?? defaultCVData.colors.sidebarText,
      accent: input.colors?.accent ?? input.colors?.primary ?? defaultCVData.colors.accent,
    },
    typography: {
      fontFamily: input.typography?.fontFamily ?? defaultCVData.typography.fontFamily,
      fontSize: input.typography?.fontSize ?? defaultCVData.typography.fontSize,
      lineHeight: input.typography?.lineHeight ?? defaultCVData.typography.lineHeight,
    },
    layout: {
      sidebarSide: input.layout?.sidebarSide ?? defaultCVData.layout.sidebarSide,
      spacing: input.layout?.spacing ?? defaultCVData.layout.spacing,
      sectionsOrder: Array.isArray(input.layout?.sectionsOrder) 
        ? input.layout.sectionsOrder 
        : [...defaultCVData.layout.sectionsOrder],
    },
    personalInfo: {
      firstName: input.personalInfo?.firstName ?? "",
      lastName: input.personalInfo?.lastName ?? "",
      title: input.personalInfo?.title ?? "",
      email: input.personalInfo?.email ?? "",
      phone: input.personalInfo?.phone ?? "",
      address: input.personalInfo?.address ?? "",
      website: input.personalInfo?.website ?? "",
      photoUrl: input.personalInfo?.photoUrl ?? "",
      photoPositionX: input.personalInfo?.photoPositionX ?? 50,
      photoPositionY: input.personalInfo?.photoPositionY ?? 50,
      photoZoom: input.personalInfo?.photoZoom ?? 100,
      summary: input.personalInfo?.summary ?? "",
    },
    socialLinks: Array.isArray(input.socialLinks) 
      ? input.socialLinks.map((l: any) => ({
          id: l.id || Math.random().toString(36).substring(2, 9),
          platform: l.platform || "LinkedIn",
          username: l.username || "",
          url: l.url || "",
        }))
      : [],
    sections: Array.isArray(input.sections)
      ? input.sections.map((s: any) => ({
          id: s.id,
          type: s.type,
          title: s.title || "",
          visible: typeof s.visible === "boolean" ? s.visible : true,
          side: s.side || "right",
          items: Array.isArray(s.items) ? s.items : [],
        }))
      : [...defaultCVData.sections],
  };
};

interface CVState {
  data: CVData;
  history: CVData[];
  future: CVData[];
  zoom: number;
  activeTab: "edit" | "preview"; // mobile view toggle
  autoSaveStatus: "saved" | "saving" | "idle";
  
  // Basic Settings Actions
  setLanguage: (lang: "fr" | "en") => void;
  setTitle: (title: string) => void;
  setTemplate: (template: string) => void;
  updateColors: (colors: Partial<CVColors>) => void;
  updateTypography: (typography: Partial<CVTypography>) => void;
  updateLayout: (layout: Partial<CVLayout>) => void;
  setZoom: (zoom: number) => void;
  setActiveTab: (tab: "edit" | "preview") => void;

  // Personal Info Actions
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  
  // Social Links Actions
  addSocialLink: (link: Omit<SocialLink, "id">) => void;
  updateSocialLink: (id: string, link: Partial<SocialLink>) => void;
  removeSocialLink: (id: string) => void;

  // Section Management Actions
  toggleSectionVisibility: (id: string) => void;
  updateSectionTitle: (id: string, title: string) => void;
  setSectionSide: (id: string, side: "left" | "right") => void;
  addCustomSection: (title: string, side?: "left" | "right") => void;
  removeSection: (id: string) => void;
  reorderSections: (sectionsOrder: string[]) => void;
  
  // Section Item Actions
  addSectionItem: (sectionId: string, item: any) => void;
  updateSectionItem: (sectionId: string, itemId: string, updatedItem: any) => void;
  removeSectionItem: (sectionId: string, itemId: string) => void;
  reorderSectionItems: (sectionId: string, items: any[]) => void;

  // Undo/Redo Actions
  undo: () => void;
  redo: () => void;
  
  // Import/Load CV Action
  loadCV: (data: CVData) => void;
  resetCV: () => void;
}

// Helper to push to history and update state
const pushToHistory = (state: CVState, newData: CVData) => {
  const currentHistory = [...state.history];
  // Limit history size to 30 states to save memory
  if (currentHistory.length >= 30) {
    currentHistory.shift();
  }
  return {
    history: [...currentHistory, state.data],
    future: [],
    data: newData,
  };
};

export const useCVStore = create<CVState>((set, get) => ({
  data: defaultCVData,
  history: [],
  future: [],
  zoom: 1.0,
  activeTab: "edit",
  autoSaveStatus: "idle",

  setTitle: (title) => {
    set((state) => {
      const updated = { ...state.data, title };
      return { ...pushToHistory(state, updated) };
    });
    // get().resetCV(); removed buggy call
  },

  setLanguage: (lang) => {
    set((state) => {
      const updated = { ...state.data, language: lang };
      return { ...pushToHistory(state, updated) };
    });
  },

  setTemplate: (template) => {
    set((state) => {
      const updated = { ...state.data, template };
      return { ...pushToHistory(state, updated) };
    });
  },

  updateColors: (colors) => {
    set((state) => {
      const updated = {
        ...state.data,
        colors: { ...state.data.colors, ...colors },
      };
      return { ...pushToHistory(state, updated) };
    });
  },

  updateTypography: (typography) => {
    set((state) => {
      const updated = {
        ...state.data,
        typography: { ...state.data.typography, ...typography },
      };
      return { ...pushToHistory(state, updated) };
    });
  },

  updateLayout: (layout) => {
    set((state) => {
      const updated = {
        ...state.data,
        layout: { ...state.data.layout, ...layout },
      };
      return { ...pushToHistory(state, updated) };
    });
  },

  setZoom: (zoom) => set({ zoom }),
  setActiveTab: (activeTab) => set({ activeTab }),

  updatePersonalInfo: (info) => {
    set((state) => {
      const updated = {
        ...state.data,
        personalInfo: { ...state.data.personalInfo, ...info },
      };
      return { ...pushToHistory(state, updated) };
    });
  },

  addSocialLink: (link) => {
    set((state) => {
      const newLink = { ...link, id: generateId() };
      const updated = {
        ...state.data,
        socialLinks: [...state.data.socialLinks, newLink],
      };
      return { ...pushToHistory(state, updated) };
    });
  },

  updateSocialLink: (id, link) => {
    set((state) => {
      const updatedLinks = state.data.socialLinks.map((l) =>
        l.id === id ? { ...l, ...link } : l
      );
      const updated = {
        ...state.data,
        socialLinks: updatedLinks,
      };
      return { ...pushToHistory(state, updated) };
    });
  },

  removeSocialLink: (id) => {
    set((state) => {
      const updatedLinks = state.data.socialLinks.filter((l) => l.id !== id);
      const updated = {
        ...state.data,
        socialLinks: updatedLinks,
      };
      return { ...pushToHistory(state, updated) };
    });
  },

  toggleSectionVisibility: (id) => {
    set((state) => {
      const updatedSections = state.data.sections.map((s) =>
        s.id === id ? { ...s, visible: !s.visible } : s
      );
      const updated = { ...state.data, sections: updatedSections };
      return { ...pushToHistory(state, updated) };
    });
  },

  updateSectionTitle: (id, title) => {
    set((state) => {
      const updatedSections = state.data.sections.map((s) =>
        s.id === id ? { ...s, title } : s
      );
      const updated = { ...state.data, sections: updatedSections };
      return { ...pushToHistory(state, updated) };
    });
  },

  setSectionSide: (id, side) => {
    set((state) => {
      const updatedSections = state.data.sections.map((s) =>
        s.id === id ? { ...s, side } : s
      );
      const updated = { ...state.data, sections: updatedSections };
      return { ...pushToHistory(state, updated) };
    });
  },

  addCustomSection: (title, side = "right") => {
    set((state) => {
      const customId = `custom_${generateId()}`;
      const newSection: CVSection = {
        id: customId,
        type: "custom",
        title,
        visible: true,
        side,
        items: [],
      };
      const updated = {
        ...state.data,
        sections: [...state.data.sections, newSection],
        layout: {
          ...state.data.layout,
          sectionsOrder: [...state.data.layout.sectionsOrder, customId],
        },
      };
      return { ...pushToHistory(state, updated) };
    });
  },

  removeSection: (id) => {
    set((state) => {
      const updatedSections = state.data.sections.filter((s) => s.id !== id);
      const updatedOrder = state.data.layout.sectionsOrder.filter((oid) => oid !== id);
      const updated = {
        ...state.data,
        sections: updatedSections,
        layout: { ...state.data.layout, sectionsOrder: updatedOrder },
      };
      return { ...pushToHistory(state, updated) };
    });
  },

  reorderSections: (sectionsOrder) => {
    set((state) => {
      const updated = {
        ...state.data,
        layout: { ...state.data.layout, sectionsOrder },
      };
      return { ...pushToHistory(state, updated) };
    });
  },

  addSectionItem: (sectionId, item) => {
    set((state) => {
      const newItem = { ...item, id: item.id || generateId() };
      const updatedSections = state.data.sections.map((s) =>
        s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s
      );
      const updated = { ...state.data, sections: updatedSections };
      return { ...pushToHistory(state, updated) };
    });
  },

  updateSectionItem: (sectionId, itemId, updatedItem) => {
    set((state) => {
      const updatedSections = state.data.sections.map((s) => {
        if (s.id === sectionId) {
          const updatedItems = s.items.map((item) =>
            item.id === itemId ? { ...item, ...updatedItem } : item
          );
          return { ...s, items: updatedItems };
        }
        return s;
      });
      const updated = { ...state.data, sections: updatedSections };
      return { ...pushToHistory(state, updated) };
    });
  },

  removeSectionItem: (sectionId, itemId) => {
    set((state) => {
      const updatedSections = state.data.sections.map((s) => {
        if (s.id === sectionId) {
          const filteredItems = s.items.filter((item) => item.id !== itemId);
          return { ...s, items: filteredItems };
        }
        return s;
      });
      const updated = { ...state.data, sections: updatedSections };
      return { ...pushToHistory(state, updated) };
    });
  },

  reorderSectionItems: (sectionId, items) => {
    set((state) => {
      const updatedSections = state.data.sections.map((s) =>
        s.id === sectionId ? { ...s, items } : s
      );
      const updated = { ...state.data, sections: updatedSections };
      return { ...pushToHistory(state, updated) };
    });
  },

  undo: () => {
    set((state) => {
      if (state.history.length === 0) return {};
      const previous = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, state.history.length - 1);
      return {
        history: newHistory,
        future: [state.data, ...state.future],
        data: previous,
      };
    });
  },

  redo: () => {
    set((state) => {
      if (state.future.length === 0) return {};
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        history: [...state.history, state.data],
        future: newFuture,
        data: next,
      };
    });
  },

  loadCV: (data) => {
    const sanitized = sanitizeCVData(data);
    set({
      data: sanitized,
      history: [],
      future: [],
    });
  },

  resetCV: () => {
    set((state) => ({
      ...pushToHistory(state, defaultCVData),
    }));
  },
}));

// LocalStorage Sync (Auto-save) Hook Helper
if (typeof window !== "undefined") {
  let lastSavedDataStr = "";

  // Try loading on initialize
  try {
    const saved = localStorage.getItem("cv_generator_data");
    if (saved) {
      const parsed = JSON.parse(saved);
      const sanitized = sanitizeCVData(parsed);
      lastSavedDataStr = JSON.stringify(sanitized); // Initialize to prevent load triggers
      // Ensure it is fully loaded
      setTimeout(() => {
        useCVStore.getState().loadCV(sanitized);
      }, 50);
    }
  } catch (e) {
    console.error("Error loading CV from localStorage", e);
  }

  // Subscribe to changes to auto-save with a debounce of 500ms
  let saveTimeout: NodeJS.Timeout;
  useCVStore.subscribe((state) => {
    const currentDataStr = JSON.stringify(state.data);
    if (currentDataStr === lastSavedDataStr) {
      return; // Break recursive infinite loop when only autoSaveStatus or UI states change
    }
    lastSavedDataStr = currentDataStr;

    clearTimeout(saveTimeout);
    if (useCVStore.getState().autoSaveStatus !== "saving") {
      useCVStore.setState({ autoSaveStatus: "saving" });
    }

    saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem("cv_generator_data", currentDataStr);
        useCVStore.setState({ autoSaveStatus: "saved" });
        
        // Return to idle status after 2 seconds
        setTimeout(() => {
          if (useCVStore.getState().autoSaveStatus === "saved") {
            useCVStore.setState({ autoSaveStatus: "idle" });
          }
        }, 2000);
      } catch (e) {
        console.error("Failed to auto-save to localStorage", e);
      }
    }, 500);
  });
}
