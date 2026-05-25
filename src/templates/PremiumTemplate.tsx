import React from "react";
import { CVData, CVSection } from "../types/cv";
import {
  Award,
  Briefcase,
  Code,
  GraduationCap,
  Grid,
  Globe,
  Heart,
  Languages,
  Link as LinkIcon,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { cvLabels, sectionTitle } from "./templateHelpers";

interface TemplateProps {
  data: CVData;
}

const sectionIcon = (type: string) => {
  const props = { size: 15, style: { color: "var(--cv-primary)" } };
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

export const PremiumTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, socialLinks = [], sections = [], layout } = data;
  const t = cvLabels(data.language);
  const orderedSections = (side: "left" | "right") =>
    sections
      .filter((section) => section.visible && section.side === side)
      .sort((a, b) => {
        const idxA = layout.sectionsOrder.indexOf(a.id);
        const idxB = layout.sectionsOrder.indexOf(b.id);
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB;
      });

  const isLeftSidebar = layout.sidebarSide === "left";
  const sidebarSections = isLeftSidebar ? orderedSections("left") : orderedSections("right");
  const mainSections = isLeftSidebar ? orderedSections("right") : orderedSections("left");
  const photoZoom = Math.max(personalInfo.photoZoom ?? 100, 100);
  const photoX = personalInfo.photoPositionX ?? 50;
  const photoY = personalInfo.photoPositionY ?? 50;
  const photoStyle = {
    position: "absolute" as const,
    width: `${photoZoom}%`,
    height: `${photoZoom}%`,
    left: `${((100 - photoZoom) * photoX) / 100}%`,
    top: `${((100 - photoZoom) * photoY) / 100}%`,
    objectFit: "cover" as const,
    objectPosition: `${personalInfo.photoPositionX ?? 50}% ${personalInfo.photoPositionY ?? 50}%`,
  };

  const renderCompactSection = (section: CVSection) => {
    if (section.items.length === 0) return null;

    return (
      <section key={section.id} style={{ display: "flex", flexDirection: "column", gap: "calc(var(--cv-spacing) * 0.7)" }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "calc(var(--cv-font-size) * 0.82)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--cv-sidebar-text)", borderBottom: "1px solid color-mix(in srgb, var(--cv-sidebar-text) 20%, transparent)", paddingBottom: "0.35rem" }}>
          {sectionIcon(section.type)}
          {sectionTitle(section, data.language)}
        </h3>

        {section.type === "skills" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {section.items.map((skill) => (
              <span key={skill.id} style={{ fontSize: "calc(var(--cv-font-size) * 0.72)", padding: "0.2rem 0.5rem", borderRadius: "999px", background: "color-mix(in srgb, var(--cv-primary) 18%, transparent)", color: "var(--cv-sidebar-text)", border: "1px solid color-mix(in srgb, var(--cv-primary) 40%, transparent)" }}>
                {skill.name}
              </span>
            ))}
          </div>
        )}

        {section.type === "languages" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {section.items.map((lang) => (
              <div key={lang.id}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", fontSize: "calc(var(--cv-font-size) * 0.78)", color: "var(--cv-sidebar-text)" }}>
                  <strong>{lang.name}</strong>
                  <span style={{ opacity: 0.75 }}>{lang.level}</span>
                </div>
                <div style={{ height: 4, marginTop: 4, borderRadius: 999, background: "color-mix(in srgb, var(--cv-sidebar-text) 15%, transparent)" }}>
                  <div style={{ width: `${lang.percentage || 70}%`, height: "100%", borderRadius: 999, background: "var(--cv-primary)" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {section.type === "interests" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
            {section.items.map((interest) => (
              <span key={interest.id} style={{ fontSize: "calc(var(--cv-font-size) * 0.72)", color: "var(--cv-sidebar-text)", opacity: 0.85 }}>
                {interest.name}
              </span>
            ))}
          </div>
        )}

        {section.type === "custom" && section.items.map((item) => (
          <div key={item.id} style={{ fontSize: "calc(var(--cv-font-size) * 0.78)", color: "var(--cv-sidebar-text)" }}>
            <strong>{item.title}</strong>
            {item.subtitle && <div style={{ opacity: 0.8 }}>{item.subtitle}</div>}
            {item.date && <div style={{ color: "var(--cv-primary)", fontSize: "calc(var(--cv-font-size) * 0.7)" }}>{item.date}</div>}
            <p style={{ whiteSpace: "pre-line", opacity: 0.82, marginTop: "0.25rem" }}>{item.description}</p>
          </div>
        ))}
      </section>
    );
  };

  const renderMainSection = (section: CVSection) => {
    if (section.items.length === 0) return null;

    return (
      <section key={section.id} style={{ display: "grid", gridTemplateColumns: "78px 1fr", gap: "0.8rem", alignItems: "start" }}>
        <h3 style={{ display: "flex", alignItems: "flex-start", gap: "0.35rem", fontSize: "calc(var(--cv-font-size) * 0.58)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.03em", lineHeight: 1.18, color: "var(--cv-secondary)", paddingTop: "0.2rem", overflowWrap: "anywhere" }}>
          {sectionIcon(section.type)}
          {sectionTitle(section, data.language)}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--cv-spacing) * 0.9)", borderLeft: "2px solid color-mix(in srgb, var(--cv-primary) 22%, transparent)", paddingLeft: "1rem" }}>
          {section.type === "experience" && section.items.map((item) => (
            <article key={item.id} style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "-1.32rem", top: "0.35rem", width: 9, height: 9, borderRadius: "50%", background: "var(--cv-primary)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "baseline" }}>
                <h4 style={{ fontWeight: 850, color: "var(--cv-text)", fontSize: "calc(var(--cv-font-size) * 0.98)" }}>{item.position}</h4>
                <span style={{ whiteSpace: "nowrap", color: "var(--cv-primary)", fontSize: "calc(var(--cv-font-size) * 0.74)", fontWeight: 800 }}>{item.startDate} - {item.endDate}</span>
              </div>
              <div style={{ color: "var(--cv-secondary)", fontWeight: 700, fontSize: "calc(var(--cv-font-size) * 0.84)" }}>
                {item.company} {item.location && <span style={{ opacity: 0.65, fontWeight: 500 }}> / {item.location}</span>}
              </div>
              <p style={{ whiteSpace: "pre-line", color: "var(--cv-text)", opacity: 0.86, fontSize: "calc(var(--cv-font-size) * 0.86)", marginTop: "0.35rem" }}>{item.description}</p>
            </article>
          ))}

          {section.type === "education" && section.items.map((item) => (
            <article key={item.id} style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "-1.32rem", top: "0.35rem", width: 9, height: 9, borderRadius: "50%", background: "var(--cv-primary)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "baseline" }}>
                <h4 style={{ fontWeight: 850, color: "var(--cv-text)", fontSize: "calc(var(--cv-font-size) * 0.98)" }}>{item.degree}</h4>
                <span style={{ whiteSpace: "nowrap", color: "var(--cv-primary)", fontSize: "calc(var(--cv-font-size) * 0.74)", fontWeight: 800 }}>{item.startDate} - {item.endDate}</span>
              </div>
              <div style={{ color: "var(--cv-secondary)", fontWeight: 700, fontSize: "calc(var(--cv-font-size) * 0.84)" }}>
                {item.institution} {item.fieldOfStudy && <span style={{ opacity: 0.65, fontWeight: 500 }}> / {item.fieldOfStudy}</span>}
              </div>
              {item.description && <p style={{ color: "var(--cv-text)", opacity: 0.86, fontSize: "calc(var(--cv-font-size) * 0.86)", marginTop: "0.35rem" }}>{item.description}</p>}
            </article>
          ))}

          {section.type === "projects" && section.items.map((item) => (
            <article key={item.id} style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "-1.32rem", top: "0.35rem", width: 9, height: 9, borderRadius: "50%", background: "var(--cv-primary)" }} />
              <h4 style={{ fontWeight: 850, color: "var(--cv-text)", fontSize: "calc(var(--cv-font-size) * 0.98)", display: "flex", gap: "0.35rem", alignItems: "center" }}>
                {item.name}
                {item.url && <a href={item.url} target="_blank" rel="noreferrer" style={{ color: "var(--cv-primary)" }}><LinkIcon size={13} /></a>}
              </h4>
              {item.technologies && <div style={{ color: "var(--cv-primary)", fontSize: "calc(var(--cv-font-size) * 0.75)", fontWeight: 750 }}>{item.technologies}</div>}
              <p style={{ color: "var(--cv-text)", opacity: 0.86, fontSize: "calc(var(--cv-font-size) * 0.86)", marginTop: "0.25rem" }}>{item.description}</p>
            </article>
          ))}

          {section.type === "certifications" && section.items.map((item) => (
            <article key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: "calc(var(--cv-font-size) * 0.86)" }}>
              <span><strong style={{ color: "var(--cv-text)" }}>{item.name}</strong> / {item.issuer}</span>
              <span style={{ color: "var(--cv-primary)", fontWeight: 800 }}>{item.date}</span>
            </article>
          ))}

          {section.type === "skills" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              {section.items.map((skill) => (
                <span key={skill.id} style={{ padding: "0.25rem 0.55rem", borderRadius: 6, background: "color-mix(in srgb, var(--cv-primary) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--cv-primary) 22%, transparent)", color: "var(--cv-text)", fontSize: "calc(var(--cv-font-size) * 0.8)", fontWeight: 700 }}>
                  {skill.name}
                </span>
              ))}
            </div>
          )}

          {section.type === "languages" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.55rem" }}>
              {section.items.map((lang) => (
                <div key={lang.id} style={{ border: "1px solid color-mix(in srgb, var(--cv-primary) 18%, transparent)", borderRadius: 8, padding: "0.45rem 0.55rem", fontSize: "calc(var(--cv-font-size) * 0.8)" }}>
                  <strong style={{ color: "var(--cv-text)" }}>{lang.name}</strong>
                  <div style={{ color: "var(--cv-secondary)", opacity: 0.72 }}>{lang.level}</div>
                </div>
              ))}
            </div>
          )}

          {section.type === "interests" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {section.items.map((interest) => (
                <span key={interest.id} style={{ color: "var(--cv-text)", fontSize: "calc(var(--cv-font-size) * 0.82)" }}>{interest.name}</span>
              ))}
            </div>
          )}

          {section.type === "custom" && section.items.map((item) => (
            <article key={item.id}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                <strong style={{ color: "var(--cv-text)" }}>{item.title}</strong>
                {item.date && <span style={{ color: "var(--cv-primary)", fontWeight: 800, fontSize: "calc(var(--cv-font-size) * 0.76)" }}>{item.date}</span>}
              </div>
              {item.subtitle && <div style={{ color: "var(--cv-secondary)", fontWeight: 700, fontSize: "calc(var(--cv-font-size) * 0.82)" }}>{item.subtitle}</div>}
              <p style={{ whiteSpace: "pre-line", color: "var(--cv-text)", opacity: 0.86, fontSize: "calc(var(--cv-font-size) * 0.86)", marginTop: "0.25rem" }}>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div
      id="cv-capture-area"
      className="a4-page"
      style={{
        display: "flex",
        flexDirection: isLeftSidebar ? "row" : "row-reverse",
        minHeight: "100%",
        fontFamily: "var(--cv-font-family)",
        fontSize: "var(--cv-font-size)",
        lineHeight: "var(--cv-line-height)",
        color: "var(--cv-text)",
        background: "var(--cv-bg)",
      }}
    >
      <aside
        style={{
          width: "32%",
          background: "var(--cv-sidebar-bg)",
          color: "var(--cv-sidebar-text)",
          padding: "calc(var(--cv-spacing) * 1.35)",
          display: "flex",
          flexDirection: "column",
          gap: "calc(var(--cv-spacing) * 1.15)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: "0 0 auto auto", width: 130, height: 130, background: "var(--cv-primary)", opacity: 0.16, borderBottomLeftRadius: "100%" }} />

        {personalInfo.photoUrl && (
          <div style={{ width: 130, height: 154, clipPath: "polygon(50% 0%, 100% 18%, 100% 82%, 50% 100%, 0 82%, 0 18%)", background: "var(--cv-primary)", padding: 4, margin: "0 auto", zIndex: 1 }}>
            <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", clipPath: "polygon(50% 0%, 100% 18%, 100% 82%, 50% 100%, 0 82%, 0 18%)" }}>
              <img src={personalInfo.photoUrl} alt={`${personalInfo.firstName} ${personalInfo.lastName}`} style={photoStyle} />
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", zIndex: 1 }}>
          <h1 style={{ fontSize: "calc(var(--cv-font-size) * 1.65)", fontWeight: 900, lineHeight: 1.05, color: "var(--cv-sidebar-text)", textTransform: "uppercase" }}>
            {personalInfo.firstName}
            <span style={{ display: "block", color: "var(--cv-primary)" }}>{personalInfo.lastName}</span>
          </h1>
          {personalInfo.title && <p style={{ marginTop: "0.45rem", fontSize: "calc(var(--cv-font-size) * 0.78)", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.86 }}>{personalInfo.title}</p>}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "calc(var(--cv-font-size) * 0.76)", zIndex: 1 }}>
          {personalInfo.email && <div style={{ display: "flex", gap: "0.45rem", alignItems: "center" }}><Mail size={12} style={{ color: "var(--cv-primary)" }} />{personalInfo.email}</div>}
          {personalInfo.phone && <div style={{ display: "flex", gap: "0.45rem", alignItems: "center" }}><Phone size={12} style={{ color: "var(--cv-primary)" }} />{personalInfo.phone}</div>}
          {personalInfo.address && <div style={{ display: "flex", gap: "0.45rem", alignItems: "center" }}><MapPin size={12} style={{ color: "var(--cv-primary)" }} />{personalInfo.address}</div>}
          {personalInfo.website && <a href={personalInfo.website} target="_blank" rel="noreferrer" style={{ display: "flex", gap: "0.45rem", alignItems: "center", color: "var(--cv-sidebar-text)", textDecoration: "none" }}><Globe size={12} style={{ color: "var(--cv-primary)" }} />{personalInfo.website.replace(/^https?:\/\//, "")}</a>}
        </div>

        {socialLinks.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "calc(var(--cv-font-size) * 0.74)" }}>
            {socialLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noreferrer" style={{ color: "var(--cv-sidebar-text)", textDecoration: "none", opacity: 0.86 }}>
                <strong style={{ color: "var(--cv-primary)" }}>{link.platform}</strong> / {link.username}
              </a>
            ))}
          </div>
        )}

        {sidebarSections.map(renderCompactSection)}
      </aside>

      <main style={{ width: "68%", padding: "calc(var(--cv-spacing) * 1.45)", display: "flex", flexDirection: "column", gap: "calc(var(--cv-spacing) * 1.25)" }}>
        {personalInfo.summary && (
          <section style={{ display: "grid", gridTemplateColumns: "78px 1fr", gap: "0.8rem", alignItems: "start" }}>
            <h3 style={{ fontSize: "calc(var(--cv-font-size) * 0.58)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.03em", lineHeight: 1.18, color: "var(--cv-secondary)" }}>{t.profile}</h3>
            <p style={{ color: "var(--cv-text)", opacity: 0.88, fontSize: "calc(var(--cv-font-size) * 0.9)", borderLeft: "2px solid var(--cv-primary)", paddingLeft: "1rem", whiteSpace: "pre-line" }}>
              {personalInfo.summary}
            </p>
          </section>
        )}

        {mainSections.map(renderMainSection)}
      </main>
    </div>
  );
};

export default PremiumTemplate;
