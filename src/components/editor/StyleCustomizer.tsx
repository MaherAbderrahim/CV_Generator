import React from "react";
import { useCVStore } from "../../store/useCVStore";
import { Paintbrush, Type, AlignLeft, Sparkles, Check, Sidebar } from "lucide-react";
import { getDictionary } from "../../i18n/dictionaries";

export const StyleCustomizer: React.FC = () => {
  const { data, setTemplate, updateColors, updateTypography, updateLayout } = useCVStore();
  const t = getDictionary(data.language || "fr");

  const templates = [
    { id: "primary", name: "Signature Bicolore", description: "Le modèle principal avec colonne colorée" },
    { id: "classic", name: "Classique", description: "Mise en page centrée traditionnelle" },
    { id: "minimal", name: "Minimaliste", description: "Élégant, aéré et asymétrique" },
    { id: "ats", name: "ATS Friendly", description: "Optimisé pour les robots recruteurs" },
    { id: "creative", name: "Timeline Créative", description: "Structure dynamique avec accents personnalisables" },
    { id: "premium", name: "Hexa Portrait", description: "Portrait géométrique et lecture éditoriale" },
    { id: "soft-panel", name: "Soft Panel", description: "Panneau arrondi et barres de compétences" },
    { id: "diagonal-timeline", name: "Diagonal Impact", description: "En-tête graphique et timeline verticale" },
    { id: "executive-band", name: "Executive Band", description: "Sidebar sombre et bandeaux élégants" },
  ];

  // Premium color presets
  const presets = [
    {
      name: "Cyan Modern",
      colors: {
        primary: "#00bcd4",
        secondary: "#0f172a",
        sidebarBg: "#0f172a",
        sidebarText: "#f8fafc",
        background: "#ffffff",
        text: "#334155",
      },
    },
    {
      name: "Ocean Breeze",
      colors: {
        primary: "#3b82f6",
        secondary: "#1e3a8a",
        sidebarBg: "#1e3a8a",
        sidebarText: "#f0f9ff",
        background: "#ffffff",
        text: "#334155",
      },
    },
    {
      name: "Emerald Luxury",
      colors: {
        primary: "#10b981",
        secondary: "#064e3b",
        sidebarBg: "#064e3b",
        sidebarText: "#ecfdf5",
        background: "#ffffff",
        text: "#374151",
      },
    },
    {
      name: "Royal Amethyst",
      colors: {
        primary: "#8b5cf6",
        secondary: "#1e1b4b",
        sidebarBg: "#1e1b4b",
        sidebarText: "#faf5ff",
        background: "#ffffff",
        text: "#374151",
      },
    },
    {
      name: "Charcoal Chic",
      colors: {
        primary: "#18181b",
        secondary: "#18181b",
        sidebarBg: "#f4f4f5",
        sidebarText: "#18181b",
        background: "#ffffff",
        text: "#27272a",
      },
    },
  ];

  const fonts = [
    "Poppins", "Inter", "Manrope", "DM Sans", "Plus Jakarta Sans",
    "Outfit", "Source Sans 3", "Nunito Sans", "Lora", "Merriweather"
  ];

  const handleColorChange = (key: string, val: string) => {
    updateColors({ [key]: val });
  };

  const isPresetActive = (preset: typeof presets[0]) => {
    return (
      data.colors.primary === preset.colors.primary &&
      data.colors.secondary === preset.colors.secondary &&
      data.colors.sidebarBg === preset.colors.sidebarBg &&
      data.colors.sidebarText === preset.colors.sidebarText
    );
  };

  return (
    <div className="space-y-6 text-slate-200">
      
      {/* 1. Template Selection */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Sidebar size={14} className="text-cyan-500" />
          {t.customizer.template}
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => setTemplate(tpl.id)}
              className={`p-3 rounded-xl text-left transition-all relative border flex flex-col justify-between h-24 ${
                data.template === tpl.id
                  ? "bg-cyan-950/40 border-cyan-500/80 ring-1 ring-cyan-500/50"
                  : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
              }`}
            >
              <div className="space-y-0.5">
                <span className="text-xs font-semibold block text-slate-200">{tpl.name}</span>
                <span className="text-[10px] text-slate-500 font-light block leading-tight">{tpl.description}</span>
              </div>
              {data.template === tpl.id && (
                <span className="absolute bottom-2 right-2 bg-cyan-500 text-slate-950 p-0.5 rounded-full">
                  <Check size={10} strokeWidth={4} />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Color Presets */}
      <div className="space-y-3 pt-3 border-t border-slate-800/80">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Sparkles size={14} className="text-cyan-500" />
          {t.customizer.presets}
        </h4>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => {
            const active = isPresetActive(preset);
            return (
              <button
                key={preset.name}
                onClick={() => updateColors(preset.colors)}
                className={`flex items-center gap-2 px-3 py-2 bg-slate-950/60 border rounded-xl hover:bg-slate-900 transition-all ${
                  active ? "border-cyan-500 text-cyan-400 font-medium" : "border-slate-800 text-slate-300"
                }`}
              >
                <div className="flex gap-0.5">
                  <span className="w-2 h-4 rounded-l" style={{ backgroundColor: preset.colors.primary }} />
                  <span className="w-2 h-4" style={{ backgroundColor: preset.colors.secondary }} />
                  <span className="w-2 h-4 rounded-r" style={{ backgroundColor: preset.colors.sidebarBg }} />
                </div>
                <span className="text-xs">{preset.name}</span>
                {active && <Check size={12} className="text-cyan-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Manual Colors */}
      <div className="space-y-3 pt-3 border-t border-slate-800/80">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Paintbrush size={14} className="text-cyan-500" />
          {t.customizer.customColors}
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400 block">{t.customizer.primary}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={data.colors.primary}
                onChange={(e) => handleColorChange("primary", e.target.value)}
                className="w-8 h-8 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={data.colors.primary}
                onChange={(e) => handleColorChange("primary", e.target.value)}
                className="flex-1 bg-slate-950/80 border border-slate-800 text-xs px-2 py-1 rounded text-slate-300 font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400 block">{t.customizer.secondary}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={data.colors.secondary}
                onChange={(e) => handleColorChange("secondary", e.target.value)}
                className="w-8 h-8 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={data.colors.secondary}
                onChange={(e) => handleColorChange("secondary", e.target.value)}
                className="flex-1 bg-slate-950/80 border border-slate-800 text-xs px-2 py-1 rounded text-slate-300 font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400 block">{t.customizer.sidebarBg}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={data.colors.sidebarBg}
                onChange={(e) => handleColorChange("sidebarBg", e.target.value)}
                className="w-8 h-8 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={data.colors.sidebarBg}
                onChange={(e) => handleColorChange("sidebarBg", e.target.value)}
                className="flex-1 bg-slate-950/80 border border-slate-800 text-xs px-2 py-1 rounded text-slate-300 font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400 block">{t.customizer.sidebarText}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={data.colors.sidebarText}
                onChange={(e) => handleColorChange("sidebarText", e.target.value)}
                className="w-8 h-8 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={data.colors.sidebarText}
                onChange={(e) => handleColorChange("sidebarText", e.target.value)}
                className="flex-1 bg-slate-950/80 border border-slate-800 text-xs px-2 py-1 rounded text-slate-300 font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Typography */}
      <div className="space-y-3 pt-3 border-t border-slate-800/80">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Type size={14} className="text-cyan-500" />
          {t.customizer.typography}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">{t.customizer.fontFamily}</label>
            <select
              value={data.typography.fontFamily}
              onChange={(e) => updateTypography({ fontFamily: e.target.value })}
              className="w-full text-xs px-3 py-2 bg-slate-950/80 rounded-lg border border-slate-800 focus:outline-none focus:border-cyan-500 text-slate-200"
            >
              {fonts.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">{t.customizer.fontSize}</label>
            <div className="flex bg-slate-950/80 rounded-lg p-0.5 border border-slate-800">
              {["small", "medium", "large"].map((sz) => (
                <button
                  key={sz}
                  onClick={() => updateTypography({ fontSize: sz as any })}
                  className={`flex-1 text-[11px] py-1.5 rounded-md transition-all uppercase font-medium ${
                    data.typography.fontSize === sz
                      ? "bg-cyan-500 text-slate-950"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {sz === "small" ? t.customizer.fontWeights.small : sz === "large" ? t.customizer.fontWeights.large : t.customizer.fontWeights.medium}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-400">{t.customizer.lineHeight}</label>
            <div className="flex bg-slate-950/80 rounded-lg p-0.5 border border-slate-800">
              {["compact", "normal", "loose"].map((lh) => (
                <button
                  key={lh}
                  onClick={() => updateTypography({ lineHeight: lh as any })}
                  className={`flex-1 text-[11px] py-1.5 rounded-md transition-all uppercase font-medium ${
                    data.typography.lineHeight === lh
                      ? "bg-cyan-500 text-slate-950"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {lh === "compact" ? t.customizer.lineHeights.compact : lh === "loose" ? t.customizer.lineHeights.loose : t.customizer.lineHeights.normal}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Layout Alignment and Spacing */}
      <div className="space-y-3 pt-3 border-t border-slate-800/80">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <AlignLeft size={14} className="text-cyan-500" />
          {t.customizer.layoutAndSpacing}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">{t.customizer.sidebarPosition}</label>
            <div className="flex bg-slate-950/80 rounded-lg p-0.5 border border-slate-800">
              {["left", "right"].map((side) => (
                <button
                  key={side}
                  onClick={() => updateLayout({ sidebarSide: side as any })}
                  className={`flex-1 text-[11px] py-1.5 rounded-md transition-all uppercase font-semibold ${
                    data.layout.sidebarSide === side
                      ? "bg-cyan-500 text-slate-950"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {side === "left" ? t.customizer.sidebarPositions.left : t.customizer.sidebarPositions.right}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">{t.customizer.blockSpacing}</label>
            <div className="flex bg-slate-950/80 rounded-lg p-0.5 border border-slate-800">
              {["compact", "normal", "loose"].map((sp) => (
                <button
                  key={sp}
                  onClick={() => updateLayout({ spacing: sp as any })}
                  className={`flex-1 text-[11px] py-1.5 rounded-md transition-all uppercase font-semibold ${
                    data.layout.spacing === sp
                      ? "bg-cyan-500 text-slate-950"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {sp === "compact" ? t.customizer.blockSpacings.compact : sp === "loose" ? t.customizer.blockSpacings.loose : t.customizer.blockSpacings.normal}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
export default StyleCustomizer;
