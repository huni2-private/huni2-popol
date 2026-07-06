-- ============================================================
-- Company Projects Seed — CongKong (chatbot + timeslot)
-- Run in Supabase Dashboard > SQL Editor
-- ============================================================

-- ── 1. Projects (문제→선택→결과 구조) ───────────────────────

INSERT INTO projects (title, description, type, status, tags, project_url, github_url, pdf_url, display_order)
VALUES
(
  'RoundWait — 대규모 행사 대기열 관리',
  '기존 Go+MySQL 스택으로는 마비노기 Fantasy Party 2026(1만 명+)의 순간 트래픽을 감당할 수 없다고 판단해 Firebase 서버리스로 재구축했다. 자동 스케일링이 되는 Firestore로 예약 데이터를 이전하고, Cloud Run Job으로 GCP 내부에서 k6 부하 테스트를 돌려 네트워크 비용 없이 현실적인 부하를 재현했다. Dual Write 전략으로 기존 서비스 중단 없이 전환을 완료했고, 1만 명 동시 부하 테스트에서 예약 성공률 99.94%, 평균 처리 0.26초를 달성했다.',
  'company',
  'live',
  ARRAY['Next.js', 'TypeScript', 'Firebase', 'Cloud Run', 'GCP', 'k6', 'GitHub Actions'],
  NULL,
  NULL,
  NULL,
  10
),
(
  'TimeSlot — 행사 예약 운영 플랫폼',
  '매 행사마다 스프레드시트+카카오톡으로 예약을 수동 운영하던 문제를 해결하기 위해 만들었다. 슬롯 잔여석이 여러 기기에서 즉시 동기화돼야 해서 Firebase RTDB의 onSnapshot을 선택했고, 알림톡 발송은 별도 서버 없이 Cloud Functions으로 처리해 인프라 비용을 최소화했다. 아주대 전공멘토링 행사에 실전 투입해 예약~QR 체크인 전 사이클을 단일 시스템으로 운영했고, 당일 발생한 iOS 카카오 인앱 브라우저 버그를 Cloud Function HTTP 302 redirect로 즉석 패치해 배포했다.',
  'company',
  'live',
  ARRAY['Next.js 15', 'TypeScript', 'Firebase', 'Cloud Functions', 'Solapi', 'GitHub Actions'],
  'https://timeslot.congkong.net',
  NULL,
  NULL,
  20
),
(
  'SalesPulse — VIP 세일즈 대시보드',
  'VIP 체크인 후 담당 영업사원에게 알리는 과정이 수동 전달로 5~10분 걸려 영업 기회를 놓치는 문제가 있었다. 기존 Go Echo + Vue 3 플랫폼에 신규 모듈로 통합해 재개발 비용을 없앴고, 알림은 고루틴으로 비동기 처리해 체크인 응답 속도에 영향이 없다. IMAGINE AX 2026 컨퍼런스에 실전 투입, VIP 체크인 즉시 카카오 알림톡 자동 발송으로 지연을 0으로 줄였다.',
  'company',
  'live',
  ARRAY['Go', 'Vue 3', 'TypeScript', 'Redis', 'MySQL', 'KakaoTalk'],
  NULL,
  NULL,
  NULL,
  15
),
(
  'CongKong SaaS Chatbot',
  '고객사마다 다른 챗봇 요구사항을 개별 개발로 대응하던 방식이 코드 중복과 유지보수 불가 문제를 만들었다. pnpm Workspaces 모노레포로 위젯·어드민·Cloud Functions를 단일 레포에서 관리해 코드와 타입을 공유했고, Firestore path 설계로 siteId 기반 테넌트 데이터를 격리해 코드 수정 없이 고객사를 추가할 수 있는 구조를 만들었다. 1줄 script 태그로 30초 내 도입 가능한 위젯 CDN을 구현했고, 타이핑 인디케이터·파일첨부·이메일 답장 등 실시간 상담 기능을 탑재했다.',
  'company',
  'wip',
  ARRAY['Vue 3', 'TypeScript', 'Firebase', 'pnpm Workspaces', 'Cloud Functions'],
  NULL,
  NULL,
  NULL,
  30
),
(
  'BLE 체크인 미들웨어',
  'BLE 게이트웨이가 COP API를 직접 호출하는 구조에서 디바운싱 없이 중복 요청이 쏟아지는 문제가 있었다. Go와 Redis로 30초 디바운싱 레이어를 만들어 중복 체크인을 차단하고, 고루틴 기반으로 동시 접속 수 제한 없이 처리할 수 있게 했다. API 실패 시 지수 백오프 3회 재시도를 붙여 게이트웨이-API 간 신뢰성을 확보했다.',
  'company',
  'live',
  ARRAY['Go', 'Redis', 'REST API', 'Goroutine'],
  NULL,
  NULL,
  NULL,
  12
)
ON CONFLICT (title) DO UPDATE SET
  description  = EXCLUDED.description,
  type         = EXCLUDED.type,
  status       = EXCLUDED.status,
  tags         = EXCLUDED.tags,
  project_url  = EXCLUDED.project_url,
  github_url   = EXCLUDED.github_url,
  pdf_url      = EXCLUDED.pdf_url,
  display_order = EXCLUDED.display_order;


