// 프로젝트 상세 — 문제→원인→해결→결과를 인시던트 포스트모템 타임라인으로 보여준다.
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { PostmortemKind, PostmortemSection } from '@/lib/postmortem';

const KIND_META: Record<PostmortemKind, { label: string; dot: string; text: string }> = {
  context: { label: 'OVERVIEW', dot: 'bg-base-content/30', text: 'text-base-content/50' },
  process: { label: 'ROOT CAUSE → FIX', dot: 'bg-warning', text: 'text-warning' },
  stack: { label: 'STACK DECISION', dot: 'bg-info', text: 'text-info' },
  result: { label: 'RESULT', dot: 'bg-success', text: 'text-success' },
  learned: { label: 'RETRO', dot: 'bg-secondary', text: 'text-secondary' },
  role: { label: 'OWNERSHIP', dot: 'bg-primary', text: 'text-primary' },
  other: { label: 'NOTES', dot: 'bg-base-content/20', text: 'text-base-content/40' },
};

const PROSE_CLASS = `prose prose-sm max-w-none text-base-content/70
  prose-headings:text-base-content prose-headings:font-bold
  prose-code:bg-base-300 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-primary prose-code:text-xs prose-code:before:content-none prose-code:after:content-none
  prose-pre:bg-base-300 prose-pre:rounded-xl
  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
  prose-strong:text-base-content
  prose-li:marker:text-primary`;

export default function PostmortemTimeline({ sections }: { sections: PostmortemSection[] }) {
  return (
    <div className="space-y-0">
      {sections.map((section, i) => {
        const meta = KIND_META[section.kind];
        const isLast = i === sections.length - 1;
        return (
          <div key={section.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ring-4 ring-base-100 ${meta.dot}`} />
              {!isLast && <span className="w-px flex-1 bg-base-content/10" />}
            </div>
            <div className={`min-w-0 flex-1 space-y-2 ${isLast ? 'pb-0' : 'pb-6'}`}>
              <div className="flex flex-wrap items-baseline gap-2 font-mono text-[10px] font-bold uppercase tracking-widest">
                <span className={meta.text}>{meta.label}</span>
                <span className="text-base-content/20">/</span>
                <span className="normal-case tracking-normal text-base-content/40">{section.rawTitle}</span>
              </div>
              <div className="rounded-2xl border border-base-content/10 bg-base-200/60 p-5">
                <div className={PROSE_CLASS}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.body}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
