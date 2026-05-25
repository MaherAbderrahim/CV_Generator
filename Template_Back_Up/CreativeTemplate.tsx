import React from "react";
import { CVData, CVSection } from "../types/cv";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Languages,
  Grid,
  Heart,
  Calendar,
  Link as LinkIcon,
} from "lucide-react";

interface TemplateProps {
  data: CVData;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { colors, typography, layout, personalInfo, socialLinks, sections } = data;

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

  const fontSizeClass =
    typography.fontSize === "small"
      ? "text-xs"
      : typography.fontSize === "large"
      ? "text-base"
      : "text-sm";

  const lineHeightClass =
    typography.lineHeight === "compact"
      ? "leading-tight"
      : typography.lineHeight === "loose"
      ? "leading-relaxed"
      : "leading-normal";

  // Dynamic spacing classes
  const paddingStyle =
    layout.spacing === "compact"
      ? "1.25rem"
      : layout.spacing === "loose"
      ? "2.25rem"
      : "1.75rem";

  const itemSpacingClass =
    layout.spacing === "compact"
      ? "space-y-3"
      : layout.spacing === "loose"
      ? "space-y-6"
      : "space-y-4.5";

  // Helper to render icon for section type
  const renderSectionIcon = (type: string, color: string) => {
    const props = { size: 14, style: { color } };
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

  // Filter sections by where they should be rendered
  const leftSections = sections.filter((s) => s.visible && s.side === "left");
  const rightSections = sections.filter((s) => s.visible && s.side === "right");

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

  // Sidebar elements (Dark Column)
  const renderSidebarSection = (section: CVSection) => {
    if (section.items.length === 0) return null;

    return (
      <div key={section.id} className="space-y-3 relative pl-4 border-l border-amber-500/20">
        {/* Accent dot on the sidebar timeline */}
        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-amber-500 border border-slate-900" />
        
        <h3
          className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-white"
        >
          {section.title}
        </h3>

        {section.type === "skills" && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {section.items.map((skill) => (
              <span
                key={skill.id}
                className="text-[10px] px-2 py-0.5 rounded border font-medium text-slate-300 border-slate-700 bg-slate-800/40"
              >
                {skill.name}
              </span>
            ))}
          </div>
        )}

        {section.type === "languages" && (
          <div className="space-y-1.5 pt-1 text-slate-300">
            {section.items.map((lang) => (
              <div key={lang.id} className="text-xs flex flex-col">
                <span className="font-semibold text-white">{lang.name}</span>
                <span className="text-[10px] opacity-75 italic">{lang.level}</span>
              </div>
            ))}
          </div>
        )}

        {section.type === "interests" && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {section.items.map((interest) => (
              <span
                key={interest.id}
                className="text-[10px] px-2 py-0.5 rounded-full border border-slate-800 text-slate-400 bg-slate-950/20"
              >
                {interest.name}
              </span>
            ))}
          </div>
        )}

        {section.type === "custom" && (
          <div className="space-y-2.5 pt-1 text-slate-300">
            {section.items.map((item) => (
              <div key={item.id} className="text-xs space-y-0.5">
                <h4 className="font-semibold text-white">{item.title}</h4>
                {item.subtitle && <p className="opacity-75">{item.subtitle}</p>}
                {item.date && <p className="text-[10px] text-amber-500 font-mono">{item.date}</p>}
                <p className="opacity-80 text-[11px] whitespace-pre-line leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Main Column elements (Light Column with Timeline Dots)
  const renderMainSection = (section: CVSection) => {
    if (section.items.length === 0) return null;

    return (
      <div key={section.id} className="relative pl-6 space-y-4">
        {/* Dynamic Timeline Dot next to the section title */}
        <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white shadow-sm" />
        
        <div className="flex items-center gap-2">
          {renderSectionIcon(section.type, colors.primary)}
          <h3
            className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-slate-900"
          >
            {section.title}
          </h3>
        </div>

        <div className={itemSpacingClass}>
          {section.type === "experience" &&
            section.items.map((item) => (
              <div key={item.id} className="space-y-1.5 pb-3 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                <div className="flex flex-col md:flex-row md:justify-between md:items-baseline">
                  <h4 className="text-xs md:text-[13px] font-extrabold text-slate-900">
                    {item.position}
                  </h4>
                  <span className="text-[10px] font-mono text-amber-600 font-semibold shrink-0">
                    {item.startDate} — {item.endDate}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-500">
                  {item.company} {item.location && <span className="font-normal text-slate-400">| {item.location}</span>}
                </p>
                <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            ))}

          {section.type === "education" &&
            section.items.map((item) => (
              <div key={item.id} className="space-y-1.5 pb-3 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                <div className="flex flex-col md:flex-row md:justify-between md:items-baseline">
                  <h4 className="text-xs md:text-[13px] font-extrabold text-slate-900">
                    {item.degree}
                  </h4>
                  <span className="text-[10px] font-mono text-amber-600 font-semibold shrink-0">
                    {item.startDate} — {item.endDate}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-500">
                  {item.institution} {item.fieldOfStudy && <span className="font-normal text-slate-400">({item.fieldOfStudy})</span>}
                </p>
                {item.description && (
                  <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed font-light">
                    {item.description}
                  </p>
                )}
              </div>
            ))}

          {section.type === "projects" &&
            section.items.map((item) => (
              <div key={item.id} className="space-y-1.5 pb-3 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                <div className="flex justify-between items-baseline">
                  <h4 className="text-xs md:text-[13px] font-extrabold text-slate-900 flex items-center gap-1.5">
                    {item.name}
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noreferrer" className="text-sky-500 hover:text-sky-700">
                        <LinkIcon size={12} />
                      </a>
                    )}
                  </h4>
                  {item.technologies && (
                    <span className="text-[9px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded font-mono border border-slate-100">
                      {item.technologies}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}

          {section.type === "certifications" &&
            section.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-1.5 border-b border-dashed border-slate-100 last:border-0 last:py-0">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold">{item.issuer}</p>
                </div>
                <div className="text-[10px] font-semibold text-slate-400">{item.date}</div>
              </div>
            ))}

          {section.type === "skills" && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {section.items.map((skill) => (
                <span
                  key={skill.id}
                  className="text-xs px-2.5 py-1 rounded border font-medium bg-slate-50 text-slate-700 border-slate-200"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          )}

          {section.type === "languages" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
              {section.items.map((lang) => (
                <div key={lang.id} className="p-2.5 rounded border bg-slate-50/50 text-xs flex flex-col gap-0.5 border-slate-100">
                  <span className="font-bold text-slate-800">{lang.name}</span>
                  <span className="text-[10px] text-slate-400 italic">{lang.level}</span>
                </div>
              ))}
            </div>
          )}

          {section.type === "interests" && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {section.items.map((interest) => (
                <span
                  key={interest.id}
                  className="text-xs px-2.5 py-1 rounded-full border text-slate-600 bg-slate-50 border-slate-100"
                >
                  {interest.name}
                </span>
              ))}
            </div>
          )}

          {section.type === "custom" &&
            section.items.map((item) => (
              <div key={item.id} className="space-y-1.5 pb-3 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs md:text-[13px] font-extrabold text-slate-900">
                      {item.title}
                    </h4>
                    {item.subtitle && <p className="text-xs text-slate-400 mt-0.5">{item.subtitle}</p>}
                  </div>
                  {item.date && (
                    <span className="text-[10px] font-mono text-amber-600 shrink-0">{item.date}</span>
                  )}
                </div>
                <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
        </div>
      </div>
    );
  };

  const isSidebarLeft = layout.sidebarSide === "left";

  return (
    <div
      id="cv-capture-area"
      className={`a4-page ${fontClass} ${fontSizeClass} ${lineHeightClass} flex flex-col`}
      style={{ backgroundColor: "#ffffff" }}
    >
      {/* 1. Header (Creative Layout Split) */}
      <div className="w-full flex shrink-0 border-b-4 border-amber-500 min-h-[140px] items-stretch">
        
        {/* Left Side Header - Matches Sidebar Width */}
        <div
          className="w-[260px] shrink-0 bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden"
          style={{ order: isSidebarLeft ? 1 : 2 }}
        >
          {/* Top-left decorative triangle cut */}
          <div className="absolute top-0 left-0 w-0 h-0 border-t-[30px] border-t-amber-500 border-r-[30px] border-r-transparent opacity-85" />
          
          {personalInfo.photoUrl && (
            <img
              src={personalInfo.photoUrl}
              alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 shadow-lg z-10"
              style={{ borderColor: colors.primary }}
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          )}
        </div>

        {/* Right Side Header Name Banner */}
        <div
          className="flex-grow bg-slate-50 flex flex-col justify-center px-8 py-6"
          style={{ order: isSidebarLeft ? 2 : 1 }}
        >
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-widest text-slate-900">
            {personalInfo.firstName} <span className="text-amber-500">{personalInfo.lastName}</span>
          </h1>
          {personalInfo.title && (
            <h2 className="text-xs font-bold tracking-widest text-slate-500 uppercase mt-1">
              {personalInfo.title}
            </h2>
          )}
          
          <div className="w-16 h-1 bg-amber-500 mt-3 rounded-full" />
        </div>
      </div>

      {/* 2. Main content area (Timeline Split Sidebar / Content) */}
      <div className="flex-grow flex items-stretch min-h-0">
        
        {/* Dark Left Sidebar Column */}
        <div
          className="w-[260px] shrink-0 bg-slate-950 text-slate-300 flex flex-col gap-6"
          style={{
            padding: paddingStyle,
            order: isSidebarLeft ? 1 : 2,
          }}
        >
          {/* Contacts & Social Info Block */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white border-b border-slate-800 pb-1 flex items-center gap-1.5">
              Contact Me
            </h3>
            
            <div className="space-y-2 text-[11px] text-slate-300 font-medium">
              {personalInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail size={11} className="text-amber-500 shrink-0" />
                  <span className="break-all">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={11} className="text-amber-500 shrink-0" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.address && (
                <div className="flex items-center gap-2">
                  <MapPin size={11} className="text-amber-500 shrink-0" />
                  <span className="break-words">{personalInfo.address}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center gap-2">
                  <Globe size={11} className="text-amber-500 shrink-0" />
                  <a href={personalInfo.website} target="_blank" rel="noreferrer" className="break-all hover:underline">
                    {personalInfo.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Social Media links if present */}
          {socialLinks.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white border-b border-slate-800 pb-1">
                Social Networks
              </h3>
              <div className="space-y-2 text-[11px] text-slate-300">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-white"
                  >
                    <span className="text-[9px] uppercase font-bold text-amber-500 bg-amber-500/10 px-1 py-0.5 rounded leading-none shrink-0">
                      {link.platform.substring(0, 2)}
                    </span>
                    <span className="break-all">{link.username}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Ordered left items */}
          {orderedLeft.map((section) => renderSidebarSection(section))}
        </div>

        {/* Light Right Column with Vertical Timeline line */}
        <div
          className="flex-grow flex flex-col space-y-6 relative border-l border-slate-200"
          style={{
            padding: paddingStyle,
            order: isSidebarLeft ? 2 : 1,
            backgroundColor: "#ffffff",
            width: "calc(100% - 260px)",
          }}
        >
          {/* About Me / Summary */}
          {personalInfo.summary && (
            <div className="relative pl-6 space-y-2">
              {/* Timeline Dot */}
              <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white shadow-sm" />
              
              <div className="flex items-center gap-2">
                <Briefcase size={14} className="text-amber-500" />
                <h3 className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-slate-900">
                  About Me
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-light whitespace-pre-line">
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* Ordered right items */}
          {orderedRight.map((section) => renderMainSection(section))}
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
