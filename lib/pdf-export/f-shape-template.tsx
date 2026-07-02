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


