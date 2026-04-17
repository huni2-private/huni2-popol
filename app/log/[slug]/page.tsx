import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
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

  return (
    <article className="max-w-3xl mx-auto space-y-8 pb-20">
      <Link href="/log" className="btn btn-ghost btn-sm gap-2">
        <ArrowLeft className="w-4 h-4" /> Back to Logs
      </Link>

      <div className="space-y-4 border-b border-base-content/10 pb-8">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">{log.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm opacity-50 font-mono">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" /> 
            {new Date(log.created_at).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> 
            5 min read
          </span>
        </div>
      </div>

      <div className="prose prose-lg max-w-none 
        prose-headings:font-bold prose-headings:scroll-mt-20
        prose-a:text-primary prose-code:text-secondary
        prose-pre:bg-neutral prose-pre:p-0">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypeSlug,
            [rehypePrettyCode as any, { theme: 'github-dark' }]
          ]}
        >
          {log.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
