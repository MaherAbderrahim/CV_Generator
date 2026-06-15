import React from "react";
import { CVSection } from "../types/cv";
import { cvLabels, dateRange, orderedSections, photoCropStyle, sectionByType, sectionTitle, TemplateProps } from "./templateHelpers";

export const DiagonalTimelineTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, colors } = data;
  const t = cvLabels(data.language);
  const sections = orderedSections(data);
  const experience = sectionByType(sections, "experience");
  const education = sectionByType(sections, "education");
  const projects = sectionByType(sections, "projects");
  const skills = sectionByType(sections, "skills");
  const certifications = sectionByType(sections, "certifications");
  const photoStyle = photoCropStyle(personalInfo);

  const renderTitle = (children: React.ReactNode) => (
    <h3 style={{ margin: 0, color: colors.primary, fontSize: "calc(var(--cv-font-size) * 1.28)", fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>
      {children}
    </h3>
  );

  const renderTimelineBlock = (section: CVSection | undefined, children: React.ReactNode) => {
    if (!section && !children) return null;
    return (
      <section className="section-group" data-section-id={section?.id} style={{ position: "relative", paddingLeft: "1.65rem", paddingBottom: "1.1rem", borderLeft: `2px solid color-mix(in srgb, ${colors.secondary} 70%, transparent)` }}>
        <span style={{ position: "absolute", left: "-9px", top: 0, width: 17, height: 17, borderRadius: "50%", background: colors.primary }} />
        {section && renderTitle(sectionTitle(section, data.language))}
        <div style={{ marginTop: "0.7rem" }}>{children}</div>
      </section>
    );
  };

  const renderExperience = (section?: CVSection) => section?.items.map((item) => (
    <article key={item.id} className="section-item" data-section-id={section?.id} data-item-id={item.id} style={{ marginBottom: "0.9rem" }}>
      <h4 style={{ margin: 0, color: colors.primary, fontSize: "calc(var(--cv-font-size) * 1.05)", fontWeight: 900, textTransform: "uppercase" }}>{item.position}</h4>
      <div style={{ fontSize: "calc(var(--cv-font-size) * 0.75)", fontWeight: 800, color: colors.secondary }}>
        {item.company} {item.location && `/ ${item.location}`}
      </div>
      <div style={{ fontSize: "calc(var(--cv-font-size) * 0.72)", fontStyle: "italic", color: colors.text }}>{dateRange(item)}</div>
      <p style={{ margin: "0.45rem 0 0", fontSize: "calc(var(--cv-font-size) * 0.78)", lineHeight: 1.55, color: colors.text, whiteSpace: "pre-line" }}>{item.description}</p>
    </article>
  ));

  const renderEducation = (section?: CVSection) => section?.items.map((item) => (
    <article key={item.id} className="section-item" data-section-id={section?.id} data-item-id={item.id} style={{ marginBottom: "0.9rem" }}>
      <div style={{ fontSize: "calc(var(--cv-font-size) * 0.72)", color: colors.text }}>{dateRange(item)}</div>
      <h4 style={{ margin: "0.15rem 0", color: colors.secondary, fontSize: "calc(var(--cv-font-size) * 0.92)", fontWeight: 900, textTransform: "uppercase" }}>{item.degree}</h4>
      <div style={{ fontSize: "calc(var(--cv-font-size) * 0.76)", fontStyle: "italic", color: colors.text }}>{item.institution}</div>
    </article>
  ));

  return (
    <div
      id="cv-capture-area"
      className="a4-page cv-template-diagonal"
      style={{
        minHeight: "var(--cv-page-height, 1123px)",
        background: colors.background,
        color: colors.text,
        fontFamily: "var(--cv-font-family)",
        fontSize: "var(--cv-font-size)",
        lineHeight: "var(--cv-line-height)",
        overflow: "hidden",
      }}
    >
      <header style={{ position: "relative", minHeight: 245, padding: "105px 54px 44px", display: "grid", gridTemplateColumns: "1fr 160px", gap: "1.5rem", alignItems: "center" }}>
        <div style={{ position: "absolute", inset: "0 0 auto 0", height: 116, background: colors.secondary }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 305, height: 235, background: colors.primary, clipPath: "polygon(0 0, 100% 0, 42% 100%, 0 100%)", opacity: 0.95 }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 420, height: 70, background: "color-mix(in srgb, var(--cv-primary) 72%, var(--cv-secondary))", clipPath: "polygon(0 0, 100% 0, 80% 100%, 18% 100%)", opacity: 0.7 }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <h1 style={{ margin: 0, fontSize: "calc(var(--cv-font-size) * 2.25)", lineHeight: 1, letterSpacing: "0.12em", fontWeight: 950, textTransform: "uppercase", color: colors.secondary }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          {personalInfo.title && <div style={{ marginTop: "0.65rem", fontSize: "calc(var(--cv-font-size) * 0.95)", letterSpacing: "0.2em", fontWeight: 850, textTransform: "uppercase", color: colors.secondary }}>{personalInfo.title}</div>}
        </div>
        <div className="photo-container" style={{ position: "relative", zIndex: 1, width: 146, height: 146, borderRadius: "50%", border: `9px solid ${colors.primary}`, overflow: "hidden", background: "#e5e7eb" }}>
          {personalInfo.photoUrl && <img src={personalInfo.photoUrl} alt={`${personalInfo.firstName} ${personalInfo.lastName}`} style={photoStyle} />}
        </div>
      </header>

      <main style={{ display: "grid", gridTemplateColumns: "58% 42%", gap: "1.8rem", padding: "0 58px 48px" }}>
        <div>
          {personalInfo.summary && renderTimelineBlock({ id: "profile", type: "custom", title: t.profile, visible: true, side: "right", items: [personalInfo.summary] },
            <p style={{ margin: 0, fontSize: "calc(var(--cv-font-size) * 0.8)", lineHeight: 1.65 }}>{personalInfo.summary}</p>
          )}
          {renderTimelineBlock(experience, renderExperience(experience))}
          {projects && (
            renderTimelineBlock(projects,
            <>
              {projects.items.map((item) => (
                <article key={item.id} className="section-item" data-section-id={projects.id} data-item-id={item.id} style={{ marginBottom: "0.75rem", fontSize: "calc(var(--cv-font-size) * 0.78)" }}>
                  <strong style={{ color: colors.secondary, textTransform: "uppercase" }}>{item.name}</strong>
                  {item.technologies && <div style={{ color: colors.primary, fontWeight: 800 }}>{item.technologies}</div>}
                  <p style={{ margin: "0.25rem 0 0" }}>{item.description}</p>
                </article>
              ))}
            </>)
          )}
        </div>

        <div>
          {renderTimelineBlock({ id: "contact", type: "custom", title: t.contactMe, visible: true, side: "left", items: [] },
            <div style={{ display: "grid", gap: "0.65rem", fontSize: "calc(var(--cv-font-size) * 0.8)" }}>
              {personalInfo.phone && <div><strong>{t.phone.toUpperCase()} :</strong> {personalInfo.phone}</div>}
              {personalInfo.email && <div><strong>{t.email.toUpperCase()} :</strong> {personalInfo.email}</div>}
              {personalInfo.website && <div><strong>{t.website.toUpperCase()} :</strong> {personalInfo.website.replace(/^https?:\/\//, "")}</div>}
              {personalInfo.address && <div><strong>{t.location.toUpperCase()} :</strong> {personalInfo.address}</div>}
            </div>
          )}
          {renderTimelineBlock(education, renderEducation(education))}
          {skills && (
            renderTimelineBlock(skills,
              <ul style={{ margin: "0 0 0 1rem", padding: 0, fontSize: "calc(var(--cv-font-size) * 0.78)", lineHeight: 1.55 }}>
                {skills.items.map((skill) => <li key={skill.id}>{skill.name}</li>)}
              </ul>
            )
          )}
          {certifications && (
            renderTimelineBlock(certifications,
            <>
              {certifications.items.map((item) => (
                <div key={item.id} className="section-item" data-section-id={certifications.id} data-item-id={item.id} style={{ fontSize: "calc(var(--cv-font-size) * 0.78)", marginBottom: "0.45rem" }}>
                  <strong>{item.name}</strong> / {item.issuer}
                </div>
              ))}
            </>)
          )}
        </div>
      </main>
    </div>
  );
};

export default DiagonalTimelineTemplate;
