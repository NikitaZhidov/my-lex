import Markdown from 'react-markdown';

import { cn } from '@/shared/utils';

export interface MarkdownViewProps {
  markdown: string;
  className?: string;
}

export const MarkdownView = ({ markdown, className }: MarkdownViewProps) => {
  return (
    <div className={cn('prose dark:prose-invert', className)}>
      <Markdown>{markdown}</Markdown>
    </div>
  );
};
