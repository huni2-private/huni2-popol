// 홈 페이지 — bio, 프로젝트 수, 최신 로그를 서버에서 패칭해 HomeClient에 전달
import { createClient } from '@/lib/supabase/server';
import HomeClient from '@/components/home/HomeClient';

export default async function Home() {
  const supabase = await createClient();

  const [{ data: bioData }, { count: projectCount }, { data: latestLogs }] = await Promise.all([
    supabase.from('site_settings').select('value').eq('key', 'about_bio').single(),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase
      .from('logs')
      .select('title, slug, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(1),
  ]);

  return (
    <HomeClient
      bio={bioData?.value ?? {}}
      projectCount={projectCount ?? 0}
      latestLog={latestLogs?.[0] ?? null}
    />
  );
}
