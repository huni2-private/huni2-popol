// about_bio 시딩 — node --env-file=.env.local scripts/seed_about.mjs
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const bio = {
  title_ko: 'SK-하이닉스 MAPS, 23만 건 로딩을 5s→1s로. Next.js로 실서비스 6개를 만들고 운영합니다.',
  title_en: '5s→1s on 230K rows at SK-hynix MAPS. Shipped 6 live services with Next.js.',
  desc_ko: '실무에서 측정된 성과(로딩 80% 단축, 업로드 5× 향상)와 사이드에서 직접 기획·배포한 6개 실서비스. 기능 구현을 넘어 성능과 사용성까지 책임지는 프론트엔드 개발자입니다.',
  desc_en: 'Measured outcomes at work: 80% faster load, 5× upload speed. On the side: 6 live services built and shipped solo — from concept to production. A frontend developer who owns the outcome, not just the code.',
};

const { error } = await supabase
  .from('site_settings')
  .upsert({ key: 'about_bio', value: bio }, { onConflict: 'key' });

if (error) {
  console.error('❌', error.message);
} else {
  console.log('✅ about_bio 저장 완료');
  console.log('   KO:', bio.title_ko);
  console.log('   EN:', bio.title_en);
}
