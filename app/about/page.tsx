import { createClient } from '@/lib/supabase/server';
import AboutClient from '@/components/about/AboutClient';

export default async function AboutPage() {
  const supabase = await createClient();

  const [{ data: bioData }, { data: careerData }, { data: stackData }] = await Promise.all([
    supabase.from('site_settings').select('value').eq('key', 'about_bio').single(),
    supabase.from('site_settings').select('value').eq('key', 'career_timeline').single(),
    supabase.from('site_settings').select('value').eq('key', 'tech_stack').single(),
  ]);

  return (
    <AboutClient
      bio={bioData?.value ?? {}}
      career={careerData?.value ?? []}
      stack={stackData?.value ?? []}
    />
  );
}
