import React from "react";
import { CVData, CVSection } from "../types/cv";
import { sectionTitle } from "./templateHelpers";

interface TemplateProps {
  data: CVData;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, socialLinks = [], sections = [] } = data;

  // Ordered sections
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
        padding: "calc(var(--cv-spacing) * 3)",
        backgroundColor: "var(--cv-bg)",
        color: "var(--cv-text)",
        fontFamily: "var(--cv-font-family)",
        fontSize: "var(--cv-font-size)",
        lineHeight: "var(--cv-line-height)",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--cv-spacing) * 1.5)"
      }}
    >
      {/* Sleek Minimalist Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", borderBottom: "1px solid color-mix(in srgb, var(--cv-text) 10%, transparent)", paddingBottom: "1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 2 }}>
          <h1 style={{ fontSize: "calc(var(--cv-font-size) * 1.8)", fontWeight: 300, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--cv-text)" }}>
            {personalInfo.firstName} <span style={{ fontWeight: "bold" }}>{personalInfo.lastName}</span>
          </h1>
          {personalInfo.title && (
            <p style={{ fontSize: "calc(var(--cv-font-size) * 0.85)", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--cv-secondary)", fontWeight: 600 }}>{personalInfo.title}</p>
          )}
        </div>
        
        {/* Contact info clean right alignment */}
        <div style={{ textAlign: "right", fontSize: "calc(var(--cv-font-size) * 0.8)", color: "var(--cv-secondary)", fontFamily: "monospace", display: "flex", flexDirection: "column", gap: "0.15rem", flex: 1 }}>
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.address && <p>{personalInfo.address}</p>}
          {personalInfo.website && (
            <a href={personalInfo.website} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
              {personalInfo.website.replace(/^https?:\/\//, "")}
            </a>
          )}
          {socialLinks.map((link) => (
             <a key={link.id} href={link.url} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
               {link.platform} / {link.username}
             </a>
          ))}
        </div>
      </div>

      {/* Summary Profile */}
      {personalInfo.summary && (
        <div style={{ maxWidth: "48rem", fontSize: "calc(var(--cv-font-size) * 0.85)", color: "var(--cv-text)", opacity: 0.9, lineHeight: 1.6, fontWeight: 300, borderLeft: "2px solid var(--cv-primary)", paddingLeft: "1rem", paddingTop: "0.25rem", paddingBottom: "0.25rem", fontStyle: "italic" }}>
          {personalInfo.summary}
        </div>
      )}

      {/* Sections Layout */}
      <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--cv-spacing) * 1.5)" }}>
        {orderedSections.map((section) => (
          <div key={section.id} className="section-group" style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            
            {/* Sidebar Title */}
            <div style={{ flex: "0 0 25%", minWidth: "120px" }}>
              <h3 style={{ fontSize: "calc(var(--cv-font-size) * 0.85)", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--cv-secondary)", opacity: 0.8 }}>
                {sectionTitle(section, data.language)}
              </h3>
            </div>

            {/* Content list */}
            <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "var(--cv-spacing)" }}>
              {section.type === "experience" &&
                section.items.map((item) => (
                  <div key={item.id} style={{ fontSize: "calc(var(--cv-font-size) * 0.85)", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontWeight: "bold", color: "var(--cv-text)" }}>{item.position}</span>
                      <span style={{ fontSize: "calc(var(--cv-font-size) * 0.7)", color: "var(--cv-secondary)", opacity: 0.8, fontFamily: "monospace", flexShrink: 0 }}>
                        {item.startDate} — {item.endDate}
                      </span>
                    </div>
                    <div style={{ fontSize: "calc(var(--cv-font-size) * 0.8)", color: "var(--cv-secondary)", fontWeight: 500 }}>
                      {item.company} {item.location && <span style={{ opacity: 0.7 }}>• {item.location}</span>}
                    </div>
                    <p style={{ fontSize: "calc(var(--cv-font-size) * 0.8)", color: "var(--cv-secondary)", whiteSpace: "pre-line", fontWeight: 300, marginTop: "0.25rem" }}>
                      {item.description}
                    </p>
                  </div>
                ))}

              {section.type === "education" &&
                section.items.map((item) => (
                  <div key={item.id} style={{ fontSize: "calc(var(--cv-font-size) * 0.85)", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontWeight: "bold", color: "var(--cv-text)" }}>{item.degree}</span>
                      <span style={{ fontSize: "calc(var(--cv-font-size) * 0.7)", color: "var(--cv-secondary)", opacity: 0.8, fontFamily: "monospace", flexShrink: 0 }}>
                        {item.startDate} — {item.endDate}
                      </span>
                    </div>
                    <p style={{ fontSize: "calc(var(--cv-font-size) * 0.8)", color: "var(--cv-secondary)", fontWeight: 500 }}>
                      {item.institution} {item.fieldOfStudy && <span style={{ opacity: 0.7 }}>• {item.fieldOfStudy}</span>}
                    </p>
                    {item.description && (
                      <p style={{ fontSize: "calc(var(--cv-font-size) * 0.8)", color: "var(--cv-secondary)", fontWeight: 300, marginTop: "0.25rem" }}>{item.description}</p>
                    )}
                  </div>
                ))}

              {section.type === "projects" &&
                section.items.map((item) => (
                  <div key={item.id} style={{ fontSize: "calc(var(--cv-font-size) * 0.85)", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontWeight: "bold", color: "var(--cv-text)" }}>{item.name}</span>
                      {item.technologies && (
                        <span style={{ fontSize: "calc(var(--cv-font-size) * 0.65)", color: "var(--cv-secondary)", opacity: 0.8, fontFamily: "monospace" }}>
                          [{item.technologies}]
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: "calc(var(--cv-font-size) * 0.8)", color: "var(--cv-secondary)", fontWeight: 300 }}>{item.description}</p>
                  </div>
                ))}

              {section.type === "skills" && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {section.items.map((skill) => (
                    <span
                      key={skill.id}
                      style={{ fontSize: "calc(var(--cv-font-size) * 0.8)", backgroundColor: "color-mix(in srgb, var(--cv-secondary) 5%, transparent)", border: "1px solid color-mix(in srgb, var(--cv-secondary) 15%, transparent)", color: "var(--cv-text)", padding: "0.25rem 0.6rem", borderRadius: "0.25rem" }}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              )}

              {section.type === "languages" && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", rowGap: "0.25rem" }}>
                  {section.items.map((lang) => (
                    <span key={lang.id} style={{ fontSize: "calc(var(--cv-font-size) * 0.8)", color: "var(--cv-secondary)" }}>
                      <span style={{ fontWeight: "bold", color: "var(--cv-text)" }}>{lang.name}</span> ({lang.level})
                    </span>
                  ))}
                </div>
              )}

              {section.type === "certifications" &&
                section.items.map((item) => (
                  <div key={item.id} style={{ fontSize: "calc(var(--cv-font-size) * 0.85)", display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>
                        <span style={{ fontWeight: "bold", color: "var(--cv-text)" }}>{item.name}</span> – <span style={{ opacity: 0.8 }}>{item.issuer}</span>
                      </span>
                      <span style={{ color: "var(--cv-primary)", fontWeight: 600, fontSize: "calc(var(--cv-font-size) * 0.75)" }}>{item.date}</span>
                    </div>
                  </div>
                ))}

              {section.type === "interests" && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {section.items.map((interest) => (
                    <span key={interest.id} style={{ fontSize: "calc(var(--cv-font-size) * 0.8)", color: "var(--cv-secondary)", paddingRight: "0.5rem", borderRight: "1px solid color-mix(in srgb, var(--cv-secondary) 20%, transparent)" }}>
                      {interest.name}
                    </span>
                  ))}
                </div>
              )}

              {section.type === "custom" &&
                section.items.map((item) => (
                  <div key={item.id} style={{ fontSize: "calc(var(--cv-font-size) * 0.85)", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontWeight: "bold", color: "var(--cv-text)" }}>{item.title}</span>
                      {item.date && (
                        <span style={{ fontSize: "calc(var(--cv-font-size) * 0.7)", color: "var(--cv-secondary)", opacity: 0.8, fontFamily: "monospace" }}>
                          {item.date}
                        </span>
                      )}
                    </div>
                    {item.subtitle && <p style={{ fontSize: "calc(var(--cv-font-size) * 0.8)", color: "var(--cv-secondary)", fontStyle: "italic", opacity: 0.8 }}>{item.subtitle}</p>}
                    <p style={{ fontSize: "calc(var(--cv-font-size) * 0.8)", color: "var(--cv-secondary)", fontWeight: 300, whiteSpace: "pre-line" }}>
                      {item.description}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MinimalTemplate;
