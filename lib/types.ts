export interface Contact {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  graduationDate: string;
  details?: string;
}

export interface Skill {
  id: string;
  category: string;
  skills: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export type SectionType = 'summary' | 'experience' | 'education' | 'certifications' | 'skills';

export interface Resume {
  id: string;
  contact: Contact;
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  skills: Skill[];
  summary?: string;
  template: 'fshape' | 'harvard';
  sectionOrder: SectionType[];
}

export const defaultResume: Resume = {
  id: 'default',
  contact: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
  },
  experience: [],
  education: [],
  certifications: [],
  skills: [],
  summary: '',
  template: 'fshape',
  sectionOrder: ['summary', 'experience', 'education', 'certifications', 'skills'],
};
