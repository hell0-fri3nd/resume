import { Resume } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface FShapeTemplateProps {
  resume: Resume;
}

export default function FShapeTemplate({ resume }: FShapeTemplateProps) {
  return (
    <div className="bg-white text-black p-8 font-serif max-w-4xl mx-auto min-h-screen space-y-4">
      {/* Header */}
      <div className="border-b-2 border-black pb-4 mb-6">
        <h1 className="text-3xl font-bold text-black">{resume.contact.fullName}</h1>
        <div className="flex flex-wrap gap-2 mt-2 text-sm">
          {resume.contact.email && <span>{resume.contact.email}</span>}
          {resume.contact.phone && <span>•</span>}
          {resume.contact.phone && <span>{resume.contact.phone}</span>}
          {resume.contact.location && <span>•</span>}
          {resume.contact.location && <span>{resume.contact.location}</span>}
        </div>
        <div className="flex flex-wrap gap-2 mt-1 text-sm">
          {resume.contact.website && <span>{resume.contact.website}</span>}
          {resume.contact.website && resume.contact.linkedin && <span>•</span>}
          {resume.contact.linkedin && <span>{resume.contact.linkedin}</span>}
        </div>
      </div>

      {/* Dynamic Sections */}
      {resume.sectionOrder.map((section) => {
        switch (section) {
          case 'summary':
            return resume.summary ? (
              <div key="summary" className="space-y-2">
                <h2 className="text-lg font-bold text-black border-b border-black pb-1">PROFESSIONAL SUMMARY</h2>
                <p className="text-sm whitespace-pre-wrap">{resume.summary}</p>
              </div>
            ) : null;

          case 'experience':
            return resume.experience.length > 0 ? (
              <div key="experience" className="space-y-3">
                <h2 className="text-lg font-bold text-black border-b border-black pb-1">EXPERIENCE</h2>
                {resume.experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-black">{exp.jobTitle}</h3>
                        <p className="text-sm italic">{exp.company}</p>
                      </div>
                      <span className="text-sm whitespace-nowrap ml-4">
                        {exp.startDate && formatDate(exp.startDate)}
                        {exp.endDate && !exp.currentlyWorking && ` – ${formatDate(exp.endDate)}`}
                        {exp.currentlyWorking && ' – Present'}
                      </span>
                    </div>
                    {exp.description && <p className="text-sm whitespace-pre-wrap">{exp.description}</p>}
                  </div>
                ))}
              </div>
            ) : null;

          case 'education':
            return resume.education.length > 0 ? (
              <div key="education" className="space-y-3">
                <h2 className="text-lg font-bold text-black border-b border-black pb-1">EDUCATION</h2>
                {resume.education.map((edu) => (
                  <div key={edu.id} className="space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-black">
                          {edu.degree} in {edu.field}
                        </h3>
                        <p className="text-sm italic">{edu.school}</p>
                      </div>
                      {edu.graduationDate && (
                        <span className="text-sm whitespace-nowrap ml-4">{formatDate(edu.graduationDate)}</span>
                      )}
                    </div>
                    {edu.details && <p className="text-sm whitespace-pre-wrap">{edu.details}</p>}
                  </div>
                ))}
              </div>
            ) : null;

          case 'certifications':
            return resume.certifications.length > 0 ? (
              <div key="certifications" className="space-y-3">
                <h2 className="text-lg font-bold text-black border-b border-black pb-1">CERTIFICATIONS</h2>
                {resume.certifications.map((cert) => (
                  <div key={cert.id} className="space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-black">{cert.title}</h3>
                        <p className="text-sm italic">{cert.issuer}</p>
                      </div>
                      {cert.issueDate && (
                        <span className="text-sm whitespace-nowrap ml-4">{formatDate(cert.issueDate)}</span>
                      )}
                    </div>
                    {cert.credentialId && <p className="text-sm">ID: {cert.credentialId}</p>}
                  </div>
                ))}
              </div>
            ) : null;

          case 'skills':
            return resume.skills.length > 0 ? (
              <div key="skills" className="space-y-2">
                <h2 className="text-lg font-bold text-black border-b border-black pb-1">SKILLS</h2>
                <div className="space-y-2">
                  {resume.skills.map((skillGroup) => (
                    <div key={skillGroup.id} className="flex gap-2">
                      <span className="font-bold text-black min-w-fit">{skillGroup.category}:</span>
                      <span className="text-sm">{skillGroup.skills.join(', ')}</span>
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
