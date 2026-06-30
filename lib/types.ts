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

/**
 * A single entry inside a user-defined custom section (e.g. one project, one
 * leadership role). Keeps the same shape spirit as the built-in item types:
 * an optional heading plus a free-form description.
 */
export interface CustomSectionItem {
  id: string;
  title: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description: string;
}

/**
 * A user-defined section with a custom heading (e.g. "Projects", "Leadership",
 * "Activities") and a list of entries. Its `id` is what gets placed into
 * `sectionOrder` so it can be ordered alongside the built-in sections.
 */
export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export type SectionType = 'summary' | 'experience' | 'education' | 'certifications' | 'skills';

/** A section reference in `sectionOrder`: a built-in type or a custom section id. */
export type SectionId = SectionType | string;

export type TemplateType = 'fshape' | 'harvard';

export const BUILTIN_SECTION_TYPES: SectionType[] = [
  'summary',
  'experience',
  'education',
  'certifications',
  'skills',
];

/** Whether a `sectionOrder` entry refers to a built-in section (vs. a custom one). */
export function isBuiltinSection(id: string): id is SectionType {
  return (BUILTIN_SECTION_TYPES as string[]).includes(id);
}

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
  customSections: CustomSection[];
  summary?: string;
  template: TemplateType;
  sectionOrder: SectionId[];
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
    customSections: [],
    summary: '',
    template,
    sectionOrder: [...DEFAULT_SECTION_ORDER],
  };
}
