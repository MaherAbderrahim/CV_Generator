import React from "react";
import { CVSection } from "../types/cv";
import { bulletLines, cvLabels, dateRange, orderedSections, photoCropStyle, sectionByType, sectionTitle, TemplateProps } from "./templateHelpers";

export const ExecutiveBandTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, colors } = data;
  const t = cvLabels(data.language);
  const sections = orderedSections(data);
  const skills = sectionByType(sections, "skills");
  const languages = sectionByType(sections, "languages");
  const interests = sectionByType(sections, "interests");
  const mainSections = sections.filter((section) => !["skills", "languages", "interests"].includes(section.type));
  const photoStyle = photoCropStyle(personalInfo);

  const renderSidebarTitle = (children: React.ReactNode) => (
    <h3 style={{ background: colors.primary, color: colors.sidebarBg, borderRadius: 999, padding: "0.25rem 0.75rem", fontSize: "calc(var(--cv-font-size) * 0.74)", fontWeight: 950, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "center", margin: "0 0 0.45rem" }}>
      {children}
    </h3>
  );

  const renderMainTitle = (children: React.ReactNode) => (
    <h3 style={{ background: colors.primary, color: colors.sidebarBg, borderRadius: 999, padding: "0.28rem 1rem", fontSize: "calc(var(--cv-font-size) * 0.82)", fontWeight: 950, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 0.75rem", display: "inline-block", minWidth: 170, textAlign: "center" }}>
      {children}
    </h3>
  );

  const renderMainSection = (section: CVSection) => (
    <section key={section.id} className="section-group" style={{ marginBottom: "calc(var(--cv-spacing) * 1.15)" }} data-section-id={section.id}>
      {renderMainTitle(sectionTitle(section, data.language))}
      {section.type === "experience" && section.items.map((item) => (
        <article key={item.id} className="section-item" data-section-id={section.id} data-item-id={item.id} style={{ marginBottom: "0.85rem", fontSize: "calc(var(--cv-font-size) * 0.78)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.7rem", color: colors.secondary, fontWeight: 900 }}>
            <span>{item.position}</span>
            <span style={{ color: colors.primary, whiteSpace: "nowrap" }}>{dateRange(item)}</span>
          </div>
          <div style={{ fontWeight: 800 }}>{item.company} {item.location && `/ ${item.location}`}</div>
          <ul style={{ margin: "0.35rem 0 0 1rem", padding: 0, lineHeight: 1.45 }}>
            {bulletLines(item.description).map((line, index) => <li key={index}>{line}</li>)}
          </ul>
        </article>
      ))}
      {section.type === "education" && section.items.map((item) => (
        <article key={item.id} className="section-item" data-section-id={section.id} data-item-id={item.id} style={{ marginBottom: "0.65rem", fontSize: "calc(var(--cv-font-size) * 0.78)" }}>
          <div style={{ color: colors.secondary, fontWeight: 900 }}>{item.degree}</div>
          <div>{item.institution} {item.fieldOfStudy && `/ ${item.fieldOfStudy}`}</div>
          <div style={{ color: colors.primary, fontWeight: 800 }}>{dateRange(item)}</div>
        </article>
      ))}
      {section.type === "projects" && section.items.map((item) => (
        <article key={item.id} className="section-item" data-section-id={section.id} data-item-id={item.id} style={{ marginBottom: "0.65rem", fontSize: "calc(var(--cv-font-size) * 0.78)" }}>
          <strong style={{ color: colors.secondary }}>{item.name}</strong>
          {item.technologies && <div style={{ color: colors.primary, fontWeight: 800 }}>{item.technologies}</div>}
          <p style={{ margin: "0.2rem 0 0" }}>{item.description}</p>
        </article>
      ))}
      {section.type === "certifications" && section.items.map((item) => (
        <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "calc(var(--cv-font-size) * 0.78)", marginBottom: "0.35rem" }}>
          <strong>{item.name}</strong>
          <span style={{ color: colors.primary, fontWeight: 900 }}>{item.date}</span>
        </div>
      ))}
      {section.type === "custom" && section.items.map((item) => (
        <article key={item.id} className="section-item" data-section-id={section.id} data-item-id={item.id} style={{ marginBottom: "0.65rem", fontSize: "calc(var(--cv-font-size) * 0.78)" }}>
          <strong style={{ color: colors.secondary }}>{item.title}</strong>
          {item.subtitle && <div style={{ color: colors.primary, fontWeight: 800 }}>{item.subtitle}</div>}
          <p style={{ whiteSpace: "pre-line", margin: "0.2rem 0 0" }}>{item.description}</p>
        </article>
      ))}
    </section>
  );

  return (
    <div
      id="cv-capture-area"
      className="a4-page"
      style={{
        display: "grid",
        gridTemplateColumns: "32% 68%",
        minHeight: "var(--cv-page-height, 1123px)",
        background: colors.background,
        color: colors.text,
        fontFamily: "var(--cv-font-family)",
        fontSize: "var(--cv-font-size)",
        lineHeight: "var(--cv-line-height)",
      }}
    >
      <aside style={{ background: colors.sidebarBg, color: colors.sidebarText, padding: "1.35rem 1rem", display: "flex", flexDirection: "column", gap: "0.95rem" }}>
        <div className="photo-container" style={{ width: 126, height: 126, borderRadius: "50%", border: `4px solid ${colors.primary}`, overflow: "hidden", position: "relative", background: "#e5e7eb", margin: "0 auto" }}>
          {personalInfo.photoUrl && <img src={personalInfo.photoUrl} alt={`${personalInfo.firstName} ${personalInfo.lastName}`} style={photoStyle} />}
        </div>

        <section style={{ fontSize: "calc(var(--cv-font-size) * 0.72)", display: "grid", gap: "0.45rem" }}>
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.email && <div style={{ wordBreak: "break-all" }}>{personalInfo.email}</div>}
          {personalInfo.address && <div>{personalInfo.address}</div>}
          {personalInfo.website && <div style={{ wordBreak: "break-all" }}>{personalInfo.website.replace(/^https?:\/\//, "")}</div>}
        </section>

        {skills && (
          <section>
            {renderSidebarTitle(sectionTitle(skills, data.language))}
            <ul style={{ margin: "0 0 0 1rem", padding: 0, fontSize: "calc(var(--cv-font-size) * 0.72)", lineHeight: 1.5 }}>
              {skills.items.map((skill) => <li key={skill.id}>{skill.name}</li>)}
            </ul>
          </section>
        )}

        {languages && (
          <section>
            {renderSidebarTitle(sectionTitle(languages, data.language))}
            <ul style={{ margin: "0 0 0 1rem", padding: 0, fontSize: "calc(var(--cv-font-size) * 0.72)", lineHeight: 1.5 }}>
              {languages.items.map((lang) => <li key={lang.id}>{lang.name} - {lang.level}</li>)}
            </ul>
          </section>
        )}

        {interests && (
          <section>
            {renderSidebarTitle(sectionTitle(interests, data.language))}
            <ul style={{ margin: "0 0 0 1rem", padding: 0, fontSize: "calc(var(--cv-font-size) * 0.72)", lineHeight: 1.5 }}>
              {interests.items.map((interest) => <li key={interest.id}>{interest.name}</li>)}
            </ul>
          </section>
        )}
      </aside>

      <main style={{ padding: "1.45rem 1.65rem 1.7rem" }}>
        <header style={{ background: colors.secondary, color: colors.sidebarText, margin: "-1.45rem -1.65rem 1.2rem", padding: "1.35rem 1.65rem", borderBottom: `5px solid ${colors.primary}` }}>
          <h1 style={{ margin: 0, fontSize: "calc(var(--cv-font-size) * 1.75)", lineHeight: 1, letterSpacing: "0.12em", fontWeight: 950, textTransform: "uppercase" }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          {personalInfo.title && <div style={{ color: colors.primary, fontSize: "calc(var(--cv-font-size) * 0.82)", letterSpacing: "0.08em", fontWeight: 800, textTransform: "uppercase", marginTop: "0.35rem" }}>{personalInfo.title}</div>}
        </header>

        {personalInfo.summary && (
          <section style={{ marginBottom: "calc(var(--cv-spacing) * 1.15)" }}>
            {renderMainTitle(t.profile)}
            <p style={{ margin: 0, fontSize: "calc(var(--cv-font-size) * 0.78)", lineHeight: 1.55, whiteSpace: "pre-line" }}>{personalInfo.summary}</p>
          </section>
        )}

        {mainSections.map(renderMainSection)}
      </main>
    </div>
  );
};

export default ExecutiveBandTemplate;
