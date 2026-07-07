// 로그 목록 페이지 — tag 쿼리 파라미터로 서버 사이드 필터링 지원
import { createClient } from '@/lib/supabase/server';
import LogListClient from '@/components/log/LogListClient';
import { Tag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; project?: string }>;
}) {
  const { tag, project } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('logs')
    .select('id, slug, title, excerpt, tags, project, category, published, created_at, content')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (tag) query = query.contains('tags', [tag]);
  if (project) query = query.eq('project', project);

  const { data: logs } = await query;

  const logsWithMeta = (logs || []).map(({ content, ...log }) => ({
    ...log,
    readingMinutes: Math.max(1, Math.ceil(content.split(' ').length / 200)),
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold italic">Tech <span className="text-primary underline">Logs</span></h1>
        <p className="text-base-content/70">Insights, tutorials, and troubleshooting notes.</p>
      </div>

      <LogListClient initialLogs={logsWithMeta} activeTag={tag} activeProject={project} />
    </div>
  );
}
