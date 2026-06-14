// contact_info 시딩 — node --env-file=.env.local scripts/seed_contact.mjs
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const info = {
  email: 'powerhch@gmail.com',
  github: 'https://github.com/huni2-private',
  linkedin: '',
  twitter: '',
  resume_pdf: '',
  greeting_ko: '커피 한 잔 마시면서 이야기 나눠요. 취업이나 프로젝트 협업 관련 연락 언제나 환영합니다.',
  greeting_en: "Let's grab a coffee and chat. Always open to job opportunities and project collaborations.",
};

const { error } = await supabase
  .from('site_settings')
  .upsert({ key: 'contact_info', value: info }, { onConflict: 'key' });

if (error) {
  console.error('❌', error.message);
} else {
  console.log('✅ contact_info 저장 완료');
  console.log('   이메일:', info.email);
}
