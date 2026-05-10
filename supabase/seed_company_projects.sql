-- ============================================================
-- Company Projects Seed — CongKong (chatbot + timeslot)
-- Run in Supabase Dashboard > SQL Editor
-- ============================================================

-- ── 1. Projects ─────────────────────────────────────────────

INSERT INTO projects (title, description, type, status, tags, project_url, github_url, pdf_url, display_order)
VALUES
(
  'TimeSlot Event OS',
  'Firebase + Next.js 15 기반 이벤트 예약 운영 플랫폼. 시간대별 슬롯 관리, 부스 QR 체크인, Solapi 알림톡 자동 발송, Google OAuth 어드민, GitHub Actions CI/CD 자동 배포까지 풀사이클 운영 시스템.',
  'company',
  'live',
  ARRAY['Next.js 15', 'TypeScript', 'Firebase', 'Tailwind CSS', 'GitHub Actions', 'Solapi', 'Cloud Functions'],
  'https://timeslot.congkong.net',
  NULL,
  NULL,
  10
),
(
  'CongKong SaaS Chatbot',
  'Firebase 인프라 위의 멀티테넌트 SaaS 챗봇 플랫폼. 1줄 script 태그 임베드로 30초 내 도입 가능한 위젯 CDN, Vue 3 어드민 대시보드, siteId 기반 테넌트 격리까지 설계·구현.',
  'company',
  'wip',
  ARRAY['Vue 3', 'TypeScript', 'Firebase', 'Vite', 'pnpm Workspaces', 'SaaS', 'Cloud Functions'],
  NULL,
  NULL,
  NULL,
  20
);


-- ── 2. Logs (Troubleshooting) ────────────────────────────────

-- [1] TimeSlot — GitHub Actions + Firebase 배포 트러블슈팅
INSERT INTO logs (title, slug, excerpt, content, tags, category, published)
VALUES (
  'GitHub Actions + Firebase 배포 삽질기 (403, ESLint, Secrets)',
  'timeslot-firebase-cicd-troubleshooting',
  'w9jds/firebase-action 403 권한 오류, ESLint 설정 누락, GCP 서비스 계정 권한 문제를 순서대로 해결한 기록.',
  E'# GitHub Actions + Firebase 배포 삽질기\n\n**프로젝트**: TimeSlot Event OS\n**날짜**: 2026-03-25 ~ 2026-03-26\n\n---\n\n## 문제 1 — `w9jds/firebase-action` 403 Forbidden\n\n### 증상\n```\nError: HTTP Error: 403, The caller does not have permission\n```\n\nGitHub Actions에서 `w9jds/firebase-action`을 사용해 배포하면 403 오류 발생.\n\n### 원인\n`w9jds/firebase-action`의 GCP 인증 방식이 최신 Google Cloud 정책과 충돌.\nService Account JSON을 `GCP_SA_KEY`로 넘기는 방식이 일부 프로젝트 설정에서 권한 거부.\n\n### 해결\n`google-github-actions/auth@v2` (Google 공식 액션)으로 교체.\n\n```yaml\n# Before\n- uses: w9jds/firebase-action@master\n  with:\n    args: deploy --only hosting,functions\n  env:\n    GCP_SA_KEY: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}\n\n# After\n- uses: google-github-actions/auth@v2\n  with:\n    credentials_json: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}\n- run: npm install -g firebase-tools\n- run: firebase deploy --only hosting,functions\n```\n\n**핵심**: 서드파티 Firebase 액션보다 Google 공식 Auth 액션 + Firebase CLI 직접 호출이 더 안정적.\n\n---\n\n## 문제 2 — 서비스 계정 권한 부족 (Cloud Billing API)\n\n### 증상\n```\nError: Service Usage API has not been used in project ... before or it is disabled.\n```\n\n구글 공식 액션으로 바꿔도 배포 실패.\n\n### 원인\n1. 서비스 계정에 `Service Usage Consumer` 역할 누락\n2. Cloud Billing API 미활성화\n\n### 해결\n\nFirebase 콘솔 → IAM → 서비스 계정 역할 추가:\n- `Firebase Admin`\n- `Service Usage Consumer`\n- `Cloud Build Service Account` (선택)\n\nGCP 콘솔 → API 및 서비스 → Cloud Billing API 활성화.\n\n**팁**: 서비스 계정 생성 시 권한 체크리스트를 미리 검증하면 이 단계를 건너뛸 수 있다.\n\n---\n\n## 문제 3 — CI에서 `npm run lint` 실패\n\n### 증상\n```\nsh: eslint: command not found\n```\nor\n```\nESLint couldn''t find a configuration file.\n```\n\n### 원인\n`functions/` 디렉토리에 `.eslintrc.js` 파일이 없었음.\n\n### 해결\n`functions/.eslintrc.js` 생성:\n\n```javascript\nmodule.exports = {\n  env: { es6: true, node: true },\n  parserOptions: { ecmaVersion: 2020 },\n  extends: ["eslint:recommended"],\n  rules: {\n    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],\n    "no-console": "off",\n  },\n};\n```\n\n**교훈**: CI 파이프라인에 lint 스텝 추가 전에 로컬에서 `npm run lint`가 실제로 작동하는지 반드시 확인.\n\n---\n\n## 문제 4 — functions/.env 로그 마스킹\n\n### 증상\nCI 로그에 secrets 값이 그대로 출력될 위험.\n\n### 해결\nheredoc 대신 `env` 블록 + `echo` 방식으로 변경:\n\n```yaml\n# Before (위험)\n- run: |\n    cat <<EOF > functions/.env\n    SOLAPI_API_KEY=${{ secrets.SOLAPI_API_KEY }}\n    EOF\n\n# After (안전 — GitHub이 자동 마스킹)\n- name: Create .env\n  env:\n    SOLAPI_API_KEY: ${{ secrets.SOLAPI_API_KEY }}\n  run: echo "SOLAPI_API_KEY=$SOLAPI_API_KEY" >> functions/.env\n```\n\n환경변수 블록에 secret을 넣으면 GitHub Actions가 로그에서 자동으로 `***` 마스킹 처리한다.\n\n---\n\n## 최종 결과\n\n| 문제 | 원인 | 해결 |\n|------|------|------|\n| 403 Forbidden | 서드파티 action GCP 인증 실패 | google-github-actions/auth@v2 |\n| Cloud Billing API 오류 | 서비스 계정 권한 누락 | IAM 역할 + API 활성화 |\n| lint 실패 | .eslintrc.js 없음 | functions/.eslintrc.js 생성 |\n| secrets 로그 노출 위험 | heredoc 방식 | env block + echo 방식 |',
  ARRAY['GitHub Actions', 'Firebase', 'CI/CD', 'ESLint', 'GCP', 'Troubleshooting'],
  'log',
  true
);


