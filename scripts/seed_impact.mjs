// impact_metrics 시딩 — node --env-file=.env.local scripts/seed_impact.mjs
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const metrics = [
  {
    value: '5×',
    label_ko: '업로드 속도 향상',
    label_en: 'Upload Speed Up',
    desc_ko: '글방 — Firestore 청크 5개씩 병렬 저장',
    desc_en: 'Geul-bang — 5-way parallel Firestore chunk writes',
  },
  {
    value: '80%',
    label_ko: '로딩 시간 단축',
    label_en: 'Load Time Reduced',
    desc_ko: 'SK-hynix MAPS — 23만 건 5초 → 1초',
    desc_en: 'SK-hynix MAPS — 230K rows from 5s → 1s',
  },
  {
    value: '6+',
    label_ko: '실서비스 출시',
    label_en: 'Projects Shipped',
    desc_ko: 'TimeSlot · 챗봇 · 글방 · RoundWait · ImagineAX · hunipopol',
    desc_en: 'TimeSlot · Chatbot · Geul-bang · RoundWait · ImagineAX · hunipopol',
  },
  {
    value: '0',
    label_ko: '다운타임 마이그레이션',
    label_en: 'Zero-downtime Migration',
    desc_ko: 'RoundWait — Dual Write로 RTDB 무중단 전환',
    desc_en: 'RoundWait — RTDB migration via dual write strategy',
  },
];

const { error } = await supabase
  .from('site_settings')
  .upsert({ key: 'impact_metrics', value: metrics }, { onConflict: 'key' });

if (error) {
  console.error('❌', error.message);
} else {
  console.log('✅ impact_metrics 저장 완료');
  metrics.forEach(m => console.log(`   ${m.value}  ${m.label_ko}`));
}
