import React, { useState, useEffect } from "react";
import { useCVStore } from "../../store/useCVStore";
import { PersonalForm } from "./PersonalForm";
import { StyleCustomizer } from "./StyleCustomizer";
import { SectionAccordion } from "./SectionAccordion";
import { getDictionary } from "../../i18n/dictionaries";
import {
  Undo2,
  Redo2,
  RotateCcw,
  Sparkles,
  FileText,
  Palette,
  Database,
  Save,
  Trash2,
  FolderOpen,
  Plus,
  CloudLightning,
} from "lucide-react";
import { CVData } from "../../types/cv";

export const EditorPanel: React.FC = () => {
  const {
    data,
    undo,
    redo,
    resetCV,
    loadCV,
    setTitle,
    history,
    future,
    autoSaveStatus,
  } = useCVStore();

  const [activeTab, setActiveTab] = useState<"content" | "style" | "database">("content");
  
  const t = getDictionary(data.language || "fr");

  // Database API lists states
  const [savedCVs, setSavedCVs] = useState<any[]>([]);
  const [isDbLoading, setIsDbLoading] = useState(false);
  const [dbMessage, setDbMessage] = useState<{ text: string; type: "success" | "error" | null }>({ text: "", type: null });

  // Fetch list of saved CVs from SQLite database
  const fetchCVs = async () => {
    setIsDbLoading(true);
    try {
      const res = await fetch("/api/cv");
      if (res.ok) {
        const json = await res.json();
        setSavedCVs(json);
      }
    } catch (e) {
      console.error("Failed to load CVs from db", e);
    } finally {
      setIsDbLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "database") {
      fetchCVs();
    }
  }, [activeTab]);

  // Save the current Zustand state to the database
  const handleSaveToDatabase = async () => {
    setIsDbLoading(true);
    setDbMessage({ text: "", type: null });
    try {
      // If we are updating an existing database record vs creating a new one
      const method = data.id && data.id !== "default-cv" ? "PUT" : "POST";
      const url = method === "PUT" ? `/api/cv/${data.id}` : "/api/cv";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const savedData = await res.json();
        // Load the saved data back (updates ID if it was newly created)
        loadCV(savedData);
        setDbMessage({ text: "CV sauvegardé avec succès dans SQLite !", type: "success" });
        fetchCVs();
      } else {
        setDbMessage({ text: "Erreur lors de la sauvegarde du CV.", type: "error" });
      }
    } catch (e: any) {
      setDbMessage({ text: `Erreur serveur: ${e.message}`, type: "error" });
    } finally {
      setIsDbLoading(false);
      // Auto clear message after 4 seconds
      setTimeout(() => setDbMessage({ text: "", type: null }), 4000);
    }
  };

  // Load a CV from list
  const handleLoadFromDb = (cv: any) => {
    const formatted: CVData = {
      id: cv.id,
      title: cv.title,
      template: cv.template,
      colors: cv.colors,
      typography: cv.typography,
      layout: cv.layout,
      personalInfo: cv.personalInfo,
      socialLinks: cv.socialLinks || [],
      sections: cv.sections || [],
    };
    loadCV(formatted);
    setDbMessage({ text: `CV "${cv.title}" chargé avec succès !`, type: "success" });
    setTimeout(() => setDbMessage({ text: "", type: null }), 3000);
  };

  // Delete a CV from database
  const handleDeleteFromDb = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce CV ?")) return;

    try {
      const res = await fetch(`/api/cv/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCVs();
        setDbMessage({ text: "CV supprimé avec succès.", type: "success" });
        // If the active CV was deleted, reset ID
        if (data.id === id) {
          loadCV({ ...data, id: "default-cv" });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setDbMessage({ text: "", type: null }), 3000);
    }
  };

  // Create a brand new blank CV
  const handleCreateNewBlank = () => {
    resetCV();
    setDbMessage({ text: "Nouveau CV initialisé !", type: "success" });
    setTimeout(() => setDbMessage({ text: "", type: null }), 3000);
  };

  return (
    <div
      id="editor-panel"
      className="glass-panel w-full lg:w-[460px] h-full flex flex-col shrink-0 border-r border-slate-800"
    >
      {/* 1. Header Toolbar */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 space-y-3">
        
        {/* Title Input and Auto-save indicator */}
        <div className="flex items-center justify-between gap-3">
          <input
            type="text"
            value={data.title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 bg-transparent text-sm font-bold text-slate-100 hover:bg-slate-900 focus:bg-slate-900 border-b border-transparent focus:border-cyan-500 rounded px-1.5 py-1 focus:outline-none transition-colors"
            placeholder={t.editor.titlePlaceholder}
          />
          
          {/* Reactive Autosave Indicator */}
          <div className="shrink-0 flex items-center gap-1 text-[10px] uppercase font-bold text-slate-500 bg-slate-900/60 px-2 py-1 rounded-full border border-slate-850">
            <span className={`w-1.5 h-1.5 rounded-full ${
              autoSaveStatus === "saving" ? "bg-amber-500 animate-pulse" : "bg-cyan-500"
            }`} />
            <span>
              {autoSaveStatus === "saving" ? "Enregistrement..." : "Sauvegardé"}
            </span>
          </div>
        </div>

        {/* Action Controls Toolbar: Undo, Redo, Reset, SQL Save */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={undo}
              disabled={history.length === 0}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 disabled:opacity-35 disabled:cursor-not-allowed transition-all border border-slate-800"
              title="Annuler (Ctrl+Z)"
            >
              <Undo2 size={14} />
            </button>
            <button
              onClick={redo}
              disabled={future.length === 0}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 disabled:opacity-35 disabled:cursor-not-allowed transition-all border border-slate-800"
              title="Rétablir (Ctrl+Y)"
            >
              <Redo2 size={14} />
            </button>
            <button
              onClick={resetCV}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-red-400 transition-all border border-slate-800"
              title="Réinitialiser le CV"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          <button
            onClick={handleSaveToDatabase}
            disabled={isDbLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-cyan-950/20 active:scale-95"
            title="Sauvegarder les modifications dans la base SQL"
          >
            <Save size={13} />
            <span>Sauver SQL</span>
          </button>
        </div>
      </div>

      {/* 2. Form Tabs Selector */}
      <div className="flex border-b border-slate-800 bg-slate-950/50 p-1">
        <button
          onClick={() => setActiveTab("content")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "content"
              ? "bg-slate-900 text-cyan-400 border border-slate-800"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileText size={13} />
          {t.editor.content}
        </button>
        <button
          onClick={() => setActiveTab("style")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "style"
              ? "bg-slate-900 text-cyan-400 border border-slate-800"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Palette size={13} />
          {t.editor.style}
        </button>
        <button
          onClick={() => setActiveTab("database")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "database"
              ? "bg-slate-900 text-cyan-400 border border-slate-800"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Database size={13} />
          {t.editor.database}
        </button>
      </div>

      {/* 3. Main Form Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {dbMessage.text && (
          <div
            className={`p-3 rounded-xl border text-xs leading-snug animate-fade-in ${
              dbMessage.type === "success"
                ? "bg-emerald-950/40 border-emerald-900/60 text-emerald-400"
                : "bg-red-950/40 border-red-900/60 text-red-400"
            }`}
          >
            {dbMessage.text}
          </div>
        )}

        {activeTab === "content" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Coordonnées</h3>
              <PersonalForm />
            </div>
            <div className="space-y-4 pt-4 border-t border-slate-800/80">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Rubriques du CV</h3>
              <SectionAccordion />
            </div>
          </div>
        )}

        {activeTab === "style" && <StyleCustomizer />}

        {activeTab === "database" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <CloudLightning size={14} className="text-cyan-500" />
                Vos CVs enregistrés
              </h4>
              <button
                onClick={handleCreateNewBlank}
                className="text-[10px] px-2 py-1 bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-400 rounded border border-cyan-850 flex items-center gap-1 transition-all"
              >
                <Plus size={11} />
                Nouveau
              </button>
            </div>

            {isDbLoading && savedCVs.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">Chargement de la base SQL...</div>
            ) : savedCVs.length === 0 ? (
              <div className="text-center py-8 bg-slate-900/30 rounded-xl border border-slate-850 border-dashed">
                <p className="text-xs text-slate-400 font-medium">Aucun CV dans la base SQL pour le moment.</p>
                <p className="text-[10px] text-slate-600 mt-1">Cliquez sur "Sauver SQL" en haut pour sauvegarder votre travail actuel.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {savedCVs.map((cv) => {
                  const isActive = data.id === cv.id;
                  return (
                    <div
                      key={cv.id}
                      onClick={() => handleLoadFromDb(cv)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                        isActive
                          ? "bg-cyan-950/20 border-cyan-500/50"
                          : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <h5 className={`text-xs font-semibold truncate ${isActive ? "text-cyan-400" : "text-slate-200"}`}>
                          {cv.title}
                        </h5>
                        <p className="text-[10px] text-slate-500 font-mono">
                          Template: <span className="text-slate-400">{cv.template}</span> • Maj:{" "}
                          {new Date(cv.updatedAt).toLocaleDateString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={(e) => handleDeleteFromDb(cv.id, e)}
                          className="p-1.5 rounded hover:bg-red-950/40 text-slate-500 hover:text-red-400 transition-colors"
                          title="Supprimer définitivement"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default EditorPanel;
