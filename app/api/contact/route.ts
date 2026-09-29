// 포트폴리오 Contact 폼 — 메시지를 Supabase contact_messages 테이블에 저장
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LEN = 100;
const MAX_EMAIL_LEN = 254;
const MAX_MESSAGE_LEN = 5000;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: '요청 형식이 올바르지 않습니다.' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: '필드를 모두 입력해주세요.' }, { status: 400 });
  }

  const { name, email, message } = body as Record<string, unknown>;

  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return NextResponse.json({ error: '필드를 모두 입력해주세요.' }, { status: 400 });
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  if (!trimmedName || !trimmedEmail || !trimmedMessage) {
    return NextResponse.json({ error: '필드를 모두 입력해주세요.' }, { status: 400 });
  }
  if (trimmedName.length > MAX_NAME_LEN || trimmedEmail.length > MAX_EMAIL_LEN || trimmedMessage.length > MAX_MESSAGE_LEN) {
    return NextResponse.json({ error: '입력 길이가 너무 깁니다.' }, { status: 400 });
  }
  if (!EMAIL_RE.test(trimmedEmail)) {
    return NextResponse.json({ error: '이메일 형식이 올바르지 않습니다.' }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('contact_messages')
    .insert({ name: trimmedName, email: trimmedEmail, message: trimmedMessage });

  if (error) {
    console.error('[contact] supabase error:', error);
    return NextResponse.json({ error: '전송에 실패했습니다.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
