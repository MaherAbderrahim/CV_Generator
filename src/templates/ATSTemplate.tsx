import React from "react";
import { CVData } from "../types/cv";
import { cvLabels, sectionTitle } from "./templateHelpers";

interface TemplateProps {
  data: CVData;
}

export const ATSTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, socialLinks = [], sections = [] } = data;
  const t = cvLabels(data.language);

  // Filter sections
  const orderedSections = [...sections]
    .filter((s) => s.visible && s.items.length > 0)
    .sort((a, b) => {
      const idxA = data.layout.sectionsOrder.indexOf(a.id);
      const idxB = data.layout.sectionsOrder.indexOf(b.id);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });

  return (
    <div
      id="cv-capture-area"
      className="a4-page"
      style={{ 
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)", 
        padding: "calc(var(--cv-spacing) * 3)",
        color: "var(--cv-text)",
        backgroundColor: "var(--cv-bg)",
        fontFamily: "var(--cv-font-family)",
        fontSize: "var(--cv-font-size)",
        lineHeight: "var(--cv-line-height)",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--cv-spacing) * 1.5)"
      }}
    >
      {/* Name and simple header */}
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "0.25rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--cv-text)" }}>
        <h1 style={{ fontSize: "calc(var(--cv-font-size) * 1.5)", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "normal" }}>
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.title && (
          <p style={{ fontWeight: "bold", textTransform: "uppercase" }}>{personalInfo.title}</p>
        )}
        
        {/* Flat simple contacts list */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.4rem", fontWeight: "normal", fontSize: "calc(var(--cv-font-size) * 0.9)" }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>| {personalInfo.phone}</span>}
          {personalInfo.address && <span>| {personalInfo.address}</span>}
          {personalInfo.website && <span>| {personalInfo.website}</span>}
        </div>

        {/* Flat simple social networks */}
        {socialLinks.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.4rem", fontWeight: "normal", fontSize: "calc(var(--cv-font-size) * 0.9)" }}>
            {socialLinks.map((link, idx) => (
              <span key={link.id}>
                {idx > 0 ? " | " : ""}
                {link.platform}: {link.url}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Summary Profile */}
      {personalInfo.summary && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <h2 style={{ fontSize: "calc(var(--cv-font-size) * 0.9)", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--cv-text)" }}>
            {t.profile.toUpperCase()}
          </h2>
          <p style={{ fontSize: "calc(var(--cv-font-size) * 0.9)", textAlign: "justify" }}>{personalInfo.summary}</p>
        </div>
      )}

      {/* Dynamic Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--cv-spacing)" }}>
        {orderedSections.map((section) => (
          <div key={section.id} className="section-group" style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <h2 style={{ fontSize: "calc(var(--cv-font-size) * 0.9)", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--cv-text)" }}>
              {sectionTitle(section, data.language).toUpperCase()}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--cv-spacing) * 0.75)", paddingTop: "0.1rem" }}>
              {section.type === "experience" &&
                section.items.map((item) => (
                  <div key={item.id} style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "calc(var(--cv-font-size) * 0.9)" }}>
                      <span>
                        {item.position.toUpperCase()} – {item.company.toUpperCase()}
                      </span>
                      <span>
                        {item.startDate.toUpperCase()} – {item.endDate.toUpperCase()}
                      </span>
                    </div>
                    {item.location && <p style={{ fontSize: "calc(var(--cv-font-size) * 0.8)", fontStyle: "italic", fontWeight: 600 }}>{item.location}</p>}
                    <p style={{ fontSize: "calc(var(--cv-font-size) * 0.9)", textAlign: "justify", whiteSpace: "pre-line", fontWeight: "normal" }}>
                      {item.description}
                    </p>
                  </div>
                ))}

              {section.type === "education" &&
                section.items.map((item) => (
                  <div key={item.id} style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "calc(var(--cv-font-size) * 0.9)" }}>
                      <span>
                        {item.degree.toUpperCase()} IN {item.fieldOfStudy?.toUpperCase()}
                      </span>
                      <span>
                        {item.startDate.toUpperCase()} – {item.endDate.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ fontSize: "calc(var(--cv-font-size) * 0.9)", fontWeight: 600 }}>{item.institution.toUpperCase()}</p>
                    {item.description && <p style={{ fontSize: "calc(var(--cv-font-size) * 0.8)", fontStyle: "italic" }}>{item.description}</p>}
                  </div>
                ))}

              {section.type === "projects" &&
                section.items.map((item) => (
                  <div key={item.id} style={{ display: "flex", flexDirection: "column", gap: "0.15rem", fontSize: "calc(var(--cv-font-size) * 0.9)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                      <span>{item.name.toUpperCase()}</span>
                      {item.technologies && <span style={{ fontWeight: "normal", fontStyle: "italic" }}>({item.technologies})</span>}
                    </div>
                    <p style={{ fontSize: "calc(var(--cv-font-size) * 0.9)", textAlign: "justify" }}>{item.description}</p>
                  </div>
                ))}

              {section.type === "skills" && (
                <div style={{ fontSize: "calc(var(--cv-font-size) * 0.9)" }}>
                  <span style={{ fontWeight: "bold" }}>{t.skillsInline.toUpperCase()} : </span>
                  {section.items.map((skill, idx) => (
                    <span key={skill.id}>
                      {idx > 0 ? ", " : ""}
                      {skill.name}
                    </span>
                  ))}
                </div>
              )}

              {section.type === "languages" && (
                <div style={{ fontSize: "calc(var(--cv-font-size) * 0.9)" }}>
                  <span style={{ fontWeight: "bold" }}>{t.languagesInline.toUpperCase()} : </span>
                  {section.items.map((lang, idx) => (
                    <span key={lang.id}>
                      {idx > 0 ? ", " : ""}
                      {lang.name} ({lang.level})
                    </span>
                  ))}
                </div>
              )}

              {section.type === "certifications" &&
                section.items.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "calc(var(--cv-font-size) * 0.9)", padding: "0.1rem 0" }}>
                    <span>
                      <span style={{ fontWeight: "bold" }}>{item.name.toUpperCase()}</span> – {item.issuer.toUpperCase()}
                    </span>
                    <span style={{ fontWeight: 600 }}>{item.date.toUpperCase()}</span>
                  </div>
                ))}

              {section.type === "interests" && (
                <div style={{ fontSize: "calc(var(--cv-font-size) * 0.9)" }}>
                  <span style={{ fontWeight: "bold" }}>{t.interestsInline.toUpperCase()} : </span>
                  {section.items.map((interest, idx) => (
                    <span key={interest.id}>
                      {idx > 0 ? ", " : ""}
                      {interest.name}
                    </span>
                  ))}
                </div>
              )}

              {section.type === "custom" &&
                section.items.map((item) => (
                  <div key={item.id} style={{ display: "flex", flexDirection: "column", gap: "0.15rem", fontSize: "calc(var(--cv-font-size) * 0.9)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                      <span>{item.title.toUpperCase()}</span>
                      {item.date && <span>{item.date.toUpperCase()}</span>}
                    </div>
                    {item.subtitle && <p style={{ fontStyle: "italic" }}>{item.subtitle}</p>}
                    <p style={{ textAlign: "justify" }}>{item.description}</p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ATSTemplate;
