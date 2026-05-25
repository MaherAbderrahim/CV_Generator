import React, { useState } from "react";
import { useCVStore } from "../../store/useCVStore";
import { TemplateSelector } from "../../templates/TemplateSelector";
import { getDictionary } from "../../i18n/dictionaries";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Printer,
  Download,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

export const PreviewPanel: React.FC = () => {
  const { data, zoom, setZoom } = useCVStore();
  const [exporting, setExporting] = useState(false);
  const [success, setSuccess] = useState(false);

  const t = getDictionary(data.language || "fr");

  // Zoom control modifiers
  const handleZoomIn = () => setZoom(Math.min(zoom + 0.1, 1.5));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.1, 0.5));
  const handleZoomReset = () => setZoom(1.0);

  // Method 1: HTML2Canvas + jsPDF Fallback
  const handleCanvasExport = async () => {
    const captureArea = document.getElementById("cv-capture-area");
    if (!captureArea) return;

    setExporting(true);
    setSuccess(false);

    // Save previous styling states before resetting for high-res rendering
    const originalTransform = captureArea.style.transform;
    const originalBoxShadow = captureArea.style.boxShadow;

    // Temporarily reset zoom scaling of parents so html2canvas captures a perfect 1:1 screen
    const zoomWrapper = captureArea.closest(".zoom-viewport-wrapper") as HTMLElement;
    const originalParentTransform = zoomWrapper ? zoomWrapper.style.transform : "";
    
    if (zoomWrapper) {
      zoomWrapper.style.transform = "none";
    }
    captureArea.style.transform = "scale(1)";
    captureArea.style.boxShadow = "none";

    try {
      // 2.0x DPI scale factor ensures extreme text clarity
      const canvas = await html2canvas(captureArea, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      
      // Standard A4 dimensions in Points (Pt)
      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate proportional height to prevent horizontal/vertical stretching
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add the first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Create subsequent pages if the content height overflows standard A4 height
      while (heightLeft >= 1) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      const fileName = `${data.personalInfo.firstName || "CV"}_${data.personalInfo.lastName || ""}_CV.pdf`;
      pdf.save(fileName);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error("Canvas PDF generation failed", err);
    } finally {
      // Restore original preview transform states
      captureArea.style.transform = originalTransform;
      captureArea.style.boxShadow = originalBoxShadow;
      if (zoomWrapper) {
        zoomWrapper.style.transform = originalParentTransform;
      }
      setExporting(false);
    }
  };

  // Method 2: High quality vector browser print
  const handleVectorPrint = () => {
    // Standard browser printing automatically triggers @media print stylesheets
    window.print();
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-[#05070c] relative select-none print:h-auto print:overflow-visible print:block print:bg-white print-layout-ancestor">
      
      {/* Preview Toolbar */}
      <div className="no-print h-12 bg-slate-950/80 border-b border-slate-900 flex items-center justify-between px-4 z-10">
        
        {/* Zoom controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors border border-slate-850"
            title={t.preview.zoomOut}
          >
            <ZoomOut size={13} />
          </button>
          
          <button
            onClick={handleZoomReset}
            className="text-[10px] px-2 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-mono transition-colors border border-slate-850"
            title={t.preview.resetZoom}
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors border border-slate-850"
            title={t.preview.zoomIn}
          >
            <ZoomIn size={13} />
          </button>
        </div>

        {/* Status Alerts */}
        {success && (
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-950/20 px-2 py-1 rounded border border-emerald-900/30">
            <CheckCircle size={12} />
            <span>{t.preview.downloaded}</span>
          </div>
        )}

        {/* Print / Export buttons */}
        <div className="flex items-center gap-2">
          
          {/* Vector Print button */}
          <button
            onClick={handleVectorPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-lg transition-colors border border-slate-800"
            title={t.preview.vectorPrint}
          >
            <Printer size={13} />
            <span className="hidden md:inline">{t.preview.vectorPrint}</span>
            <span className="md:hidden">{t.preview.print}</span>
          </button>

          {/* Direct Fallback PDF export */}
          <button
            onClick={handleCanvasExport}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-600 font-bold text-xs rounded-lg transition-colors shadow-md shadow-cyan-950/10 active:scale-95"
            title={t.preview.downloadPDF}
          >
            {exporting ? (
              <>
                <span className="w-3 h-3 rounded-full border-2 border-slate-950 border-t-transparent animate-spin shrink-0" />
                <span>{t.preview.generating}</span>
              </>
            ) : (
              <>
                <Download size={13} />
                <span>{t.preview.downloadPDF}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Vector print advice note */}
      <div className="no-print bg-slate-900/40 border-b border-slate-900/60 py-1.5 px-4 text-center text-[10px] text-slate-500 font-light flex items-center justify-center gap-1 shrink-0">
        <AlertCircle size={10} className="text-cyan-500 shrink-0" />
        <span>
          {t.preview.tipVectorPrint}
        </span>
      </div>

      {/* Sheet Workspace area */}
      <div 
        className="flex-grow overflow-auto p-8 flex flex-col items-center justify-start print:p-0 print:bg-white bg-[#05070c] scroll-smooth print:h-auto print:overflow-visible print:block print:static print-layout-ancestor"
        style={{
          "--cv-font-family": `"${data.typography.fontFamily}", sans-serif`,
          "--cv-font-size": data.typography.fontSize === "small" ? "13px" : data.typography.fontSize === "large" ? "17px" : "15px",
          "--cv-line-height": data.typography.lineHeight === "compact" ? "1.2" : data.typography.lineHeight === "loose" ? "1.8" : "1.5",
          "--cv-spacing": data.layout.spacing === "compact" ? "0.5rem" : data.layout.spacing === "loose" ? "1.5rem" : "1rem",
          "--cv-primary": data.colors.primary,
          "--cv-secondary": data.colors.secondary,
          "--cv-text": data.colors.text,
          "--cv-bg": data.colors.background,
          "--cv-sidebar-bg": data.colors.sidebarBg,
          "--cv-sidebar-text": data.colors.sidebarText,
          "--cv-accent": data.colors.accent,
        } as React.CSSProperties}
      >
        
        {/* Zoom viewport wrapper */}
        <div
          className="zoom-viewport-wrapper print:p-0 print:m-0 shrink-0 select-text transition-transform duration-200"
          style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
        >
          <TemplateSelector data={data} />
        </div>
      </div>
    </div>
  );
};
export default PreviewPanel;
