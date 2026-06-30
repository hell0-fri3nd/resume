import { cn } from '@/lib/utils';

interface RichHtmlProps {
  /** HTML (or legacy plain text) produced by the RichTextEditor. */
  html?: string;
  className?: string;
}

/**
 * Renders the limited, self-authored HTML from the RichTextEditor in the DOM.
 * Legacy plain-text values (no markup) preserve their line breaks. The HTML is
 * generated locally by Lexical (formatting tags only — no scripts), so it is
 * safe to inject for the user's own resume preview.
 */
export default function RichHtml({ html, className }: RichHtmlProps) {
  if (!html) return null;

  const looksLikeHtml = /<[a-z][\s\S]*>/i.test(html);

  if (!looksLikeHtml) {
    return <p className={cn('whitespace-pre-wrap', className)}>{html}</p>;
  }

  return (
    <div
      className={cn(
        '[&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5',
        '[&_strong]:font-bold [&_em]:italic [&_u]:underline [&_p]:mb-1',
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
