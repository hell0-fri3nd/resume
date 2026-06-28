import { v4 as uuidv4 } from 'uuid';

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

export type TemplateType = 'fshape' | 'harvard';

export const DEFAULT_SECTION_ORDER: SectionType[] = [
  'summary',
  'experience',
  'education',
  'certifications',
  'skills',
];

export interface Resume {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  contact: Contact;
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  skills: Skill[];
  summary?: string;
  template: TemplateType;
  sectionOrder: SectionType[];
}

/**
 * Factory for a brand-new, empty resume. Generates a fresh uuid and timestamps.
 * Use this instead of spreading a shared default object so every resume gets a
 * unique id and independent arrays.
 */
export function createEmptyResume(
  name: string,
  template: TemplateType = 'fshape',
  now: string = new Date().toISOString()
): Resume {
  return {
    id: uuidv4(),
    name: name.trim() || 'Untitled Resume',
    createdAt: now,
    updatedAt: now,
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
    template,
    sectionOrder: [...DEFAULT_SECTION_ORDER],
  };
}
