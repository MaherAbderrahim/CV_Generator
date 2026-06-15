import React from "react";
import { CVData, CVSection } from "../types/cv";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Link as LinkIcon,
  Code,
  Languages,
  Heart,
  Grid,
} from "lucide-react";
import { cvLabels, sectionTitle, photoCropStyle } from "./templateHelpers";

interface TemplateProps {
  data: CVData;
}

export const PrimaryTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { colors, typography, layout, personalInfo } = data;
  const t = cvLabels(data.language);
  const socialLinks = data.socialLinks ?? [];
  const sections = data.sections ?? [];
  const photoStyle = photoCropStyle(personalInfo);

  // Apply typography fonts
  const fontClass =
    typography.fontFamily === "Inter"
      ? "font-inter"
      : typography.fontFamily === "Outfit"
      ? "font-outfit"
      : typography.fontFamily === "Montserrat"
      ? "font-montserrat"
      : typography.fontFamily === "Playfair Display"
      ? "font-playfair"
      : typography.fontFamily === "Lora"
      ? "font-lora"
      : "font-sans";

  // Apply typography font size adjustments
  const fontSizeClass =
    typography.fontSize === "small"
      ? "text-sm"
      : typography.fontSize === "large"
      ? "text-base"
      : "text-sm md:text-[14.5px]";

  // Apply line height
  const lineHeightClass =
    typography.lineHeight === "compact"
      ? "leading-tight"
      : typography.lineHeight === "loose"
      ? "leading-relaxed"
      : "leading-normal";

  // Apply spacing margins
  const spacingClass =
    layout.spacing === "compact"
      ? "space-y-4 gap-4 py-4"
      : layout.spacing === "loose"
      ? "space-y-8 gap-8 py-8"
      : "space-y-6 gap-6 py-6";

  // Real CSS padding values for inline styling
  const paddingStyle =
    layout.spacing === "compact"
      ? "1.5rem"
      : layout.spacing === "loose"
      ? "2.5rem"
      : "2rem";

  const itemSpacingClass =
    layout.spacing === "compact"
      ? "space-y-3.5"
      : layout.spacing === "loose"
      ? "space-y-7"
      : "space-y-5.5";

  // Filter sections by where they should be rendered
  const leftSections = sections.filter((s) => s.visible && s.side === "left");
  const rightSections = sections.filter((s) => s.visible && s.side === "right");

  // Custom sections or unassigned sections go to their default sides if not configured
  const getOrderedSections = (side: "left" | "right") => {
    const list = side === "left" ? leftSections : rightSections;
    return [...list].sort((a, b) => {
      const idxA = layout.sectionsOrder.indexOf(a.id);
      const idxB = layout.sectionsOrder.indexOf(b.id);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });
  };

  const orderedLeft = getOrderedSections("left");
  const orderedRight = getOrderedSections("right");

  // Helper to render icon for section type
  const renderSectionIcon = (type: string, color: string) => {
    const props = { size: 16, style: { color } };
    switch (type) {
      case "experience":
        return <Briefcase {...props} />;
      case "education":
        return <GraduationCap {...props} />;
      case "projects":
        return <Code {...props} />;
      case "certifications":
        return <Award {...props} />;
      case "languages":
        return <Languages {...props} />;
      case "skills":
        return <Grid {...props} />;
      case "interests":
        return <Heart {...props} />;
      default:
        return <Award {...props} />;
    }
  };

  // Sidebar components render
  const renderSidebarSection = (section: CVSection) => {
    if (section.items.length === 0) return null;

    return (
      <div key={section.id} className="section-group space-y-3.5" data-section-id={section.id}>
        <div className="flex items-center gap-2 border-b pb-1.5" style={{ borderColor: `${colors.sidebarText}15` }}>
          {renderSectionIcon(section.type, colors.primary)}
          <h3
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: colors.sidebarText }}
          >
            {sectionTitle(section, data.language)}
          </h3>
        </div>

        {section.type === "skills" && (
          <div className="flex flex-wrap gap-1.5">
            {section.items.map((skill) => (
              <span
                key={skill.id}
                className="text-[11px] px-2 py-1 rounded border transition-colors duration-250 font-medium tracking-wide"
                style={{
                  color: colors.sidebarText,
                  borderColor: `${colors.sidebarText}18`,
                  backgroundColor: `${colors.sidebarText}06`,
                }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        )}

        {section.type === "languages" && (
          <div className="space-y-2">
            {section.items.map((lang) => (
              <div key={lang.id} className="flex justify-between items-center text-xs font-medium py-1 border-b border-dashed" style={{ borderColor: `${colors.sidebarText}12` }}>
                <span style={{ color: colors.sidebarText }}>{lang.name}</span>
                <span className="text-[10px] opacity-75 font-normal italic" style={{ color: colors.sidebarText }}>{lang.level}</span>
              </div>
            ))}
          </div>
        )}

        {section.type === "interests" && (
          <div className="flex flex-wrap gap-1.5">
            {section.items.map((interest) => (
              <span
                key={interest.id}
                className="text-[11px] px-2.5 py-0.5 rounded-full border transition-all duration-200"
                style={{
                  color: `${colors.sidebarText}d0`,
                  borderColor: `${colors.sidebarText}20`,
                  backgroundColor: `${colors.sidebarText}05`,
                }}
              >
                {interest.name}
              </span>
            ))}
          </div>
        )}

        {section.type === "custom" && (
          <div className="space-y-3">
            {section.items.map((item) => (
              <div key={item.id} className="text-xs space-y-1">
                <h4 className="font-semibold" style={{ color: colors.sidebarText }}>
                  {item.title}
                </h4>
                {item.subtitle && <p className="opacity-75" style={{ color: colors.sidebarText }}>{item.subtitle}</p>}
                {item.date && <p className="text-[10px] opacity-50" style={{ color: colors.sidebarText }}>{item.date}</p>}
                <p className="opacity-80 text-[11px] whitespace-pre-line leading-relaxed font-light" style={{ color: colors.sidebarText }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Main column components render
  const renderMainSection = (section: CVSection) => {
    if (section.items.length === 0) return null;

    return (
      <div key={section.id} className="section-group space-y-4" data-section-id={section.id}>
        {/* Section Title with accent underbar */}
        <div className="relative border-b pb-1.5" style={{ borderColor: `${colors.secondary}15` }}>
          <div className="flex items-center gap-2">
            {renderSectionIcon(section.type, colors.primary)}
            <h3
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: colors.secondary }}
            >
              {sectionTitle(section, data.language)}
            </h3>
          </div>
          <div
            className="absolute bottom-0 left-0 h-0.5 w-12 rounded-full"
            style={{ backgroundColor: colors.primary }}
          />
        </div>

        <div className={itemSpacingClass}>
          {section.type === "experience" &&
            section.items.map((item) => (
              <div key={item.id} className="section-item space-y-2 pb-3 border-b border-dashed border-slate-100 last:border-0 last:pb-0" data-section-id={section.id} data-item-id={item.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs md:text-sm font-bold tracking-wide" style={{ color: colors.secondary }}>
                      {item.position}
                    </h4>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: colors.primary }}>
                      {item.company} {item.location && <span className="text-slate-400 font-normal">| {item.location}</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 shrink-0 mt-0.5">
                    <Calendar size={11} />
                    <span>
                      {item.startDate} — {item.endDate}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            ))}

          {section.type === "education" &&
            section.items.map((item) => (
              <div key={item.id} className="section-item space-y-2 pb-3 border-b border-dashed border-slate-100 last:border-0 last:pb-0" data-section-id={section.id} data-item-id={item.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs md:text-sm font-bold tracking-wide" style={{ color: colors.secondary }}>
                      {item.degree}
                    </h4>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: colors.primary }}>
                      {item.institution} {item.fieldOfStudy && <span className="text-slate-400 font-normal">({item.fieldOfStudy})</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 shrink-0 mt-0.5">
                    <Calendar size={11} />
                    <span>
                      {item.startDate} — {item.endDate}
                    </span>
                  </div>
                </div>
                {item.description && (
                  <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed font-light">
                    {item.description}
                  </p>
                )}
              </div>
            ))}

          {section.type === "projects" &&
            section.items.map((item) => (
              <div key={item.id} className="section-item space-y-2 pb-3 border-b border-dashed border-slate-100 last:border-0 last:pb-0" data-section-id={section.id} data-item-id={item.id}>
                <div className="flex justify-between items-start">
                  <h4 className="text-xs md:text-sm font-bold flex items-center gap-1.5" style={{ color: colors.secondary }}>
                    {item.name}
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noreferrer" className="text-sky-500 hover:text-sky-700">
                        <LinkIcon size={12} />
                      </a>
                    )}
                  </h4>
                  {item.technologies && (
                    <span className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded font-mono border border-slate-100">
                      {item.technologies}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 whitespace-pre-line font-light">
                  {item.description}
                </p>
              </div>
            ))}

          {section.type === "certifications" &&
            section.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-dashed border-slate-100 last:border-0 last:py-1">
                <div>
                  <h4 className="text-xs font-bold" style={{ color: colors.secondary }}>
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-semibold">{item.issuer}</p>
                </div>
                <div className="text-[11px] font-semibold text-slate-400">{item.date}</div>
              </div>
            ))}

          {section.type === "skills" && (
            <div className="flex flex-wrap gap-2 pt-1">
              {section.items.map((skill) => (
                <span
                  key={skill.id}
                  className="text-xs px-2.5 py-1 rounded border font-medium bg-slate-50/50 text-slate-700"
                  style={{
                    borderColor: `${colors.primary}20`,
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          )}

          {section.type === "languages" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-1">
              {section.items.map((lang) => (
                <div key={lang.id} className="p-2.5 rounded border bg-slate-50/50 text-xs flex flex-col gap-0.5" style={{ borderColor: `${colors.primary}15` }}>
                  <span className="font-bold text-slate-800">{lang.name}</span>
                  <span className="text-[10px] text-slate-400 italic">{lang.level}</span>
                </div>
              ))}
            </div>
          )}

          {section.type === "interests" && (
            <div className="flex flex-wrap gap-2 pt-1">
              {section.items.map((interest) => (
                <span
                  key={interest.id}
                  className="text-xs px-2.5 py-1 rounded-full border text-slate-600 bg-slate-50/50"
                  style={{
                    borderColor: `${colors.primary}15`,
                  }}
                >
                  {interest.name}
                </span>
              ))}
            </div>
          )}

          {section.type === "custom" &&
            section.items.map((item) => (
              <div key={item.id} className="section-item space-y-2 pb-3 border-b border-dashed border-slate-100 last:border-0 last:pb-0" data-section-id={section.id} data-item-id={item.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs md:text-sm font-bold" style={{ color: colors.secondary }}>
                      {item.title}
                    </h4>
                    {item.subtitle && <p className="text-xs text-slate-500 italic mt-0.5">{item.subtitle}</p>}
                  </div>
                  {item.date && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                      <Calendar size={11} />
                      <span>{item.date}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-600 whitespace-pre-line">
                  {item.description}
                </p>
              </div>
            ))}
        </div>
      </div>
    );
  };

  const isSidebarLeft = layout.sidebarSide === "left";

  const getFontFamilyStyle = (font: string) => {
    switch (font) {
      case "Inter":
        return "'Inter', sans-serif";
      case "Outfit":
        return "'Outfit', sans-serif";
      case "Montserrat":
        return "'Montserrat', sans-serif";
      case "Playfair Display":
        return "'Playfair Display', serif";
      case "Lora":
        return "'Lora', serif";
      default:
        return "sans-serif";
    }
  };

  return (
    <div
      id="cv-capture-area"
      className={`a4-page cv-template-primary ${fontClass} ${fontSizeClass} ${lineHeightClass} flex flex-col`}
      style={{ 
        backgroundColor: colors.background,
        fontFamily: getFontFamilyStyle(typography.fontFamily)
      }}
    >
      {/* 1. Header (Full Width Top) */}
      <div
        className="cv-primary-header w-full flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-100"
        style={{ padding: `calc(${paddingStyle} / 1.2) ${paddingStyle} calc(${paddingStyle} / 1.5)` }}
      >
        <div className="cv-primary-header-main flex items-center gap-5">
          {personalInfo.photoUrl && (
            <div className="photo-container w-16 h-16 md:w-20 md:h-20 rounded-full border-2 shadow-sm overflow-hidden relative shrink-0" style={{ borderColor: colors.primary }}>
              <img
                src={personalInfo.photoUrl}
                alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                style={photoStyle}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
          )}
          <div className="text-center md:text-left space-y-0.5">
            <h1
              className="text-xl md:text-2xl font-black uppercase tracking-tight"
              style={{ color: colors.secondary }}
            >
              {personalInfo.firstName} <span style={{ color: colors.primary }}>{personalInfo.lastName}</span>
            </h1>
            {personalInfo.title && (
              <h2
                className="text-xs md:text-sm font-semibold tracking-wider uppercase opacity-85"
                style={{ color: colors.primary }}
              >
                {personalInfo.title}
              </h2>
            )}
          </div>
        </div>

        {/* Header Contact Block */}
        <div className="cv-primary-contact flex flex-col gap-1.5 text-xs text-slate-500 font-medium md:items-end">
          {personalInfo.email && (
            <div className="flex items-center gap-1.5">
              <Mail size={12} className="text-slate-400" />
              <span className="hover:underline">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1.5">
              <Phone size={12} className="text-slate-400" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.address && (
            <div className="flex items-center gap-1.5">
              <MapPin size={12} className="text-slate-400" />
              <span>{personalInfo.address}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-1.5">
              <Globe size={12} className="text-slate-400" />
              <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline text-slate-500">
                {personalInfo.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* 2. Main content area (Split Sidebar / Content) */}
      <div
        className="cv-primary-body flex-grow flex flex-row"
        style={{
          minHeight: 0,
        }}
      >
        {/* Render columns depending on layout.sidebarSide */}
        
        {/* Sidebar Column (Dark) — solid background for html2canvas compatibility */}
        <div
          className="w-[240px] shrink-0 space-y-6"
          style={{
            backgroundColor: colors.sidebarBg,
            color: colors.sidebarText,
            padding: paddingStyle,
            order: isSidebarLeft ? 1 : 2,
          }}
        >
          {/* Contact Details duplicate in sidebar if headers are missing, or render social networks */}
          {socialLinks.length > 0 && (
            <div className="space-y-2.5">
              <h3
                className="text-xs font-bold uppercase tracking-wider border-b pb-1 flex items-center gap-2"
                style={{ color: colors.sidebarText, borderColor: `${colors.sidebarText}20` }}
              >
                <Globe size={13} style={{ color: colors.primary }} />
                {t.socialLinks}
              </h3>
              <div className="space-y-1.5">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-medium opacity-90 hover:opacity-100 hover:text-white transition-opacity"
                    style={{ color: `${colors.sidebarText}e0` }}
                  >
                    <span className="text-[10px] uppercase font-bold bg-white/10 text-white px-1.5 py-0.5 rounded leading-none shrink-0" style={{ color: colors.primary }}>
                      {link.platform.substring(0, 2)}
                    </span>
                    <span className="break-all">{link.username}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Render all sections marked for Left Column */}
          {orderedLeft.map((section) => renderSidebarSection(section))}
        </div>

        {/* Main Column (White) — solid background for html2canvas compatibility */}
        <div
          className="cv-primary-main flex-grow flex flex-col space-y-6"
          style={{
            backgroundColor: colors.background,
            padding: paddingStyle,
            order: isSidebarLeft ? 2 : 1,
            width: "calc(100% - 240px)",
          }}
        >
          {/* Professional summary / Profile statement */}
          {personalInfo.summary && (
            <div className="section-group space-y-3">
              <div className="relative border-b pb-1.5" style={{ borderColor: `${colors.secondary}15` }}>
                <h3
                  className="text-sm font-bold uppercase tracking-wider flex items-center gap-2"
                  style={{ color: colors.secondary }}
                >
                  <Briefcase size={16} style={{ color: colors.primary }} />
                  {t.professionalProfile}
                </h3>
                <div
                  className="absolute bottom-0 left-0 h-0.5 w-12 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-light whitespace-pre-line">
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* Render all sections marked for Right Column */}
          {orderedRight.map((section) => renderMainSection(section))}
        </div>
      </div>
    </div>
  );
};
export default PrimaryTemplate;
