export type Language = 'fr' | 'en';

export const dictionaries = {
  fr: {
    app: {
      title: "CV.tn",
      subtitle: "Générateur de CV interactif intelligent",
      desktopMode: "Mode Bureau",
      mobileMode: "Mode Mobile",
      editor: "Éditeur",
      preview: "Aperçu CV",
      fullscreen: "Plein écran",
      exitFullscreen: "Quitter plein écran",
    },
    sections: {
      personalInfo: "Informations Personnelles",
      experience: "Expériences Professionnelles",
      education: "Formations",
      skills: "Compétences",
      projects: "Projets",
      languages: "Langues",
      interests: "Centres d'intérêt",
      certifications: "Certifications",
      references: "Références",
      custom: "Section Personnalisée",
    },
    preview: {
      zoomIn: "Zoom avant",
      zoomOut: "Zoom arrière",
      resetZoom: "Réinitialiser zoom",
      downloadPDF: "Télécharger PDF",
      generating: "Génération...",
      vectorPrint: "Impression Vectorielle",
      print: "Imprimer",
      downloaded: "Téléchargé !",
      tipVectorPrint: "Astuce : Utilisez \"Impression Vectorielle\" et choisissez \"Enregistrer au format PDF\" pour obtenir une netteté infinie !",
    },
    editor: {
      content: "Contenu",
      style: "Style",
      database: "Sauvegardes",
      saveToDb: "Sauvegarder",
      reset: "Réinitialiser",
      loadMsgSuccess: "CV sauvegardé avec succès dans SQLite !",
      loadMsgError: "Erreur lors de la sauvegarde du CV.",
      emptyDb: "Aucun CV sauvegardé.",
      titlePlaceholder: "Nom du CV...",
      addSection: "Ajouter section",
      confirmReset: "Êtes-vous sûr de vouloir réinitialiser le CV complet ?"
    },
    customizer: {
      template: "Template de CV",
      presets: "Palettes Recommandées",
      customColors: "Personnalisation des Couleurs",
      primary: "Accent / Primaire",
      secondary: "Titres / Secondaire",
      sidebarBg: "Fond de la Sidebar",
      sidebarText: "Textes de la Sidebar",
      typography: "Typographie",
      fontFamily: "Police de caractères",
      fontSize: "Taille de police",
      fontWeights: {
        small: "Fin", medium: "Moyen", large: "Grand"
      },
      lineHeight: "Interligne / Espacement texte",
      lineHeights: {
        compact: "Serré", normal: "Standard", loose: "Aéré"
      },
      layoutAndSpacing: "Disposition & Marges",
      sidebarPosition: "Position de la Sidebar",
      sidebarPositions: {
        left: "Gauche", right: "Droite"
      },
      blockSpacing: "Espacement des Blocs",
      blockSpacings: {
        compact: "Serré", normal: "Moyen", loose: "Large"
      }
    }
  },
  en: {
    app: {
      title: "CV.tn",
      subtitle: "Smart Interactive CV Generator",
      desktopMode: "Desktop Mode",
      mobileMode: "Mobile Mode",
      editor: "Editor",
      preview: "CV Preview",
      fullscreen: "Fullscreen",
      exitFullscreen: "Exit Fullscreen",
    },
    sections: {
      personalInfo: "Personal Information",
      experience: "Professional Experience",
      education: "Education",
      skills: "Skills",
      projects: "Projects",
      languages: "Languages",
      interests: "Interests",
      certifications: "Certifications",
      references: "References",
      custom: "Custom Section",
    },
    preview: {
      zoomIn: "Zoom In",
      zoomOut: "Zoom Out",
      resetZoom: "Reset Zoom",
      downloadPDF: "Download PDF",
      generating: "Generating...",
      vectorPrint: "Vector Print",
      print: "Print",
      downloaded: "Downloaded!",
      tipVectorPrint: "Tip: Use \"Vector Print\" and select \"Save as PDF\" for infinite sharpness!",
    },
    editor: {
      content: "Content",
      style: "Style",
      database: "Backups",
      saveToDb: "Save",
      reset: "Reset",
      loadMsgSuccess: "CV successfully saved to SQLite!",
      loadMsgError: "Error saving CV.",
      emptyDb: "No saved CVs.",
      titlePlaceholder: "CV Name...",
      addSection: "Add section",
      confirmReset: "Are you sure you want to completely reset the CV?"
    },
    customizer: {
      template: "CV Template",
      presets: "Recommended Palettes",
      customColors: "Color Customization",
      primary: "Accent / Primary",
      secondary: "Titles / Secondary",
      sidebarBg: "Sidebar Background",
      sidebarText: "Sidebar Text",
      typography: "Typography",
      fontFamily: "Font Family",
      fontSize: "Font Size",
      fontWeights: {
        small: "Small", medium: "Medium", large: "Large"
      },
      lineHeight: "Line Height",
      lineHeights: {
        compact: "Compact", normal: "Standard", loose: "Loose"
      },
      layoutAndSpacing: "Layout & Spacing",
      sidebarPosition: "Sidebar Position",
      sidebarPositions: {
        left: "Left", right: "Right"
      },
      blockSpacing: "Block Spacing",
      blockSpacings: {
        compact: "Compact", normal: "Medium", loose: "Loose"
      }
    }
  }
};

export const getDictionary = (lang: Language) => dictionaries[lang] || dictionaries.fr;