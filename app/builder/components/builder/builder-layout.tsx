'use client';

import ResumeForm from './resume-form';
import ResumePreview from './resume-preview';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Download,
  Eye,
  Edit,
  ArrowLeft
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { FShapePDFTemplate, HarvardPDFTemplate } from '@/lib/pdf-export';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { pdf } from '@react-pdf/renderer';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { renameResume, selectResumeById, setTemplate } from '@/store/slices/resumes-slice';
import { togglePreview } from '@/store/slices/builder-slice';

interface BuilderLayoutProps {
  resumeId: string;
}

export default function BuilderLayout({ resumeId }: BuilderLayoutProps) {
  const dispatch = useAppDispatch();
  const resume = useAppSelector((state) => selectResumeById(state, resumeId))!;
  const isPreview = useAppSelector((state) => state.builder.isPreview);
  const [isExporting, setIsExporting] = useState(false);
  const [title, setTitle] = useState(resume.name);
  const router = useRouter();

  const handleTitleChange = (value: string) => {
    setTitle(value);
    dispatch(renameResume({ id: resumeId, name: value }));
  };

  const handleDownloadPDF = async () => {
    try {
      setIsExporting(true);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const doc =
        resume.template === 'harvard' ? (
          <HarvardPDFTemplate resume={resume} />
        ) : (
          <FShapePDFTemplate resume={resume} />
        );

      const instance = pdf(doc);
      const blob = await instance.toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      a.click();
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('[v0] Failed to export PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleTemplateChange = (template: 'fshape' | 'harvard') => {
    dispatch(setTemplate({ id: resumeId, template }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className=" border-b border-border bg-card sticky top-0 z-50">

        <div className=" w-full md:w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="gap-2 shrink-0 border-border text-foreground hover:bg-muted"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>

              <Image
                src="/letter-r.png"
                alt="R"
                width={30}
                height={30}
                onClick={() => router.push('/')}
                className="hidden sm:block w-8 h-8 object-contain rounded-lg shrink-0 cursor-pointer"
              />

              {/* Editable resume title */}
              <Input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Untitled Resume"
                aria-label="Resume title"
                className="min-w-0 max-w-xs flex-1 border-transparent bg-transparent text-base font-semibold text-foreground hover:border-border focus-visible:border-border focus-visible:bg-background"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 border-r border-border pr-3">

                <span className="text-sm text-muted-foreground">Template:</span>
                <Select
                value={resume.template}
                onValueChange={(value: 'fshape' | 'harvard') => handleTemplateChange(value)}
                >
                  <SelectTrigger className="text-sm bg-background border border-border rounded px-2 py-1 text-foreground">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  
                  <SelectContent>
                    <SelectItem value="fshape">F-Shape</SelectItem>
                    <SelectItem value="harvard">Harvard</SelectItem>
                  </SelectContent>
                </Select>

              </div>
              <Button
                variant={isPreview ? 'default' : 'outline'}
                size="sm"
                onClick={() => dispatch(togglePreview())}
                  className="gap-2 md:hidden" // hide on desktop (md and up)
              >
                {isPreview ? <Edit size={16} /> : <Eye size={16} />}
                <span className="hidden md:inline">{isPreview ? 'Edit' : 'Preview'}</span>
              </Button>
              <Button
                size="sm"
                onClick={handleDownloadPDF}
                disabled={isExporting}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
              >
                <Download size={16} />
                <span className="hidden md:inline">{isExporting ? '' : 'Export PDF'}</span>
                {isExporting && <Spinner />}
              </Button>
            </div>

          </div>

          {/* Mobile Template Selector */}
          <div className="sm:hidden flex items-center gap-2 mt-3 pt-3 border-t border-border">
            <span className="text-sm text-muted-foreground">Template:</span>
            <select
              value={resume.template}
              onChange={(e) =>
                handleTemplateChange(e.target.value as 'fshape' | 'harvard')
              }
              className="text-sm bg-background border border-border rounded px-2 py-1 text-foreground"
            >
              <option value="fshape">F-Shape</option>
              <option value="harvard">Harvard</option>
            </select>
          </div>
        </div>

      </header>

      {/* Main Content */}
      <div className="w-full md:w-[90%] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-0 min-h-[calc(100vh-120px)]">
          {/* Form Section */}
          <div
            className={`border-r border-border overflow-y-auto ${
              isPreview ? 'hidden lg:block' : ''
            }`}
          >
            <ResumeForm resumeId={resumeId} />
          </div>

          {/* Preview Section */}
          <div
            className={`overflow-y-auto bg-muted/100 ${
              !isPreview ? 'hidden lg:block' : ''
            }`}
          >
            <ResumePreview resume={resume} />
          </div>
        </div>
      </div>
    </div>
  );
}
