// 이력서 인쇄 전용 페이지 — Supabase 데이터를 서버에서 패칭해 렌더링
import { createClient } from '@/lib/supabase/server';
import ResumePrintClient from './ResumePrintClient';

interface CoverSection { id: string; title: string; content: string; }
interface CoverLetter  { id: string; company: string; position: string; sections: CoverSection[]; isGeneral?: boolean; }
interface CoverMeta    { active_id: string | null; enabled: boolean; }

export default async function ResumePage() {
  const supabase = await createClient();

  const [
    { data: { user } },
    { data: bioData },
    { data: careerData },
    { data: stackData },
    { data: educationData },
    { data: impactData },
    { data: projects },
    { data: contactData },
    { data: coverLettersData },
    { data: coverMetaData },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from('site_settings').select('value').eq('key', 'about_bio').single(),
    supabase.from('site_settings').select('value').eq('key', 'career_timeline').single(),
    supabase.from('site_settings').select('value').eq('key', 'tech_stack').single(),
    supabase.from('site_settings').select('value').eq('key', 'education').single(),
    supabase.from('site_settings').select('value').eq('key', 'impact_stats').single(),
    supabase.from('projects').select('id, title, description, tags, type, status, project_url, github_url, project_key').eq('show_in_resume', true).order('display_order', { ascending: true }),
    supabase.from('site_settings').select('value').eq('key', 'contact_info').single(),
    supabase.from('site_settings').select('value').eq('key', 'cover_letters').single(),
    supabase.from('site_settings').select('value').eq('key', 'cover_letter_meta').single(),
  ]);

  const isAdmin = !!user;

  // 어드민 + enabled + active_id가 있을 때만 자기소개서 표시
  let activeCoverLetter: CoverLetter | null = null;
  if (isAdmin) {
    const meta = (coverMetaData?.value ?? {}) as CoverMeta;
    if (meta.enabled) {
      const letters = Array.isArray(coverLettersData?.value) ? (coverLettersData.value as CoverLetter[]) : [];
      activeCoverLetter = letters.find(l => l.id === meta.active_id) ?? letters.find(l => l.isGeneral) ?? null;
    }
  }

  return (
    <ResumePrintClient
      bio={bioData?.value ?? {}}
      career={Array.isArray(careerData?.value) ? careerData.value : []}
      stack={Array.isArray(stackData?.value) ? stackData.value : []}
      education={Array.isArray(educationData?.value) ? educationData.value : []}
      impactStats={Array.isArray(impactData?.value) ? impactData.value : []}
      projects={projects ?? []}
      contact={contactData?.value ?? {}}
      isAdmin={isAdmin}
      coverLetter={activeCoverLetter}
    />
  );
}