-- ── 2. Architecture & Tech-choice Logs ──────────────────────

INSERT INTO logs (title, slug, excerpt, content, tags, category, project, published, created_at)
VALUES (
  'RoundWait 아키텍처 — 왜 Firebase로 재구축했나',
  'roundwait-architecture-why-firebase',
  '기존 Go+MySQL 스택의 자동 스케일링 한계를 파악하고 Firebase 서버리스로 재구축한 이유. Dual Write 무중단 전환과 Cloud Run k6 부하 테스트 설계 기록.',
  E'## 배경: 왜 Go+MySQL에서 Firebase로 바꿨나\n\n마비노기 Fantasy Party 2026은 1만 명+ 규모 행사다. 기존 시스템(Go Echo + MySQL)은 예약 폭주 시 DB 커넥션 풀이 포화되는 구조였고, 수동 스케일링이 필요했다.\n\n가장 큰 문제는 예측 불가능성이었다. 행사 당일 예약이 언제 몰릴지 모르는 상황에서 서버 스케일링 타이밍을 사람이 맞추는 건 리스크였다.\n\n## 핵심 기술 선택과 이유\n\n### Firebase Firestore (기존 MySQL 대체)\n- **이유**: 트래픽 피크에 자동 스케일링, 서버 관리 없음\n- **트레이드오프**: SQL 대비 복잡한 쿼리 불가 → 예약 데이터 구조를 단순하게 설계해서 해결\n- **결과**: 1만 명 동시 부하에서 서버 개입 없이 처리\n\n### Cloud Run + k6 (부하 테스트)\n- **이유**: k6를 GCP 내부 Cloud Run Job으로 실행하면 외부 네트워크 비용 없이 현실적인 부하 재현 가능\n- **방법**: Cloud Run Job이 k6를 실행 → asia-northeast3 리전에서 직접 부하 생성\n\n```\n[Cloud Run Job] → k6 부하 생성 → [Firebase Functions] → [Firestore]\n                                          ↓\n                                   [KakaoTalk 알림]\n```\n\n### Dual Write (무중단 마이그레이션)\n- **이유**: 기존 서비스를 내리지 않고 새 스택으로 전환해야 했음\n- **방법**: 일정 기간 MySQL과 Firestore에 동시 쓰기 → 데이터 정합성 확인 후 MySQL Read 제거\n\n## 결과\n\n| 지표 | 수치 |\n|------|------|\n| 1만 명 동시 부하 예약 성공률 | 99.94% |\n| 평균 예약 처리 시간 | 0.26초 |\n| 다운타임 | 0 (Dual Write 전환) |\n\n## 배운 것\n\n서버리스 스택은 "서버 관리를 안 해도 된다"는 장점이 있지만, Firestore 데이터 모델링이 핵심이다. SQL처럼 JOIN을 못 하기 때문에 읽기 패턴을 먼저 설계하고 거기에 맞게 문서 구조를 만들어야 한다.',
  ARRAY['Architecture', 'Firebase', 'Go', 'Cloud Run', 'k6', 'Dual Write'],
  'log',
  'RoundWait',
  true,
  '2026-06-01T10:00:00+09:00'
),
(
  'TimeSlot 아키텍처 — Firebase를 선택한 이유와 실전 검증',
  'timeslot-architecture-why-firebase',
  '슬롯 잔여석 실시간 동기화를 위해 Firebase RTDB를 선택한 이유, Cloud Functions 서버리스 알림 설계, 아주대 행사 당일 터진 버그 3종 기록.',
  E'## 무엇을 만들었나\n\n행사 예약 운영 시스템. 주최자가 슬롯을 만들면 참가자가 예약하고, 현장에서 QR로 체크인하는 전 사이클.\n\n기존에는 구글 폼 + 스프레드시트 + 카카오 단체방으로 수동 운영했다. 실시간 현황 파악이 안 되고, 주최자 리소스가 많이 들었다.\n\n## 핵심 기술 선택과 이유\n\n### Firebase RTDB + Firestore (혼합 사용)\n- **RTDB**: 슬롯 잔여석 카운터 — 여러 사용자가 동시에 예약할 때 onSnapshot으로 즉시 동기화 필요\n- **Firestore**: 예약자 데이터 — 구조화된 문서 형태로 어드민 쿼리에 유리\n- **이유**: 단순 카운터는 RTDB atomic increment가 Firestore보다 빠르고 충돌이 없다\n\n### Next.js 15 App Router\n- **이유**: SSR로 초기 로딩을 빠르게, 파일 기반 라우팅으로 어드민/참가자 권한 분기\n- **트레이드오프**: `useSearchParams`가 Suspense 필수 → 처음에 이 규칙을 몰라서 빌드 오류 겪음\n\n### Cloud Functions (서버리스 알림)\n- **이유**: 별도 서버 없이 카카오 알림톡 발송 로직을 처리, 스타트업에서 인프라 비용 최소화\n- **실제 문제**: Solapi IP 화이트리스트 + Cloud Run egress IP 미등록으로 배포 후 알림 실패 → egress IP 등록으로 해결\n\n## 시스템 흐름\n\n```\n참가자 → 예약 → Firestore 저장 + RTDB 카운터 감소\n                        ↓\n              Cloud Function 트리거\n                        ↓\n              Solapi 카카오 알림톡 발송\n                        ↓\n현장 QR 스캔 → 체크인 상태 업데이트 → 어드민 대시보드 실시간 반영\n```\n\n## 실전 검증에서 터진 것들\n\n아주대 전공멘토링 행사 당일에 3가지 버그가 현장에서 터졌다.\n\n1. **iOS 카카오 인앱 브라우저**: JS로 외부 브라우저 전환 불가 → Cloud Function HTTP 302 redirect로 즉석 패치\n2. **새로고침 시 슬롯 선택 초기화**: localStorage persist로 해결\n3. **카운터 재계산 오류**: atomic increment 보완\n\n코드는 PR 통과 후에도 완성이 아니다. 실제 사람들이 쓸 때 드러나는 버그가 있다.',
  ARRAY['Architecture', 'Firebase', 'Next.js 15', 'Real-time', 'Cloud Functions'],
  'log',
  'TimeSlot',
  true,
  '2026-04-10T10:00:00+09:00'
),
(
  'SalesPulse 아키텍처 — 기존 플랫폼에 신규 모듈 통합한 이유',
  'salespulse-architecture-module-integration',
  'VIP 알림 5~10분 지연을 0으로 줄인 방법. 새 서비스 대신 기존 Go+Vue 3 플랫폼에 모듈로 통합한 이유와 고루틴 비동기 알림 설계.',
  E'## 무엇을 만들었나\n\n컨퍼런스 VIP 영업 지원 시스템. VIP가 체크인하면 담당 영업사원이 즉시 알림을 받고 모바일로 상담 현황을 관리한다.\n\n## 왜 기존 플랫폼(Go+Vue 3)에 통합했나\n\n새 서비스로 분리하는 대신 기존 Go Echo + Vue 3 플랫폼에 신규 모듈로 붙였다.\n\n**이유**:\n- 이미 인증, DB, 배포 파이프라인이 있음 → 재개발 없이 2배 빠른 개발\n- 기존 코드베이스를 아는 팀이 유지보수\n- IMAGINE AX 2026 행사까지 시간이 촉박했음\n\n**트레이드오프**: 기존 플랫폼 의존성이 생김 → 독립 배포 불가\n\n## 알림 지연을 0으로 줄인 방법\n\n기존: VIP 체크인 → 담당자에게 수동 연락 → 5~10분 지연\n\n### Go 고루틴 비동기 알림\n\n```go\nfunc handleVIPCheckIn(c echo.Context) error {\n    // 체크인 처리 (동기)\n    if err := processCheckIn(vipID); err != nil {\n        return err\n    }\n\n    // 알림 발송 (비동기 — 응답 지연 없음)\n    go func() {\n        assignedRep := getAssignedRep(vipID)\n        sendKakaoNotification(assignedRep, vipInfo)\n    }()\n\n    return c.JSON(200, "ok")  // 알림 완료 기다리지 않고 즉시 응답\n}\n```\n\n체크인 응답은 알림 발송과 무관하게 즉시 반환한다. 알림이 실패해도 체크인 자체는 정상 처리된다.\n\n## 결과\n\n| 지표 | 전 | 후 |\n|------|------|------|\n| VIP 알림 지연 | 5~10분 (수동) | 즉시 (자동) |\n| 개발 기간 | — | 기존 모듈 통합으로 단기 완성 |\n| 검증 | — | IMAGINE AX 2026 행사 실전 투입 |',
  ARRAY['Architecture', 'Go', 'Vue 3', 'Redis', 'KakaoTalk'],
  'log',
  'SalesPulse',
  true,
  '2026-05-25T10:00:00+09:00'
),
(
  'CongKong Chatbot 아키텍처 — pnpm 모노레포와 멀티테넌트 설계',
  'congkong-chatbot-architecture-monorepo-multitenant',
  'SaaS 챗봇의 멀티테넌트 격리를 Firestore path 설계로 해결한 방법. pnpm Workspaces로 위젯·어드민·Cloud Functions를 하나의 레포에서 관리한 이유.',
  E'## 무엇을 만들었나\n\nSaaS 챗봇 플랫폼. 고객사가 1줄 script 태그를 붙이면 자체 브랜딩의 챗봇이 즉시 동작한다.\n\n## 왜 pnpm Workspaces(모노레포)를 선택했나\n\n이 프로젝트는 3개의 독립된 결과물이 있다.\n\n- **widget**: 고객사 사이트에 임베드되는 JS 번들\n- **admin**: 어드민 대시보드 (Vue 3 SPA)\n- **functions**: Firebase Cloud Functions (서버 로직)\n\n멀티레포로 나누면 타입 정의를 세 곳에 각각 유지해야 하고, widget과 functions 사이에 인터페이스가 맞지 않는 문제가 생긴다.\n\npnpm Workspaces로 하나의 레포에서 관리하면:\n- `packages/shared`에 공통 타입 한 번만 정의\n- widget ↔ functions 인터페이스가 컴파일 타임에 검증됨\n- 한 번의 `pnpm install`로 전체 의존성 설치\n\n## 멀티테넌트 Firestore 설계\n\n고객사별 데이터 격리가 핵심이다.\n\n```\nFirestore 구조:\n/tenants/{siteId}/sessions/{sessionId}/messages/{messageId}\n/tenants/{siteId}/settings\n/tenants/{siteId}/agents/{agentId}\n```\n\nsiteId를 Firestore path의 최상위에 두면:\n- Security Rules에서 `siteId` 하나로 모든 접근 제어 가능\n- 코드 수정 없이 신규 고객사 추가 (Firestore에 siteId 문서 생성만 하면 됨)\n- 고객사 데이터가 물리적으로 격리됨\n\n## widget.js 임베드 설계\n\n```html\n<!-- 고객사 사이트에 이것만 추가 -->\n<script src="https://cdn.congkong.net/widget.js" data-site-id="acme"></script>\n```\n\nwidget.js는 Shadow DOM으로 스타일을 격리한다. 고객사 CSS가 챗봇에 영향을 주거나, 챗봇 스타일이 고객사 페이지를 오염시키지 않는다.\n\n```javascript\n// Shadow DOM 격리\nconst shadow = this.attachShadow({ mode: ''closed'' });\nconst style = document.createElement(''style'');\nstyle.textContent = WIDGET_CSS; // 번들된 CSS\nshadow.appendChild(style);\n```\n\n## 배운 것\n\nSaaS 설계에서 가장 중요한 결정은 테넌트 격리 방법이다. Firestore path 설계를 처음부터 `/tenants/{siteId}/...`로 잡으면 나중에 고객사를 추가할 때 코드를 전혀 바꾸지 않아도 된다. 이 결정을 나중에 바꾸려면 전체 데이터 마이그레이션이 필요하다.',
  ARRAY['Architecture', 'pnpm Workspaces', 'Vue 3', 'Firebase', 'SaaS', 'Multitenant'],
  'log',
  'CongKong',
  true,
  '2026-04-15T10:00:00+09:00'
)
ON CONFLICT (slug) DO UPDATE SET
  title    = EXCLUDED.title,
  excerpt  = EXCLUDED.excerpt,
  content  = EXCLUDED.content,
  tags     = EXCLUDED.tags,
  category = EXCLUDED.category,
  project  = EXCLUDED.project,
  published = EXCLUDED.published,
  created_at = EXCLUDED.created_at;


