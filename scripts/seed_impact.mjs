// impact_stats 시딩 — node --env-file=.env.local scripts/seed_impact.mjs
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const stats = [
  {
    id: 'upload-speed',
    metric: '5×',
    title: '업로드 속도 향상',
    context: '글방 — Firestore 청크 5개 병렬 처리',
    log_slug: 'geulbang-firestore-chunk-rewrite-2026-05',
  },
  {
    id: 'load-time',
    metric: '80%',
    title: '로딩 시간 단축',
    context: 'SK-hynix MAPS — 23만 건 5s → 1s',
    log_slug: null,
  },
  {
    id: 'projects-shipped',
    metric: '6+',
    title: '실서비스 출시',
    context: 'TimeSlot · 챗봇 · 글방 · RoundWait · ImagineAX · hunipopol',
    log_slug: null,
  },
  {
    id: 'zero-downtime',
    metric: '0',
    title: '다운타임 마이그레이션',
    context: 'RoundWait — Dual Write로 RTDB 무중단 전환',
    log_slug: 'roundwait-firebase-migration-2026-05-06',
  },
];

const { error } = await supabase
  .from('site_settings')
  .upsert({ key: 'impact_stats', value: stats }, { onConflict: 'key' });

if (error) {
  console.error('❌', error.message);
} else {
  console.log('✅ impact_stats 저장 완료');
  stats.forEach(s => console.log(`   ${s.metric}  ${s.title}`));
}
