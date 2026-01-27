'use client';

import ResumeForm from './resume-form';
import ResumePreview from './resume-preview';
import Image from 'next/image';
import { useState } from 'react';
import { Resume } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Eye, 
  Edit 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { exportResumeToPDF } from '@/lib/pdf-export';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';

interface BuilderLayoutProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

export default function BuilderLayout({ resume, setResume }: BuilderLayoutProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const router = useRouter();

  const handleDownloadPDF = async () => {
    try {
      setIsExporting(true);
      await new Promise((resolve) => setTimeout(resolve, 100));
      await exportResumeToPDF(resume);
    } catch (error) {
      console.error('[v0] Failed to export PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleTemplateChange = (template: 'fshape' | 'harvard') => {
    setResume({ ...resume, template });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <Button
              variant="link"
              onClick={() => router.push('/')}
              className="text-foreground hover:text-primary transition-colors font-semibold cursor-pointer"
              >
                <span className="flex items-center gap-1">
                  <Image
                    src="/letter-r.png"
                    alt="R"
                    width={20}
                    height={20}
                    className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 object-contain rounded-lg shrink-0"
                  />
                  esume
                </span>
              </Button>
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
                onClick={() => setIsPreview(!isPreview)}
                  className="gap-2 md:hidden" // hide on desktop (md and up)
              >
                {isPreview ? <Edit size={16} /> : <Eye size={16} />}
                {isPreview ? 'Edit' : 'Preview'}
              </Button>
              <Button
                size="sm"
                onClick={handleDownloadPDF}
                disabled={isExporting}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
              >
                <Download size={16} />
                {isExporting ? 'Exporting...' : 'Export PDF'}
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
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[calc(100vh-120px)]">
          {/* Form Section */}
          <div
            className={`border-r border-border overflow-y-auto ${
              isPreview ? 'hidden lg:block' : ''
            }`}
          >
            <ResumeForm resume={resume} setResume={setResume} />
          </div>

          {/* Preview Section */}
          <div
            className={`overflow-y-auto bg-muted/50 ${
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
