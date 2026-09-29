// 로그 데이터 시딩 스크립트 (2026-07-06 ~ 2026-08-25 구간) — node --env-file=.env.local scripts/seed_logs_2026_07_08.mjs
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('❌ 환경변수 누락:');
  if (!url) console.error('   NEXT_PUBLIC_SUPABASE_URL 이 없습니다.');
  if (!key) console.error('   SUPABASE_SERVICE_ROLE_KEY 가 없습니다.');
  console.error('\n실행 방법: node --env-file=.env.local scripts/seed_logs_2026_07_08.mjs');
  process.exit(1);
}

console.log(`🎯 대상: ${url}`);

const supabase = createClient(url, key);

const logs = [
  {
    title: 'hunipopol — 프로젝트 설명을 문제·선택·결과로 갈아엎고 하루 만에 버그 다잡기',
    slug: 'hunipopol-problem-choice-result-rewrite-2026-07-06',
    category: 'log',
    project: 'hunipopol',
    tags: ['Next.js', '포트폴리오'],
    published: true,
    created_at: '2026-07-06T14:37:00+09:00',
    content: `## 계기

"왜 이 기술을 골랐는지"가 안 보인다는 피드백을 받았다. 프로젝트 설명과 README를 문제-선택-결과 구조로 다시 썼다.

- 프로젝트 5개 설명 재작성 — 기술 선택 이유를 명시
- 프로젝트별 아키텍처 로그 4건 추가 (RoundWait, TimeSlot, SalesPulse, CongKong Chatbot)
- README 전면 재작성 — 아키텍처 다이어그램 + 문제→선택→결과 구조
- logs 테이블에 project 컬럼을 추가해 로그-프로젝트 연동을 시작 (project_key 이전의 첫 버전)

## 카카오 인앱브라우저 다크모드 버그

카카오톡 링크로 들어온 사용자가 다크모드에서 텍스트가 아예 안 보인다는 제보가 들어왔다.

원인은 localStorage 접근이 막힌 환경에서 data-theme이 설정되지 않은 채로, OS는 다크모드를 인식하지만 --foreground 변수는 라이트 기본값(어두운 텍스트)을 그대로 쓰고 있었던 것. globals.css에 prefers-color-scheme 미디어쿼리를 추가하고, layout.tsx 초기화 스크립트에 try-catch를 둬서 localStorage 접근이 실패하면 OS 다크모드 감지로 폴백하도록 고쳤다.

## 그 밖에 하루 만에

- 이력서 PDF: 핵심 프로젝트 6개로 제한, 수치 없는 impact 카드 제외
- OG 이미지 자동 생성 (Next.js edge runtime ImageResponse)
- 모바일 하단 탭 제거 → 헤더로 통합 (햄버거 + 한/영 전환 + 다크모드)
- 페이지 전환 로딩바, 404/500 에러 페이지 추가
- 이력서 PDF 버튼을 admin 전용으로 제한했다가, 30분 만에 다시 전체 공개로 되돌렸다 — PDF 다운로드 자체가 포트폴리오 열람 경험의 일부라는 판단.`,
  },
  {
    title: '이력서 PDF description 렌더링, 갈아엎고 되돌리고 다시 갈아엎은 이틀',
    slug: 'hunipopol-resume-description-rendering-iteration-2026-07-08',
    category: 'log',
    project: 'hunipopol',
    tags: ['PDF', 'UX'],
    published: true,
    created_at: '2026-07-08T13:25:00+09:00',
    content: `## 포트폴리오 모달부터

카드 클릭 시 모달로 설명·임팩트·Dev 로그·링크를 한번에 보여주는 기능을 붙였다. 곧바로 description을 마크다운으로 렌더링하도록 바꿔서, README를 그대로 붙여넣어도 되게 했다.

## 이력서 PDF: 하루 안에 네 번 뒤집은 글자수 제한

프로젝트 description을 이력서에 그대로 넣었더니 길이가 들쭉날쭉해서 레이아웃이 흔들렸다.

1. 1차: 4개 프로젝트 기준으로 글자수 제한을 확장
2. 2차: 그래도 부족해서 글자수 제한을 완전히 제거
3. 3차: 대신 description을 \`##\` 섹션(목적/과정/성과)별로 파싱해서 렌더링
4. 4차: 성과만 있고 기술 스택이 안 보인다는 피드백 → 목적/과정/기술/성과 4섹션으로 확장

경력 설명도 줄바꿈이 사라지는 문제가 있어 whitespace-pre-line을 적용했다가, 다시 bullet 리스트 렌더링으로 손봤다.

## 사이트 자체를 프로젝트로

hunipopol 포트폴리오 사이트 자체를 프로젝트 목록에 최상단으로 추가했다. "왜 만들었나 / 기술 선택 이유 / 구조"를 마크다운으로 적어 넣었다. 이 사이트가 곧 포트폴리오라는 걸 사이트 안에서도 보여주고 싶었다.

## 그 밖

챗봇 위젯 URL을 congkong.net으로 갱신했고, ESLint 에러를 전부 잡으면서 eslint-plugin-security를 새로 추가해 unsafe-regex 같은 룰도 걸어뒀다.`,
  },
  {
    title: 'project_key 도입 — 로그와 임팩트가 프로젝트에 하나도 안 붙던 버그를 잡다',
    slug: 'hunipopol-project-key-matching-bug-2026-07-18',
    category: 'log',
    project: 'hunipopol',
    tags: ['Bug Fix', 'Supabase'],
    published: true,
    created_at: '2026-07-18T01:25:00+09:00',
    content: `## 발견

포트폴리오 상세를 모달에서 전용 페이지(/portfolio/[key])로 옮기는 작업을 하다가, 대부분의 프로젝트에 Dev Log도 Impact 수치도 하나도 안 붙어 있다는 걸 발견했다.

## 원인

logs.project와 impact_stats[].project는 짧은 코드네임("Timeslot", "RoundWait" 등)을 썼는데, 매칭 기준은 projects.title(전체 표시용 제목)이었다. 코드네임과 전체 제목이 애초에 같을 수 없으니 거의 모든 프로젝트가 조용히 매칭 실패 상태였다. 화면에는 에러가 뜨지 않고 그냥 "없음"으로만 보여서 한동안 몰랐다.

## 해결

project_key라는 안정적인 짧은 식별자를 도입해서 display title과 분리했다. 대소문자 무시로 매칭하고, 동시에 /portfolio/[key]의 URL 세그먼트로도 재사용한다. project_key가 아직 없는 기존 프로젝트는 id로 폴백.

부수로 admin write/impact 폼에 project_key 자동완성을 붙였다(하드코딩된 프로젝트 목록 대신 실제 등록된 값 기준), 포트폴리오 admin에 PDF 업로드를 추가했고(기존엔 URL만 가능), 저장·렌더링 시 태그 중복도 제거했다.

## 그 사이

7/9에 ESLint 정리를 마무리했고, 7/14에는 자체 방문자 Analytics 대시보드(관리자 접속은 자동 제외, 오늘/주간/월간 통계 + 7일 차트 + 유입경로)를 추가했다.

## 교훈

필드 이름이 같아 보여도("project") 실제로 매칭에 쓰이는 값의 성격(코드네임 vs 표시용 제목)이 다르면 조용히 다 깨진다.`,
  },
  {
    title: '커리어 타임라인 dot 정렬 버그와 Education 섹션',
    slug: 'hunipopol-career-timeline-education-2026-07-30',
    category: 'log',
    project: 'hunipopol',
    tags: ['CSS', 'UI/UX'],
    published: true,
    created_at: '2026-07-30T11:25:00+09:00',
    content: `## 커리어 타임라인 dot이 안 맞는다

flex + translate 보정으로 타임라인 중앙 dot 위치를 맞추고 있었는데, 컨테이너 폭이 바뀔 때마다 어긋났다. grid 레이아웃으로 바꾸니 컨테이너 폭과 무관하게 항상 정확한 위치에 dot이 놓였다. 카드도 기본은 로고·부서명·직책·소개만 보여주고 클릭해야 역할·기여가 펼쳐지도록 정리했고, 커리어 항목에 포트폴리오 프로젝트 연동(project_keys)을 추가해 펼침 영역에 링크 배지가 뜨도록 했다.

## Education 섹션

About·이력서 양쪽에 학력 섹션을 추가했다. admin에 학력 CRUD UI(기간, 기관명, 학위, 비고)를 만들고, 이력서 PDF에는 Experience 다음 섹션으로 넣었다. 이 무렵 스크롤 상단 이동 버튼을 전역 컴포넌트로 분리해 모든 페이지에 적용했고, 포트폴리오 카드 이미지도 object-cover(크롭)에서 object-contain + 블러 배경으로 바꿔 이미지가 잘리지 않게 했다.

## 7/30

About 커리어 카드에 강조 박스와 상태 배지를 추가하고, 홈 히어로 CTA 우선순위를 정리하면서 이 구간을 마무리했다.`,
  },
  {
    title: '이력서 인쇄 버그 4연타 — A4 잘림부터 챗봇 위젯까지',
    slug: 'hunipopol-resume-print-bug-quadfecta-2026-08-17',
    category: 'log',
    project: 'hunipopol',
    tags: ['Print CSS', 'Bug Fix'],
    published: true,
    created_at: '2026-08-17T22:19:00+09:00',
    content: `오랜만에 이력서 페이지를 열어보니 인쇄 관련 버그가 한꺼번에 몰려 있었다. 하루에 네 개를 순서대로 잡았다.

## 1. A4 폭을 넘어 잘리는 문제

본문이 고정폭 780px라 A4보다 넓으면 오른쪽이 그대로 잘려 인쇄됐다. 여백 방식을 @page margin으로 통일하고 폭 기준을 정리해서 고쳤다.

## 2. 임팩트 배지가 하나도 안 뜨는 문제

프로젝트 임팩트 배지가 project_key가 아니라 title로 매칭되고 있었다. 7/18에 project_key로 통일했던 곳 중 한 군데가 빠져 있었던 것 — 리팩터링이 한 곳에서라도 새면 이렇게 조용히 재발한다.

## 3. 챗봇 위젯이 이력서에 같이 인쇄되는 문제

CongKong 챗봇 위젯(#ck-chatbot-root)이 SPA 라우팅 특성상 다른 페이지에서 로드된 채로 /resume 진입 시에도 DOM에 남아 있었다. print 미디어 쿼리에서 명시적으로 숨겨 해결했다. 인쇄 폰트도 맑은 고딕으로 고정했다.

## 4. 줄바꿈이 사라지는 문제

stripMd()가 모든 개행을 공백 하나로 뭉개서, 목적/과정/기술/성과 섹션의 번호·불릿 항목이 한 문단으로 붙어버렸다. 줄 단위로 마크다운을 제거하도록 바꾸고 \`<br/>\`로 원래 줄바꿈을 보존했다. 이 김에 목적/과정/기술/성과라는 섹션 레이블 자체를 없애고 Experience와 동일한 · 불릿 형식으로 통일했다 — 레이블이 있으니 이력서라기보다 보고서처럼 보였다.

## 자기소개서 기능 추가

같은 날, 회사·포지션·섹션을 자유롭게 구성해 PDF로 출력하는 자기소개서(/resume/cover) 기능을 새로 추가하고, 곧바로 /resume에 통합해 인쇄 시 이력서 뒤에 새 페이지로 자동으로 이어지게 만들었다. Pretendard 폰트도 이날 적용했다(Geist Sans 대체).`,
  },
  {
    title: '자기소개서를 범용으로, 홈은 백엔드 중심으로',
    slug: 'hunipopol-general-cover-letter-backend-reframe-2026-08-25',
    category: 'log',
    project: 'hunipopol',
    tags: ['Copywriting', 'UX'],
    published: true,
    created_at: '2026-08-25T19:39:00+09:00',
    content: `## 범용 자기소개서

회사별 자소서 말고, 항상 노출할 수 있는 범용 자소서가 필요했다. CoverLetter에 isGeneral 플래그를 추가해서 활성 자소서가 따로 지정 안 됐을 때 범용 자소서로 폴백하게 했다. 작성일 표시는 뺐고("8월 17일 작성" 같은 문구가 범용 자소서엔 어색해서), 범용일 땐 '범용' 라벨도 숨겼다.

학력 항목에도 커리어 타임라인과 동일하게 프로젝트 연동과 활동 설명(줄바꿈 구분 → 불릿)을 추가했는데, 처음엔 About 페이지에서만 반영되고 이력서 페이지에서는 안 보이는 걸 놓쳐서 다음날 바로 수정했다.

## 홈페이지를 백엔드 중심으로 재프레이밍

포트폴리오에 검색바(제목·설명·태그 기준 실시간 검색)를 추가했고, 로그 페이지에는 프로젝트 필터 선택 시 해당 프로젝트의 임팩트 요약 카드(before/after, context)를 상단에 노출시켰다.

가장 큰 변화는 카피였다. 히어로 태그라인과 About 기본 문구의 "Frontend Developer" 표기를 "Backend-leaning Fullstack Developer"로 바꾸고, Go·MySQL·Redis 중심으로 다시 썼다. 히어로 스택 배지도 Go·Spring Boot·TypeScript·Redis·Next.js·AWS로 재정렬했다. 홈에는 RoundWait·SalesPulse·TimeSlot 3개를 대표 프로젝트로 큐레이션해 벤토 그리드 아래 스크롤 섹션으로 추가하고, 초안에 넣었던 About 요약 섹션은 히어로 카드와 내용이 완전히 겹쳐서 바로 뺐다.

실제로 최근 반년의 작업 비중이 백엔드·인프라 쪽으로 옮겨간 걸 사이트에도 반영한 셈이다.`,
  },
  {
    title: 'FireWatch — bkit PDCA로 계획 세우고 하루 만에 백엔드+웹 완성',
    slug: 'firewatch-project-kickoff-2026-08-19',
    category: 'project',
    project: 'FireWatch',
    tags: ['Kotlin', 'Spring Boot', '신규프로젝트'],
    published: true,
    created_at: '2026-08-19T17:11:00+09:00',
    content: `## 무엇을 만들었나

매일 아침 8시, 국내·미국 증시 요약과 호재/악재 뉴스, 금/은 시세, 환율을 자동으로 수집·분석해서 웹 대시보드와 모바일 푸시로 전달하는 시스템. 이름은 **FireWatch**.

## 계획부터 세우고 시작

bkit PDCA로 Plan → Design → Do 순서를 지켰다. Plan에서는 계정 없는 1인 사용자 모델, MVP는 backend+web 우선(모바일은 Phase 2로 분리), 백엔드는 Oracle Cloud Always Free Tier로 확정했다. Design에서는 아키텍처 3안 중 Option C(Pragmatic Balance)를 선택했다 — FR 도메인별 3계층 구조에 AuditLogAspect를 Service 공개 메서드 전체에 AOP로 일괄 적용해서 감사로그 누락을 구조적으로 막는 방식. 계정이 없어도 설정 변경·수동 트리거 같은 쓰기 API는 정적 X-API-Key로 최소 보호하기로 했다(ADR 0004).

## 하루 만에 Phase 1

Kotlin + Spring Boot 4.1(명세서의 "3.2+" 요구를 충족하되, Initializr가 3.x를 안 줘서 4.1로 시작 — ADR 0005)로 백엔드를 세우고, AuditLogAspect가 service 패키지 전체를 가로채 SUCCESS/WARNING/FALLBACK/FAILURE 4개 상태를 자동 판정하도록 했다. 어느 서비스 코드에도 로깅을 직접 흩뿌리지 않는 게 핵심이었다.

금융 데이터는 한국수출입은행 환율 API와 Yahoo Finance 비공식 API로 수집했는데, 실측하면서 두 가지 함정을 발견했다 — 수출입은행 위안화 코드가 "CNY"가 아니라 "CNH"였고, Yahoo는 User-Agent 헤더가 없으면 429를 뱉었다. FCM 발송 로직을 붙이는 중에는 AuditLogAspect가 성공 시 response_summary를 항상 "OK"로만 남기던 설계 결함도 발견해 고쳤다 — 이제 반환값이 그대로 감사로그에 남아 발송 성공/실패 통계가 자동 기록된다.

웹은 Vite + React 18 + antd v5로 대시보드·감사로그·설정 3화면을 붙였다. 브라우저로 직접 확인하는 과정에서 Design 문서가 CORS를 아예 빠뜨린 걸 발견해 그 자리에서 추가했다.

## 결과

| 구간 | 소요 |
|------|------|
| Plan + Design | 약 1시간 |
| 백엔드 (스캐폴딩~REST API 6종) | 약 3시간 |
| 웹 3화면 | 약 3시간 |

./gradlew build, npm run build, npm run lint 전부 통과를 확인하고 하루를 마쳤다. 남은 건 배포뿐이었다.`,
  },
  {
    title: '배포하자마자 데이터가 날아갔다 — Render H2에서 Supabase Postgres로',
    slug: 'firewatch-render-deploy-data-loss-2026-08-20',
    category: 'log',
    project: 'FireWatch',
    tags: ['Render', 'Supabase', '배포'],
    published: true,
    created_at: '2026-08-20T23:47:00+09:00',
    content: `## 배포

Oracle Cloud 가입이 막혀서 대안을 찾다가 Render(백엔드, Docker)로 방향을 틀었다. 무료 티어는 15분 무활동 시 슬립되는데, GitHub Actions 예약 워크플로가 매일 외부에서 깨우는 방식으로 우회했다(ADR 0008). Cloudflare Pages(웹)도 같이 배포해서 저녁에 Phase 1(backend+web) 배포를 마쳤다.

## 데이터가 사라졌다

배포 몇 시간 만에 브리핑과 감사로그가 전부 사라진 걸 발견했다. 원인은 단순했다 — Render 무료 티어는 영구 디스크가 없어서, 슬립 후 재기동될 때마다 파일 기반 H2 DB가 초기화되고 있었다. prod 프로필을 분리해서 로컬 개발은 H2 그대로 두고, 프로덕션만 외부 Supabase Postgres를 쓰도록 바꿨다(ADR 0009).

## Postgres로 옮기자마자 또 터졌다

감사로그 검색이 500 에러를 뱉기 시작했다. "IS NULL OR ..." 형태의 JPQL 패턴이 H2에서는 문제없이 돌아가지만 Postgres에서는 "could not determine data type of parameter"로 죽었다. Specification 기반으로 교체해서, 필터가 실제로 있을 때만 predicate를 추가하도록 바꿨다 — null 타입 추론 문제 자체가 애초에 발생하지 않는 구조로.

## 리디자인

같은 날 저녁, 웹 디자인을 AntD 기본 톤(파란 primary, radius 6)에서 토스·TradingView 쪽 벤치마킹으로 갈아엎었다. Pretendard 폰트, 인디고 브랜드 컬러, 지표 카드(굵은 숫자 + 트렌드 색 상단 바), 그라디언트 차트 영역. 카드 hover 리프트와 값 변경 시 배경 플래시 애니메이션도 붙였다. 감사로그 상태 4색은 디자인 규칙에 고정값이라 그대로 뒀다.

## 교훈

무료 티어 인프라는 "슬립"만 신경 쓰면 될 것 같지만, 슬립 뒤에 뭐가 초기화되는지까지 봐야 한다. 파일 기반 DB는 특히 위험했다.`,
  },
  {
    title: 'Gemini 무료 티어와의 사투 — 모델 3종 실측하고 타임존 버그까지',
    slug: 'firewatch-gemini-free-tier-timezone-bug-2026-08-21',
    category: 'log',
    project: 'FireWatch',
    tags: ['Gemini', 'Bug Fix'],
    published: true,
    created_at: '2026-08-21T09:47:00+09:00',
    content: `## Gemini 3 계열이 전부 429

Google AI Studio 쿼터 화면에서 확인하니 Gemini 3 계열은 무료 티어에서 Search Grounding 일일 할당량이 0이었다. 2.5-flash로 바꿨다가, 검증 도중 2.5가 단종 진행 중(404)인 걸 확인해서 3.5-flash로 다시 바꿨다. 결국 3.7/2.5/3.5 세 버전을 전부 실측했다 — 3.7은 429, 2.5는 404(단종), 3.5만 살아있었다. Gemini 3 계열은 세부 버전과 무관하게 검색 그라운딩 무료 할당량이 0이라는 결론.

## 타임존 버그 — "오늘"이 하루 전으로 계산되고 있었다

Gemini 모델 문제를 검증하던 중 실측으로 발견한 버그. @Scheduled cron 자체는 Asia/Seoul 기준 08:00에 정확히 실행되지만, 그 안의 LocalDate.now()는 타임존을 명시하지 않아 컨테이너 기본값(UTC)을 쓰고 있었다. KST 08:00은 UTC로 전날 23:00이라, 매일 자동 실행마다 "오늘" 날짜가 하루 전으로 계산돼 "이미 존재함"으로 오판하고 스킵할 위험이 있었다. 브리핑 조회 API(latest/list)도 같은 패턴의 버그를 갖고 있어서 함께 고쳤다.

## 수출입은행 API가 항상 빈 응답

수출입은행 환율 API는 "영업일 11시 이전에 당일 데이터 요청 시 null 반환"이 정책인데, 스케줄러는 매일 08:00 KST(11시 이전)에 도는 구조라 매번 빈 배열만 받고 있었다. 전일부터 거꾸로 조회해서 데이터가 있는 가장 최근 영업일을 찾도록 바꿨다(주말·공휴일 연속 대비 최대 7일 소급).

## 감사로그가 엉뚱한 곳에 찍힌다

SchedulerJob이 Gemini 실패 후 자기 자신을 FALLBACK으로 표시하려던 게, 그 뒤에 실행되는 아무 감사 대상 호출(FCM_PUSH, 나중엔 NEWS_API)에나 먼저 소비되고 있었다. 프로덕션 감사로그에서 NEWS_API가 "Gemini 실패..." 사유로 잘못 찍힌 걸 보고 발견했다 — 호출 깊이를 추적해 가장 바깥쪽 호출만 소비하도록 고치고 재현 테스트를 추가했다.

## Search Grounding을 아예 뺐다

무료 티어에서 막힌 건 Search Grounding 도구의 할당량이지 generateContent 자체가 아니라는 데 착안했다. 이미 Yahoo·수출입은행 시세와 RSS 뉴스로 실제 데이터를 확보하고 있어서 Gemini가 직접 검색할 필요가 없었다 — tools 필드를 빼고 시세+뉴스를 프롬프트에 직접 넣어 요약·종목추천만 시키는 쪽으로 바꿨다. 뉴스 소스도 네이버 검색 API(API HUB 이전으로 신규 신청이 막힘) 대신 회원가입이 필요 없는 아시아경제 증권 RSS로 정리했다.

## 하루 요약

$0 제약을 지키면서 안정적으로 돌아가는 조합을 찾기까지 모델 3종 실측과 버그 4건을 하루 만에 처리했다.`,
  },
  {
    title: '관심종목, 차트, 성능 최적화 — 써보고 바로 요청받은 걸 그날 다 넣은 날',
    slug: 'firewatch-watchlist-chart-performance-2026-08-21',
    category: 'log',
    project: 'FireWatch',
    tags: ['성능최적화', 'UX'],
    published: true,
    created_at: '2026-08-21T14:56:00+09:00',
    content: `8/21 오후는 실제로 대시보드를 써보면서 나온 요청을 그날그날 반영한 하루였다.

## "원하는 종목과 차트도 보고싶은데"

금/은 시세에 쓰던 Yahoo Finance 엔드포인트를 임의 종목 티커로 확장해서, 관심 종목(국내 .KS/.KQ + 해외 티커)을 등록하고 시세 차트를 보는 "종목" 화면을 새로 만들었다. 진짜 실시간 틱 스트리밍은 유료 서비스가 필요해서, 대신 오늘자 1분봉을 30초마다 폴링하는 방식으로 준-실시간을 흉내냈다.

이어서 "5년/6개월/3개월/1달/일주일/하루로 볼 수 있는 차트"를 요청받아 기간을 6종으로 확장했다. "종목이 뭐가 있는지 몰라서 검색을 어떻게 해야할지 모르겠다"는 말에는 Yahoo 검색 API를 붙이려다가 한글 종목명을 아예 인식 못 하는 걸 실측으로 확인했다("삼성전자"는 에러, "Samsung"은 정상). 국내 대형주 35개 정도는 로컬 별칭표로 한글 검색을 보완하고, 그 외/해외는 Yahoo 영문 검색으로 폴백하는 방식으로 마무리했다.

## "대시보드가 너무 느리게 뜬다"

실측해보니 Render 콜드스타트(9초, 오래 쉬면 50초 이상)가 가장 크지만 이건 무료 티어 트레이드오프라 코드로 못 고쳤다. 대신 개선 여지가 있던 JS 번들(gzip 495KB 단일 파일)을 React.lazy로 라우트별 코드 스플리팅해서 대시보드 초기 로드를 약 371KB로 줄였다.

## 티커 검증이 사실 작동을 안 하고 있었다

"반도체" 같은 일반 단어가 종목 티커로 그대로 저장되는 걸 막으려고 List<@Pattern String> 타입 인자 애노테이션을 달았는데, 프로덕션에서 실측해보니 잘못된 값이 여전히 저장되고 있었다. Jakarta Bean Validation이 Kotlin의 이 문법을 실제로는 검증하지 않는다는 걸 확인하고, 애노테이션을 걷어낸 뒤 서비스 레이어에서 직접 정규식 검사 후 예외를 던지도록 바꿨다.

## 그 밖

상단 가로 메뉴를 사이드바로 전환하고 좁은 화면에서 자동으로 접히게 했고(사용자 지적: "화면 크기에 따른 오토스케일링이 하나도 안 되어있다"), AI 추천종목 칩이 계속 빈 배열이던 것도 발견해서 Gemini 프롬프트에 "추천종목: A, B" 형식을 요청하고 파싱하도록 채워 넣었다.`,
  },
  {
    title: 'UI 리디자인 후 사이드바가 하루 종일 왔다갔다 한 날',
    slug: 'firewatch-sidebar-redesign-saga-2026-08-23',
    category: 'log',
    project: 'FireWatch',
    tags: ['UI/UX', '반응형'],
    published: true,
    created_at: '2026-08-23T18:27:00+09:00',
    content: `## 리스킨

루트에 있던 Design.md(스타벅스 사이트 디자인 시스템 추출본)를 토큰 레벨로 적용했다. Primary를 인디고에서 Green Accent(#00754A)로, 캔버스를 크림으로, 버튼을 50px 풀필로 바꿨다. 다크모드는 House Green 계열로 직접 파생시켰다. 검증하다가 AntD Layout.Sider가 theme="light"일 때 커스텀 배경 토큰을 무시하는 걸 발견해서 인라인 스타일로 우회했다.

국내외 지수(코스피·코스닥·S&P500·나스닥·다우)와 미국채 10년물 수익률도 이날 매일 브리핑 핵심 지표로 추가했다. 한국국채 10년물은 Yahoo에 수익률 데이터가 없어서 제외했다.

## 그리고 사이드바가 하루 종일 왔다갔다 했다

리뷰를 거치며 UX 지적이 쏟아졌고, 메뉴 구조를 하루에만 여섯 번 넘게 갈아엎었다.

1. 사이드바 강제 접힘·에러 화면 전체화면 등 버그 5건 수정
2. 로고를 사이드바에서 헤더로 이동 (사이드바가 접히면 로고도 같이 사라지던 문제)
3. 헤더 로고-햄버거를 가로에서 세로 스택으로
4. 햄버거를 눌러도 실제 열리는 게 버튼 위치와 다른 문제 → 데스크톱은 사이드바, 모바일은 헤더 바로 아래 드롭다운으로 완전히 분리
5. 그 과정에서 데스크톱 접기 기능을 확인 없이 같이 없앰 → 복구
6. "메뉴가 왼쪽으로 나온다"는 지적이 재발 → 992px 분기 자체를 없애고 드롭다운 하나로 통일
7. 드롭다운도 별로라 Menu mode="horizontal"로 항상 노출로 교체
8. AntD Menu의 자동 오버플로우가 좁은 화면에서 메뉴를 "..." 뒤로 숨김 → Menu를 걷어내고 절대 숨기지 않는 커스텀 Link 목록 + 사이드바 재추가
9. 결국 사이드바에 표준 collapsible(collapsedWidth=80)을 붙이고, 완전 숨김이 필요할 때만 collapsedWidth=0으로 별도 처리

## 콜드스타트를 에러로 착각하지 않게

Render 콜드스타트가 90초 이상 걸릴 수 있는데, 첫 요청이 실패하면 바로 에러 화면을 보여주고 있었다. [2s,4s,8s,15s,25s,35s] 간격(누적 약 89초)으로 재시도하면서 loading 상태를 유지하고, 전부 실패했을 때만 최종 에러를 보여주도록 6개 훅 전체에 적용했다. 대시보드/종목/지수/뉴스와 감사로그/설정을 헤더 두 그룹으로 재배치하고, 티커 표기와 지수 용어를 설명하는 가이드 페이지도 신설했다.

## 돌아보면

디자인 하나 바꿨을 뿐인데 레이아웃 구조 전체가 흔들렸다. "메뉴가 안 보인다"는 지적이 반복될 때마다 다른 컴포넌트로 갈아엎기보다, 한 번 더 확인하고 갔으면 왕복이 줄었을 것 같다.`,
  },
  {
    title: '모바일 앱 스캐폴딩부터 FCM, 그리고 웹 푸시까지',
    slug: 'firewatch-mobile-expo-fcm-webpush-2026-08-24',
    category: 'log',
    project: 'FireWatch',
    tags: ['Expo', 'FCM', '모바일'],
    published: true,
    created_at: '2026-08-24T00:47:00+09:00',
    content: `## Design 단계에서 이미 구멍을 발견

mobile-app Plan/Design 문서를 쓰다가 UserSettings.kt를 확인해보니 fcm_tokens 컬럼은 있는데 이걸 등록할 API가 없었다. "backend 변경 0"이라던 Plan의 가정을 PUT /api/settings에 선택적 fcmToken 필드를 추가하는 최소 확장으로 수정했다.

## Expo 스캐폴딩

create-expo-app 기본 템플릿(SDK 57)에서 데모 콘텐츠를 걷어내고 NativeWind v4를 설정했다. 이어서 fcmToken 필드를 백엔드에 추가하고, 원시 FCM 토큰에 직접 보내는 방식(Firebase Admin SDK)에서 Expo Push Service로 전환했다 — iOS(APNs)와 Android(FCM) 토큰 형식이 달라서, 원시 방식으로 iOS까지 받으려면 react-native-firebase와 커스텀 개발 빌드가 필요했기 때문이다(Expo Go로는 불가능). FcmSender 인터페이스는 그대로 두고 구현체만 교체해서 PushService 쪽 변경은 없었다.

브리핑 홈 화면(요약 카드+바텀시트+오프라인 캐시), 설정 화면(수신 시간+관심 키워드)까지 붙이고 나니 모바일 코드는 다 끝났는데, 실제 알림을 받아보려니 사용자의 EAS 프로젝트 연결이 필요해서 거기서 잠시 멈췄다.

## 폴링으로 바꾼 이유

그러다 발견한 버그 — Settings 화면의 "수신 시간"이 저장만 될 뿐 어디서도 읽히지 않아서, 항상 고정 08:00 KST에만 발송되고 있었다. GitHub Actions를 15분마다 폴링하도록 바꾸고, 새 trigger-if-due 엔드포인트가 현재 시각과 저장된 pushTime을 비교해 맞을 때만 실제로 파이프라인을 실행하게 했다.

## EAS 연결과 로고

디스크 공간 부족으로 막혀 있던 EAS 연결(npx eas init)이 공간을 확보하고 나서야 풀렸다 — 원인 진단에 제법 걸렸다. FireWatch 로고를 모바일 아이콘·웹 파비콘에 반영하고, Android 적응형 아이콘은 중앙 62% 안에 들어가도록 여백을 두고 재처리했다(sharp). APK는 Expo 빌드 아티팩트가 14일 후 만료되길래 GitHub Release에 영구 링크로 올렸다.

## 그래도 안 되면 웹 푸시

Android 사이드로드 APK가 Play Protect에 막혀서, 앱 설치 없이 브라우저로 알림을 받는 웹 푸시 채널을 추가로 붙였다. web-push 라이브러리(VAPID 서명 + RFC 8291 암호화)로 브라우저 구독에 직접 발송한다. FCM 토큰과 웹 푸시 구독을 각각 다른 채널로 두고, PushService가 둘 다 시도해서 한쪽이 비어있어도 나머지로는 발송되게 했다. Web Push는 구독자마다 키가 달라 멀티캐스트가 안 되기 때문에 WebPushSender 인터페이스를 FcmSender와 분리했다.

## 6일간의 기록

8/19 계획부터 8/24 웹 푸시까지, FireWatch는 나흘 반 만에 백엔드-웹-모바일-알림 채널까지 갖춘 개인 프로젝트가 됐다. bkit PDCA로 미리 설계 결정을 문서화해둔 덕에, 무료 티어 제약(Gemini 할당량, Render 콜드스타트, $0 원칙)에 부딪힐 때마다 ADR로 근거를 남기면서 방향을 바꿀 수 있었다.`,
  },
  {
    title: 'Timeslot — SSO 로그아웃이 막다른 길로 보내던 버그',
    slug: 'timeslot-sso-logout-notices-2026-07-12',
    category: 'log',
    project: 'Timeslot',
    tags: ['SSO', 'Firebase'],
    published: true,
    created_at: '2026-07-12T12:02:00+09:00',
    content: `## 로그아웃 버튼이 사용자를 가둬버렸다

requireSSO로 보호된 이벤트에서 로그아웃 버튼을 누르면, 사용자가 돌아갈 방법이 없는 안내 메시지 화면에 남겨졌다. 로그인 페이지가 아니라 정보 페이지로만 리다이렉트되고 있었기 때문. {ssoSourceUrl}/login으로 명시적으로 보내도록 수정했다.

## 공지사항 화면 통합

/{eventSlug}/notices가 별도 UI를 중복 구현하고 있어서, /{eventSlug}?view=notices로 리다이렉트하도록 바꿨다. 알림톡 딥링크와 앱 내 탭이 이제 완전히 같은 화면(같은 접근코드·숨김 조건 포함)을 보여준다. requireSSO 이벤트의 조용한 자동 리다이렉트도 "등록된 참가자만 이용 가능하며 현장 등록 데스크를 확인하라"는 인페이지 안내로 바꿨다.

## admin DB 리셋 세분화

기존엔 슬롯+참가자를 한번에 리셋하는 기능만 있었는데, "참가자만 삭제" 옵션을 별도로 추가하고, 진행 중 상태가 갱신되는 지속형 알림을 붙였다 — 예전엔 끝날 때까지 조용히 있다가 실패하면 그제서야 알 수 있었다.`,
  },
  {
    title: '다중 일정 배치 스케줄링 + 5463줄 AdminApp.tsx 리팩터링',
    slug: 'timeslot-batch-scheduling-admin-refactor-2026-07-22',
    category: 'log',
    project: 'Timeslot',
    tags: ['Refactor', 'Firestore'],
    published: true,
    created_at: '2026-07-22T11:34:00+09:00',
    content: `## 배치 슬롯 생성이 하루짜리 이벤트만 지원했다

새 슬롯의 날짜 필드가 하드코딩된 과거 날짜(2026-04-15)로 기본값이 잡혀 있던 버그부터 고치고, 이벤트 startDate/endDate 필드를 추가해 타임존 안전한 UTC 연산으로 다중 일정(여러 날) 배치 생성을 지원하도록 확장했다. 부스별 벌크 편집(용량/카테고리/구역/날짜)도 추가하고, 부스 상세의 "배치 생성" 버튼은 전체 구역 생성기를 새로 여는 대신 해당 부스에만 시간 블록을 추가하도록 스코프를 좁혔다.

## 토스트가 모달 뒤에 숨어있었다

알림 토스트의 z-index가 모달 배경보다 낮아서, 배치 생성 성공/실패 피드백이 실제로는 화면에 보이지 않고 있었다. z-index를 모든 모달 위로 올리고, 배치 생성기 레이아웃도 왼쪽(설정)-오른쪽(미리보기/저장) 2컬럼으로 나눠서 폼 전체를 스크롤하지 않아도 결과가 보이게 했다.

## AdminApp.tsx 5463줄

모달 10개가 전부 같은 클로저 스코프를 공유하는 인라인 렌더 함수·JSX 블록으로 한 파일에 들어있었다. components/admin/modals/로 각각 분리하고 상태·핸들러는 명시적 props로 넘기도록 바꿨다. 공유하던 TimePicker도 별도 파일로 뺐다. 부스 벌크 편집 모달에서 "구역(Location)" 필드도 이 김에 뺐다 — 부스를 구역 간 이동시키는 건 "시간 블록 편집" 액션에 속하지 않는다는 판단(구역은 데이터 모델에서 부스보다 상위 레벨이지, 슬롯의 속성이 아니다).

동작 변화 없는 순수 이동이라 tsc, lint, 프로덕션 빌드, admin 페이지 로컬 스모크 테스트로 검증했다.`,
  },
  {
    title: 'NCP 클라우드 위에 반려동물 상담 RAG 챗봇 하루 만에 올리기',
    slug: 'pet-training-rag-chatbot-ncp-launch-2026-08-04',
    category: 'project',
    project: 'PetRAG',
    tags: ['RAG', 'NCP', 'LangChain'],
    published: true,
    created_at: '2026-08-04T13:57:00+09:00',
    content: `## 무엇을 만들었나

NCP CLOVA Studio(HyperCLOVA X)를 LLM으로, LangChain(공식 langchain-naver 통합)을 오케스트레이션으로, Streamlit을 UI로 쓰는 반려동물 훈육·행동교정 상담 RAG 챗봇을 하루 만에 만들었다.

## 파이프라인

data/ 아래 문서(.md/.txt)를 청킹해서 ClovaXEmbeddings로 임베딩하고 FAISS 로컬 인덱스로 저장하는 ingest 스크립트, 그리고 retriever + ChatClovaX로 구성한 LangChain RAG 체인. 반려동물과 무관한 질문은 검색 단계에서 걸러서 LLM 호출 자체를 아예 안 하도록 했다 — 불필요한 API 비용도 줄고 응답도 빨라진다.

디자인은 별도 문서(Design.md)로 Intercom의 디자인 시스템을 분석해서 기준을 잡았다. 캔버스는 크림(#f5f1ec), 카드는 화이트+헤어라인 테두리(그림자 없음), 프라이머리는 charcoal이고 오렌지는 "AI" 배지에만 한정해서 썼다. Saans 폰트는 라이선스 문제로 공식 대체 가이드대로 Inter로 바꿨다.

## NCP 배포 아키텍처

NKS(Kubernetes)는 이 정도 규모의 단일 앱엔 과하다고 판단해서 NCP Server(VM) + systemd로 배포하기로 했다. 서버를 Private Subnet에 두고 ALB로만 노출하는 구성을 ARCHITECTURE.md에 정리했다 — Subnet 5개(pub-subnet/pub-lb/pub-nat/pri-subnet/pri-db), Bastion은 Ubuntu, App 서버는 Rocky Linux, 하이퍼바이저는 KVM으로 실제 NCP 콘솔에서 생성한 이름 그대로 문서를 동기화했다.

## 하루의 순서

초기 구현 → GitHub 저장소 링크를 README에 추가 → 실제 콘솔에서 만든 리소스 이름으로 아키텍처 문서를 다시 맞추는 순서로 마무리했다. 문서를 먼저 쓰고 나중에 인프라를 맞추는 대신, 실제로 만든 뒤 문서를 실물에 맞게 동기화하는 쪽이 더 정확했다.`,
  },
  {
    title: 'PetitPet — NCP 클라우드 캠프 팀 프로젝트, 배포 트러블슈팅 3연타',
    slug: 'petitpet-docker-deploy-troubleshooting-2026-08-11',
    category: 'project',
    project: 'PetitPet',
    tags: ['Docker', '팀프로젝트'],
    published: true,
    created_at: '2026-08-11T15:46:00+09:00',
    content: `## 팀 프로젝트에서 맡은 몫

PetitPet은 NaverCloud 부트캠프 4인 팀(NaverCloud-Team4)이 만든 반려동물 헬스케어 AI 상담 서비스다. Next.js 16 프론트 + AI 상담 챗봇 + 관리자 대시보드로 구성돼 있고, 팀 안에서는 주로 Docker 배포와 인프라 쪽 버그를 맡았다.

## Dockerfile이 원상복구되어 있었다

dev 브랜치의 Dockerfile을 열어보니 prisma 복사 단계가 빠진 일반 템플릿으로 되돌아가 있었다. feat/ncp-docker-deploy 브랜치에서 검증해둔 버전을 그대로 가져와 복원하고, 실제 배포(docker run 직접 실행)에서 쓰지 않던 docker-compose.yml(fe/be 분리형)은 제거했다.

## 타입 에러가 프로덕션 빌드를 막고 있었다

activePet null 체크 누락, User 타입 name/nickname 불일치 같은 실제 타입 버그가 있었지만 당장 빌드 자체가 막혀 있어서 next.config.ts에서 타입 체크를 임시로 우회했다. 연동 작업 때 근본 수정 후 이 옵션을 빼야 한다고 커밋 메시지에 남겨뒀다.

## mariadb 드라이버가 사라졌다

DB 연결이 pool timeout으로 계속 실패했다. standalone 빌드의 자동 파일 추적(Next.js가 런타임에 필요한 node_modules만 골라 담는 기능)이 mariadb 패키지를 빠뜨리고 있었다. 근본 원인을 더 파는 대신, 런타임 이미지에 node_modules 전체를 포함시키는 쪽으로 실용적으로 해결했다.

## lock 파일 동기화

package.json에는 markdown-it 등 새 의존성이 추가돼 있었는데 lock 파일이 안 맞아서 npm ci가 실패하고 있었다. package-lock.json과 yarn.lock 둘 다 동기화해서 해결했다.

## 돌아보면

4명이 각자 브랜치에서 작업하다 보니, 검증된 설정이 다른 브랜치의 "기본값"으로 조용히 되돌아가는 일이 종종 있었다. Docker 관련 파일은 누가 마지막으로 건드렸는지보다 실제로 배포에서 검증됐는지를 기준으로 판단해야 했다.`,
  },
  {
    title: 'PetitPet UI/버그 픽스 — 토스트 메시지부터 챗봇 주제 제한까지',
    slug: 'petitpet-ui-bugfix-batch-2026-08-13',
    category: 'log',
    project: 'PetitPet',
    tags: ['UI', 'Bug Fix'],
    published: true,
    created_at: '2026-08-13T23:15:00+09:00',
    content: `Docker 배포를 안정화한 다음엔 프론트엔드 자잘한 버그들을 잡았다.

## 반짝이 아이콘 제거

대시보드 AI 케어팁 제목에 붙어있던 반짝이 아이콘을 뺐다. 사소하지만 팀 내 UI 피드백에서 나온 요청.

## alert 대신 토스트

프로필 저장 성공/실패를 alert로 띄우던 걸, 채팅 화면과 동일한 스타일의 토스트로 통일했다. 성공 토스트가 화면에 보일 시간을 주기 위해 리로드를 살짝 지연시켰다.

## 반려견 나이/체중에 음수가 들어갔다

입력창에서 '-' 입력 자체를 막고, 저장 시점에도 한 번 더 0 이상으로 clamp했다. 입력 단에서 막아도 다른 경로로 들어올 수 있어서 저장 시점 검증을 같이 뒀다.

## 약 복용 정보가 항상 "없음"으로 보였다

layout.tsx에서 pet 데이터를 매핑할 때 상태(status) 계산에는 currentMedication을 쓰면서 정작 필드 자체를 객체에 안 넣고 있었다. 그래서 사용자가 약 복용 정보를 저장해도 화면엔 항상 "없음"으로 표시됐다. 필드 하나를 빠뜨린 게 원인이었다.

## 챗봇이 반려동물과 무관한 질문에도 답했다

요리, 상식 같은 질문에도 AI 상담 챗봇이 답변하고 있었다. 시스템 프롬프트에 주제 제한 규칙을 추가해서, 무관한 질문에는 답변 대신 반려동물 관련 질문을 하도록 유도하는 안내로 대체했다.

작은 수정들이었지만 실제 사용자 테스트에서 나온 피드백을 그날그날 반영한 덕에 팀 데모 전까지 체감 완성도가 꽤 올라갔다.`,
  },
];

async function main() {
  console.log(`\n로그 ${logs.length}건 삽입 시작...\n`);
  let ok = 0;
  let fail = 0;

  for (const log of logs) {
    const excerpt = log.content
      .replace(/```[\s\S]*?```/g, '')
      .replace(/[#*`>\-_\[\]!]/g, '')
      .replace(/\n+/g, ' ')
      .trim()
      .slice(0, 150);

    const { error } = await supabase
      .from('logs')
      .upsert({ ...log, excerpt }, { onConflict: 'slug' });

    if (error) {
      console.error(`❌ [${log.slug}]: ${error.message}`);
      fail++;
    } else {
      console.log(`✅ ${log.title}`);
      ok++;
    }
  }

  console.log(`\n완료: 성공 ${ok}건 / 실패 ${fail}건`);
}

main();
