import z from "zod";

export const ContactSchema = z.object({
  fullName: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  website: z.string().optional(),
  linkedin: z.string().optional(),
});

export const dateField = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.literal(''));

export const ExperienceSchema = z.object({
  jobTitle: z.string(),
  company: z.string(),
  startDate: dateField,
  endDate: dateField,
  currentlyWorking: z.boolean(),
  description: z.string(),
});

export const EducationSchema = z.object({
  school: z.string(),
  degree: z.string(),
  field: z.string(),
  graduationDate: z.string(),
  details: z.string().optional(),
});

export const CertificationSchema = z.object({
  title: z.string(),
  issuer: z.string(),
  issueDate: z.string(),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().optional(),
});

export const SkillSchema = z.object({
  category: z.string(),
  skills: z.array(z.string()),
});

export const CustomSectionItemSchema = z.object({
  title: z.string(),
  role: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string(),
});

export const CustomSectionSchema = z.object({
  title: z.string(),
  items: z.array(CustomSectionItemSchema),
});

export const ExtractedResumeSchema = z.object({
  name: z.string().optional(),
  contact: ContactSchema.optional(),
  summary: z.string().optional(),
  experience: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  certifications: z.array(CertificationSchema),
  skills: z.array(SkillSchema),
  customSections: z.array(CustomSectionSchema),
});