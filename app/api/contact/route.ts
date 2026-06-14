// 포트폴리오 Contact 폼 이메일 전송 — Resend API 사용
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const TO_EMAIL = 'powerhch@gmail.com';

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY가 설정되지 않았습니다.' }, { status: 500 });
  }

  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: '필드를 모두 입력해주세요.' }, { status: 400 });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: 'Portfolio Contact <onboarding@resend.dev>',
    to: TO_EMAIL,
    replyTo: email,
    subject: `[포트폴리오] ${name}님의 메시지`,
    text: `이름: ${name}\n이메일: ${email}\n\n${message}`,
  });

  if (error) {
    console.error('[contact] resend error:', error);
    return NextResponse.json({ error: '전송에 실패했습니다.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
