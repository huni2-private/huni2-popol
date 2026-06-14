import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';
import Link from 'next/link';
import LogSidebar from '@/components/log/LogSidebar';

export default async function LogDetail({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const supabase = await createClient();

  const [{ data: log }, { data: others }] = await Promise.all([
    supabase.from('logs').select('*').eq('slug', slug).single(),
    supabase
      .from('logs')
      .select('id, slug, title, created_at, tags, content')
      .eq('published', true)
      .neq('slug', slug)
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  if (!log) notFound();

  const readingMinutes = Math.max(1, Math.ceil(log.content.split(' ').length / 200));

  const otherLogs = (others ?? []).map(({ content, ...l }) => ({
    ...l,
    readingMinutes: Math.max(1, Math.ceil(content.split(' ').length / 200)),
  }));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex gap-12 items-start">

        {/* Main article */}
        <article className="min-w-0 flex-1 space-y-8 pb-20">
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

          {/* 모바일: 하단에 다른 글 그리드 */}
          {otherLogs.length > 0 && (
            <div className="lg:hidden border-t border-base-content/10 pt-8 space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-base-content/40">
                다른 글
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {otherLogs.slice(0, 4).map(l => (
                  <Link key={l.id} href={`/log/${l.slug}`} className="block group">
                    <div className="card bg-base-200 border border-base-content/5 hover:border-primary/30 transition-all p-4">
                      <h3 className="text-sm font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {l.title}
                      </h3>
                      <div className="flex items-center gap-3 text-[10px] font-mono text-base-content/40">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(l.created_at).toLocaleDateString('ko-KR', {
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {l.readingMinutes}분
                        </span>
                      </div>
                      {(l.tags ?? []).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(l.tags as string[]).slice(0, 3).map((tag: string) => (
                            <span
                              key={tag}
                              className={`badge badge-xs font-bold ${
                                ((log.tags as string[]) ?? []).includes(tag) ? 'badge-primary' : 'badge-ghost'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/log" className="btn btn-ghost btn-sm rounded-xl text-xs text-base-content/40 hover:text-base-content">
                모든 글 보기 →
              </Link>
            </div>
          )}
        </article>

        {/* 데스크톱 sticky 사이드바 */}
        <LogSidebar logs={otherLogs} currentTags={log.tags ?? []} />
      </div>
    </div>
  );
}
