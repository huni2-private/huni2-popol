// 로그 목록 페이지 — tag 쿼리 파라미터로 서버 사이드 필터링 지원
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import LogListClient from '@/components/log/LogListClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dev Log | HUNI²',
  description: '실무·사이드 프로젝트를 만들며 겪은 문제와 해결 과정을 기록한 개발 로그.',
};

export default async function LogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; project?: string }>;
}) {
  const { tag, project } = await searchParams;
  const supabase = await createClient();

  // tag·project는 초기 선택 상태로만 쓰고 목록 자체는 항상 전체를 내려준다 —
  // 서버에서 미리 걸러버리면 클라이언트의 "All" 버튼이 원래 데이터를 복원할 수 없다.
  const query = supabase
    .from('logs')
    .select('id, slug, title, excerpt, tags, project, category, published, created_at, content')
    .eq('published', true)
    .order('created_at', { ascending: false });

  const [{ data: logs }, { data: impactData }] = await Promise.all([
    query,
    supabase.from('site_settings').select('value').eq('key', 'impact_stats').single(),
  ]);

  const logsWithMeta = (logs || []).map(({ content, ...log }) => ({
    ...log,
    readingMinutes: Math.max(1, Math.ceil(content.split(' ').length / 200)),
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <LogListClient
        initialLogs={logsWithMeta}
        activeTag={tag}
        activeProject={project}
        impactStats={Array.isArray(impactData?.value) ? impactData.value : []}
      />
    </div>
  );
}
