import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { path, referrer } = await req.json();
  if (!path) return NextResponse.json({ ok: false });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // admin이 로그인된 상태면 기록 안 함
  if (user) return NextResponse.json({ ok: true });

  await supabase.from('page_views').insert({ path, referrer: referrer || null });

  return NextResponse.json({ ok: true });
}
