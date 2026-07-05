// impact_stats 시딩 — node --env-file=.env.local scripts/seed_impact.mjs
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const stats = [
  // ── RoundWait ──────────────────────────────────────────────────────
  {
    id: 'rw-load-test',
    project: 'RoundWait',
    metric: '99.94%',
    title: '1만 명 예약 성공률',
    before: 'SLO 목표: ≥ 99%',
    after: '99.94% 달성 — 예약 처리 평균 0.26초',
    context: '마비노기 Fantasy Party 2026 대비 Cloud Run k6 부하 테스트',
    log_slug: 'roundwait-10k-load-test',
  },
  {
    id: 'rw-delete-bug',
    project: 'RoundWait',
    metric: 'Crash → 0',
    title: '회원 재가입 충돌 버그 제거',
    before: '탈퇴 후 동일 번호 재가입 시 로그인 실패',
    after: 'GORM Unscoped + 번호 아카이빙으로 안정화',
    context: '16개 파일 +706줄, 테스트 케이스 포함',
    log_slug: 'roundwait-delete-user-reregister-bug-2026-06-24',
  },
  {
    id: 'rw-migration',
    project: 'RoundWait',
    metric: '0 다운타임',
    title: 'Firebase RTDB 무중단 마이그레이션',
    before: '실시간 처리 한계로 마이그레이션 필요',
    after: 'Dual Write 전략으로 무중단 전환 완료',
    context: '5/18 기반 작업 시작 → 6/3 기능 구현 완료',
    log_slug: 'roundwait-firebase-migration-2026-05-06',
  },
  // ── SalesPulse ─────────────────────────────────────────────────────
  {
    id: 'sp-vip-notify',
    project: 'SalesPulse',
    metric: '5~10분 → 즉시',
    title: 'VIP 체크인 알림 지연 해소',
    before: '수동 전달로 5~10분 지연',
    after: '비동기 알림톡 자동 발송, 지연 0',
    context: 'IMAGINE AX 2026 행사 실전 검증',
    log_slug: 'salespulse-vip-dashboard-imagine-ax',
  },
  // ── Timeslot ───────────────────────────────────────────────────────
  {
    id: 'ts-kakao-inapp',
    project: 'Timeslot',
    metric: '즉석 패치',
    title: '카카오 인앱 예약 불가 → 현장 대응',
    before: '카카오톡 링크 진입자 예약 완료 불가',
    after: '/open 페이지로 외부 브라우저 유도, 당일 배포',
    context: '아주대 전공멘토링 행사 당일 긴급 패치',
    log_slug: 'timeslot-ajou-mentoring-2026',
  },
  {
    id: 'ts-analytics',
    project: 'Timeslot',
    metric: 'Analytics',
    title: '행사 데이터 분석 Dashboard 추가',
    before: '행사 종료 후 데이터 분석 수단 없음',
    after: '시간대별 차트 + PNG/Excel 내보내기',
    context: 'dom-to-image-more 기반 PNG 캡처 포함',
    log_slug: 'timeslot-ajou-mentoring-2026',
  },
  // ── Chatbot ────────────────────────────────────────────────────────
  {
    id: 'cb-realtime',
    project: 'Chatbot',
    metric: 'AI → 실시간',
    title: '실시간 상담 시스템 고도화',
    before: 'AI 자동응답 기반 단방향 챗봇',
    after: '타이핑 인디케이터 + 파일첨부 + SSO + 이메일 답장',
    context: '옵티미스틱 UI로 상담원 답장 속도 개선',
    log_slug: 'congkong-weekly-log-2026-05-05',
  },
  {
    id: 'cb-stibee',
    project: 'Chatbot',
    metric: '자동화',
    title: '스티비 이메일 자동화 연동',
    before: '채팅 폼 완료 후 수동 이메일 발송',
    after: 'Firestore 트리거 기반 자동 발송 (채팅 속도 무영향)',
    context: '주소록 등록 + 자동이메일 트리거 분리 호출',
    log_slug: 'chatbot-stibee-sso-2026-05',
  },
  // ── 글방 ───────────────────────────────────────────────────────────
  {
    id: 'gb-firestore-chunk',
    project: '글방',
    metric: '5× 업로드',
    title: 'Firebase Storage → Firestore 청크 전환',
    before: 'Storage 권한오류·CORS·30MB 제한',
    after: '청크 5개 병렬 처리, 순차 대비 5배 속도',
    context: 'Storage 의존성 완전 제거 + PWA 오프라인 지원',
    log_slug: 'geulbang-firestore-chunk-rewrite-2026-05',
  },
  // ── ImagineAX ──────────────────────────────────────────────────────
  {
    id: 'iax-landing',
    project: 'ImagineAX',
    metric: '단독 개발',
    title: 'Figma 시안 → Next.js 정적 배포',
    before: 'Figma 시안만 존재',
    after: 'Firebase Hosting 정적 배포, Hero 버그 3종 해결',
    context: '행사 전까지 10회 이상 콘텐츠 업데이트 반영',
    log_slug: 'imagineax-2026-landing-page',
  },
  // ── BLE미들웨어 ────────────────────────────────────────────────────
  {
    id: 'ble-mvp',
    project: 'BLE미들웨어',
    metric: '신규 구축',
    title: 'BLE 체크인 미들웨어 MVP',
    before: '게이트웨이 직접 COP API 호출 (디바운싱 없음)',
    after: 'Redis 30초 디바운싱 + 지수 백오프 3회 재시도',
    context: 'Go + Redis, 고루틴 기반 무제한 동시 접속',
    log_slug: 'ble-checkin-middleware-mvp-2026-07-02',
  },
  // ── hunipopol ──────────────────────────────────────────────────────
  {
    id: 'hp-launch',
    project: 'hunipopol',
    metric: '4일 배포',
    title: '포트폴리오 사이트 초기 구축',
    before: '개발 기록 공개 공간 없음',
    after: 'Next.js 16 + Supabase CMS + Vercel 자동 배포',
    context: '마크다운 블로그 + Admin CMS + i18n 포함',
    log_slug: 'huni2-portfolio-site-launch',
  },
];

const { error } = await supabase
  .from('site_settings')
  .upsert({ key: 'impact_stats', value: stats }, { onConflict: 'key' });

if (error) {
  console.error('❌', error.message);
  process.exit(1);
} else {
  console.log(`✅ impact_stats ${stats.length}건 저장 완료`);
  stats.forEach(s => console.log(`   [${s.project ?? '—'}] ${s.metric}  ${s.title}`));
}
