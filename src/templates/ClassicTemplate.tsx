import React from "react";
import { CVData, CVSection } from "../types/cv";
import { cvLabels, sectionTitle } from "./templateHelpers";

interface TemplateProps {
  data: CVData;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, socialLinks = [], sections = [] } = data;
  const t = cvLabels(data.language);

  // In full width Classic, we merge left and right sections or print them in layout order
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
      {/* Centered Classic Header */}
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "0.5rem", borderBottom: "2px solid var(--cv-primary)", paddingBottom: "1rem" }}>
        <h1
          style={{ fontSize: "calc(var(--cv-font-size) * 2)", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--cv-secondary)" }}
        >
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.title && (
          <h2 style={{ fontSize: "calc(var(--cv-font-size) * 1)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", fontStyle: "italic", color: "var(--cv-primary)" }}>
            {personalInfo.title}
          </h2>
        )}
        
        {/* Contact list separated by bullets */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.75rem", fontSize: "calc(var(--cv-font-size) * 0.85)", fontWeight: 500, opacity: 0.8 }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && (
            <>
              <span style={{ opacity: 0.5 }}>•</span>
              <span>{personalInfo.phone}</span>
            </>
          )}
          {personalInfo.address && (
            <>
              <span style={{ opacity: 0.5 }}>•</span>
              <span>{personalInfo.address}</span>
            </>
          )}
          {personalInfo.website && (
            <>
              <span style={{ opacity: 0.5 }}>•</span>
              <a href={personalInfo.website} target="_blank" rel="noreferrer" style={{ color: "inherit" }}>
                {personalInfo.website.replace(/^https?:\/\//, "")}
              </a>
            </>
          )}
        </div>

        {/* Social Links Row */}
        {socialLinks.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", fontSize: "calc(var(--cv-font-size) * 0.85)", fontWeight: 600, opacity: 0.8, paddingTop: "0.25rem" }}>
            {socialLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noreferrer" style={{ color: "inherit" }}>
                {link.platform} : @{link.username}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Summary Section */}
      {personalInfo.summary && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <p style={{ fontSize: "calc(var(--cv-font-size) * 0.85)", fontStyle: "italic", textAlign: "center", maxWidth: "42rem", margin: "0 auto", opacity: 0.9 }}>
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Render All Sections in Full Width */}
      <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--cv-spacing) * 1.5)" }}>
        {orderedSections.map((section) => (
          <div key={section.id} style={{ display: "flex", flexDirection: "column", gap: "var(--cv-spacing)" }}>
            {/* Section Title */}
            <h3
              style={{
                fontSize: "calc(var(--cv-font-size) * 1)",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderBottom: "1px solid",
                paddingBottom: "0.25rem",
                color: "var(--cv-secondary)",
                borderColor: "var(--cv-secondary)",
                opacity: 0.8
              }}
            >
              {sectionTitle(section, data.language)}
            </h3>

            {/* Section Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--cv-spacing) * 0.8)" }}>
              {section.type === "experience" &&
                section.items.map((item) => (
                  <div key={item.id} style={{ fontSize: "calc(var(--cv-font-size) * 0.85)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                      <span>
                        {item.position} — <span style={{ color: "var(--cv-primary)" }}>{item.company}</span>
                      </span>
                      <span style={{ fontWeight: "normal", opacity: 0.7, flexShrink: 0 }}>
                        {item.startDate} — {item.endDate}
                      </span>
                    </div>
                    {item.location && <p style={{ fontSize: "calc(var(--cv-font-size) * 0.75)", fontWeight: 600, opacity: 0.6 }}>{item.location}</p>}
                    <p style={{ fontSize: "calc(var(--cv-font-size) * 0.85)", whiteSpace: "pre-line", marginTop: "0.25rem", fontWeight: 300, opacity: 0.9 }}>
                      {item.description}
                    </p>
                  </div>
                ))}

              {section.type === "education" &&
                section.items.map((item) => (
                  <div key={item.id} style={{ fontSize: "calc(var(--cv-font-size) * 0.85)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                      <span>
                        {item.degree} <span style={{ fontWeight: "normal", opacity: 0.7 }}>({item.fieldOfStudy})</span>
                      </span>
                      <span style={{ fontWeight: "normal", opacity: 0.7, flexShrink: 0 }}>
                        {item.startDate} — {item.endDate}
                      </span>
                    </div>
                    <p style={{ fontSize: "calc(var(--cv-font-size) * 0.85)", fontWeight: 600, color: "var(--cv-primary)" }}>{item.institution}</p>
                    {item.description && (
                      <p style={{ fontSize: "calc(var(--cv-font-size) * 0.85)", marginTop: "0.25rem", fontWeight: 300, opacity: 0.9 }}>{item.description}</p>
                    )}
                  </div>
                ))}

              {section.type === "projects" &&
                section.items.map((item) => (
                  <div key={item.id} style={{ fontSize: "calc(var(--cv-font-size) * 0.85)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                      <span>
                        {item.name} <span style={{ fontWeight: "normal", opacity: 0.7, fontStyle: "italic" }}>{item.technologies ? `(${item.technologies})` : ""}</span>
                      </span>
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noreferrer" style={{ color: "var(--cv-primary)" }}>
                          {t.link}
                        </a>
                      )}
                    </div>
                    <p style={{ fontSize: "calc(var(--cv-font-size) * 0.85)", marginTop: "0.25rem", fontWeight: 300, opacity: 0.9 }}>{item.description}</p>
                  </div>
                ))}

              {section.type === "skills" && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {section.items.map((skill) => (
                    <span
                      key={skill.id}
                      style={{ fontSize: "calc(var(--cv-font-size) * 0.85)", padding: "0.25rem 0.5rem", borderRadius: "0.25rem", backgroundColor: "var(--cv-bg)", border: "1px solid var(--cv-text)", opacity: 0.8, fontWeight: 500 }}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              )}

              {section.type === "languages" && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                  {section.items.map((lang) => (
                    <span key={lang.id} style={{ fontSize: "calc(var(--cv-font-size) * 0.85)" }}>
                      <span style={{ fontWeight: "bold" }}>{lang.name}</span> <span style={{ opacity: 0.7 }}>({lang.level})</span>
                    </span>
                  ))}
                </div>
              )}

              {section.type === "certifications" &&
                section.items.map((item) => (
                  <div key={item.id} style={{ fontSize: "calc(var(--cv-font-size) * 0.85)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>
                        <span style={{ fontWeight: "bold" }}>{item.name}</span> — {item.issuer}
                      </span>
                      <span style={{ color: "var(--cv-primary)", fontWeight: 600 }}>{item.date}</span>
                    </div>
                  </div>
                ))}

              {section.type === "interests" && (
                <p style={{ fontSize: "calc(var(--cv-font-size) * 0.85)", opacity: 0.9 }}>
                  {section.items.map((interest) => interest.name).join(" • ")}
                </p>
              )}

              {section.type === "custom" &&
                section.items.map((item) => (
                  <div key={item.id} style={{ fontSize: "calc(var(--cv-font-size) * 0.85)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                      <span>{item.title}</span>
                      {item.date && (
                        <span style={{ fontWeight: "normal", opacity: 0.7 }}>{item.date}</span>
                      )}
                    </div>
                    {item.subtitle && <p style={{ fontWeight: 600, fontStyle: "italic", opacity: 0.8 }}>{item.subtitle}</p>}
                    <p style={{ fontSize: "calc(var(--cv-font-size) * 0.85)", marginTop: "0.25rem", whiteSpace: "pre-line", fontWeight: 300, opacity: 0.9 }}>
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

export default ClassicTemplate;
