"use client";

import React, { useEffect, useState } from "react";
import { useCVStore } from "../store/useCVStore";
import EditorPanel from "../components/editor/EditorPanel";
import PreviewPanel from "../components/preview/PreviewPanel";
import { Sparkles, Eye, Edit3, Smartphone, Laptop, Maximize, Minimize, Globe } from "lucide-react";
import { getDictionary, Language } from "../i18n/dictionaries";

export default function Home() {
  const { data, activeTab, setActiveTab, setLanguage } = useCVStore();
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Responsive screen size listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const t = getDictionary(data.language || "fr");

  return (
    <main className="h-screen w-screen flex flex-col bg-[#05070c] overflow-hidden select-none print:h-auto print:w-auto print:overflow-visible print:bg-white print:block print-layout-ancestor">
      
      {/* Dynamic Header Navbar */}
      <header className="no-print h-14 bg-slate-950/90 border-b border-slate-900 flex items-center justify-between px-4 shrink-0 backdrop-blur-md">
        
        {/* Startup Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-cyan-500 to-teal-400 p-1.5 rounded-lg text-slate-950 shadow-lg shadow-cyan-500/20 font-black tracking-tight leading-none shrink-0 flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-100 tracking-tight flex items-center gap-1.5 leading-none">
              {t.app.title} <span className="text-[10px] text-cyan-400 uppercase font-mono tracking-widest bg-cyan-950/60 px-1.5 py-0.5 rounded-md border border-cyan-900/30">PRO</span>
            </h1>
            <p className="text-[9px] text-slate-500 mt-0.5 hidden sm:block">{t.app.subtitle}</p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          
          <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800">
            <button
              onClick={() => setLanguage("fr")}
              className={`text-xs px-2 py-1 rounded-md transition-colors ${
                data.language !== "en" ? "bg-slate-800 text-cyan-400 font-bold" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`text-xs px-2 py-1 rounded-md transition-colors ${
                data.language === "en" ? "bg-slate-800 text-cyan-400 font-bold" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              EN
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="text-slate-400 hover:text-cyan-400 p-2 rounded-lg bg-slate-900 border border-slate-800 transition-colors"
            title={isFullscreen ? t.app.exitFullscreen : t.app.fullscreen}
          >
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
          </button>

          {/* Small Screen Layout Helper Indicators */}
          <div className="hidden md:flex text-[10px] text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-850 items-center gap-1">
            <Laptop size={11} className="hidden lg:inline text-cyan-500" />
            <Smartphone size={11} className="lg:hidden text-cyan-500" />
            <span>{isMobile ? t.app.mobileMode : t.app.desktopMode}</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden relative print:h-auto print:overflow-visible print:block print:static print-layout-ancestor">
        
        {/* Desktop Split view OR Mobile Active View routing */}
        {(!isMobile || activeTab === "edit") && (
          <div className="h-full shrink-0 w-full lg:w-auto print:hidden">
            <EditorPanel />
          </div>
        )}

        {(!isMobile || activeTab === "preview") && (
          <div className="flex-grow h-full overflow-hidden print:h-auto print:overflow-visible print:w-full print:block print:static print-layout-ancestor">
            <PreviewPanel />
          </div>
        )}
      </div>

      {/* Modern floating mobile toolbar navigation */}
      {isMobile && (
        <div className="no-print absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/80 backdrop-blur-md px-2 py-1.5 rounded-full border border-slate-800 flex items-center gap-2 shadow-2xl z-30 shadow-black/80">
          <button
            onClick={() => setActiveTab("edit")}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "edit"
                ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Edit3 size={13} />
            {t.app.editor}
          </button>
          
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "preview"
                ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye size={13} />
            {t.app.preview}
          </button>
        </div>
      )}
    </main>
  );
}
