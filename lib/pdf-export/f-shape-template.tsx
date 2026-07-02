import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";

import { Resume } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { RichText } from "@/lib/rich-text-pdf";

interface Props {
  resume: Resume;
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  page: {
    paddingVertical: 36,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
    lineHeight: 1.35,
  },

  header: {
    borderBottomWidth: 2,
    borderBottomColor: "#1a1a1a",
    paddingBottom: 3,
    marginBottom: 5,
  },

  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },

  contactColumn: {
    flexDirection: "column",
    flexWrap: "wrap",
    marginTop: 6,
  },

  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 9.5,
    color: "#333",
  },

  dot: {
    marginHorizontal: 4,
    color: "#999",
  },

  section: {
    marginTop: 2,
    marginBottom: 4
  },

  sectionTitle: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    paddingBottom: 2,
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  row: {
    marginBottom: 2,
  },

  flexBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  bold: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
  },

  italic: {
    fontFamily: "Helvetica-Oblique",
    fontSize: 9.5,
    color: "#444",
    marginTop: 1,
  },

  small: {
    fontSize: 9.5,
    lineHeight: 1.22,
    marginTop: 1,
    color: "#333",
  },

  date: {
    fontSize: 9,
    color: "#555",
    marginLeft: 10,
  },

  skillRow: {
    flexDirection: "row",
    marginBottom: 1,
    fontSize: 9.5,
  },

  skillLabel: {
    fontFamily: "Helvetica-Bold",
    minWidth: 80,
  },

  link: {
    color: "#2563eb",
    textDecoration: "underline",
  },
});



const FShapeSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  )
}
/* ---------------- COMPONENT ---------------- */

