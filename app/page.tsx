// 홈 페이지 — bio, 프로젝트, 로그, 임팩트 수치를 서버에서 패칭해 HomeClient에 전달
import { createClient } from '@/lib/supabase/server';
import HomeClient from '@/components/home/HomeClient';

export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: bioData }, { data: projects }, { data: recentLogs }, { data: impactData }] = await Promise.all([
    supabase.from('site_settings').select('value').eq('key', 'about_bio').single(),
    supabase.from('projects').select('id, title, description, tags, type, status').order('display_order', { ascending: true }),
    supabase.from('logs').select('title, slug, created_at').eq('published', true).order('created_at', { ascending: false }).limit(6),
    supabase.from('site_settings').select('value').eq('key', 'impact_stats').single(),
  ]);

  return (
    <HomeClient
      bio={bioData?.value ?? {}}
      projects={projects ?? []}
      recentLogs={recentLogs ?? []}
      impactStats={Array.isArray(impactData?.value) ? impactData.value : []}
      isAdmin={!!user}
    />
  );
}
