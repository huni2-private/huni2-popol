import { createClient } from '@/lib/supabase/server';
import HomeClient from '@/components/home/HomeClient';

export default async function Home() {
  const supabase = await createClient();
  const [{ data: bioData }, { data: impactData }] = await Promise.all([
    supabase.from('site_settings').select('value').eq('key', 'about_bio').single(),
    supabase.from('site_settings').select('value').eq('key', 'impact_metrics').single(),
  ]);

  return <HomeClient bio={bioData?.value ?? {}} impactMetrics={impactData?.value ?? []} />;
}
