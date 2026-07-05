// 이력서 인쇄 전용 페이지 — Supabase 데이터를 서버에서 패칭해 렌더링
import { createClient } from '@/lib/supabase/server';
import ResumePrintClient from './ResumePrintClient';

export default async function ResumePage() {
  const supabase = await createClient();

  const [
    { data: bioData },
    { data: careerData },
    { data: stackData },
    { data: impactData },
    { data: projects },
    { data: contactData },
  ] = await Promise.all([
    supabase.from('site_settings').select('value').eq('key', 'about_bio').single(),
    supabase.from('site_settings').select('value').eq('key', 'career_timeline').single(),
    supabase.from('site_settings').select('value').eq('key', 'tech_stack').single(),
    supabase.from('site_settings').select('value').eq('key', 'impact_stats').single(),
    supabase.from('projects').select('id, title, description, tags, type, status').order('display_order', { ascending: true }),
    supabase.from('site_settings').select('value').eq('key', 'contact_info').single(),
  ]);

  return (
    <ResumePrintClient
      bio={bioData?.value ?? {}}
      career={Array.isArray(careerData?.value) ? careerData.value : []}
      stack={Array.isArray(stackData?.value) ? stackData.value : []}
      impactStats={Array.isArray(impactData?.value) ? impactData.value : []}
      projects={projects ?? []}
      contact={contactData?.value ?? {}}
    />
  );
}
