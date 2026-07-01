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
    paddingBottom: 4,
    marginBottom: 6,
  },

  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },

  contactColumn: {
    flexDirection: "column",
    flexWrap: "wrap",
    marginTop: 12
  },

  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 9.5,
    color: "#333",
  },

  dot: {
    marginHorizontal: 5,
    color: "#999",
  },

  section: {
    marginTop: 3,
  },

  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    paddingBottom: 3,
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  row: {
    marginBottom: 3,
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
    marginTop: 2,
    color: "#333",
  },

  date: {
    fontSize: 9,
    color: "#555",
    marginLeft: 12,
  },

  skillRow: {
    flexDirection: "row",
    marginBottom: 4,
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

/* ---------------- COMPONENT ---------------- */

export function FShapePDFTemplate({ resume }: Props) {
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

        {/* ================= SUMMARY ================= */}
        {resume.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SUMMARY</Text>
            <RichText html={resume.summary} style={styles.small} />
          </View>
        )}

        {/* ================= EXPERIENCE ================= */}
        {resume.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EXPERIENCE</Text>

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
          </View>
        )}

        {/* ================= EDUCATION ================= */}
        {resume.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EDUCATION</Text>

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
          </View>
        )}

        {/* ================= CERTIFICATIONS ================= */}
        {resume.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>

            {resume.certifications.map((cert) => (
              <View key={cert.id} style={styles.flexBetween}>
                <View>
                  {cert.title && (
                    <Link
                      src={
                        cert.title.startsWith("http")
                          ? cert.title
                          : `https://${cert.title}`
                      }
                      style={[styles.bold, styles.link]}
                    >
                      {cert.title}
                    </Link>
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
            ))}
          </View>
        )}

        {/* ================= SKILLS ================= */}
        {resume.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SKILLS</Text>

            {resume.skills.map((group) => (
              <View key={group.id} style={styles.skillRow}>
                <Text style={styles.skillLabel}>
                  {group.category}:
                </Text>
                <Text>{group.skills.join(", ")}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ================= CUSTOM SECTIONS ================= */}
        {(resume.customSections ?? []).map((custom) =>
          custom.items.length > 0 ? (
            <View key={custom.id} style={styles.section}>
              <Text style={styles.sectionTitle}>
                {custom.title.toUpperCase()}
              </Text>

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
            </View>
          ) : null
        )}

      </Page>
    </Document>
  );
}

/* ---------------- HARVARD STYLES ---------------- */
const harvardStyles = StyleSheet.create({
  page: {
    paddingVertical: 40,
    paddingHorizontal: 50,
    fontFamily: "Times-Roman",
    fontSize: 11,
    color: "#000",
    lineHeight: 1.4,
  },

  header: {
    marginBottom: 0,
  },

  name: {
    fontSize: 22,
    fontFamily: "Times-Bold",
    textAlign: "center",
    letterSpacing: 0.5,
  },

  contactLine: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 6,
    fontSize: 10,
  },

  pipe: {
    marginHorizontal: 5,
  },

  section: {
    marginBottom: 3,
  },

  sectionTitle: {
    fontSize: 11,
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottomWidth: 1.5,
    borderBottomColor: "#000",
    paddingBottom: 3,
    marginBottom: 8,
  },

  entry: {
    marginBottom: 8,
  },

  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  entryTitle: {
    fontSize: 11,
    fontFamily: "Times-Bold",
    flex: 1,
  },

  entryDate: {
    fontSize: 10,
    marginLeft: 12,
  },

  entrySubtitle: {
    fontSize: 10,
    fontFamily: "Times-Italic",
    marginTop: 1,
  },

  entryDetail: {
    fontSize: 10,
    marginTop: 2,
  },

  summaryText: {
    fontSize: 10,
  },

  skillRow: {
    flexDirection: "row",
    marginBottom: 3,
    fontSize: 10,
  },

  skillLabel: {
    fontFamily: "Times-Bold",
  },

  link: {
    color: "#2563eb",
    textDecoration: "underline",
  },
});

/* ---------------- HARVARD COMPONENT ---------------- */

function HarvardSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={harvardStyles.section}>
      <Text style={harvardStyles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function HarvardPDFTemplate({ resume }: Props) {
  const formatRange = (
    start?: string,
    end?: string,
    current?: boolean
  ) => {
    const startStr = start ? formatDate(start) : "";
    if (current) return `${startStr} – Present`;
    const endStr = end ? formatDate(end) : "";
    if (startStr && endStr) return `${startStr} – ${endStr}`;
    return startStr || endStr;
  };

  const renderSection = (section: string) => {
    switch (section) {
      case "summary":
        return resume.summary ? (
          <HarvardSection key="summary" title="Professional Summary">
            <RichText html={resume.summary} style={harvardStyles.summaryText} />
          </HarvardSection>
        ) : null;

      case "experience":
        return resume.experience.length > 0 ? (
          <HarvardSection key="experience" title="Professional Experience">
            {resume.experience.map((exp) => (
              <View key={exp.id} style={harvardStyles.entry}>
                <View style={harvardStyles.entryHeader}>
                  <Text style={harvardStyles.entryTitle}>{exp.jobTitle}</Text>
                  <Text style={harvardStyles.entryDate}>
                    {formatRange(exp.startDate, exp.endDate, exp.currentlyWorking)}
                  </Text>
                </View>
                {exp.company && (
                  <Text style={harvardStyles.entrySubtitle}>{exp.company}</Text>
                )}
                {exp.description && (
                  <RichText html={exp.description} style={harvardStyles.entryDetail} />
                )}
              </View>
            ))}
          </HarvardSection>
        ) : null;

      case "education":
        return resume.education.length > 0 ? (
          <HarvardSection key="education" title="Education">
            {resume.education.map((edu) => (
              <View key={edu.id} style={harvardStyles.entry}>
                <View style={harvardStyles.entryHeader}>
                  <Text style={harvardStyles.entryTitle}>
                    {edu.degree}
                    {edu.field ? ` in ${edu.field}` : ""}
                  </Text>
                  {edu.graduationDate && (
                    <Text style={harvardStyles.entryDate}>
                      {formatDate(edu.graduationDate)}
                    </Text>
                  )}
                </View>
                {edu.school && (
                  <Text style={harvardStyles.entrySubtitle}>{edu.school}</Text>
                )}
                {edu.details && (
                  <RichText html={edu.details} style={harvardStyles.entryDetail} />
                )}
              </View>
            ))}
          </HarvardSection>
        ) : null;

      case "certifications":
        return resume.certifications.length > 0 ? (
          <HarvardSection key="certifications" title="Certifications & Licenses">
            {resume.certifications.map((cert) => (
              <View key={cert.id} style={harvardStyles.entry}>
                <View style={harvardStyles.entryHeader}>
                  <Text style={harvardStyles.entryTitle}>{cert.title}</Text>
                  {cert.issueDate && (
                    <Text style={harvardStyles.entryDate}>
                      {formatDate(cert.issueDate)}
                    </Text>
                  )}
                </View>
                {cert.issuer && (
                  <Text style={harvardStyles.entrySubtitle}>{cert.issuer}</Text>
                )}
                {cert.credentialId && (
                  <Text style={harvardStyles.entryDetail}>
                    ID: {cert.credentialId}
                  </Text>
                )}
              </View>
            ))}
          </HarvardSection>
        ) : null;

      case "skills":
        return resume.skills.length > 0 ? (
          <HarvardSection key="skills" title="Skills">
            {resume.skills.map((group) => (
              <View key={group.id} style={harvardStyles.skillRow}>
                <Text style={harvardStyles.skillLabel}>{group.category}: </Text>
                <Text>{group.skills.join(", ")}</Text>
              </View>
            ))}
          </HarvardSection>
        ) : null;

      default: {
        const custom = resume.customSections?.find((s) => s.id === section);
        if (!custom || custom.items.length === 0) return null;
        return (
          <HarvardSection key={custom.id} title={custom.title}>
            {custom.items.map((item) => (
              <View key={item.id} style={harvardStyles.entry}>
                {(item.title || item.startDate || item.endDate) && (
                  <View style={harvardStyles.entryHeader}>
                    {item.title && (
                      <Text style={harvardStyles.entryTitle}>{item.title}</Text>
                    )}
                    {(item.startDate || item.endDate) && (
                      <Text style={harvardStyles.entryDate}>
                        {item.startDate ? formatDate(item.startDate) : ""}
                        {item.startDate && item.endDate ? " – " : ""}
                        {item.endDate ? formatDate(item.endDate) : ""}
                      </Text>
                    )}
                  </View>
                )}
                {item.role && (
                  <Text style={harvardStyles.entrySubtitle}>{item.role}</Text>
                )}
                {item.description && (
                  <RichText html={item.description} style={harvardStyles.entryDetail} />
                )}
              </View>
            ))}
          </HarvardSection>
        );
      }
    }
  };

  return (
    <Document>
      <Page size="A4" style={harvardStyles.page}>
        {/* ================= HEADER ================= */}
        <View style={harvardStyles.header}>
          <Text style={harvardStyles.name}>{resume.contact.fullName}</Text>

          <View style={harvardStyles.contactLine}>
            {resume.contact.phone && <Text>{resume.contact.phone}</Text>}
            {resume.contact.phone && resume.contact.email && (
              <Text style={harvardStyles.pipe}>|</Text>
            )}
            {resume.contact.email && <Text>{resume.contact.email}</Text>}
          </View>

          <View style={harvardStyles.contactLine}>
            {resume.contact.location && <Text>{resume.contact.location}</Text>}
            {resume.contact.location &&
              (resume.contact.website || resume.contact.linkedin) && (
                <Text style={harvardStyles.pipe}>|</Text>
              )}
            {resume.contact.website && (
              <Link
                src={
                  resume.contact.website.startsWith("http")
                    ? resume.contact.website
                    : `https://${resume.contact.website}`
                }
                style={harvardStyles.link}
              >
                {resume.contact.website}
              </Link>
            )}
            {resume.contact.website && resume.contact.linkedin && (
              <Text style={harvardStyles.pipe}>|</Text>
            )}
            {resume.contact.linkedin && (
              <Link
                src={
                  resume.contact.linkedin.startsWith("http")
                    ? resume.contact.linkedin
                    : `https://${resume.contact.linkedin}`
                }
                style={harvardStyles.link}
              >
                {resume.contact.linkedin}
              </Link>
            )}
          </View>
        </View>

        {/* ================= DYNAMIC SECTIONS ================= */}
        {resume.sectionOrder.map((section) => renderSection(section))}
      </Page>
    </Document>
  );
}