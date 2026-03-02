import { CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import {
  InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { EditorState, LexicalEditor } from 'lexical';

import { cn } from '@/shared/utils';

export interface MarkdownEditorProps {
  initialMarkdown: string;
  onChange?: (markdown: string) => void;
  className?: string;
  autoFocus?: boolean;
}

export const MarkdownEditor = ({
  initialMarkdown,
  className,
  onChange,
  autoFocus,
}: MarkdownEditorProps) => {
  const initialConfig: InitialConfigType = {
    namespace: 'markdown-editor',
    editorState: () =>
      $convertFromMarkdownString(initialMarkdown, TRANSFORMERS),
    onError: function (error: Error, editor: LexicalEditor): void {
      console.error(error);
    },
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, CodeNode, LinkNode],
  };

  const onChangeHandler = (editorState: EditorState, editor: LexicalEditor) => {
    editorState.read(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS);
      onChange?.(markdown);
    });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className='edit-container'>
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className={cn('prose dark:prose-invert', className)}
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        {autoFocus && <AutoFocusPlugin />}
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <OnChangePlugin onChange={onChangeHandler} />
      </div>
    </LexicalComposer>
  );
};
