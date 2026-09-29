import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import ContactClient from '@/components/contact/ContactClient';

export const metadata: Metadata = {
  title: '연락하기 | HUNI²',
  description: '취업이나 프로젝트 협업 관련 연락은 언제나 환영합니다.',
};

export default async function ContactPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('site_settings').select('value').eq('key', 'contact_info').single();

  return <ContactClient info={data?.value ?? {}} />;
}
