# Resume Builder

A production-ready resume builder built with Next.js. The app helps users create, manage, preview, and export ATS-friendly resumes using professional templates.

## Live Demo

Vercel deployment: [https://resume-builder-demo.vercel.app](https://resume-builder-demo.vercel.app)

> Temporary placeholder link. Replace this URL after the real Vercel deployment is available.

## Overview

Resume Builder is a client-focused web application for creating polished resumes without manual formatting work. Users can start from curated templates, fill out structured resume sections, preview the final result, manage multiple resumes, and export a PDF for job applications.

The project is designed as a modern Next.js application with reusable UI components, typed resume models, persistent local state, and PDF generation support.

## Features

- Landing page for introducing the resume builder and available templates
- Dashboard for creating, viewing, editing, and managing resumes
- Resume builder with editable sections for contact information, summary, experience, education, certifications, and skills
- Live resume preview while editing
- Template selection with F-Shape and Harvard resume layouts
- Section ordering support for flexible resume structure
- PDF export powered by React PDF
- Local state management with Redux Toolkit and persistence
- Responsive UI built with Tailwind CSS and reusable component primitives

## Tech Stack

- [Next.js](https://nextjs.org/) 16
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Redux](https://react-redux.js.org/)
- [redux-persist](https://github.com/rt2zz/redux-persist)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [React PDF](https://react-pdf.org/)
- [Radix UI](https://www.radix-ui.com/) primitives
- [Lucide React](https://lucide.dev/) icons

## Getting Started

### Prerequisites

Use a current Node.js runtime compatible with Next.js 16. Node.js 20 or later is recommended.

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

## Available Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run build
```

Creates an optimized production build.

```bash
npm run start
```

Runs the production server after a successful build.

```bash
npm run lint
```

Runs ESLint across the project.

## Project Structure

```text
app/
  builder/              Resume builder pages and builder-specific UI
  dashboard/            Resume management dashboard
  components/landing/   Landing page sections
  globals.css           Global styles
components/
  custom/               Project-specific reusable components
  ui/                   Shared UI primitives
hooks/                  Shared React hooks
lib/
  pdf-export.tsx        PDF templates and export rendering
  types.ts              Resume domain models and factories
  utils.ts              Shared utility functions
public/                 Static assets and icons
store/
  slices/               Redux state slices
  hooks.ts              Typed Redux hooks
  provider.tsx          Store provider setup
```

## Core Routes

- `/` - Landing page
- `/dashboard` - Resume dashboard
- `/builder` - Resume creation flow
- `/builder/[id]` - Resume editor for a specific resume

## Resume Data Model

The application models each resume with structured sections:

- Contact information
- Professional summary
- Work experience
- Education
- Certifications
- Skills
- Template preference
- Section order

This structure keeps the editing experience predictable and makes it easier to render consistent previews and PDF exports.

## Deployment

This project is ready to deploy on Vercel.

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Import the project in [Vercel](https://vercel.com/new).
3. Use the default Next.js framework settings.
4. Deploy the app.
5. Replace the temporary demo URL in this README with the generated production URL.

Current placeholder deployment URL:

```text
https://resume-builder-demo.vercel.app
```

## Quality Checklist

Before shipping changes, run:

```bash
npm run lint
npm run build
```

These commands help catch type, lint, and production build issues before deployment.

## License

This project is currently private. Add a license before making the repository public or accepting external contributions.
