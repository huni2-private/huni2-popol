import { createClient } from '@/lib/supabase/server';
import HomeClient from '@/components/home/HomeClient';

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.from('site_settings').select('value').eq('key', 'about_bio').single();

  return <HomeClient bio={data?.value ?? {}} />;
}