-- ── 3. Existing troubleshooting logs (keep as-is) ────────────

INSERT INTO logs (title, slug, excerpt, content, tags, category, published)
VALUES (
  'GitHub Actions + Firebase 배포 삽질기 (403, ESLint, Secrets)',
  'timeslot-firebase-cicd-troubleshooting',
  'w9jds/firebase-action 403 권한 오류, ESLint 설정 누락, GCP 서비스 계정 권한 문제를 순서대로 해결한 기록.',
  E'# GitHub Actions + Firebase 배포 삽질기\n\n**프로젝트**: TimeSlot Event OS\n**날짜**: 2026-03-25 ~ 2026-03-26\n\n## 문제 1 — `w9jds/firebase-action` 403 Forbidden\n\n`w9jds/firebase-action` 대신 `google-github-actions/auth@v2`로 교체하면 해결.\n\n## 문제 2 — 서비스 계정 권한 부족\n\nFirebase Admin + Service Usage Consumer + Cloud Build Service Account 역할 추가.\n\n## 문제 3 — CI에서 lint 실패\n\n`functions/.eslintrc.js` 파일 생성.\n\n## 문제 4 — secrets 로그 마스킹\n\nheredoc 대신 env block + echo 방식으로 변경.',
  ARRAY['GitHub Actions', 'Firebase', 'CI/CD', 'ESLint', 'GCP', 'Troubleshooting'],
  'log',
  true
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO logs (title, slug, excerpt, content, tags, category, published)
VALUES (
  'CDN React → Next.js 15 App Router 마이그레이션 삽질기',
  'timeslot-nextjs-migration-troubleshooting',
  'useSearchParams 정적 빌드 오류, 환경변수 누락 late discovery, AdminApp 1,955줄 모노리스가 된 사연.',
  E'# CDN React → Next.js 15 마이그레이션 삽질기\n\n**프로젝트**: TimeSlot Event OS\n**날짜**: 2026-04-03 ~ 2026-04-05\n\n## 핵심 교훈\n\n- `useSearchParams`는 Suspense 경계 필수\n- `.env.example`을 구현 전에 먼저 작성\n- Next.js App Router에서 탭 UI는 파일 기반 라우팅(`/admin/[tab]`)으로 처음부터 설계',
  ARRAY['Next.js 15', 'App Router', 'Firebase', 'Suspense', 'Migration', 'Troubleshooting'],
  'log',
  true
)
ON CONFLICT (slug) DO NOTHING;
