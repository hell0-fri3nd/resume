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

/* ---------------- HARVARD STYLES ---------------- */
const harvardStyles = StyleSheet.create({
  page: {
    paddingVertical: 36,
    paddingHorizontal: 44,
    fontFamily: "Times-Roman",
    fontSize: 10,
    color: "#000",
    lineHeight: 1.35,
  },

  header: {
    paddingBottom: 3,
    marginBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: "#1a1a1a",
  },

  name: {
    fontSize: 20,
    fontFamily: "Times-Bold",
    textAlign: "center",
    letterSpacing: 0.5,
  },

  contactColumn: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center", 
    width: "100%",
    marginTop: 6,
  },

  contactLine: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    fontSize: 9.5,
  },

  pipe: {
    marginHorizontal: 4,
  },

  section: {
    marginTop: 2,
    marginBottom: 4
  },

  sectionTitle: {
    fontSize: 10.5,
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottomWidth: 1.5,
    borderBottomColor: "#999",
    paddingBottom: 2,
    textAlign: "center",
    marginBottom: 3,
  },

  entry: {
    marginBottom: 2,
  },

  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  entryTitle: {
    fontSize: 10.5,
    fontFamily: "Times-Bold",
    flex: 1,
  },

  entryDate: {
    fontSize: 9,
    marginLeft: 10,
  },

  entrySubtitle: {
    fontSize: 9.5,
    fontFamily: "Times-Italic",
    marginTop: 1,
  },

  entryDetail: {
    fontSize: 9.5,
    lineHeight: 1.22,
    marginTop: 1,
  },

  summaryText: {
    fontSize: 9.5,
    lineHeight: 1.22,
  },

  skillRow: {
    flexDirection: "row",
    marginBottom: 1,
    fontSize: 9.5,
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
  const formatRange = (start?: string, end?: string, current?: boolean) => {
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

          <View style={harvardStyles.contactColumn}>

            <View style={harvardStyles.contactLine}>
              {resume.contact.phone && <Text>{resume.contact.phone}</Text>}
              {resume.contact.phone && resume.contact.email && (
                <Text style={harvardStyles.pipe}>•</Text>
              )}
              {resume.contact.email && <Text>{resume.contact.email}</Text>}
            </View>

            <View style={harvardStyles.contactLine}>
              {resume.contact.location && <Text>{resume.contact.location}</Text>}
              {resume.contact.location &&
                (resume.contact.website || resume.contact.linkedin) && (
                  <Text style={harvardStyles.pipe}>•</Text>
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
                <Text style={harvardStyles.pipe}>•</Text>
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
        </View>

        {/* ================= DYNAMIC SECTIONS ================= */}
        {resume.sectionOrder.map((section) => renderSection(section))}
      </Page>
    </Document>
  );
}
