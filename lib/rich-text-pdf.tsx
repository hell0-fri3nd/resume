import { Fragment, type ReactNode } from 'react';
import { Text, View } from '@react-pdf/renderer';
import type { Style } from '@react-pdf/types';

/**
 * Renders the limited HTML produced by the resume RichTextEditor
 * (paragraphs, bold/italic/underline/strikethrough spans, and bullet/numbered
 * lists) into @react-pdf/renderer primitives. @react-pdf cannot render raw
 * HTML, so we parse it into block/inline structures and emit Text/View nodes.
 *
 * Text styles (fontSize, fontFamily, color, lineHeight) cascade from the
 * wrapping View to child Text nodes, so callers pass their existing paragraph
 * style and inline tags only layer on weight/style/decoration.
 */

interface InlineFormat {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
}

interface Span extends InlineFormat {
  text: string;
}

type Block =
  | { type: 'paragraph'; spans: Span[] }
  | { type: 'list'; ordered: boolean; items: Span[][] };

const BLOCK_TAGS = new Set(['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

function styleFlags(styleAttr: string, fmt: InlineFormat): InlineFormat {
  const next = { ...fmt };
  if (/text-decoration[^;]*underline/i.test(styleAttr)) next.underline = true;
  if (/text-decoration[^;]*line-through/i.test(styleAttr)) next.strike = true;
  if (/font-weight:\s*(bold|[6-9]00)/i.test(styleAttr)) next.bold = true;
  if (/font-style:\s*italic/i.test(styleAttr)) next.italic = true;
  return next;
}

/** Collects inline text spans (with cumulative formatting) from a DOM node. */
function collectSpans(node: ChildNode, fmt: InlineFormat, out: Span[]): void {
  node.childNodes.forEach((child) => {
    if (child.nodeType === 3 /* text */) {
      const text = child.textContent ?? '';
      if (text) out.push({ text, ...fmt });
      return;
    }
    if (child.nodeType !== 1 /* element */) return;

    const el = child as HTMLElement;
    const tag = el.tagName.toLowerCase();

    if (tag === 'br') {
      out.push({ text: '\n', ...fmt });
      return;
    }

    let next: InlineFormat = { ...fmt };
    if (tag === 'strong' || tag === 'b') next.bold = true;
    if (tag === 'em' || tag === 'i') next.italic = true;
    if (tag === 'u') next.underline = true;
    if (tag === 's' || tag === 'strike' || tag === 'del') next.strike = true;
    next = styleFlags(el.getAttribute('style') ?? '', next);

    collectSpans(el, next, out);
  });
}

function collectBlocks(node: ChildNode, out: Block[]): void {
  if (node.nodeType === 3) {
    const text = node.textContent ?? '';
    if (text.trim()) out.push({ type: 'paragraph', spans: [{ text }] });
    return;
  }
  if (node.nodeType !== 1) return;

  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();

  if (tag === 'ul' || tag === 'ol') {
    const items: Span[][] = [];
    el.querySelectorAll(':scope > li').forEach((li) => {
      const spans: Span[] = [];
      collectSpans(li, {}, spans);
      items.push(spans);
    });
    if (items.length) out.push({ type: 'list', ordered: tag === 'ol', items });
    return;
  }

  if (BLOCK_TAGS.has(tag)) {
    const spans: Span[] = [];
    collectSpans(el, {}, spans);
    out.push({ type: 'paragraph', spans });
    return;
  }

  // Unknown wrapper — treat its inline content as a paragraph.
  const spans: Span[] = [];
  collectSpans(el, {}, spans);
  if (spans.length) out.push({ type: 'paragraph', spans });
}

function htmlToBlocks(html: string): Block[] {
  const trimmed = html?.trim();
  if (!trimmed) return [];

  // Legacy plain text (no markup): split on blank lines into paragraphs.
  if (!/<[a-z][\s\S]*>/i.test(trimmed)) {
    return trimmed
      .split(/\r?\n/)
      .filter((line) => line.trim())
      .map((line) => ({ type: 'paragraph', spans: [{ text: line }] }) as Block);
  }

  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    // SSR fallback: strip tags to plain text.
    const text = trimmed.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return text ? [{ type: 'paragraph', spans: [{ text }] }] : [];
  }

  const doc = new DOMParser().parseFromString(`<body>${trimmed}</body>`, 'text/html');
  const blocks: Block[] = [];
  doc.body.childNodes.forEach((child) => collectBlocks(child, blocks));
  return blocks;
}

function spanStyle(span: Span): Style {
  const style: Style = {};
  if (span.bold) style.fontWeight = 'bold';
  if (span.italic) style.fontStyle = 'italic';
  const deco: string[] = [];
  if (span.underline) deco.push('underline');
  if (span.strike) deco.push('line-through');
  if (deco.length) {
    style.textDecoration = deco.join(' ') as Style['textDecoration'];
  }
  return style;
}

function renderSpans(spans: Span[]): ReactNode {
  if (!spans.length) return '';
  return spans.map((span, i) => {
    if (span.text === '\n') return <Fragment key={i}>{'\n'}</Fragment>;
    const style = spanStyle(span);
    return Object.keys(style).length ? (
      <Text key={i} style={style}>
        {span.text}
      </Text>
    ) : (
      <Fragment key={i}>{span.text}</Fragment>
    );
  });
}

interface RichTextProps {
  /** HTML (or legacy plain text) from the RichTextEditor. */
  html?: string;
  /** Paragraph style applied to the container; cascades to inner Text. */
  style?: Style | Style[];
}

export function RichText({ html, style }: RichTextProps) {
  const blocks = htmlToBlocks(html ?? '');
  if (!blocks.length) return null;

  return (
    <View style={style}>
      {blocks.map((block, bi) => {
        const last = bi === blocks.length - 1;
        const gap = last ? undefined : { marginBottom: 2 };

        if (block.type === 'list') {
          return (
            <View key={bi} style={gap}>
              {block.items.map((item, ii) => (
                <View key={ii} style={{ flexDirection: 'row' }}>
                  <Text style={{ marginRight: 4 }}>
                    {block.ordered ? `${ii + 1}.` : '•'}
                  </Text>
                  <Text style={{ flex: 1 }}>{renderSpans(item)}</Text>
                </View>
              ))}
            </View>
          );
        }

        return (
          <Text key={bi} style={gap}>
            {renderSpans(block.spans)}
          </Text>
        );
      })}
    </View>
  );
}
