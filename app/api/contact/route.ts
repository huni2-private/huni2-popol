// 포트폴리오 Contact 폼 — 메시지를 Supabase contact_messages 테이블에 저장
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: '필드를 모두 입력해주세요.' }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('contact_messages')
    .insert({ name, email, message });

  if (error) {
    console.error('[contact] supabase error:', error);
    return NextResponse.json({ error: '전송에 실패했습니다.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
