import { createClient } from '@/lib/supabase/server';
import ImpactClient from '@/components/impact/ImpactClient';

export const metadata = { title: 'Impact | HUNI²' };

export default async function ImpactPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'impact_stats')
    .single();

  return <ImpactClient stats={Array.isArray(data?.value) ? data.value : []} />;
}
