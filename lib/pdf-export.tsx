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

interface Props {
  resume: Resume;
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Times-Roman",
    fontSize: 11,
    color: "#000",
    lineHeight: 1.4,
  },

  header: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    paddingBottom: 10,
    marginBottom: 10,
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
  },

  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },

  dot: {
    marginHorizontal: 4,
  },

  section: {
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 2,
    marginBottom: 6,
    textTransform: "uppercase",
  },

  row: {
    marginBottom: 8,
  },

  flexBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  bold: {
    fontWeight: "bold",
  },

  italic: {
    fontStyle: "italic",
  },

  small: {
    fontSize: 10,
  },

  skillRow: {
    flexDirection: "row",
    marginBottom: 4,
  },

  skillLabel: {
    fontWeight: "bold",
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

        {/* ================= SUMMARY ================= */}
        {resume.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SUMMARY</Text>
            <Text style={styles.small}>{resume.summary}</Text>
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

                  <Text>
                    {exp.startDate && formatDate(exp.startDate)}
                    {exp.endDate && !exp.currentlyWorking
                      ? ` – ${formatDate(exp.endDate)}`
                      : ""}
                    {exp.currentlyWorking ? " – Present" : ""}
                  </Text>
                </View>

                {exp.description && (
                  <Text style={styles.small}>{exp.description}</Text>
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
                    <Text>{formatDate(edu.graduationDate)}</Text>
                  )}
                </View>

                {edu.details && (
                  <Text style={styles.small}>{edu.details}</Text>
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
                      style={styles.bold}
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
                    <Text>{formatDate(cert.issueDate)}</Text>
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

      </Page>
    </Document>
  );
}