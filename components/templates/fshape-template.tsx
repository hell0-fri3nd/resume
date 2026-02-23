import { Resume } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { ReactNode } from 'react';

interface FShapeTemplateProps {
  resume: Resume;
}

const Container = ({label, children} : {label?: string | undefined; children: ReactNode;}) => {
  return (              
    <div className="space-y-1">
      <h2 className="text-[14.67px] font-bold text-black border-b border-black pb-0 mt-2">{label}</h2>
      {children}
    </div>
  )
}

const FShapeTemplate = ({ resume }: FShapeTemplateProps) => {
  return (
    // <div className="bg-white text-black font-serif mx-auto my-0
    //             w-[794px] h-[1123px] p-[64px] shadow-lg">
    <div className="bg-white text-black p-8 font-serif max-w-4xl mx-auto min-h-screen space-y-4">


      {/* Information */}
      <div className="border-b-2 border-black pb-4 mb-2">
        <h1 className="text-[17.33px] font-bold text-black">{resume.contact.fullName}</h1>
        <div className="flex flex-wrap gap-1 mt-2 text-[14.67px]">
          {resume.contact.email && <span>{resume.contact.email}</span>}
          {resume.contact.phone && <span>•</span>}
          {resume.contact.phone && <span>{resume.contact.phone}</span>}
          {resume.contact.location && <span>•</span>}
          {resume.contact.location && <span>{resume.contact.location}</span>}
        </div>
        <div className="flex flex-wrap gap-1 mt-1 text-[11px]">

          {resume.contact.linkedin && ( 
            <Link href={ 
              resume.contact.linkedin.startsWith("http") ? resume.contact.linkedin : `https://${resume.contact.linkedin}`
            } 
            target="_blank" rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800 hover:underline">
              {resume.contact.linkedin}
            </Link>
          )}

          {resume.contact.website && resume.contact.linkedin && <span>•</span>}

          {resume.contact.website && ( 
            <Link href={ 
              resume.contact.website.startsWith("http") ? resume.contact.website : `https://${resume.contact.website}`
            } 
            target="_blank" rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800 hover:underline">
              {resume.contact.website}
            </Link>
          )}
          
          {resume.contact.website && resume.contact.linkedin && <span>•</span>}
          {resume.contact.website && ( 
            <Link href={ 
              resume.contact.website.startsWith("http") ? resume.contact.website : `https://${resume.contact.website}`
            } 
            target="_blank" rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800 hover:underline">
              {resume.contact.website}
            </Link>
          )}

        </div>
      </div>

      {/* Dynamic Sections */}
      {resume.sectionOrder.map((section) => {
        switch (section) {
          case 'summary':
            return resume.summary ? (
              <Container label='SUMMARY'>
                <p className="text-[12px] whitespace-pre-wrap2">{resume.summary}</p>
              </Container>
            ) : null;

          case 'experience':
            return resume.experience.length > 0 ? (
              <Container label='EXPERIENCE'>
                {resume.experience.map((exp) => (
                  <div key={exp.id} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-[13.33px] font-bold text-black">{exp.jobTitle}</h3>
                        <p className="text-[13.33px] italic">{exp.company}</p>
                      </div>
                      <span className="text-[13.33px] text-sm whitespace-nowrap ml-4">
                        {exp.startDate && formatDate(exp.startDate)}
                        {exp.endDate && !exp.currentlyWorking && ` – ${formatDate(exp.endDate)}`}
                        {exp.currentlyWorking && ' – Present'}
                      </span>
                    </div>
                    {exp.description && <p className="text-[12px] whitespace-pre-wrap">{exp.description}</p>}
                  </div>
                ))}
              </Container>

            ) : null;

          case 'education':
            return resume.education.length > 0 ? (

              <Container label='EDUCATION'>
                {resume.education.map((edu) => (
                  <div key={edu.id} className="space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-[13.33px] font-bold text-black">
                          {edu.degree} in {edu.field}
                        </h3>
                        <p className="text-[13.33px] italic">{edu.school}</p>
                      </div>
                      {edu.graduationDate && (
                        <span className="text-[13.33px] whitespace-nowrap ml-4">{formatDate(edu.graduationDate)}</span>
                      )}
                    </div>
                    {edu.details && <p className="text-[12px] whitespace-pre-wrap">{edu.details}</p>}
                  </div>
                ))}
              </Container>

            ) : null;

          case 'certifications':
            return resume.certifications.length > 0 ? (
              <Container label='CERTIFICATIONS'>
                {resume.certifications.map((cert) => (
                  <div key={cert.id} className="flex justify-between">

                    {/* Left side: Title + Issuer */}
                    <div className="flex flex-col items-start justify-start">
                      {cert.title && (
                        <Link
                          href={cert.title.startsWith("http") ? cert.title : `https://${cert.title}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-[13.33px] text-black hover:text-blue-800 hover:underline"
                        >
                          {cert.title}
                        </Link>
                      )}
                      {cert.issuer && (
                        <p className="text-[12px] italic mt-[0px]">{cert.issuer}</p>
                      )}
                    </div>

                    {/* Right side: Date + Credential ID */}
                    <div className="flex flex-col items-start justify-end">
                      {cert.issueDate && (
                        <span className="text-[13.33px] whitespace-nowrap">{formatDate(cert.issueDate)}</span>
                      )}
                      {cert.credentialId && (
                        <p className="text-[12px] mt-[0px]">ID: {cert.credentialId}</p>
                      )}
                    </div>
                    
                  </div>
                ))}

              </Container>    
            ) : null;

          case 'skills':
            return resume.skills.length > 0 ? (
              <Container label='SKILLS'>
                <div className="space-y-2">

                  {resume.skills.map((skillGroup) => (
                    <div key={skillGroup.id} className="flex gap-2">
                      <span className="font-bold text-[12px] text-black min-w-fit">{skillGroup.category}:</span>
                      <span className="text-[12px]">{skillGroup.skills.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </Container> 
            ) : null;

          default:
            return null;
        }
      })}
    </div>
  );
}

export default FShapeTemplate