import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import AboutClient from '@/components/about/AboutClient';

export const metadata: Metadata = {
  title: '소개 | HUNI²',
  description: '측정하고, 개선하고, 배포하는 백엔드 중심 풀스택 개발자 허창훈의 커리어·기술 스택 소개.',
};

export default async function AboutPage() {
  const supabase = await createClient();

  const [{ data: bioData }, { data: careerData }, { data: stackData }, { data: educationData }, { data: projects }] = await Promise.all([
    supabase.from('site_settings').select('value').eq('key', 'about_bio').single(),
    supabase.from('site_settings').select('value').eq('key', 'career_timeline').single(),
    supabase.from('site_settings').select('value').eq('key', 'tech_stack').single(),
    supabase.from('site_settings').select('value').eq('key', 'education').single(),
    supabase.from('projects').select('title, project_key'),
  ]);

  return (
    <AboutClient
      bio={bioData?.value ?? {}}
      career={careerData?.value ?? []}
      stack={stackData?.value ?? []}
      education={educationData?.value ?? []}
      projects={projects ?? []}
    />
  );
}
