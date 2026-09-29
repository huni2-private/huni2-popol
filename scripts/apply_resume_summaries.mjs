// projects.resume_summary 일괄 반영 — description 근거로 작성한 이력서 전용 한 줄 요약
// 사전 조건: supabase/migration_resume_summary.sql을 Supabase 대시보드에서 먼저 실행할 것
// node --env-file=.env.local scripts/apply_resume_summaries.mjs
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('❌ 환경변수 누락. 실행 방법: node --env-file=.env.local scripts/apply_resume_summaries.mjs');
  process.exit(1);
}

const supabase = createClient(url, key);

const summaries = {
  'RentalBrain':  '기업 고객(B2B) 렌탈 자산의 AS·정기점검·연체 관리를 판단 기준 기반으로 자동 추적하는 CRM형 ERP.',
  'Algo':         '알고리즘 풀이에 AI 피드백과 포인트·등급 게이미피케이션을 더해 학습 지속을 돕는 개발 취준생 통합 학습 플랫폼.',
  'TimeSlot':     '컨퍼런스·세미나 참가자 예약부터 현장 체크인·관제까지 처리하는 eventSlug 기반 멀티테넌트 행사 예약 운영 플랫폼.',
  'RoundWait':    '행사장 대기열 등록·실시간 순번 확인·호출·입장 처리 서비스. 대규모 동시 접속 부하를 Firebase RTDB 미러 계층으로 재구축.',
  'MAPS':         'SK하이닉스 반도체 공장의 BLE AP·자산 위치를 도면 위에 실시간 표시하는 자산관리 모니터링 시스템.',
  'Klume':        '조직 단위 회의실 예약을 권한별로 관리하고 사용 현황을 시각화해 예약 충돌을 방지하는 시스템.',
  'SympoStudio':  '제약 심포지엄의 아젠다·브랜드 컬러를 구조화된 데이터로 관리하고 WCAG 대비비 실측 게이트로 접근성을 강제하는 마이크로사이트 스튜디오.',
  '글방':          '한국 웹소설 .txt 파일을 업로드하면 기기와 무관하게 이어읽기가 가능한 개인용 웹소설 클라우드 리더.',
  'CorpBlog':     'CongKong Event OS의 마케팅 사이트이자, 비개발자가 Google OAuth로 로그인해 콘텐츠를 CRUD·발행하는 관리자 포털.',
  'AIDevTeam':    'Claude Code 단독 개발 시 역할 혼재·설계 없는 구현 반복을 막기 위해 PM·설계·구현·검증 페르소나를 CLAUDE.md로 강제하는 개발 워크플로우 프레임워크.',
  'ImagineAX':    "SK AX의 오프라인 컨퍼런스 'IMAGINE AX 2026'을 위한 초대 랜딩 페이지. Figma 디자인 100% 재현이 목표였던 정적 사이트.",
  'hunipopol':    '포트폴리오·개발일지·임팩트 수치·이력서를 브라우저에서 직접 관리하는 개인 CMS 포트폴리오 사이트. 외부 서비스 의존 없이 콘텐츠를 소유하는 게 목적.',
  'BLE미들웨어':    '행사장 BLE 비콘 기반 출입·체크인 원시 데이터를 필터링·중복 제거해 체크인 이벤트로 정제하는 중계 서버.',
  'Chatbot':      '웹사이트에 스크립트 한 줄로 삽입하는 멀티테넌트 SaaS 라이브채팅 위젯. AI/RAG 자동 응답과 상담사 개입을 함께 지원.',
  'FireWatch':    '증권·환율·뉴스를 매일 아침 자동으로 확인해 브리핑하는 개인용 자동화 시스템.',
  'PetRAG':       'NCP CLOVA Studio 기반 RAG로 반려동물 훈육·행동교정 지식을 검색해 답하는 상담 챗봇.',
  'PetitPet':     '반려동물의 나이·체중·증상을 입력하면 AI가 훈육·건강 상담을 해주는 4인 팀 프로젝트. Docker 배포 안정화와 프론트엔드 버그 픽스를 담당.',
  // SalesPulse는 project_key가 DB에 없어 title로 매칭
};

const titleSummaries = {
  'SalesPulse(VIP 세일즈 대시보드)': 'VIP 체크인 후 담당 영업사원에게 수동으로 전달하던 지연을 없애기 위해 기존 체크인 플랫폼에 통합한 알림 대시보드 모듈.',
};

const { data: projects, error } = await supabase
  .from('projects')
  .select('id, title, project_key');

if (error) {
  console.error('❌ 프로젝트 조회 실패:', error.message);
  process.exit(1);
}

let updated = 0;
let skipped = [];

for (const p of projects) {
  const summary = (p.project_key && summaries[p.project_key]) || titleSummaries[p.title];
  if (!summary) {
    skipped.push(p.title);
    continue;
  }
  const { error: updateError } = await supabase
    .from('projects')
    .update({ resume_summary: summary })
    .eq('id', p.id);
  if (updateError) {
    console.error(`❌ ${p.title}:`, updateError.message);
    continue;
  }
  console.log(`✓ ${p.title}`);
  updated++;
}

console.log(`\n${updated}개 반영 완료.`);
if (skipped.length > 0) {
  console.log(`건너뜀 (근거 없음 / 매칭 실패): ${skipped.join(', ')}`);
}