export function FShapePDFTemplate({ resume }: Props) {
  const formatLinkUrl = (url?: string) => {
    const trimmedUrl = url?.trim();
    if (!trimmedUrl) return "";
    return trimmedUrl.startsWith("http") ? trimmedUrl : `https://${trimmedUrl}`;
  };

  const renderSection = (section: string) => {
    switch (section) {
        case "summary":
          return resume.summary ? (
            <FShapeSection key="summary" title="Professional Summary">
              <RichText html={resume.summary} style={styles.small} />
            </FShapeSection>
          ) : null;
      
          case "experience":
            return resume.experience.length > 0 ? (
              <FShapeSection key="experience" title="Experience">
                {resume.experience.map((exp) => (
                  <View key={exp.id} style={styles.row}>
                    <View style={styles.flexBetween}>
                      <View>
                        <Text style={styles.bold}>{exp.jobTitle}</Text>
                        <Text style={styles.italic}>{exp.company}</Text>
                      </View>

                      <Text style={styles.date}>
                        {exp.startDate && formatDate(exp.startDate)}
                        {exp.endDate && !exp.currentlyWorking
                          ? ` – ${formatDate(exp.endDate)}`
                          : ""}
                        {exp.currentlyWorking ? " – Present" : ""}
                      </Text>
                    </View>

                    {exp.description && (
                      <RichText html={exp.description} style={styles.small} />
                    )}
                  </View>
                ))}

              </FShapeSection>
            ) : null;
      
          case "education":
            return resume.education.length > 0 ? (
              <FShapeSection key="education" title="Education">
                {resume.education.map((edu) => (
                  <View key={edu.id} style={styles.row}>
                    <View style={styles.flexBetween}>
                      <View>
                        <Text style={styles.bold}>
                          {edu.degree} in {edu.field}
                        </Text>
                        <Text style={styles.italic}>{edu.school}</Text>
                      </View>

                      {edu.graduationDate && (
                        <Text style={styles.date}>{formatDate(edu.graduationDate)}</Text>
                      )}
                    </View>

                    {edu.details && (
                      <RichText html={edu.details} style={styles.small} />
                    )}
                  </View>
                  ))}
              </FShapeSection>
            ) : null;
      
            case "certifications":
              return resume.certifications.length > 0 ? (
                <FShapeSection key="certifications" title="Certifications & Licenses">
                  {resume.certifications.map((cert) => {
                    const credentialUrl = formatLinkUrl(cert.credentialUrl);

                    return (
                      <View key={cert.id} style={styles.flexBetween}>
                        <View>
                          {cert.title && credentialUrl ? (
                            <Link
                              src={credentialUrl}
                              style={[styles.bold, styles.link]}
                            >
                              {cert.title}
                            </Link>
                          ) : (
                            cert.title && <Text style={styles.bold}>{cert.title}</Text>
                          )}

                          {cert.issuer && (
                            <Text style={styles.small}>{cert.issuer}</Text>
                          )}
                        </View>

                        <View>
                          {cert.issueDate && (
                            <Text style={styles.date}>{formatDate(cert.issueDate)}</Text>
                          )}
                          {cert.credentialId && (
                            <Text style={styles.small}>
                              ID: {cert.credentialId}
                            </Text>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </FShapeSection>
              ) : null;
      
            case "skills":
              return resume.skills.length > 0 ? (
                <FShapeSection key="skills" title="Skills">
                  {resume.skills.map((group) => (
                    <View key={group.id} style={styles.skillRow}>
                      <Text style={styles.skillLabel}>
                        {group.category}:
                      </Text>
                      <Text>{group.skills.join(", ")}</Text>
                    </View>
                  ))}
                </FShapeSection>
              ) : null;
      
            default: {
              const custom = resume.customSections?.find((s) => s.id === section);
              if (!custom || custom.items.length === 0) return null;
              return (
                <FShapeSection key={custom.id} title={custom.title}>
                  {custom.items.map((item) => (
                                  <View key={item.id} style={styles.row}>
                  {(item.title || item.role || item.startDate || item.endDate) && (
                    <View style={styles.flexBetween}>
                      <View>
                        {item.title && <Text style={styles.bold}>{item.title}</Text>}
                        {item.role && <Text style={styles.italic}>{item.role}</Text>}
                      </View>
                      {(item.startDate || item.endDate) && (
                        <Text style={styles.date}>
                          {item.startDate ? formatDate(item.startDate) : ""}
                          {item.startDate && item.endDate ? " – " : ""}
                          {item.endDate ? formatDate(item.endDate) : ""}
                        </Text>
                      )}
                    </View>
                  )}
                  {item.description && (
                    <RichText html={item.description} style={styles.small} />
                  )}
                </View>
                  ))}
                </FShapeSection>
              );
    }
    }
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {resume.contact.fullName}
          </Text>

          <View style={styles.contactColumn}>
            <View style={styles.contactRow}>
              {resume.contact.email && <Text>{resume.contact.email}</Text>}
              {resume.contact.phone && (
                <>
                  <Text style={styles.dot}>•</Text>
                  <Text>{resume.contact.phone}</Text>
                </>
              )}
              {resume.contact.location && (
                <>
                  <Text style={styles.dot}>•</Text>
                  <Text>{resume.contact.location}</Text>
                </>
              )}
            </View>

            <View style={styles.contactRow}>
              {resume.contact.linkedin && (
                <Link
                  src={
                    resume.contact.linkedin.startsWith("http")
                      ? resume.contact.linkedin
                      : `https://${resume.contact.linkedin}`
                  }
                  style={styles.link}
                >
                  {resume.contact.linkedin}
                </Link>
              )}

              {resume.contact.website && resume.contact.linkedin && (
                <Text style={styles.dot}>•</Text>
              )}

              {resume.contact.website && (
                <Link
                  src={
                    resume.contact.website.startsWith("http")
                      ? resume.contact.website
                      : `https://${resume.contact.website}`
                  }
                  style={styles.link}
                >
                  {resume.contact.website}
                </Link>
              )}
            </View>
          </View>

        </View>

        {/* ================= DYNAMIC SECTIONS ================= */}
        {resume.sectionOrder.map((section) => renderSection(section))}

      </Page>
    </Document>
  );
}


