import { createClient } from '@/lib/supabase/server';
import ContactClient from '@/components/contact/ContactClient';

export default async function ContactPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('site_settings').select('value').eq('key', 'contact_info').single();

  return <ContactClient info={data?.value ?? {}} />;
}
