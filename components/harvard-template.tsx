import { Resume } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface HarvardTemplateProps {
  resume: Resume;
}

export default function HarvardTemplate({ resume }: HarvardTemplateProps) {
  return (
    <div className="bg-white text-black p-10 font-serif max-w-4xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-black text-center">{resume.contact.fullName}</h1>
        <div className="text-center mt-3 text-sm space-y-1">
          <div className="flex justify-center flex-wrap gap-2">
            {resume.contact.phone && <span>{resume.contact.phone}</span>}
            {resume.contact.phone && resume.contact.email && <span>|</span>}
            {resume.contact.email && <span>{resume.contact.email}</span>}
          </div>
          <div className="flex justify-center flex-wrap gap-2">
            {resume.contact.location && <span>{resume.contact.location}</span>}
            {resume.contact.location && (resume.contact.website || resume.contact.linkedin) && <span>|</span>}
            {resume.contact.website && <span>{resume.contact.website}</span>}
            {resume.contact.website && resume.contact.linkedin && <span>|</span>}
            {resume.contact.linkedin && <span>{resume.contact.linkedin}</span>}
          </div>
        </div>
      </div>

      {/* Dynamic Sections */}
      {resume.sectionOrder.map((section) => {
        switch (section) {
          case 'summary':
            return resume.summary ? (
              <div key="summary" className="mb-6">
                <h2 className="text-sm font-bold text-black uppercase tracking-wide border-b-2 border-black pb-2 mb-3">
                  Professional Summary
                </h2>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{resume.summary}</p>
              </div>
            ) : null;

          case 'experience':
            return resume.experience.length > 0 ? (
              <div key="experience" className="mb-6">
                <h2 className="text-sm font-bold text-black uppercase tracking-wide border-b-2 border-black pb-2 mb-3">
                  Professional Experience
                </h2>
                <div className="space-y-4">
                  {resume.experience.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-bold text-black">{exp.jobTitle}</h3>
                        <span className="text-sm text-black ml-4">
                          {exp.startDate && formatDate(exp.startDate)}
                          {exp.endDate && !exp.currentlyWorking && ` – ${formatDate(exp.endDate)}`}
                          {exp.currentlyWorking && ' – Present'}
                        </span>
                      </div>
                      <p className="text-sm italic text-black">{exp.company}</p>
                      {exp.description && (
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null;

          case 'education':
            return resume.education.length > 0 ? (
              <div key="education" className="mb-6">
                <h2 className="text-sm font-bold text-black uppercase tracking-wide border-b-2 border-black pb-2 mb-3">
                  Education
                </h2>
                <div className="space-y-3">
                  {resume.education.map((edu) => (
                    <div key={edu.id} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-bold text-black">
                          {edu.degree} in {edu.field}
                        </h3>
                        {edu.graduationDate && (
                          <span className="text-sm text-black ml-4">{formatDate(edu.graduationDate)}</span>
                        )}
                      </div>
                      <p className="text-sm italic text-black">{edu.school}</p>
                      {edu.details && (
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{edu.details}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null;

          case 'certifications':
            return resume.certifications.length > 0 ? (
              <div key="certifications" className="mb-6">
                <h2 className="text-sm font-bold text-black uppercase tracking-wide border-b-2 border-black pb-2 mb-3">
                  Certifications & Licenses
                </h2>
                <div className="space-y-3">
                  {resume.certifications.map((cert) => (
                    <div key={cert.id} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-bold text-black">{cert.title}</h3>
                        {cert.issueDate && (
                          <span className="text-sm text-black ml-4">{formatDate(cert.issueDate)}</span>
                        )}
                      </div>
                      <p className="text-sm italic text-black">{cert.issuer}</p>
                      {cert.credentialId && <p className="text-sm">ID: {cert.credentialId}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ) : null;

          case 'skills':
            return resume.skills.length > 0 ? (
              <div key="skills" className="mb-6">
                <h2 className="text-sm font-bold text-black uppercase tracking-wide border-b-2 border-black pb-2 mb-3">
                  Skills
                </h2>
                <div className="space-y-2">
                  {resume.skills.map((skillGroup) => (
                    <div key={skillGroup.id} className="text-sm">
                      <span className="font-bold text-black">{skillGroup.category}:</span>{' '}
                      <span>{skillGroup.skills.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null;

          default:
            return null;
        }
      })}
    </div>
  );
}
