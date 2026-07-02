'use client';

import { useEffect, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { Resume } from '@/lib/types';
import { FShapePDFTemplate } from '@/lib/pdf-export/f-shape-template';
import { HarvardPDFTemplate } from '@/lib/pdf-export/harvard-template';

interface PdfPreviewProps {
  resume: Resume;
}

/**
 * Live preview of the EXACT PDF that gets downloaded.
 * The resume is debounced so the document isn't rebuilt on every keystroke.
 */
export default function PdfPreview({ resume }: PdfPreviewProps) {
  const [debounced, setDebounced] = useState<Resume>(resume);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(resume), 400);
    return () => clearTimeout(t);
  }, [resume]);

  const doc =
    debounced.template === 'harvard' ? (
      <HarvardPDFTemplate resume={debounced} />
    ) : (
      <FShapePDFTemplate resume={debounced} />
    );

  return (
    <PDFViewer
      showToolbar
      className="w-full h-full border-0 bg-muted"
      style={{ width: '100%', height: '100%', border: 'none' }}
    >
      {doc}
    </PDFViewer>
  );
}