-- [2] TimeSlot — Next.js 15 마이그레이션 트러블슈팅
INSERT INTO logs (title, slug, excerpt, content, tags, category, published)
VALUES (
  'CDN React → Next.js 15 App Router 마이그레이션 삽질기',
  'timeslot-nextjs-migration-troubleshooting',
  'useSearchParams 정적 빌드 오류, 환경변수 누락 late discovery, AdminApp 1,955줄 모노리스가 된 사연.',
  E'# CDN React → Next.js 15 마이그레이션 삽질기\n\n**프로젝트**: TimeSlot Event OS\n**날짜**: 2026-04-03 ~ 2026-04-05\n**배경**: 5개 HTML 파일(6,135 LOC)을 Next.js 15 App Router로 전환\n\n---\n\n## 문제 1 — `useSearchParams()` 정적 빌드 오류\n\n### 증상\n```\nError: useSearchParams() should be wrapped in a suspense boundary at page "/sso"\n  useSearchParams\n    at SSOPage\n```\n\n`npm run build` 시 `/sso` 페이지에서 정적 빌드 실패.\n\n### 원인\nNext.js 15에서 `useSearchParams()`는 동적 기능(Dynamic Feature)으로 분류된다.\nSuspense 경계 없이 사용하면 정적 생성(Static Generation) 단계에서 오류 발생.\n\n### 해결\nSuspense로 분리:\n\n```tsx\n// Before — 빌드 실패\nexport default function SSOPage() {\n  const params = useSearchParams(); // ❌\n  ...\n}\n\n// After — 빌드 성공\nexport default function SSOPage() {\n  return (\n    <Suspense fallback={<div>로딩 중...</div>}>\n      <SSOHandler />\n    </Suspense>\n  );\n}\n\nfunction SSOHandler() {\n  const params = useSearchParams(); // ✅ Suspense 내부\n  ...\n}\n```\n\n**규칙**: `useSearchParams`, `useRouter`, `usePathname` 등 동적 훅은 Suspense 경계 안에서 사용.\n\n---\n\n## 문제 2 — 환경변수 late-stage discovery\n\n### 증상\nApp Hosting 배포 후 일부 기능 작동 안 함.\n확인해보니 `GEMINI_API_KEY`, `BULK_SEND_URL`이 `apphosting.yaml`에 누락.\n\n### 원인\n구현 시작 전 `.env.example`을 작성하지 않아서, 어떤 환경변수가 필요한지 전체 파악이 늦었음.\n\n### 해결\n`apphosting.yaml`에 누락된 환경변수 추가.\n그리고 앞으로는 구현 전에 `.env.example`을 먼저 작성:\n\n```\n# .env.example\nNEXT_PUBLIC_FIREBASE_API_KEY=\nNEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=\nNEXT_PUBLIC_FIREBASE_PROJECT_ID=\nNEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=\nNEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=\nNEXT_PUBLIC_FIREBASE_APP_ID=\nGEMINI_API_KEY=\nBULK_SEND_URL=\nREFIRED_NOTIFICATION_URL=\n```\n\n**교훈**: `.env.example`은 구현 이전 인프라 문서다. 먼저 작성하면 배포 단계에서 놀라지 않는다.\n\n---\n\n## 문제 3 — AdminApp.tsx가 1,955줄 모노리스가 된 이유\n\n### 상황\n어드민 대시보드를 단일 `AdminApp.tsx`에 7개 탭(대시보드, 스케줄, 체크인, AI 운영, SOS, 부스로그, 계정)을 모두 구현.\n결과: 1,955 LOC.\n\n### 원인\n레거시 HTML에서 탭 전환이 JavaScript `display: none/block` 방식이었고,\n이를 그대로 React state로 옮기다 보니 파일 분리 없이 한 컴포넌트에 누적.\n\nNext.js는 탭이 아닌 라우트(`/admin/schedule`, `/admin/checkin`)가 자연스러운 패턴인데,\n마이그레이션 속도 우선으로 구조 변경 없이 진행.\n\n### 현재 대응\n이 파일은 별도 PDCA 사이클(`admin-refactor`)로 분리 예정.\n당장 기능적으로는 문제 없으므로 지금은 유지.\n\n**교훈**: Next.js App Router 마이그레이션 시 탭 UI는 반드시 파일 기반 라우팅으로 설계해야 한다.\n탭 = `/admin/[tab]` 구조. 나중에 쪼개면 state 추출, URL 구조 변경이 동시에 발생해서 더 어렵다.\n\n---\n\n## 결과 요약\n\n| 문제 | 교훈 |\n|------|------|\n| useSearchParams 빌드 오류 | 동적 훅은 Suspense 경계 필수 |\n| 환경변수 late discovery | .env.example을 구현 전에 작성 |\n| 모노리틱 Admin 컴포넌트 | Next.js 탭 = 파일 기반 라우팅으로 처음부터 설계 |',
  ARRAY['Next.js 15', 'App Router', 'Firebase', 'Suspense', 'Migration', 'Troubleshooting'],
  'log',
  true
);


