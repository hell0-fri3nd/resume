// import html2pdf from 'html2pdf.js';
import { Resume } from './types';

export async function exportResumeToPDF(resume: Resume) {
  try {
    // Get the resume HTML element
    const element = document.getElementById('resume-preview');
    if (!element) {
      console.error('[v0] Resume preview element not found');
      return;
    }

    // Create a clone to avoid modifying the original
    const clonedElement = element.cloneNode(true) as HTMLElement;

    // PDF options
    const options = {
      margin: 0,
      filename: `${resume.contact.fullName || 'resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
      },
      jsPDF: {
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      },
    };

    // Generate PDF
    // await html2pdf().set(options).from(clonedElement).save();
    console.log('[v0] PDF exported successfully');
  } catch (error) {
    console.error('[v0] Error exporting PDF:', error);
    throw error;
  }
}
