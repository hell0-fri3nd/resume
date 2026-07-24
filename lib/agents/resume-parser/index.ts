'use server';

import { z } from 'zod';
import { ChatGroq } from '@langchain/groq';
import { extractText, getDocumentProxy } from 'unpdf';
import { ExtractedResumeSchema } from './types';


export type ExtractedResume = z.infer<typeof ExtractedResumeSchema>;

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: process.env.LLM_MODEL ?? 'llama-3.3-70b-versatile',
  temperature: 0.1,
});

const structuredLlm = model.withStructuredOutput(ExtractedResumeSchema, {
  name: 'resume',
});

export async function extractResumeFromPdfAction(
  formData: FormData
): Promise<ExtractedResume> {
  const file = formData.get('pdf') as File | null;
  if (!file) throw new Error('No PDF file provided');

  const buffer = new Uint8Array(await file.arrayBuffer());
  const pdf = await getDocumentProxy(buffer);
  const { text } = await extractText(pdf, { mergePages: true });

  if (!text.trim()) throw new Error('Could not extract text from PDF');

  const raw = await structuredLlm.invoke([
    {
      role: 'system',
      content:
        `You are a resume parser. Extract structured information from the resume text below. ` +
        `For the resume name, suggest one based on the person's name (e.g. "John Doe — Resume"). ` +
        `For dates, always use full ISO format YYYY-MM-DD (e.g. "2023-07-01", not "2023-07"). ` +
        `If only month and year are available, use the first day (e.g. "2023-07-01"). ` +
        `Use empty null dates if date is not found. ` +
        `Set currentlyWorking to true if the end date is "Present" or similar. ` +
        `For all description fields (experience, customSections, etc.), output HTML. ` +
        `If the source resume contains bullet points (lines starting with •, ●, ▪, -, *, or similar markers, ` +
        `or clearly separated responsibilities/achievements), format the description as an HTML unordered list: ` +
        `"<ul><li>First point</li><li>Second point</li></ul>". ` +
        `Split long paragraphs that describe multiple distinct responsibilities into separate <li> items. ` +
        `If the description is a single continuous sentence or paragraph, wrap it in "<p>...</p>". ` +
        `Do not include bullet characters (•, -, *) inside the <li> text — the list markup provides them. ` +
        `IMPORTANT: Capture ALL sections in the resume, including non-standard ones. Never drop or omit a section. ` +
        `Deduplicate: if the resume has multiple sections with the same or equivalent header (e.g. "Skills" appears twice, ` +
        `or "Technical Skills" and "Skills — Technical"), merge them into ONE entry. Skills specifically ALWAYS belong in ` +
        `the top-level "skills" array (never in customSections), grouped by category. If the resume has sub-headers under ` +
        `Skills like "Technical", "Soft Skills", "Languages" (as programming/spoken proficiency in skills context), each ` +
        `sub-header becomes one skills entry with that category name. Do NOT emit duplicate category entries — merge all ` +
        `items sharing the same category into a single skills entry. Similarly, never place education, work experience, ` +
        `or certifications inside customSections. ` +
        `Detect sections that don't fit the standard ones (experience, education, certifications, skills) ` +
        `and put them in customSections. Examples include (but are not limited to): Projects, Publications, ` +
        `Volunteering, Awards, Honors, Interests, Hobbies, Patents, Speaking Engagements, ` +
        `Character References, References, Personal Information, Seminars, Trainings, Affiliations, Memberships. ` +
        `Also deduplicate customSections themselves: if two custom sections share the same title, merge their items into one. ` +
        `Each customSection has a title (the exact section heading from the resume) and an items array. ` +
        `Each item has: title, role (optional), startDate (optional, YYYY-MM-DD), endDate (optional, YYYY-MM-DD), and description (HTML). ` +
        `For Character References / References: create ONE item PER PERSON listed. Use the person's name as "title", ` +
        `their position/relationship (e.g. "Manager at ABC Corp", "Professor") as "role", and put contact info ` +
        `(phone, email, address) inside the description as an HTML list. ` +
        `If the section only says "Available upon request" or similar, keep it as a single item with that text as the description. ` +
        `For each customSection item, always populate at least one of title/role/description — never emit an item where all fields are empty. ` +
        `Preserve the exact wording from the resume; do not summarize, shorten, or paraphrase content.`,
    },
    { role: 'user', content: text },
  ]);

  return ExtractedResumeSchema.parse(raw);
}
