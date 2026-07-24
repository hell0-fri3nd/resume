import {
  createEntityAdapter,
  createSlice,
  nanoid,
  type PayloadAction,
} from '@reduxjs/toolkit';
import {
  DEFAULT_SECTION_ORDER,
  createEmptyResume,
  type Certification,
  type Contact,
  type CustomSection,
  type CustomSectionItem,
  type Education,
  type Experience,
  type Resume,
  type SectionId,
  type Skill,
  type TemplateType,
} from '@/lib/types';
import type { ExtractedResume } from '@/lib/actions/extract-resume';
import type { RootState } from '../index';

const adapter = createEntityAdapter<Resume>({
  // Most-recently-edited first — drives dashboard card order for free.
  sortComparer: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
});

/**
 * Bump `updatedAt` on the target resume after any edit so the dashboard sort and
 * "last edited" labels stay accurate. Note: timestamps are stamped inside
 * reducers via an ISO string created at dispatch time — acceptable here because
 * this store is not server-rendered or replayed.
 */
function touch(resume: Resume | undefined) {
  if (resume) resume.updatedAt = new Date().toISOString();
}

const resumesSlice = createSlice({
  name: 'resumes',
  initialState: adapter.getInitialState(),
  reducers: {
    // ---- Document-level (dashboard) ----------------------------------------
    createResume: {
      reducer: (state, action: PayloadAction<Resume>) => {
        adapter.addOne(state, action.payload);
      },
      prepare: (input: { name: string; template?: TemplateType }) => ({
        payload: createEmptyResume(input.name, input.template ?? 'fshape'),
      }),
    },

    createResumeFromExtract: {
      reducer: (state, action: PayloadAction<Resume>) => {
        adapter.addOne(state, action.payload);
      },
      prepare: (input: {
        name: string;
        template?: TemplateType;
        extracted: ExtractedResume;
      }) => {
        const { extracted } = input;
        const now = new Date().toISOString();

        // Sort helpers — descending (most recent first). YYYY-MM-DD strings
        // compare lexicographically, so string compare works. Empty strings
        // sort last (treated as oldest/unknown).
        const dateKey = (d: string): string => (d ? d : '0000-00-00');
        const compareDateDesc = <T extends { startDate: string; endDate: string; currentlyWorking?: boolean }>(
          a: T,
          b: T
        ): number => {
          // Currently working entries always come first.
          if (a.currentlyWorking && !b.currentlyWorking) return -1;
          if (!a.currentlyWorking && b.currentlyWorking) return 1;
          const endCmp = dateKey(b.endDate).localeCompare(dateKey(a.endDate));
          if (endCmp !== 0) return endCmp;
          return dateKey(b.startDate).localeCompare(dateKey(a.startDate));
        };
        const sortByEnd = <T extends { startDate: string; endDate: string; currentlyWorking?: boolean }>(
          arr: T[]
        ): T[] => [...arr].sort(compareDateDesc);

        // Group experience by company, sort roles within each company by date desc
        // (so promotions at the same company stay together, newest role on top),
        // then order companies by their most-recent role.
        const groupExperienceByCompany = <T extends { company: string; startDate: string; endDate: string; currentlyWorking?: boolean }>(
          arr: T[]
        ): T[] => {
          const groups = new Map<string, T[]>();
          const order: string[] = [];
          for (const item of arr) {
            const key = (item.company ?? '').trim().toLowerCase();
            if (!groups.has(key)) {
              groups.set(key, []);
              order.push(key);
            }
            groups.get(key)!.push(item);
          }
          // Sort each group by date desc.
          for (const key of order) {
            groups.get(key)!.sort(compareDateDesc);
          }
          // Sort company groups by their most-recent (first) role.
          order.sort((a, b) => {
            const topA = groups.get(a)![0];
            const topB = groups.get(b)![0];
            return compareDateDesc(topA, topB);
          });
          return order.flatMap((key) => groups.get(key)!);
        };

        const customSections: CustomSection[] = (() => {
          // Deduplicate custom sections by title (case-insensitive, trimmed).
          // If the LLM emits multiple sections with the same title, merge their items.
          const bucket = new Map<
            string,
            { title: string; items: ExtractedResume['customSections'][number]['items'] }
          >();
          const order: string[] = [];
          for (const cs of extracted.customSections ?? []) {
            const key = (cs.title ?? '').trim().toLowerCase();
            if (!key) continue;
            if (!bucket.has(key)) {
              bucket.set(key, { title: cs.title, items: [] });
              order.push(key);
            }
            bucket.get(key)!.items.push(...cs.items);
          }
          return order.map((key) => {
            const entry = bucket.get(key)!;
            return {
              id: nanoid(),
              title: entry.title,
              items: sortByEnd(
                entry.items.map((item) => ({
                  id: nanoid(),
                  title: item.title,
                  role: item.role ?? '',
                  startDate: item.startDate ?? '',
                  endDate: item.endDate ?? '',
                  description: item.description,
                }))
              ),
            };
          });
        })();
        const resume: Resume = {
          id: nanoid(),
          name: input.name.trim() || 'Untitled Resume',
          createdAt: now,
          updatedAt: now,
          contact: {
            fullName: extracted.contact?.fullName ?? '',
            email: extracted.contact?.email ?? '',
            phone: extracted.contact?.phone ?? '',
            location: extracted.contact?.location ?? '',
            website: extracted.contact?.website ?? '',
            linkedin: extracted.contact?.linkedin ?? '',
          },
          summary: extracted.summary ?? '',
          experience: groupExperienceByCompany(
            (extracted.experience ?? []).map((e) => ({
              id: nanoid(),
              ...e,
            }))
          ),
          education: [...(extracted.education ?? [])]
            .map((e) => ({
              id: nanoid(),
              ...e,
            }))
            .sort((a, b) =>
              dateKey(b.graduationDate).localeCompare(dateKey(a.graduationDate))
            ),
          certifications: [...(extracted.certifications ?? [])]
            .map((c) => ({
              id: nanoid(),
              ...c,
            }))
            .sort((a, b) =>
              dateKey(b.issueDate).localeCompare(dateKey(a.issueDate))
            ),
          skills: (() => {
            // Deduplicate skills by category (case-insensitive, trimmed).
            // Merge skill lists across duplicate category entries and drop
            // duplicate skill strings within each category.
            const bucket = new Map<
              string,
              { category: string; skills: string[]; seen: Set<string> }
            >();
            const order: string[] = [];
            for (const s of extracted.skills ?? []) {
              const key = (s.category ?? '').trim().toLowerCase();
              if (!key) continue;
              if (!bucket.has(key)) {
                bucket.set(key, {
                  category: s.category,
                  skills: [],
                  seen: new Set(),
                });
                order.push(key);
              }
              const entry = bucket.get(key)!;
              for (const skill of s.skills ?? []) {
                const skillKey = skill.trim().toLowerCase();
                if (!skillKey || entry.seen.has(skillKey)) continue;
                entry.seen.add(skillKey);
                entry.skills.push(skill.trim());
              }
            }
            return order.map((key) => {
              const entry = bucket.get(key)!;
              return {
                id: nanoid(),
                category: entry.category,
                skills: entry.skills,
              };
            });
          })(),
          customSections,
          template: input.template ?? 'fshape',
          sectionOrder: [
            ...DEFAULT_SECTION_ORDER,
            ...customSections.map((cs) => cs.id),
          ],
        };
        return { payload: resume };
      },
    },

    /** Import a resume object as-is (used by the legacy localStorage migration). */
    importResume: (state, action: PayloadAction<Resume>) => {
      adapter.addOne(state, action.payload);
    },

    /**
     * Insert or replace a resume wholesale — used by cloud sync when a newer
     * copy arrives from Supabase. Unlike `importResume`, this overwrites an
     * existing resume with the same id.
     */
    upsertResume: (state, action: PayloadAction<Resume>) => {
      adapter.upsertOne(state, action.payload);
    },

    /** Batch version of `upsertResume` for pulling many resumes at once. */
    upsertResumes: (state, action: PayloadAction<Resume[]>) => {
      adapter.upsertMany(state, action.payload);
    },

    renameResume: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const resume = state.entities[action.payload.id];
      if (resume) {
        resume.name = action.payload.name.trim() || 'Untitled Resume';
        touch(resume);
      }
    },

    duplicateResume: (state, action: PayloadAction<string>) => {
      const source = state.entities[action.payload];
      if (!source) return;
      const now = new Date().toISOString();
      const copy: Resume = {
        ...JSON.parse(JSON.stringify(source)),
        id: nanoid(),
        name: `${source.name} (copy)`,
        createdAt: now,
        updatedAt: now,
      };
      adapter.addOne(state, copy);
    },

    deleteResume: (state, action: PayloadAction<string>) => {
      adapter.removeOne(state, action.payload);
    },

    // ---- Resume-level settings ---------------------------------------------
    setTemplate: (
      state,
      action: PayloadAction<{ id: string; template: TemplateType }>
    ) => {
      const resume = state.entities[action.payload.id];
      if (resume) {
        resume.template = action.payload.template;
        touch(resume);
      }
    },

    reorderSections: (
      state,
      action: PayloadAction<{ id: string; sectionOrder: SectionId[] }>
    ) => {
      const resume = state.entities[action.payload.id];
      if (resume) {
        resume.sectionOrder = action.payload.sectionOrder;
        touch(resume);
      }
    },

    // ---- Contact / summary --------------------------------------------------
    updateContact: (
      state,
      action: PayloadAction<{ id: string; field: keyof Contact; value: string }>
    ) => {
      const resume = state.entities[action.payload.id];
      if (resume) {
        resume.contact[action.payload.field] = action.payload.value;
        touch(resume);
      }
    },

    setSummary: (state, action: PayloadAction<{ id: string; summary: string }>) => {
      const resume = state.entities[action.payload.id];
      if (resume) {
        resume.summary = action.payload.summary;
        touch(resume);
      }
    },

    // ---- Experience ---------------------------------------------------------
    addExperience: (state, action: PayloadAction<{ id: string }>) => {
      const resume = state.entities[action.payload.id];
      if (resume) {
        resume.experience.push({
          id: nanoid(),
          jobTitle: '',
          company: '',
          startDate: '',
          endDate: '',
          currentlyWorking: false,
          description: '',
        });
        touch(resume);
      }
    },
    updateExperience: (
      state,
      action: PayloadAction<{
        id: string;
        itemId: string;
        changes: Partial<Experience>;
      }>
    ) => {
      const resume = state.entities[action.payload.id];
      const item = resume?.experience.find((e) => e.id === action.payload.itemId);
      if (resume && item) {
        Object.assign(item, action.payload.changes);
        touch(resume);
      }
    },
    removeExperience: (
      state,
      action: PayloadAction<{ id: string; itemId: string }>
    ) => {
      const resume = state.entities[action.payload.id];
      if (resume) {
        resume.experience = resume.experience.filter(
          (e) => e.id !== action.payload.itemId
        );
        touch(resume);
      }
    },

    // ---- Education ----------------------------------------------------------
    addEducation: (state, action: PayloadAction<{ id: string }>) => {
      const resume = state.entities[action.payload.id];
      if (resume) {
        resume.education.push({
          id: nanoid(),
          school: '',
          degree: '',
          field: '',
          graduationDate: '',
          details: '',
        });
        touch(resume);
      }
    },
    updateEducation: (
      state,
      action: PayloadAction<{
        id: string;
        itemId: string;
        changes: Partial<Education>;
      }>
    ) => {
      const resume = state.entities[action.payload.id];
      const item = resume?.education.find((e) => e.id === action.payload.itemId);
      if (resume && item) {
        Object.assign(item, action.payload.changes);
        touch(resume);
      }
    },
    removeEducation: (
      state,
      action: PayloadAction<{ id: string; itemId: string }>
    ) => {
      const resume = state.entities[action.payload.id];
      if (resume) {
        resume.education = resume.education.filter(
          (e) => e.id !== action.payload.itemId
        );
        touch(resume);
      }
    },

    // ---- Certifications -----------------------------------------------------
    addCertification: (state, action: PayloadAction<{ id: string }>) => {
      const resume = state.entities[action.payload.id];
      if (resume) {
        resume.certifications.push({
          id: nanoid(),
          title: '',
          issuer: '',
          issueDate: '',
          expiryDate: '',
          credentialId: '',
          credentialUrl: '',
        });
        touch(resume);
      }
    },
    updateCertification: (
      state,
      action: PayloadAction<{
        id: string;
        itemId: string;
        changes: Partial<Certification>;
      }>
    ) => {
      const resume = state.entities[action.payload.id];
      const item = resume?.certifications.find(
        (c) => c.id === action.payload.itemId
      );
      if (resume && item) {
        Object.assign(item, action.payload.changes);
        touch(resume);
      }
    },
    removeCertification: (
      state,
      action: PayloadAction<{ id: string; itemId: string }>
    ) => {
      const resume = state.entities[action.payload.id];
      if (resume) {
        resume.certifications = resume.certifications.filter(
          (c) => c.id !== action.payload.itemId
        );
        touch(resume);
      }
    },

    // ---- Skills (grouped by category) --------------------------------------
    addSkillGroup: (state, action: PayloadAction<{ id: string }>) => {
      const resume = state.entities[action.payload.id];
      if (resume) {
        resume.skills.push({ id: nanoid(), category: '', skills: [] });
        touch(resume);
      }
    },
    updateSkillGroup: (
      state,
      action: PayloadAction<{
        id: string;
        itemId: string;
        changes: Partial<Skill>;
      }>
    ) => {
      const resume = state.entities[action.payload.id];
      const group = resume?.skills.find((s) => s.id === action.payload.itemId);
      if (resume && group) {
        Object.assign(group, action.payload.changes);
        touch(resume);
      }
    },
    removeSkillGroup: (
      state,
      action: PayloadAction<{ id: string; itemId: string }>
    ) => {
      const resume = state.entities[action.payload.id];
      if (resume) {
        resume.skills = resume.skills.filter(
          (s) => s.id !== action.payload.itemId
        );
        touch(resume);
      }
    },
    addSkillToGroup: (
      state,
      action: PayloadAction<{ id: string; itemId: string; skill: string }>
    ) => {
      const value = action.payload.skill.trim();
      if (!value) return;
      const resume = state.entities[action.payload.id];
      const group = resume?.skills.find((s) => s.id === action.payload.itemId);
      if (resume && group) {
        group.skills.push(value);
        touch(resume);
      }
    },
    removeSkillFromGroup: (
      state,
      action: PayloadAction<{ id: string; itemId: string; index: number }>
    ) => {
      const resume = state.entities[action.payload.id];
      const group = resume?.skills.find((s) => s.id === action.payload.itemId);
      if (resume && group) {
        group.skills.splice(action.payload.index, 1);
        touch(resume);
      }
    },

    // ---- Custom sections (user-named, e.g. Projects / Leadership) -----------
    addCustomSection: {
      reducer: (
        state,
        action: PayloadAction<{ id: string; section: CustomSection }>
      ) => {
        const resume = state.entities[action.payload.id];
        if (resume) {
          // Backfill for resumes persisted before custom sections existed.
          resume.customSections ??= [];
          resume.customSections.push(action.payload.section);
          resume.sectionOrder.push(action.payload.section.id);
          touch(resume);
        }
      },
      // The section's id must be stable between customSections and sectionOrder,
      // so generate it here rather than inside the reducer.
      prepare: (input: { id: string; title?: string }) => ({
        payload: {
          id: input.id,
          section: {
            id: nanoid(),
            title: input.title ?? '',
            items: [] as CustomSectionItem[],
          },
        },
      }),
    },
    updateCustomSection: (
      state,
      action: PayloadAction<{
        id: string;
        sectionId: string;
        changes: Partial<Pick<CustomSection, 'title'>>;
      }>
    ) => {
      const resume = state.entities[action.payload.id];
      const section = resume?.customSections?.find(
        (s) => s.id === action.payload.sectionId
      );
      if (resume && section) {
        Object.assign(section, action.payload.changes);
        touch(resume);
      }
    },
    removeCustomSection: (
      state,
      action: PayloadAction<{ id: string; sectionId: string }>
    ) => {
      const resume = state.entities[action.payload.id];
      if (resume) {
        resume.customSections = (resume.customSections ?? []).filter(
          (s) => s.id !== action.payload.sectionId
        );
        resume.sectionOrder = resume.sectionOrder.filter(
          (s) => s !== action.payload.sectionId
        );
        touch(resume);
      }
    },
    addCustomSectionItem: (
      state,
      action: PayloadAction<{ id: string; sectionId: string }>
    ) => {
      const resume = state.entities[action.payload.id];
      const section = resume?.customSections?.find(
        (s) => s.id === action.payload.sectionId
      );
      if (resume && section) {
        section.items.push({
          id: nanoid(),
          title: '',
          role: '',
          startDate: '',
          endDate: '',
          description: '',
        });
        touch(resume);
      }
    },
    updateCustomSectionItem: (
      state,
      action: PayloadAction<{
        id: string;
        sectionId: string;
        itemId: string;
        changes: Partial<CustomSectionItem>;
      }>
    ) => {
      const resume = state.entities[action.payload.id];
      const section = resume?.customSections?.find(
        (s) => s.id === action.payload.sectionId
      );
      const item = section?.items.find((i) => i.id === action.payload.itemId);
      if (resume && item) {
        Object.assign(item, action.payload.changes);
        touch(resume);
      }
    },
    removeCustomSectionItem: (
      state,
      action: PayloadAction<{ id: string; sectionId: string; itemId: string }>
    ) => {
      const resume = state.entities[action.payload.id];
      const section = resume?.customSections?.find(
        (s) => s.id === action.payload.sectionId
      );
      if (resume && section) {
        section.items = section.items.filter(
          (i) => i.id !== action.payload.itemId
        );
        touch(resume);
      }
    },
  },
});

export const {
  createResume,
  createResumeFromExtract,
  importResume,
  upsertResume,
  upsertResumes,
  renameResume,
  duplicateResume,
  deleteResume,
  setTemplate,
  reorderSections,
  updateContact,
  setSummary,
  addExperience,
  updateExperience,
  removeExperience,
  addEducation,
  updateEducation,
  removeEducation,
  addCertification,
  updateCertification,
  removeCertification,
  addSkillGroup,
  updateSkillGroup,
  removeSkillGroup,
  addSkillToGroup,
  removeSkillFromGroup,
  addCustomSection,
  updateCustomSection,
  removeCustomSection,
  addCustomSectionItem,
  updateCustomSectionItem,
  removeCustomSectionItem,
} = resumesSlice.actions;

export const {
  selectAll: selectAllResumes,
  selectById: selectResumeById,
  selectIds: selectResumeIds,
  selectTotal: selectResumeCount,
} = adapter.getSelectors((state: RootState) => state.resumes);

export default resumesSlice.reducer;
