// 자기소개서 인쇄 전용 페이지 — 어드민만 접근 가능
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CoverPrintClient from './CoverPrintClient';

interface CoverSection { id: string; title: string; content: string; }
interface CoverLetter  { id: string; company: string; position: string; sections: CoverSection[]; isGeneral?: boolean; }
interface CoverMeta    { active_id: string | null; enabled: boolean; }

export default async function CoverPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/resume');

  const [{ data: lettersData }, { data: metaData }] = await Promise.all([
    supabase.from('site_settings').select('value').eq('key', 'cover_letters').single(),
    supabase.from('site_settings').select('value').eq('key', 'cover_letter_meta').single(),
  ]);

  const letters: CoverLetter[] = Array.isArray(lettersData?.value) ? lettersData.value : [];
  const meta = (metaData?.value ?? { active_id: null, enabled: false }) as CoverMeta;
  const active = letters.find(l => l.id === meta.active_id) ?? letters.find(l => l.isGeneral) ?? letters[0] ?? null;

  return <CoverPrintClient letters={letters} initialActive={active} />;
}