-- [3] TimeSlot — 프로덕션 릴리스 2026-04-17 트러블슈팅
INSERT INTO logs (title, slug, excerpt, content, tags, category, published)
VALUES (
  'iOS 카카오톡 링크 안 열림, CORS, Solapi 크레덴셜 순서 문제',
  'timeslot-production-release-apr17-troubleshooting',
  'iOS KakaoTalk 인앱 브라우저에서 외부 링크가 Safari로 전환되지 않는 문제와 CORS, Solapi 인증 오류 해결 기록.',
  E'# 프로덕션 릴리스 삽질기 (2026-04-17)\n\n**프로젝트**: TimeSlot Event OS\n**날짜**: 2026-04-17 (집중 배포 세션)\n\n---\n\n## 문제 1 — iOS KakaoTalk 인앱 브라우저에서 링크가 열리지 않음\n\n### 증상\nSolapi 알림톡에서 이벤트 링크 클릭 시 iOS KakaoTalk 인앱 브라우저에서 페이지가 열리지만,\nSafari로 전환이 되지 않아 일부 기능(특히 Firebase Auth) 동작 불가.\n\n### 원인\n기존 `app/open/page.tsx`에서 JavaScript로 `kakaotalk://` 스킴을 호출하려 했는데,\niOS는 **사용자 제스처 없는 JS 스킴 호출을 차단**한다.\n\n```typescript\n// 실패하는 방식 — iOS에서 동작 안 함\nwindow.location.href = `kakaotalk://web/openExternal?url=${targetUrl}`;\n```\n\n### 해결\nCloud Function(`openRedirect`)으로 서버 사이드 **HTTP 302 redirect**:\n\niOS는 JS 스킴은 막지만 HTTP 302 응답의 `Location` 헤더는 따른다.\n\n```javascript\n// functions/index.js — openRedirect 함수\nexports.openRedirect = onRequest(\n  { region: "asia-northeast3" },\n  (req, res) => {\n    const eventSlug = req.query.e;\n    const ua = req.get("User-Agent") || "";\n    const isKakaoTalk = ua.includes("KAKAOTALK");\n    const isAndroid = ua.includes("Android");\n\n    if (isKakaoTalk && !isAndroid) {\n      // iOS: kakaotalk:// 스킴 — HTTP 302로만 가능\n      return res.redirect(302,\n        `kakaotalk://web/openExternal?url=https://timeslot.congkong.net/events/${eventSlug}`\n      );\n    }\n    if (isKakaoTalk && isAndroid) {\n      // Android: Chrome intent\n      return res.redirect(302,\n        `intent://timeslot.congkong.net/events/${eventSlug}#Intent;` +\n        `scheme=https;package=com.android.chrome;end`\n      );\n    }\n    return res.redirect(302, `/events/${eventSlug}`);\n  }\n);\n```\n\n`firebase.json` rewrite로 `/open` 경로를 함수로 연결:\n```json\n{\n  "source": "/open",\n  "function": "openRedirect"\n}\n```\n\n**핵심**: iOS에서 JS로 앱 스킴 열기 = 불가. HTTP 302 = 가능. 반드시 서버 사이드로.\n\n---\n\n## 문제 2 — Cloud Functions CORS preflight 오류\n\n### 증상\n```\nAccess to fetch at ''https://asia-northeast3-timeslot-99a39.cloudfunctions.net/...'' has been blocked by CORS policy\n```\n\n### 원인\nCloud Functions를 `us-central1`에서 `asia-northeast3`으로 리전 이전 후,\n`lib/firebase.ts`의 `BULK_SEND_URL`, `RESEND_NOTIFICATION_URL` 등이 구 리전 URL을 사용.\n\n### 해결\n1. `setGlobalOptions({location: "asia-northeast3"})` 으로 Functions 전체 리전 통일\n2. `lib/firebase.ts` URL 상수 모두 `asia-northeast3` URL로 업데이트\n3. `cors.json`의 허용 오리진 재확인\n\n```typescript\n// lib/firebase.ts\nexport const BULK_SEND_URL = \n  "https://asia-northeast3-timeslot-99a39.cloudfunctions.net/bulkSendNotification";\nexport const RESEND_NOTIFICATION_URL = \n  "https://asia-northeast3-timeslot-99a39.cloudfunctions.net/resendNotification";\n```\n\n**체크리스트**: Functions 리전 변경 시 클라이언트 URL 상수도 반드시 함께 변경.\n\n---\n\n## 문제 3 — Solapi 알림톡 발송 실패 (API KEY/SECRET 순서 오류)\n\n### 증상\n알림톡 발송 시 `401 Unauthorized` 오류.\n\n### 원인\n`functions/.env`에 `SOLAPI_API_KEY`와 `SOLAPI_API_SECRET` 값을 **반대로** 입력.\n\n```\n# 잘못된 설정\nSOLAPI_API_KEY=NCS...secret...\nSOLAPI_API_SECRET=STA...key...\n```\n\n### 해결\n값 교환 후 재배포. 단순 실수지만 에러 메시지가 `401`뿐이라 찾기 어려웠음.\n\n**방지책**: `.env.example`에 값 예시 형식을 주석으로 남겨두기:\n```\n# Solapi — dashboard.solapi.com > 개발자센터 > API Key 관리\nSOLAPI_API_KEY=STA로 시작하는 키\nSOLAPI_API_SECRET=NCS로 시작하는 시크릿\n```\n\n---\n\n## 문제 4 — Solapi IP 화이트리스트 (Cloud Run egress IP)\n\n### 증상\nCloud Functions에서 Solapi API 호출 시 간헐적 거부.\n\n### 원인\nSolapi 계정에 IP 화이트리스트 설정이 되어있었는데,\nCloud Functions가 Cloud Run으로 실행되며 egress IP가 고정되지 않음.\n\n### 해결\nSolapi 대시보드에서 Cloud Run 가능 egress IP 대역을 화이트리스트에 추가.\n또는 IP 화이트리스트를 비활성화 (개발 초기라면).\n\n**교훈**: 외부 API에 IP 화이트리스트가 있다면 서버리스(Cloud Functions/Run) 배포 전에 egress IP 정책 확인 필수.\n\n---\n\n## 최종 결과\n\n| 문제 | 원인 | 해결 |\n|------|------|------|\n| iOS KakaoTalk 외부 브라우저 전환 실패 | JS 스킴 호출 iOS 차단 | Cloud Function HTTP 302 redirect |\n| CORS preflight 오류 | 리전 변경 후 URL 미동기화 | 클라이언트 URL 상수 업데이트 |\n| Solapi 401 오류 | KEY/SECRET 값 반대로 입력 | 값 교환 후 재배포 |\n| Solapi 간헐적 거부 | Cloud Run IP 미등록 | Solapi IP 화이트리스트 추가 |',
  ARRAY['Firebase', 'Cloud Functions', 'iOS', 'KakaoTalk', 'CORS', 'Solapi', 'Troubleshooting'],
  'log',
  true
);


