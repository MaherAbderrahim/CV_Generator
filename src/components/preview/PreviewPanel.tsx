import React, { useState, useEffect, useRef } from "react";
import { useCVStore } from "../../store/useCVStore";
import { TemplateSelector } from "../../templates/TemplateSelector";
import { getDictionary } from "../../i18n/dictionaries";
import { calculatePageBreaks } from "../../templates/templateHelpers";
import {
  ZoomIn,
  ZoomOut,
  Printer,
  Download,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

// A4 dimensions in pixels at 96 dpi
const A4_HEIGHT_PX = 1123;
const A4_WIDTH_PX = 794;

// ─────────────────────────────────────────────────────────────────
// ARCHITECTURE — Section-aware viewport-clip pagination
//
// 1. Render full template in a hidden measurement div
// 2. Measure all .section-group positions relative to #cv-capture-area
// 3. calculatePageBreaks() determines where breaks should go
// 4. Re-render visible pages — each page injects break markers via
//    MutationObserver INSIDE the template DOM, between .section-group
//    elements, so that CSS page-break-before triggers in print mode.
// 5. Preview uses viewport-clip (overflow:hidden + translateY).
// ─────────────────────────────────────────────────────────────────

export const PreviewPanel: React.FC = () => {
  const { data, zoom, setZoom } = useCVStore();
  const [exporting, setExporting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageBreaks, setPageBreaks] = useState<number[]>([]);

  // Ref to the measurement container (hidden, renders full template)
  const measureRef = useRef<HTMLDivElement>(null);
  // Refs to each visible page's inner container (for MutationObserver)
  const pageInnerRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const t = getDictionary(data.language || "fr");

  // Zoom controls
  const handleZoomIn = () => setZoom(Math.min(zoom + 0.1, 1.5));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.1, 0.5));
  const handleZoomReset = () => setZoom(1.0);

  // ── Measurement pass: measure all .section-group elements ──
  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    const compute = () => {
      const captureArea = el.querySelector<HTMLElement>("#cv-capture-area");
      if (!captureArea) return;

      const captureRect = captureArea.getBoundingClientRect();
      const sectionEls = captureArea.querySelectorAll<HTMLElement>(".section-group");

      const sectionHeights: Array<{ top: number; height: number }> = [];
      sectionEls.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        sectionHeights.push({
          top: rect.top - captureRect.top,
          height: rect.height,
        });
      });

      const { breaksBefore, totalPages: pages } = calculatePageBreaks(
        sectionHeights,
        A4_HEIGHT_PX
      );

      setPageBreaks(breaksBefore);
      setTotalPages(pages);
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [data]);

  // ── Inject page-break markers into ALL pages' template DOMs ──
  //    Breaks are display:none in preview (invisible), so clip offsets based
  //    on unbroken layout remain correct. In @media print, breaks become
  //    visible and trigger page-break-before for correct print pagination.
  useEffect(() => {
    if (pageBreaks.length === 0) return;

    const cleanupAll = () => {
      for (const [, pageEl] of pageInnerRefs.current) {
        pageEl.querySelectorAll(".cv-page-break-marker").forEach((m) => m.remove());
      }
    };
    cleanupAll();

    let injecting = false;
    const injectIntoPage = (pageEl: HTMLElement) => {
      const captureArea = pageEl.querySelector<HTMLElement>("#cv-capture-area");
      if (!captureArea) return;
      const sections = captureArea.querySelectorAll<HTMLElement>(".section-group");
      if (sections.length === 0) return;

      pageEl.querySelectorAll(".cv-page-break-marker").forEach((m) => m.remove());

      const sorted = [...pageBreaks].sort((a, b) => b - a);
      for (const breakIdx of sorted) {
        if (breakIdx < sections.length) {
          const marker = document.createElement("div");
          marker.className = "cv-page-break-marker";
          marker.setAttribute("data-break-before-section", String(breakIdx));
          sections[breakIdx].parentElement?.insertBefore(marker, sections[breakIdx]);
        }
      }
    };

    const injectAll = () => {
      if (injecting) return;
      injecting = true;
      try {
        for (const [, pageEl] of pageInnerRefs.current) {
          injectIntoPage(pageEl);
        }
      } finally {
        injecting = false;
      }
    };

    injectAll();

    const observers: MutationObserver[] = [];
    for (const [, pageEl] of pageInnerRefs.current) {
      const mo = new MutationObserver(() => {
        if (!pageEl.querySelector(".cv-page-break-marker")) {
          injectIntoPage(pageEl);
        }
      });
      mo.observe(pageEl, { childList: true, subtree: true });
      observers.push(mo);
    }

    return () => {
      observers.forEach((mo) => mo.disconnect());
      cleanupAll();
    };
  }, [pageBreaks, data, totalPages]);

  // Canvas PDF export
  const handleCanvasExport = async () => {
    setExporting(true);
    setSuccess(false);
    document.body.classList.add("cv-capture-mode");

    try {
      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();

      const pageContainers = document.querySelectorAll<HTMLElement>(
        "[data-cv-page]"
      );

      for (let i = 0; i < pageContainers.length; i++) {
        const pageEl = pageContainers[i];
        const origShadow = pageEl.style.boxShadow;
        pageEl.style.boxShadow = "none";

        const colorMixEls = pageEl.querySelectorAll<HTMLElement>(
          '[style*="color-mix"]'
        );
        const origBgs: string[] = [];
        colorMixEls.forEach((el, idx) => {
          origBgs[idx] = el.style.background || el.style.backgroundColor || "";
          const computed = getComputedStyle(el).backgroundColor;
          if (computed && computed !== "rgba(0, 0, 0, 0)") {
            el.style.background = computed;
          }
        });

        await new Promise((r) => setTimeout(r, 80));

        const canvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
          width: A4_WIDTH_PX,
          height: A4_HEIGHT_PX,
        });

        pageEl.style.boxShadow = origShadow;
        colorMixEls.forEach((el, idx) => {
          el.style.background = origBgs[idx];
        });

        const imgData = canvas.toDataURL("image/png");
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      }

      const name = `${data.personalInfo.firstName || "CV"}_${
        data.personalInfo.lastName || ""
      }_CV.pdf`;
      pdf.save(name);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error("PDF export failed", err);
    } finally {
      document.body.classList.remove("cv-capture-mode");
      setExporting(false);
    }
  };

  const handleVectorPrint = () => window.print();

  // Shared CSS custom properties for the template
  const cvStyles = {
    "--cv-font-family": `"${data.typography.fontFamily}", sans-serif`,
    "--cv-font-size":
      data.typography.fontSize === "small"
        ? "13px"
        : data.typography.fontSize === "large"
        ? "17px"
        : "15px",
    "--cv-line-height":
      data.typography.lineHeight === "compact"
        ? "1.2"
        : data.typography.lineHeight === "loose"
        ? "1.8"
        : "1.5",
    "--cv-spacing":
      data.layout.spacing === "compact"
        ? "0.5rem"
        : data.layout.spacing === "loose"
        ? "1.5rem"
        : "1rem",
    "--cv-primary": data.colors.primary,
    "--cv-secondary": data.colors.secondary,
    "--cv-text": data.colors.text,
    "--cv-bg": data.colors.background,
    "--cv-sidebar-bg": data.colors.sidebarBg,
    "--cv-sidebar-text": data.colors.sidebarText,
    "--cv-accent": data.colors.accent,
  } as React.CSSProperties;

  return (
    <div className="flex-1 h-full flex flex-col bg-[#05070c] relative select-none print:h-auto print:overflow-visible print:block print:bg-white print-layout-ancestor">
      {/* ── Toolbar ── */}
      <div className="no-print h-12 bg-slate-950/80 border-b border-slate-900 flex items-center justify-between px-4 z-10">
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

        <div className="flex items-center gap-3">
          {totalPages > 1 && (
            <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-500 font-mono bg-slate-900 px-2 py-1 rounded border border-slate-800">
              {totalPages} pages
            </div>
          )}
          {success && (
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-950/20 px-2 py-1 rounded border border-emerald-900/30">
              <CheckCircle size={12} />
              <span>{t.preview.downloaded}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleVectorPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-lg transition-colors border border-slate-800"
            title={t.preview.vectorPrint}
          >
            <Printer size={13} />
            <span className="hidden md:inline">{t.preview.vectorPrint}</span>
            <span className="md:hidden">{t.preview.print}</span>
          </button>

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

      {/* Tip bar */}
      <div className="no-print bg-slate-900/40 border-b border-slate-900/60 py-1.5 px-4 text-center text-[10px] text-slate-500 font-light flex items-center justify-center gap-1 shrink-0">
        <AlertCircle size={10} className="text-cyan-500 shrink-0" />
        <span>{t.preview.tipVectorPrint}</span>
      </div>

      {/* ── Hidden measurement container ── */}
      <div
        ref={measureRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${A4_WIDTH_PX}px`,
          visibility: "hidden",
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        <div style={{ width: `${A4_WIDTH_PX}px`, background: "#ffffff", ...cvStyles }}>
          <TemplateSelector data={data} />
        </div>
      </div>

      {/* ── Sheet workspace ── */}
      <div
        className="flex-grow overflow-auto p-8 flex flex-col items-center justify-start print:p-0 print:bg-white bg-[#05070c] scroll-smooth print:h-auto print:overflow-visible print:block print:static print-layout-ancestor"
        style={{ ...cvStyles, "--cv-page-height": `${totalPages * A4_HEIGHT_PX}px` } as React.CSSProperties}
      >
        <div
          className="zoom-viewport-wrapper print:p-0 print:m-0 shrink-0 select-text transition-transform duration-200 flex flex-col items-center"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            gap: "24px",
          }}
        >
          {Array.from({ length: totalPages }).map((_, pageIdx) => (
            <React.Fragment key={pageIdx}>
              <div
                data-cv-page={pageIdx}
                style={{
                  width: `${A4_WIDTH_PX}px`,
                  height: `${A4_HEIGHT_PX}px`,
                  overflow: "hidden",
                  position: "relative",
                  background: "#ffffff",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
                  flexShrink: 0,
                }}
              >
                <div
                  ref={(el) => {
                    if (el) pageInnerRefs.current.set(pageIdx, el);
                  }}
                  style={{
                    transform: `translateY(-${pageIdx * A4_HEIGHT_PX}px)`,
                  }}
                >
                  <TemplateSelector data={data} />
                </div>
              </div>

              {pageIdx < totalPages - 1 && (
                <div
                  className="no-print page-break-divider"
                  style={{ width: `${A4_WIDTH_PX}px` }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
