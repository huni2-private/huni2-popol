import { createClient } from '@/lib/supabase/server';
import AboutClient from '@/components/about/AboutClient';

export default async function AboutPage() {
  const supabase = await createClient();

  const [{ data: bioData }, { data: careerData }, { data: stackData }, { data: projects }] = await Promise.all([
    supabase.from('site_settings').select('value').eq('key', 'about_bio').single(),
    supabase.from('site_settings').select('value').eq('key', 'career_timeline').single(),
    supabase.from('site_settings').select('value').eq('key', 'tech_stack').single(),
    supabase.from('projects').select('title, project_key'),
  ]);

  return (
    <AboutClient
      bio={bioData?.value ?? {}}
      career={careerData?.value ?? []}
      stack={stackData?.value ?? []}
      projects={projects ?? []}
    />
  );
}
