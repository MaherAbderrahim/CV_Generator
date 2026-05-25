import React from "react";
import { CVSection } from "../types/cv";
import { allBut, bulletLines, cvLabels, dateRange, orderedSections, photoCropStyle, sectionByType, sectionTitle, TemplateProps } from "./templateHelpers";

export const SoftPanelTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, colors } = data;
  const t = cvLabels(data.language);
  const sections = orderedSections(data);
  const skills = sectionByType(sections, "skills");
  const languages = sectionByType(sections, "languages");
  const interests = sectionByType(sections, "interests");
  const mainSections = allBut(sections, ["skills", "languages", "interests"]);
  const photoStyle = photoCropStyle(personalInfo);

  const renderMainSection = (section: CVSection) => (
    <section key={section.id} style={{ marginBottom: "calc(var(--cv-spacing) * 1.1)" }}>
      <h3 style={{ fontSize: "calc(var(--cv-font-size) * 1.28)", fontWeight: 900, color: colors.secondary, lineHeight: 1, marginBottom: "0.45rem" }}>
        {sectionTitle(section, data.language)}
      </h3>
      {section.type === "experience" && section.items.map((item) => (
        <article key={item.id} style={{ marginBottom: "0.7rem" }}>
          <div style={{ fontSize: "calc(var(--cv-font-size) * 0.74)", fontWeight: 800, color: colors.text, textTransform: "uppercase" }}>
            {item.position} {dateRange(item) && <span>- {dateRange(item)}</span>}
          </div>
          <div style={{ fontSize: "calc(var(--cv-font-size) * 0.72)", fontWeight: 800, color: colors.secondary, textTransform: "uppercase" }}>
            {item.company} {item.location && <span>/ {item.location}</span>}
          </div>
          <ul style={{ margin: "0.25rem 0 0 1rem", padding: 0, fontSize: "calc(var(--cv-font-size) * 0.76)", color: colors.text, lineHeight: 1.45 }}>
            {bulletLines(item.description).map((line, index) => <li key={index}>{line}</li>)}
          </ul>
        </article>
      ))}
      {section.type === "education" && section.items.map((item) => (
        <article key={item.id} style={{ fontSize: "calc(var(--cv-font-size) * 0.76)", marginBottom: "0.45rem" }}>
          <strong style={{ color: colors.secondary, textTransform: "uppercase" }}>{item.institution}</strong>
          <div>{item.degree} {item.fieldOfStudy && `/ ${item.fieldOfStudy}`}</div>
          <div style={{ color: colors.primary, fontWeight: 700 }}>{dateRange(item)}</div>
        </article>
      ))}
      {section.type === "projects" && section.items.map((item) => (
        <article key={item.id} style={{ fontSize: "calc(var(--cv-font-size) * 0.76)", marginBottom: "0.55rem" }}>
          <strong style={{ color: colors.secondary }}>{item.name}</strong>
          {item.technologies && <div style={{ color: colors.primary, fontWeight: 700 }}>{item.technologies}</div>}
          <p style={{ margin: "0.15rem 0 0", lineHeight: 1.45 }}>{item.description}</p>
        </article>
      ))}
      {section.type === "certifications" && section.items.map((item) => (
        <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", fontSize: "calc(var(--cv-font-size) * 0.76)" }}>
          <strong>{item.name}</strong>
          <span style={{ color: colors.primary, fontWeight: 800 }}>{item.date}</span>
        </div>
      ))}
      {section.type === "custom" && section.items.map((item) => (
        <article key={item.id} style={{ fontSize: "calc(var(--cv-font-size) * 0.76)", marginBottom: "0.55rem" }}>
          <strong style={{ color: colors.secondary }}>{item.title}</strong>
          {item.subtitle && <div style={{ color: colors.primary, fontWeight: 700 }}>{item.subtitle}</div>}
          <p style={{ whiteSpace: "pre-line", margin: "0.15rem 0 0", lineHeight: 1.45 }}>{item.description}</p>
        </article>
      ))}
    </section>
  );

  return (
    <div
      id="cv-capture-area"
      className="a4-page"
      style={{
        minHeight: "100%",
        padding: "42px 52px",
        background: colors.background,
        color: colors.text,
        fontFamily: "var(--cv-font-family)",
        fontSize: "var(--cv-font-size)",
        lineHeight: "var(--cv-line-height)",
      }}
    >
      <header style={{ display: "grid", gridTemplateColumns: "150px 1fr", alignItems: "center", gap: "1.1rem", marginBottom: "1.1rem" }}>
        <div style={{ width: 128, height: 128, borderRadius: "50%", overflow: "hidden", position: "relative", background: "#e5e7eb", justifySelf: "center" }}>
          {personalInfo.photoUrl && <img src={personalInfo.photoUrl} alt={`${personalInfo.firstName} ${personalInfo.lastName}`} style={photoStyle} />}
        </div>
        <div style={{ background: colors.primary, borderRadius: "18px 18px 18px 4px", padding: "1.25rem 1.7rem", color: colors.secondary }}>
          <h1 style={{ margin: 0, fontSize: "calc(var(--cv-font-size) * 1.85)", lineHeight: 1, fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.02em" }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <div style={{ marginTop: "0.65rem", fontSize: "calc(var(--cv-font-size) * 0.74)", lineHeight: 1.45 }}>
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.website && <div>{personalInfo.website.replace(/^https?:\/\//, "")}</div>}
          </div>
        </div>
      </header>

      <main style={{ display: "grid", gridTemplateColumns: "33% 1fr", gap: "1.25rem" }}>
        <aside style={{ background: "color-mix(in srgb, var(--cv-secondary) 10%, var(--cv-bg))", borderRadius: "0 26px 26px 0", padding: "1.2rem 1rem 1.4rem 1rem" }}>
          {personalInfo.summary && (
            <section style={{ marginBottom: "1.1rem" }}>
              <h3 style={{ fontSize: "calc(var(--cv-font-size) * 1.2)", fontWeight: 900, color: colors.secondary, marginBottom: "0.45rem" }}>{t.summary}</h3>
              <p style={{ margin: 0, fontSize: "calc(var(--cv-font-size) * 0.72)", textAlign: "justify", lineHeight: 1.35 }}>{personalInfo.summary}</p>
            </section>
          )}

          {skills && (
            <section style={{ marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "calc(var(--cv-font-size) * 1.2)", fontWeight: 900, color: colors.secondary, marginBottom: "0.6rem" }}>{t.techSkills}</h3>
              {skills.items.map((skill) => (
                <div key={skill.id} style={{ marginBottom: "0.7rem" }}>
                  <div style={{ fontSize: "calc(var(--cv-font-size) * 0.68)", marginBottom: "0.18rem" }}>{skill.name}</div>
                  <div style={{ height: 7, border: `1px solid color-mix(in srgb, ${colors.text} 35%, transparent)`, background: colors.background }}>
                    <div style={{ height: "100%", width: `${skill.level || 75}%`, background: colors.primary }} />
                  </div>
                </div>
              ))}
            </section>
          )}

          {languages && (
            <section style={{ marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "calc(var(--cv-font-size) * 1.05)", fontWeight: 900, color: colors.secondary }}>{sectionTitle(languages, data.language)}</h3>
              {languages.items.map((lang) => <div key={lang.id} style={{ fontSize: "calc(var(--cv-font-size) * 0.72)" }}>{lang.name} - {lang.level}</div>)}
            </section>
          )}

          {interests && (
            <section>
              <h3 style={{ fontSize: "calc(var(--cv-font-size) * 1.05)", fontWeight: 900, color: colors.secondary }}>{sectionTitle(interests, data.language)}</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                {interests.items.map((interest) => <span key={interest.id} style={{ fontSize: "calc(var(--cv-font-size) * 0.7)" }}>{interest.name}</span>)}
              </div>
            </section>
          )}
        </aside>

        <section style={{ paddingTop: "0.8rem" }}>
          {skills && (
            <section style={{ marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "calc(var(--cv-font-size) * 1.28)", fontWeight: 900, color: colors.secondary, marginBottom: "0.45rem" }}>{sectionTitle(skills, data.language)}</h3>
              <ul style={{ margin: "0 0 0 1rem", padding: 0, fontSize: "calc(var(--cv-font-size) * 0.76)", lineHeight: 1.45 }}>
                {skills.items.slice(0, 6).map((skill) => <li key={skill.id}>{skill.name}</li>)}
              </ul>
            </section>
          )}
          {mainSections.map(renderMainSection)}
        </section>
      </main>
    </div>
  );
};

export default SoftPanelTemplate;
