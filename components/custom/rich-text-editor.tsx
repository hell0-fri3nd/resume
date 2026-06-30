'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getRoot,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  type EditorState,
  type LexicalEditor,
} from 'lexical';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { $getNearestNodeOfType } from '@lexical/utils';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';

/** Tailwind classes Lexical applies to formatted nodes so styling shows live in the editor. */
const editorTheme = {
  paragraph: 'mb-1 last:mb-0',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    underlineStrikethrough: 'underline line-through',
  },
  list: {
    ul: 'list-disc ml-5',
    ol: 'list-decimal ml-5',
    listitem: 'ml-1',
  },
};

/** Escapes a plain-text string and wraps each line in a paragraph for Lexical import. */
function plainTextToHtml(text: string): string {
  return text
    .split(/\r?\n/)
    .map((line) => {
      const escaped = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `<p>${escaped || '<br>'}</p>`;
    })
    .join('');
}

/** Seeds the editor once with the incoming value (HTML, or legacy plain text). */
function InitialValuePlugin({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;

    editor.update(() => {
      const root = $getRoot();
      root.clear();
      if (!value) return;

      const looksLikeHtml = /<[a-z][\s\S]*>/i.test(value);
      const source = looksLikeHtml ? value : plainTextToHtml(value);
      const dom = new DOMParser().parseFromString(source, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);

      root.select();
      $insertNodes(nodes);
    });
  }, [editor, value]);

  return null;
}

type ActiveFormats = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  bullet: boolean;
  number: boolean;
};

function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [formats, setFormats] = useState<ActiveFormats>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    bullet: false,
    number: false,
  });

  const refresh = useCallback(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    const anchorNode = selection.anchor.getNode();
    const listNode =
      $getNearestNodeOfType(anchorNode, ListNode) ??
      $getNearestNodeOfType(anchorNode, ListItemNode);
    let listType: string | null = null;
    if (listNode) {
      const list = $isListNode(listNode)
        ? listNode
        : $getNearestNodeOfType(anchorNode, ListNode);
      listType = list?.getListType() ?? null;
    }

    setFormats({
      bold: selection.hasFormat('bold'),
      italic: selection.hasFormat('italic'),
      underline: selection.hasFormat('underline'),
      strikethrough: selection.hasFormat('strikethrough'),
      bullet: listType === 'bullet',
      number: listType === 'number',
    });
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(refresh);
    });
  }, [editor, refresh]);

  const toggleList = (type: 'bullet' | 'number') => {
    const isActive = type === 'bullet' ? formats.bullet : formats.number;
    if (isActive) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(
        type === 'bullet'
          ? INSERT_UNORDERED_LIST_COMMAND
          : INSERT_ORDERED_LIST_COMMAND,
        undefined
      );
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/40 px-1.5 py-1">
      <Toggle
        size="sm"
        aria-label="Bold"
        pressed={formats.bold}
        onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        aria-label="Italic"
        pressed={formats.italic}
        onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        aria-label="Underline"
        pressed={formats.underline}
        onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
      >
        <Underline className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        aria-label="Strikethrough"
        pressed={formats.strikethrough}
        onPressedChange={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
        }
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <span className="mx-1 h-5 w-px bg-border" aria-hidden />
      <Toggle
        size="sm"
        aria-label="Bullet list"
        pressed={formats.bullet}
        onPressedChange={() => toggleList('bullet')}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        aria-label="Numbered list"
        pressed={formats.number}
        onPressedChange={() => toggleList('number')}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
    </div>
  );
}

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  /** Min height of the editable area (Tailwind class), e.g. "min-h-24". */
  minHeight?: string;
}

/**
 * Lexical-powered rich text editor styled to match the shadcn Textarea.
 * Stores its value as an HTML string; emits '' when visually empty so callers
 * can keep using truthy checks. Legacy plain-text values are imported on mount.
 */
export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing…',
  className,
  minHeight = 'min-h-24',
}: RichTextEditorProps) {
  const initialConfig = {
    namespace: 'resume-description',
    theme: editorTheme,
    nodes: [ListNode, ListItemNode],
    onError: (error: Error) => {
      console.error('[RichTextEditor]', error);
    },
  };

  const handleChange = useCallback(
    (editorState: EditorState, editor: LexicalEditor) => {
      editorState.read(() => {
        const text = $getRoot().getTextContent().trim();
        if (!text) {
          onChange('');
          return;
        }
        onChange($generateHtmlFromNodes(editor, null));
      });
    },
    [onChange]
  );

  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border border-border bg-background',
        'focus-within:ring-2 focus-within:ring-ring/50 focus-within:border-ring',
        className
      )}
    >
      <LexicalComposer initialConfig={initialConfig}>
        <Toolbar />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={cn(
                  'resize-none px-3 py-2 text-sm leading-relaxed outline-none',
                  minHeight
                )}
                aria-placeholder={placeholder}
                placeholder={
                  <div className="pointer-events-none absolute left-3 top-2 select-none text-sm text-muted-foreground">
                    {placeholder}
                  </div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <OnChangePlugin onChange={handleChange} ignoreSelectionChange />
          <InitialValuePlugin value={value} />
        </div>
      </LexicalComposer>
    </div>
  );
}