-- [4] Chatbot & Timeslot 통합 트러블슈팅 (2026-04-22)
INSERT INTO logs (title, slug, excerpt, content, tags, category, published)
VALUES (
  'Chatbot & Timeslot 통합 트러블슈팅 (2026-04-22)',
  'chatbot-timeslot-troubleshooting-2026-04-22',
  'Chatbot의 CI/CD 배포 및 CORS 이슈 해결, Timeslot의 배치 생성기 브레이크 타임 및 상태 관리 최적화 기록.',
  E'# Chatbot & Timeslot 통합 트러블슈팅 (2026-04-22)\n\n**날짜**: 2026-04-22\n**내용**: Chatbot 및 Timeslot 프로젝트의 기능 고도화 및 운영 이슈 해결\n\n---\n\n## 1. Chatbot — CI/CD 및 인프라 최적화\n\n### [문제 1] CI 배포 권한 및 구조 분리\n- **증상**: Firebase CI 배포 중 IAM 권한 오류 및 배포 속도 저하.\n- **해결**:\n    - \`functions\`와 \`hosting\` 배포를 명확히 분리하여 \`firebase deploy --only functions\`, \`firebase deploy --only hosting\`으로 최적화.\n    - GitHub Actions에서 필요한 IAM 역할을 세분화하여 추가.\n    - \`firebase-tools\` 버전을 v15로 고정하여 호환성 문제 해결.\n\n### [문제 2] CORS 및 패키지 의존성 이슈\n- **증상**: \`widget.js\` 호출 시 CORS 차단 및 Cloud Functions에서 \`nodemailer\` 임베딩 실패.\n- **해결**:\n    - \`functions\` 내부에 \`cors\` 미들웨어를 직접 추가하고 \`pnpm\` 워크스페이스 구조에 맞게 모듈 경로 조정.\n    - \`nodemailer\` v8(ESM)과 v6(CJS) 간의 호환성 문제를 해결하기 위해 v6로 다운그레이드하여 안정성 확보.\n\n### [기능 고도화]\n- B-side UI 개선 (아이콘 커스텀, 관리자 이메일 매핑).\n- Google OAuth 초대 시스템 및 설정 페이지 디자인 리뉴얼.\n- 위젯 CSS를 IIFE로 번들링하여 스타일 간섭 방지.\n\n---\n\n## 2. Timeslot — 운영 도구 및 상태 관리 최적화\n\n### [기능 추가] 배치 생성기 내 부스별 브레이크 타임 토글\n- **상황**: 모든 부스에 동일한 브레이크 타임을 적용하던 방식에서, 부스별로 개별 제어가 필요함.\n- **해결**: \`batch generator\` UI에 부스별 브레이크 타임 활성화/비활성화 토글 추가 및 로직 구현.\n\n### [문제 해결] 상태 관리 및 데이터 정합성\n- **증상**: 페이지 전환 시 이전 상태(\`setAttendeeCurrentPage\`)가 남아있어 데이터 오염 발생.\n- **해결**: 상태 제거 후 남은 참조 코드를 전수 조사하여 제거.\n- **개선**: 예약/체크인 카운트 시 Firebase의 \`atomic increment\`를 적용하여 데이터 정합성 보장.\n- **UI**: 타임 피커에 \`awayMode\` 배지 추가 및 존 이탈 방지 가드 구현.\n\n---\n\n**교훈**: 프로젝트가 커질수록 CI/CD 권한 관리와 상태 초기화 로직의 중요성이 커진다. 특히 멀티테넌트(Chatbot) 환경에서는 CORS와 ESM/CJS 호환성을 사전에 체크하는 습관이 필요하다.',
  ARRAY['Chatbot', 'Timeslot', 'Firebase', 'CORS', 'CI/CD', 'Troubleshooting'],
  'log',
  true
);
