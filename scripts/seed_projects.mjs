// 프로젝트 + 아키텍처 로그 시딩 — node --env-file=.env.local scripts/seed_projects.mjs
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('❌ 환경변수 누락. 실행 방법: node --env-file=.env.local scripts/seed_projects.mjs');
  process.exit(1);
}

const supabase = createClient(url, key);

// ── 1. Projects (문제→선택→결과 구조) ────────────────────────

const projects = [
  {
    title: 'HUNI² — 포트폴리오 & 개발일지 사이트',
    description: `## 왜 만들었나

포트폴리오를 Notion이나 외부 서비스에 맡기면 콘텐츠 소유권이 없고 디자인 커스터마이징에 한계가 있다. 직접 만들어서 Admin CMS로 언제든 수정할 수 있게 했고, Next.js 16 App Router와 Supabase를 실전에서 검증하는 부수 효과도 노렸다.

## 핵심 기술 선택 이유

- **Next.js 16 App Router** — 서버 컴포넌트 기본값으로 클라이언트 번들 최소화. 데이터 페칭은 \`page.tsx\`(서버)에서 \`async/await\`로, 인터랙션은 \`*Client.tsx\`(클라이언트)로 역할 분리
- **Supabase** — PostgreSQL + Auth + Storage를 단일 BaaS로 해결. 직접 서버를 운영하지 않고 Admin CMS까지 구축
- **Tailwind CSS v4 + DaisyUI v5** — \`@theme\` 블록 CSS 변수 기반 테마 설계. \`data-theme\` 속성 하나로 다크/라이트 전환, \`dark:\` prefix 없이 시맨틱 색상만 사용

## 구조

Admin 패널은 Supabase Auth 인증 후 접근 가능한 별도 레이아웃으로 격리했다. 포트폴리오 카드, 개발일지, 임팩트 수치, About 소개글을 모두 어드민에서 실시간으로 편집할 수 있어 CMS처럼 동작한다.`,
    type: 'personal',
    status: 'live',
    tags: ['Next.js 16', 'TypeScript', 'Supabase', 'Tailwind CSS v4', 'DaisyUI v5', 'Framer Motion'],
    project_url: 'https://huni2-popol.vercel.app',
    github_url: 'https://github.com/huni2-private/huni2-popol',
    pdf_url: null,
    display_order: 1,
  },
  {
    title: 'AI Dev Team — Claude Code 기반 개발 워크플로우 자동화',
    description: '혼자 Next.js·Go·Firebase를 아우르는 복수 서비스를 빠르게 개발하기 위해 Claude Code + CLAUDE.md 기반 AI-augmented 워크플로우를 설계했다. .aidev.json으로 SDLC 단계(분석→설계→구현→검증)를 정의하고, 웹 대시보드에서 진행 상황을 추적한다. 이 시스템으로 1인이 4개 프로덕션 서비스를 병렬로 개발·유지보수하는 것이 가능해졌다.',
    type: 'personal',
    status: 'live',
    tags: ['Claude Code', 'Claude API', 'Next.js 15', 'TypeScript', 'AI Workflow'],
    project_url: null,
    github_url: null,
    pdf_url: null,
    display_order: 5,
  },
  {
    title: 'RoundWait — 대규모 행사 대기열 관리',
    description: '기존 Go+MySQL 스택으로는 마비노기 Fantasy Party 2026(1만 명+)의 순간 트래픽을 감당할 수 없다고 판단해 Firebase 서버리스로 재구축했다. 자동 스케일링이 되는 Firestore로 예약 데이터를 이전하고, Cloud Run Job으로 GCP 내부에서 k6 부하 테스트를 돌려 네트워크 비용 없이 현실적인 부하를 재현했다. Dual Write 전략으로 기존 서비스 중단 없이 전환을 완료했고, 1만 명 동시 부하 테스트에서 예약 성공률 99.94%, 평균 처리 0.26초를 달성했다.',
    type: 'company',
    status: 'live',
    tags: ['Next.js', 'TypeScript', 'Firebase', 'Cloud Run', 'GCP', 'k6', 'GitHub Actions'],
    project_url: null,
    github_url: null,
    pdf_url: null,
    display_order: 10,
  },
  {
    title: 'TimeSlot — 행사 예약 운영 플랫폼',
    description: '매 행사마다 스프레드시트+카카오톡으로 예약을 수동 운영하던 문제를 해결하기 위해 만들었다. 슬롯 잔여석이 여러 기기에서 즉시 동기화돼야 해서 Firebase RTDB의 onSnapshot을 선택했고, 알림톡 발송은 별도 서버 없이 Cloud Functions으로 처리해 인프라 비용을 최소화했다. 아주대 전공멘토링 행사에 실전 투입해 예약~QR 체크인 전 사이클을 단일 시스템으로 운영했고, 당일 발생한 iOS 카카오 인앱 브라우저 버그를 Cloud Function HTTP 302 redirect로 즉석 패치해 배포했다.',
    type: 'company',
    status: 'live',
    tags: ['Next.js 15', 'TypeScript', 'Firebase', 'Cloud Functions', 'Solapi', 'GitHub Actions'],
    project_url: 'https://timeslot.congkong.net',
    github_url: null,
    pdf_url: null,
    display_order: 20,
  },
  {
    title: 'SalesPulse — VIP 세일즈 대시보드',
    description: 'VIP 체크인 후 담당 영업사원에게 알리는 과정이 수동 전달로 5~10분 걸려 영업 기회를 놓치는 문제가 있었다. 기존 Go Echo + Vue 3 플랫폼에 신규 모듈로 통합해 재개발 비용을 없앴고, 알림은 고루틴으로 비동기 처리해 체크인 응답 속도에 영향이 없다. IMAGINE AX 2026 컨퍼런스에 실전 투입, VIP 체크인 즉시 카카오 알림톡 자동 발송으로 지연을 0으로 줄였다.',
    type: 'company',
    status: 'live',
    tags: ['Go', 'Vue 3', 'TypeScript', 'Redis', 'MySQL', 'KakaoTalk'],
    project_url: null,
    github_url: null,
    pdf_url: null,
    display_order: 15,
  },
  {
    title: 'CongKong SaaS Chatbot',
    description: '고객사마다 다른 챗봇 요구사항을 개별 개발로 대응하던 방식이 코드 중복과 유지보수 불가 문제를 만들었다. pnpm Workspaces 모노레포로 위젯·어드민·Cloud Functions를 단일 레포에서 관리해 코드와 타입을 공유했고, Firestore path 설계로 siteId 기반 테넌트 데이터를 격리해 코드 수정 없이 고객사를 추가할 수 있는 구조를 만들었다. 1줄 script 태그로 30초 내 도입 가능한 위젯 CDN을 구현했고, 타이핑 인디케이터·파일첨부·이메일 답장 등 실시간 상담 기능을 탑재했다.',
    type: 'company',
    status: 'wip',
    tags: ['Vue 3', 'TypeScript', 'Firebase', 'pnpm Workspaces', 'Cloud Functions'],
    project_url: null,
    github_url: null,
    pdf_url: null,
    display_order: 30,
  },
  {
    title: 'BLE 체크인 미들웨어',
    description: 'BLE 게이트웨이가 COP API를 직접 호출하는 구조에서 디바운싱 없이 중복 요청이 쏟아지는 문제가 있었다. Go와 Redis로 30초 디바운싱 레이어를 만들어 중복 체크인을 차단하고, 고루틴 기반으로 동시 접속 수 제한 없이 처리할 수 있게 했다. API 실패 시 지수 백오프 3회 재시도를 붙여 게이트웨이-API 간 신뢰성을 확보했다.',
    type: 'company',
    status: 'live',
    tags: ['Go', 'Redis', 'REST API', 'Goroutine'],
    project_url: null,
    github_url: null,
    pdf_url: null,
    display_order: 12,
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

// ── 2. 아키텍처 & 기술 선택 로그 ────────────────────────────

const archLogs = [
  {
    title: 'RoundWait 아키텍처 — 왜 Firebase로 재구축했나',
    slug: 'roundwait-architecture-why-firebase',
    category: 'log',
    project: 'RoundWait',
    tags: ['Architecture', 'Firebase', 'Go', 'Cloud Run', 'k6', 'Dual Write'],
    published: true,
    created_at: '2026-06-01T10:00:00+09:00',
    content: `## 배경: 왜 Go+MySQL에서 Firebase로 바꿨나

마비노기 Fantasy Party 2026은 1만 명+ 규모 행사다. 기존 시스템(Go Echo + MySQL)은 예약 폭주 시 DB 커넥션 풀이 포화되는 구조였고, 수동 스케일링이 필요했다.

가장 큰 문제는 예측 불가능성이었다. 행사 당일 예약이 언제 몰릴지 모르는 상황에서 서버 스케일링 타이밍을 사람이 맞추는 건 리스크였다.

## 핵심 기술 선택과 이유

### Firebase Firestore (기존 MySQL 대체)
- **이유**: 트래픽 피크에 자동 스케일링, 서버 관리 없음
- **트레이드오프**: SQL 대비 복잡한 쿼리 불가 → 예약 데이터 구조를 단순하게 설계해서 해결
- **결과**: 1만 명 동시 부하에서 서버 개입 없이 처리

### Cloud Run + k6 (부하 테스트)
- **이유**: k6를 GCP 내부 Cloud Run Job으로 실행하면 외부 네트워크 비용 없이 현실적인 부하 재현 가능
- **방법**: Cloud Run Job이 k6를 실행 → asia-northeast3 리전에서 직접 부하 생성

\`\`\`
[Cloud Run Job] → k6 부하 생성 → [Firebase Functions] → [Firestore]
                                          ↓
                                   [KakaoTalk 알림]
\`\`\`

### Dual Write (무중단 마이그레이션)
- **이유**: 기존 서비스를 내리지 않고 새 스택으로 전환해야 했음
- **방법**: 일정 기간 MySQL과 Firestore에 동시 쓰기 → 데이터 정합성 확인 후 MySQL Read 제거

## 결과

| 지표 | 수치 |
|------|------|
| 1만 명 동시 부하 예약 성공률 | 99.94% |
| 평균 예약 처리 시간 | 0.26초 |
| 다운타임 | 0 (Dual Write 전환) |

## 배운 것

서버리스 스택은 "서버 관리를 안 해도 된다"는 장점이 있지만, Firestore 데이터 모델링이 핵심이다. SQL처럼 JOIN을 못 하기 때문에 읽기 패턴을 먼저 설계하고 거기에 맞게 문서 구조를 만들어야 한다.`,
  },
  {
    title: 'TimeSlot 아키텍처 — Firebase를 선택한 이유와 실전 검증',
    slug: 'timeslot-architecture-why-firebase',
    category: 'log',
    project: 'TimeSlot',
    tags: ['Architecture', 'Firebase', 'Next.js 15', 'Real-time', 'Cloud Functions'],
    published: true,
    created_at: '2026-04-10T10:00:00+09:00',
    content: `## 무엇을 만들었나

행사 예약 운영 시스템. 주최자가 슬롯을 만들면 참가자가 예약하고, 현장에서 QR로 체크인하는 전 사이클.

기존에는 구글 폼 + 스프레드시트 + 카카오 단체방으로 수동 운영했다. 실시간 현황 파악이 안 되고, 주최자 리소스가 많이 들었다.

## 핵심 기술 선택과 이유

### Firebase RTDB + Firestore (혼합 사용)
- **RTDB**: 슬롯 잔여석 카운터 — 여러 사용자가 동시에 예약할 때 onSnapshot으로 즉시 동기화 필요
- **Firestore**: 예약자 데이터 — 구조화된 문서 형태로 어드민 쿼리에 유리
- **이유**: 단순 카운터는 RTDB atomic increment가 Firestore보다 빠르고 충돌이 없다

### Next.js 15 App Router
- **이유**: SSR로 초기 로딩을 빠르게, 파일 기반 라우팅으로 어드민/참가자 권한 분기
- **트레이드오프**: \`useSearchParams\`가 Suspense 필수 → 처음에 이 규칙을 몰라서 빌드 오류 겪음

### Cloud Functions (서버리스 알림)
- **이유**: 별도 서버 없이 카카오 알림톡 발송 로직을 처리, 스타트업에서 인프라 비용 최소화
- **실제 문제**: Solapi IP 화이트리스트 + Cloud Run egress IP 미등록으로 배포 후 알림 실패 → egress IP 등록으로 해결

## 시스템 흐름

\`\`\`
참가자 → 예약 → Firestore 저장 + RTDB 카운터 감소
                        ↓
              Cloud Function 트리거
                        ↓
              Solapi 카카오 알림톡 발송
                        ↓
현장 QR 스캔 → 체크인 상태 업데이트 → 어드민 대시보드 실시간 반영
\`\`\`

## 실전 검증에서 터진 것들

아주대 전공멘토링 행사 당일에 3가지 버그가 현장에서 터졌다.

1. **iOS 카카오 인앱 브라우저**: JS로 외부 브라우저 전환 불가 → Cloud Function HTTP 302 redirect로 즉석 패치
2. **새로고침 시 슬롯 선택 초기화**: localStorage persist로 해결
3. **카운터 재계산 오류**: atomic increment 보완

코드는 PR 통과 후에도 완성이 아니다. 실제 사람들이 쓸 때 드러나는 버그가 있다.`,
  },
  {
    title: 'SalesPulse 아키텍처 — 기존 플랫폼에 신규 모듈 통합한 이유',
    slug: 'salespulse-architecture-module-integration',
    category: 'log',
    project: 'SalesPulse',
    tags: ['Architecture', 'Go', 'Vue 3', 'Redis', 'KakaoTalk'],
    published: true,
    created_at: '2026-05-25T10:00:00+09:00',
    content: `## 무엇을 만들었나

컨퍼런스 VIP 영업 지원 시스템. VIP가 체크인하면 담당 영업사원이 즉시 알림을 받고 모바일로 상담 현황을 관리한다.

## 왜 기존 플랫폼(Go+Vue 3)에 통합했나

새 서비스로 분리하는 대신 기존 Go Echo + Vue 3 플랫폼에 신규 모듈로 붙였다.

**이유**:
- 이미 인증, DB, 배포 파이프라인이 있음 → 재개발 없이 2배 빠른 개발
- 기존 코드베이스를 아는 팀이 유지보수
- IMAGINE AX 2026 행사까지 시간이 촉박했음

**트레이드오프**: 기존 플랫폼 의존성이 생김 → 독립 배포 불가

## 알림 지연을 0으로 줄인 방법

기존: VIP 체크인 → 담당자에게 수동 연락 → 5~10분 지연

### Go 고루틴 비동기 알림

\`\`\`go
func handleVIPCheckIn(c echo.Context) error {
    // 체크인 처리 (동기)
    if err := processCheckIn(vipID); err != nil {
        return err
    }

    // 알림 발송 (비동기 — 응답 지연 없음)
    go func() {
        assignedRep := getAssignedRep(vipID)
        sendKakaoNotification(assignedRep, vipInfo)
    }()

    return c.JSON(200, "ok")  // 알림 완료 기다리지 않고 즉시 응답
}
\`\`\`

체크인 응답은 알림 발송과 무관하게 즉시 반환한다. 알림이 실패해도 체크인 자체는 정상 처리된다.

## 결과

| 지표 | 전 | 후 |
|------|------|------|
| VIP 알림 지연 | 5~10분 (수동) | 즉시 (자동) |
| 개발 기간 | — | 기존 모듈 통합으로 단기 완성 |
| 검증 | — | IMAGINE AX 2026 행사 실전 투입 |`,
  },
  {
    title: 'CongKong Chatbot 아키텍처 — pnpm 모노레포와 멀티테넌트 설계',
    slug: 'congkong-chatbot-architecture-monorepo-multitenant',
    category: 'log',
    project: 'CongKong',
    tags: ['Architecture', 'pnpm Workspaces', 'Vue 3', 'Firebase', 'SaaS', 'Multitenant'],
    published: true,
    created_at: '2026-04-15T10:00:00+09:00',
    content: `## 무엇을 만들었나

SaaS 챗봇 플랫폼. 고객사가 1줄 script 태그를 붙이면 자체 브랜딩의 챗봇이 즉시 동작한다.

## 왜 pnpm Workspaces(모노레포)를 선택했나

이 프로젝트는 3개의 독립된 결과물이 있다.

- **widget**: 고객사 사이트에 임베드되는 JS 번들
- **admin**: 어드민 대시보드 (Vue 3 SPA)
- **functions**: Firebase Cloud Functions (서버 로직)

멀티레포로 나누면 타입 정의를 세 곳에 각각 유지해야 하고, widget과 functions 사이에 인터페이스가 맞지 않는 문제가 생긴다.

pnpm Workspaces로 하나의 레포에서 관리하면:
- \`packages/shared\`에 공통 타입 한 번만 정의
- widget ↔ functions 인터페이스가 컴파일 타임에 검증됨
- 한 번의 \`pnpm install\`로 전체 의존성 설치

## 멀티테넌트 Firestore 설계

고객사별 데이터 격리가 핵심이다.

\`\`\`
Firestore 구조:
/tenants/{siteId}/sessions/{sessionId}/messages/{messageId}
/tenants/{siteId}/settings
/tenants/{siteId}/agents/{agentId}
\`\`\`

siteId를 Firestore path의 최상위에 두면:
- Security Rules에서 \`siteId\` 하나로 모든 접근 제어 가능
- 코드 수정 없이 신규 고객사 추가 (Firestore에 siteId 문서 생성만 하면 됨)
- 고객사 데이터가 물리적으로 격리됨

## widget.js 임베드 설계

\`\`\`html
<!-- 고객사 사이트에 이것만 추가 -->
<script src="https://cdn.congkong.net/widget.js" data-site-id="acme"></script>
\`\`\`

widget.js는 Shadow DOM으로 스타일을 격리한다. 고객사 CSS가 챗봇에 영향을 주거나, 챗봇 스타일이 고객사 페이지를 오염시키지 않는다.

\`\`\`javascript
// Shadow DOM 격리
const shadow = this.attachShadow({ mode: 'closed' });
const style = document.createElement('style');
style.textContent = WIDGET_CSS; // 번들된 CSS
shadow.appendChild(style);
\`\`\`

## 배운 것

SaaS 설계에서 가장 중요한 결정은 테넌트 격리 방법이다. Firestore path 설계를 처음부터 \`/tenants/{siteId}/...\`로 잡으면 나중에 고객사를 추가할 때 코드를 전혀 바꾸지 않아도 된다. 이 결정을 나중에 바꾸려면 전체 데이터 마이그레이션이 필요하다.`,
  },
];

console.log('\n아키텍처 로그 upsert 시작...\n');
ok = 0; fail = 0;

for (const log of archLogs) {
  const excerpt = log.content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#*`>\-_\[\]!|]/g, '')
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

console.log(`\n아키텍처 로그: 성공 ${ok}건 / 실패 ${fail}건`);
console.log('\n전체 완료.');
