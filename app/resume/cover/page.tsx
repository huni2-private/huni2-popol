// 자기소개서 인쇄 전용 페이지
import { createClient } from '@/lib/supabase/server';
import CoverPrintClient from './CoverPrintClient';

export default async function CoverPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'cover_letter')
    .single();

  return <CoverPrintClient coverLetter={data?.value ?? { company: '', position: '', sections: [] }} />;
}
