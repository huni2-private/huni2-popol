import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';
import Link from 'next/link';

export default async function LogDetail({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: log } = await supabase
    .from('logs')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!log) notFound();

  const readingMinutes = Math.max(1, Math.ceil(log.content.split(' ').length / 200));

  return (
    <article className="max-w-3xl mx-auto space-y-8 pb-20">
      <Link href="/log" className="btn btn-ghost btn-sm gap-2">
        <ArrowLeft className="w-4 h-4" /> Back to Logs
      </Link>

      <div className="space-y-4 border-b border-base-content/10 pb-8">
        <div className="flex flex-wrap gap-2">
          {log.tags?.map((tag: string) => (
            <span key={tag} className="badge badge-ghost text-xs font-bold">
              <Tag className="w-3 h-3 mr-1" />{tag}
            </span>
          ))}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">{log.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm opacity-50 font-mono">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(log.created_at).toLocaleDateString('ko-KR')}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {readingMinutes}분 읽기
          </span>
        </div>
      </div>

      <div className="prose prose-lg max-w-none
        prose-headings:font-bold prose-headings:scroll-mt-20
        prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-code:text-secondary prose-code:bg-base-200 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-base-200 prose-pre:border prose-pre:border-base-content/10 prose-pre:rounded-xl
        prose-blockquote:border-primary prose-blockquote:text-base-content/70
        prose-table:w-full prose-th:bg-base-200 prose-td:border-base-content/10
        prose-img:rounded-xl prose-hr:border-base-content/10">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug]}
        >
          {log.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
