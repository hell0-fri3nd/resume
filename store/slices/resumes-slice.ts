import {
  createEntityAdapter,
  createSlice,
  nanoid,
  type PayloadAction,
} from '@reduxjs/toolkit';
import {
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

    /** Import a resume object as-is (used by the legacy localStorage migration). */
    importResume: (state, action: PayloadAction<Resume>) => {
      adapter.addOne(state, action.payload);
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
  importResume,
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
