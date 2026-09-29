// 신규 프로젝트 카드 시딩 — FireWatch / SYMPO STUDIO / PetRAG / PetitPet
// node --env-file=.env.local scripts/seed_projects_2026_08.mjs
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('❌ 환경변수 누락. 실행 방법: node --env-file=.env.local scripts/seed_projects_2026_08.mjs');
  process.exit(1);
}

const supabase = createClient(url, key);

const projects = [
  {
    title: 'FireWatch — 매일 아침 자동 브리핑 시스템',
    project_key: 'FireWatch',
    description: `## 왜 만들었나

매일 아침 증권 앱·환율 사이트·뉴스를 일일이 확인하는 반복 작업을 자동화하고 싶었다.

## 핵심 선택

- **Kotlin + Spring Boot WebFlux** — 스케줄러의 안정적 반복 실행
- **AuditLogAspect (Spring AOP)** — 스케줄러·외부 API 호출·푸시 발송 전 구간을 가로채 SUCCESS/WARNING/FALLBACK/FAILURE 4개 상태로 자동 기록. 비즈니스 로직에 로깅 코드를 흩뿌리지 않는다
- **bkit PDCA** — Plan/Design을 먼저 문서화하고 하루 만에 백엔드+웹 MVP 완성
- **$0 운영 원칙** — Gemini 무료 티어 한계(Search Grounding 할당량 0)에 맞춰 모델을 3종 실측 교체, Render 무료 티어 + GitHub Actions로 슬립 우회

## 결과

8/19 계획부터 8/24 웹 푸시까지 나흘 반 만에 백엔드-웹-모바일(Expo)-알림 채널(FCM+웹 푸시)까지 갖췄다.`,
    type: 'personal',
    status: 'live',
    tags: ['Kotlin', 'Spring Boot', 'WebFlux', 'Gemini', 'React'],
    project_url: 'https://firewatch-eqp.pages.dev',
    github_url: null,
    pdf_url: null,
    display_order: 32,
  },
  {
    title: 'SYMPO STUDIO — 제약 심포지엄 마이크로사이트 스튜디오',
    project_key: 'SympoStudio',
    description: `## 왜 만들었나

제약 심포지엄 대행 업무를 하며 겪은 문제를 처음부터 다시 설계했다. 브랜드 컬러가 이미지로만 전달되고, 아젠다가 바뀔 때마다 이미지를 다시 받아 다시 올리고, URL을 재사용해서 카카오톡 공유 캐시가 이전 회차 정보를 물고 있는 문제들이었다.

## 핵심 선택

- **구조화된 데이터** — 이미지·문자열에 갇혀 있던 운영 정보(아젠다, 브랜드 컬러)를 세션 레코드·브랜드 프리셋으로 전환
- **WCAG 대비비 저장 게이트** — 색을 눈으로 맞추던 시절엔 그 색이 읽히는지 확인할 방법이 없었다. culori의 wcagContrast로 실측하고 미달이면 저장 자체를 막는다
- **에디터 프리뷰 = 참가자 뷰어** — 같은 Microsite 컴포넌트를 공유해 "프리뷰와 실물이 다르다"를 구조적으로 불가능하게 만듦

## 담당

2인 협업 — 백엔드(D1 스키마·API)는 팀원, 프론트엔드(콘솔·에디터·뷰어·리포트·디자인 시스템)는 본인 담당.`,
    type: 'personal',
    status: 'live',
    tags: ['Next.js', 'TypeScript', 'Cloudflare Workers', 'OKLCH', 'Vitest'],
    project_url: 'https://sympo-studio.fomula91.workers.dev',
    github_url: null,
    pdf_url: null,
    display_order: 33,
  },
  {
    title: '반려동물 훈육 상담 RAG 챗봇 (PetRAG)',
    project_key: 'PetRAG',
    description: `## 왜 만들었나

NCP 클라우드 실습으로 HyperCLOVA X 기반 RAG 챗봇을 하루 만에 설계부터 배포까지 만들었다.

## 핵심 선택

- **NCP CLOVA Studio + LangChain(langchain-naver) + FAISS** — 반려동물 훈육·행동교정 지식 문서를 청킹·임베딩해 로컬 벡터 인덱스로 저장
- **검색 단계 사전 필터링** — 반려동물과 무관한 질문은 LLM 호출 자체를 생략해 비용·응답속도 개선
- **NCP Server(VM) + systemd** — NKS(Kubernetes)는 이 규모의 단일 앱엔 과하다고 판단, Private Subnet + ALB로 노출하는 구성으로 단순화

## 결과

콘솔에서 실제로 생성한 Subnet·서버 이름까지 아키텍처 문서를 실물에 맞게 동기화했다.`,
    type: 'personal',
    status: 'wip',
    tags: ['LangChain', 'HyperCLOVA X', 'FAISS', 'Streamlit', 'NCP'],
    project_url: null,
    github_url: 'https://github.com/huni2/pet-training-rag-chatbot',
    pdf_url: null,
    display_order: 34,
  },
  {
    title: 'PetitPet — 반려동물 헬스케어 AI 상담 (팀 프로젝트)',
    project_key: 'PetitPet',
    description: `## 무엇을 만들었나

NCP 클라우드 캠프 4인 팀(NaverCloud-Team4) 프로젝트. 반려동물 나이·체중·증상을 입력하면 AI가 훈육·건강 상담을 해주는 서비스.

## 담당 역할

Docker 배포와 인프라 트러블슈팅, 그리고 프론트엔드 버그 픽스를 맡았다.

- **배포 안정화** — prisma 복사 누락된 Dockerfile 복원, standalone 빌드가 mariadb 드라이버를 빠뜨리는 문제(런타임 이미지에 node_modules 전체 포함으로 해결), lock 파일 동기화
- **프론트엔드 버그 픽스** — 토스트 메시지 통일, 반려견 나이/체중 음수 입력 방지, 약 복용 정보 필드 누락 수정, 챗봇 주제 제한 규칙 추가

4명이 각자 브랜치에서 작업하는 팀 프로젝트 특성상, 검증된 배포 설정이 조용히 되돌아가는 문제를 여러 번 겪고 고쳤다.`,
    type: 'personal',
    status: 'wip',
    tags: ['Next.js', 'Docker', 'Team Project', 'NCP'],
    project_url: null,
    github_url: 'https://github.com/NaverCloud-Team4/petitpet',
    pdf_url: null,
    display_order: 35,
  },
];

console.log('\n프로젝트 upsert 시작...\n');
let ok = 0, fail = 0;

const { data: existing } = await supabase.from('projects').select('id, title');
const existingMap = Object.fromEntries((existing ?? []).map(p => [p.title, p.id]));

for (const project of projects) {
  const existingId = existingMap[project.title];
  let error;

  if (existingId) {
    ({ error } = await supabase.from('projects').update(project).eq('id', existingId));
  } else {
    ({ error } = await supabase.from('projects').insert(project));
  }

  if (error) {
    console.error(`❌ ${project.title}: ${error.message}`);
    fail++;
  } else {
    console.log(`✅ ${existingId ? '[업데이트]' : '[신규]'} ${project.title}`);
    ok++;
  }
}

console.log(`\n프로젝트: 성공 ${ok}건 / 실패 ${fail}건`);
