import React, { useState } from "react";
import { useCVStore } from "../../store/useCVStore";
import { CVSection, SectionType } from "../../types/cv";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Columns,
  Sparkles,
  ArrowUpDown,
  Layers,
} from "lucide-react";

export const SectionAccordion: React.FC = () => {
  const {
    data,
    toggleSectionVisibility,
    updateSectionTitle,
    setSectionSide,
    addSectionItem,
    updateSectionItem,
    removeSectionItem,
    addCustomSection,
    removeSection,
    reorderSections,
  } = useCVStore();

  // Keep track of which section accordion is expanded
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>("experience");
  // Keep track of expanded items inside each section (e.g. "exp1")
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  
  // Custom section state creator
  const [newCustomTitle, setNewCustomTitle] = useState("");
  const [customSide, setCustomSide] = useState<"left" | "right">("right");

  const toggleSection = (id: string) => {
    setExpandedSectionId(expandedSectionId === id ? null : id);
    setExpandedItemId(null);
  };

  const toggleItem = (itemId: string) => {
    setExpandedItemId(expandedItemId === itemId ? null : itemId);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomTitle.trim()) return;
    addCustomSection(newCustomTitle.trim(), customSide);
    setExpandedSectionId(`custom_${newCustomTitle.trim().toLowerCase().replace(/\s+/g, "_")}`);
    setNewCustomTitle("");
  };

  // Helper to get fresh default item data structures depending on section types
  const createNewItem = (type: SectionType) => {
    switch (type) {
      case "experience":
        return {
          company: "Nouvelle entreprise",
          position: "Poste",
          startDate: "2024-01",
          endDate: "Présent",
          current: true,
          location: "",
          description: "",
        };
      case "education":
        return {
          institution: "Nouvelle institution",
          degree: "Diplôme / Formation",
          fieldOfStudy: "",
          startDate: "2020-09",
          endDate: "2024-06",
          current: false,
          description: "",
        };
      case "projects":
        return {
          name: "Nouveau Projet",
          description: "Description courte du projet...",
          url: "",
          technologies: "React, Node.js",
        };
      case "skills":
        return {
          name: "Compétence",
          level: 80,
          category: "Hard",
        };
      case "languages":
        return {
          name: "Langue",
          level: "Intermédiaire",
          percentage: 60,
        };
      case "certifications":
        return {
          name: "Nouvelle Certification",
          issuer: "Organisme",
          date: "2024-01",
          url: "",
        };
      case "interests":
        return {
          name: "Centre d'intérêt",
        };
      case "custom":
        return {
          title: "Élément personnalisé",
          subtitle: "Sous-titre",
          date: "2024",
          description: "Description de l'activité...",
        };
      default:
        return {};
    }
  };

  const handleAddItem = (sectionId: string, type: SectionType) => {
    const newItem = createNewItem(type);
    addSectionItem(sectionId, newItem);
    // Auto expand newly added item
    setTimeout(() => {
      if (data.sections.find(s => s.id === sectionId)?.items.length) {
        const sect = useCVStore.getState().data.sections.find(s => s.id === sectionId);
        const lastItem = sect?.items[sect.items.length - 1];
        if (lastItem) setExpandedItemId(lastItem.id);
      }
    }, 100);
  };

  return (
    <div className="space-y-4 text-slate-200">
      
      {/* Dynamic sections rendering */}
      <div className="space-y-3">
        {data.sections.map((section) => {
          const isExpanded = expandedSectionId === section.id;
          
          return (
            <div
              key={section.id}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? "bg-slate-900/60 border-slate-700/80 shadow-lg"
                  : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700/60"
              }`}
            >
              {/* Accordion Summary Header */}
              <div className="flex items-center justify-between p-3.5 select-none">
                <button
                  onClick={() => toggleSection(section.id)}
                  type="button"
                  className="flex-1 flex items-center gap-3 text-left font-medium text-sm text-slate-200"
                >
                  <span className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                    <ChevronDown size={16} />
                  </span>
                  <span className="truncate">{section.title}</span>
                  {!section.visible && (
                    <span className="text-[10px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold uppercase leading-none">
                      <EyeOff size={10} />
                      Masqué
                    </span>
                  )}
                </button>

                {/* Section Controls Toolbar */}
                <div className="flex items-center gap-2">
                  
                  {/* Left / Right column placement selector (for primary 2-column templates) */}
                  {data.template === "primary" && (
                    <div className="flex items-center bg-slate-950/80 rounded-lg p-0.5 border border-slate-850 shrink-0">
                      <button
                        title="Placer dans la colonne gauche (sidebar)"
                        onClick={() => setSectionSide(section.id, "left")}
                        className={`text-[10px] px-2 py-1 rounded font-bold transition-all ${
                          section.side === "left"
                            ? "bg-cyan-500 text-slate-950"
                            : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        Sidebar
                      </button>
                      <button
                        title="Placer dans la colonne droite (contenu)"
                        onClick={() => setSectionSide(section.id, "right")}
                        className={`text-[10px] px-2 py-1 rounded font-bold transition-all ${
                          section.side === "right"
                            ? "bg-cyan-500 text-slate-950"
                            : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        Contenu
                      </button>
                    </div>
                  )}

                  {/* Visibility Eye button */}
                  <button
                    onClick={() => toggleSectionVisibility(section.id)}
                    type="button"
                    title={section.visible ? "Masquer la section" : "Afficher la section"}
                    className={`p-1.5 rounded-lg border transition-all ${
                      section.visible
                        ? "bg-slate-850 border-slate-750 text-cyan-400 hover:bg-slate-800"
                        : "bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {section.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>

                  {/* Remove button if custom section */}
                  {section.type === "custom" && (
                    <button
                      onClick={() => removeSection(section.id)}
                      type="button"
                      title="Supprimer la section"
                      className="p-1.5 rounded-lg border border-red-950/40 bg-red-950/20 text-red-400 hover:bg-red-900/30 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Section Form content */}
              {isExpanded && (
                <div className="p-4 border-t border-slate-800/80 space-y-4">
                  {/* Renaming titles for sections */}
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-slate-500 shrink-0">Titre affiché :</span>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                      className="flex-1 bg-slate-950/80 border border-slate-800 text-xs px-2 py-1 rounded text-slate-300 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  {/* Accordion list items */}
                  <div className="space-y-3">
                    {section.items.map((item, index) => {
                      const isItemExpanded = expandedItemId === item.id;
                      const itemTitle =
                        section.type === "experience"
                          ? item.position || "Expérience"
                          : section.type === "education"
                          ? item.degree || "Formation"
                          : section.type === "projects"
                          ? item.name || "Projet"
                          : section.type === "skills"
                          ? item.name || "Compétence"
                          : section.type === "languages"
                          ? item.name || "Langue"
                          : section.type === "certifications"
                          ? item.name || "Certification"
                          : section.type === "interests"
                          ? item.name || "Centre d'intérêt"
                          : item.title || "Élément";

                      return (
                        <div
                          key={item.id}
                          className="rounded-lg border border-slate-800/80 bg-slate-950/40 overflow-hidden"
                        >
                          {/* Item header */}
                          <div className="flex justify-between items-center p-2.5 bg-slate-950/60 select-none">
                            <button
                              onClick={() => toggleItem(item.id)}
                              type="button"
                              className="flex-1 flex items-center gap-2 text-left text-xs font-semibold text-slate-300"
                            >
                              <span className={`text-slate-500 shrink-0 transition-transform ${isItemExpanded ? "rotate-90" : ""}`}>
                                ▶
                              </span>
                              <span className="truncate">{itemTitle}</span>
                              {section.type === "skills" && item.level > 0 && (
                                <span className="text-[10px] text-cyan-400 font-bold">({item.level}%)</span>
                              )}
                            </button>

                            <button
                              onClick={() => removeSectionItem(section.id, item.id)}
                              type="button"
                              className="text-slate-600 hover:text-red-400 p-1 rounded hover:bg-red-950/30 transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          {/* Item inputs expanded */}
                          {isItemExpanded && (
                            <div className="p-3 bg-slate-900/30 border-t border-slate-850 space-y-3 text-xs">
                              
                              {/* Experience form inputs */}
                              {section.type === "experience" && (
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="col-span-2 space-y-1">
                                    <label className="text-slate-400">Poste / Titre</label>
                                    <input
                                      type="text"
                                      value={item.position}
                                      onChange={(e) => updateSectionItem(section.id, item.id, { position: e.target.value })}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-slate-400">Entreprise</label>
                                    <input
                                      type="text"
                                      value={item.company}
                                      onChange={(e) => updateSectionItem(section.id, item.id, { company: e.target.value })}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-slate-400">Lieu (ex: Paris)</label>
                                    <input
                                      type="text"
                                      value={item.location}
                                      onChange={(e) => updateSectionItem(section.id, item.id, { location: e.target.value })}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-slate-400">Date Début</label>
                                    <input
                                      type="text"
                                      value={item.startDate}
                                      placeholder="AAAA-MM"
                                      onChange={(e) => updateSectionItem(section.id, item.id, { startDate: e.target.value })}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-slate-400">Date Fin</label>
                                    <input
                                      type="text"
                                      value={item.endDate}
                                      placeholder="Présent ou AAAA-MM"
                                      onChange={(e) => updateSectionItem(section.id, item.id, { endDate: e.target.value })}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                    />
                                  </div>
                                  <div className="col-span-2 space-y-1">
                                    <label className="text-slate-400">Description des tâches (Supporte le saut de ligne)</label>
                                    <textarea
                                      value={item.description}
                                      rows={4}
                                      onChange={(e) => updateSectionItem(section.id, item.id, { description: e.target.value })}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200 resize-y"
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Education form inputs */}
                              {section.type === "education" && (
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="col-span-2 space-y-1">
                                    <label className="text-slate-400">Diplôme / Formation</label>
                                    <input
                                      type="text"
                                      value={item.degree}
                                      onChange={(e) => updateSectionItem(section.id, item.id, { degree: e.target.value })}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-slate-400">Établissement / Université</label>
                                    <input
                                      type="text"
                                      value={item.institution}
                                      onChange={(e) => updateSectionItem(section.id, item.id, { institution: e.target.value })}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-slate-400">Option / Spécialité</label>
                                    <input
                                      type="text"
                                      value={item.fieldOfStudy}
                                      placeholder="Ex: Génie Logiciel"
                                      onChange={(e) => updateSectionItem(section.id, item.id, { fieldOfStudy: e.target.value })}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-slate-400">Date Début</label>
                                    <input
                                      type="text"
                                      value={item.startDate}
                                      placeholder="AAAA-MM"
                                      onChange={(e) => updateSectionItem(section.id, item.id, { startDate: e.target.value })}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-slate-400">Date Fin</label>
                                    <input
                                      type="text"
                                      value={item.endDate}
                                      placeholder="AAAA-MM"
                                      onChange={(e) => updateSectionItem(section.id, item.id, { endDate: e.target.value })}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                    />
                                  </div>
                                  <div className="col-span-2 space-y-1">
                                    <label className="text-slate-400">Détails (Mention, Projets...)</label>
                                    <textarea
                                      value={item.description}
                                      rows={2}
                                      onChange={(e) => updateSectionItem(section.id, item.id, { description: e.target.value })}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Projects form inputs */}
                              {section.type === "projects" && (
                                <div className="space-y-3">
                                  <div className="space-y-1">
                                    <label className="text-slate-400">Nom du projet</label>
                                    <input
                                      type="text"
                                      value={item.name}
                                      onChange={(e) => updateSectionItem(section.id, item.id, { name: e.target.value })}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <label className="text-slate-400">Lien du projet (URL)</label>
                                      <input
                                        type="url"
                                        value={item.url}
                                        onChange={(e) => updateSectionItem(section.id, item.id, { url: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-slate-400">Technologies (ex: React, API)</label>
                                      <input
                                        type="text"
                                        value={item.technologies}
                                        onChange={(e) => updateSectionItem(section.id, item.id, { technologies: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-slate-400">Description du projet</label>
                                    <textarea
                                      value={item.description}
                                      rows={2}
                                      onChange={(e) => updateSectionItem(section.id, item.id, { description: e.target.value })}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Skills form inputs */}
                              {section.type === "skills" && (
                                <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <label className="text-slate-400">Nom de la compétence</label>
                                      <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) => updateSectionItem(section.id, item.id, { name: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-slate-400">Catégorie</label>
                                      <select
                                        value={item.category}
                                        onChange={(e) => updateSectionItem(section.id, item.id, { category: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                      >
                                        <option value="Hard">Technique (Hard)</option>
                                        <option value="Soft">Humaine (Soft)</option>
                                      </select>
                                    </div>
                                  </div>
                                  
                                  {/* Slider Rating */}
                                  <div className="space-y-1 pt-1">
                                    <div className="flex justify-between items-center text-slate-400">
                                      <label>Niveau de maîtrise ({item.level}%)</label>
                                      <span className="text-[10px] text-cyan-400 font-bold italic">
                                        {item.level >= 90 ? "Expert" : item.level >= 75 ? "Avancé" : item.level >= 50 ? "Intermédiaire" : "Débutant"}
                                      </span>
                                    </div>
                                    <input
                                      type="range"
                                      min="0"
                                      max="100"
                                      value={item.level}
                                      onChange={(e) => updateSectionItem(section.id, item.id, { level: parseInt(e.target.value) })}
                                      className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Languages form inputs */}
                              {section.type === "languages" && (
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <label className="text-slate-400">Nom de la langue</label>
                                    <input
                                      type="text"
                                      value={item.name}
                                      onChange={(e) => updateSectionItem(section.id, item.id, { name: e.target.value })}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-slate-400">Niveau (ex: Bilingue)</label>
                                    <input
                                      type="text"
                                      value={item.level}
                                      placeholder="Ex: C1 - Courant"
                                      onChange={(e) => updateSectionItem(section.id, item.id, { level: e.target.value })}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                    />
                                  </div>
                                  <div className="col-span-2 space-y-1">
                                    <div className="flex justify-between items-center text-slate-400">
                                      <label>Jauge visuelle ({item.percentage}%)</label>
                                    </div>
                                    <input
                                      type="range"
                                      min="0"
                                      max="100"
                                      value={item.percentage || 50}
                                      onChange={(e) => updateSectionItem(section.id, item.id, { percentage: parseInt(e.target.value) })}
                                      className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Certifications form inputs */}
                              {section.type === "certifications" && (
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="col-span-2 space-y-1">
                                    <label className="text-slate-400">Nom de la certification</label>
                                    <input
                                      type="text"
                                      value={item.name}
                                      onChange={(e) => updateSectionItem(section.id, item.id, { name: e.target.value })}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-slate-400">Organisme Émetteur</label>
                                    <input
                                      type="text"
                                      value={item.issuer}
                                      onChange={(e) => updateSectionItem(section.id, item.id, { issuer: e.target.value })}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-slate-400">Date d'obtention</label>
                                    <input
                                      type="text"
                                      value={item.date}
                                      placeholder="AAAA-MM"
                                      onChange={(e) => updateSectionItem(section.id, item.id, { date: e.target.value })}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Interests form inputs */}
                              {section.type === "interests" && (
                                <div className="space-y-1">
                                  <label className="text-slate-400">Nom de l'intérêt</label>
                                  <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => updateSectionItem(section.id, item.id, { name: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                  />
                                </div>
                              )}

                              {/* Custom form inputs */}
                              {section.type === "custom" && (
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <label className="text-slate-400">Titre / Rôle</label>
                                    <input
                                      type="text"
                                      value={item.title}
                                      onChange={(e) => updateSectionItem(section.id, item.id, { title: e.target.value })}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-slate-400">Sous-titre / Lieu</label>
                                    <input
                                      type="text"
                                      value={item.subtitle}
                                      onChange={(e) => updateSectionItem(section.id, item.id, { subtitle: e.target.value })}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                    />
                                  </div>
                                  <div className="col-span-2 space-y-1">
                                    <label className="text-slate-400">Date ou Période</label>
                                    <input
                                      type="text"
                                      value={item.date}
                                      onChange={(e) => updateSectionItem(section.id, item.id, { date: e.target.value })}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                    />
                                  </div>
                                  <div className="col-span-2 space-y-1">
                                    <label className="text-slate-400">Description</label>
                                    <textarea
                                      value={item.description}
                                      rows={3}
                                      onChange={(e) => updateSectionItem(section.id, item.id, { description: e.target.value })}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-200"
                                    />
                                  </div>
                                </div>
                              )}

                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Add item button */}
                  <button
                    onClick={() => handleAddItem(section.id, section.type)}
                    type="button"
                    className="w-full py-2 bg-slate-950/65 hover:bg-slate-900/60 text-slate-300 hover:text-cyan-400 rounded-xl border border-dashed border-slate-800 hover:border-cyan-500/50 flex items-center justify-center gap-1.5 text-xs font-semibold transition-all mt-2"
                  >
                    <Plus size={14} />
                    Ajouter un élément
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Custom Section Creator Form */}
      <form
        onSubmit={handleAddCustom}
        className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3"
      >
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Sparkles size={14} className="text-cyan-500" />
          Créer une Section Personnalisée
        </h4>
        <p className="text-[11px] text-slate-500 font-light leading-snug">
          Vous voulez ajouter du bénévolat, des publications ou des références ? Entrez simplement le nom de la section ci-dessous.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={newCustomTitle}
            onChange={(e) => setNewCustomTitle(e.target.value)}
            placeholder="Ex: Références, Bénévolat..."
            className="flex-1 text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="text-xs px-3 py-2 bg-cyan-500 text-slate-950 font-bold rounded-lg hover:bg-cyan-400 transition-colors shrink-0 flex items-center gap-1"
          >
            <Plus size={14} />
            Créer
          </button>
        </div>
      </form>
    </div>
  );
};
export default SectionAccordion;
