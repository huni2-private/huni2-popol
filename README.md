# HUNI² — Personal Digital Realm

> 개발자 Huni의 포트폴리오 허브. 모든 프로젝트의 시작점.

---

## 프로젝트 개요

**hunipopol**은 `huni2.net`을 중심으로 한 Hub & Spoke 아키텍처의 메인 포트폴리오 사이트다.  
단순한 소개 페이지가 아니라, 소설 아카이브·AI 프로젝트·관리 도구 등 개인 서비스들을 연결하는 관문 역할을 한다.

---

## 지금까지 한 것

| 날짜 | 작업 |
|------|------|
| 초기 | `create-next-app` 으로 프로젝트 생성, Next.js 16 + React 19 세팅 |
| 초기 | Tailwind CSS v4 마이그레이션 (v3 config 방식 → CSS `@theme` 방식) |
| 초기 | 홈 랜딩 페이지, 포트폴리오 페이지, 어드민 대시보드 UI 구현 |
| 초기 | i18n 시스템 구현 (한/영 전환, localStorage 저장) |
| 초기 | React Context 기반 ThemeProvider 구현 |
| 최근 | **DaisyUI v5 설치 및 테마 시스템 마이그레이션** |
| 최근 | ThemeProvider(React Context) → `useTheme` 단순 훅으로 교체 |
| 최근 | `data-theme` 기반 테마 전환으로 통일 (DaisyUI 네이티브 방식) |
| 최근 | FOUC(테마 깜빡임) 방지 인라인 스크립트 추가 |
| 최근 | lucide-react v1.8 호환 아이콘 수정 (`Github` → `GitFork`, `Linkedin` → `Link2`) |

---

## 기능 구현 현황

### 완료 ✅

| 기능 | 설명 |
|------|------|
| **홈 랜딩** | Hero 섹션, 특징 카드 3종, 프로젝트 쇼케이스, 철학 인용구 |
| **포트폴리오 페이지** | 프로젝트 카드 그리드, 기술 태그, 링크/소스/PDF 버튼 |
| **어드민 대시보드** | 관리 패널 UI, 시스템 상태 표시 (백엔드 미연결) |
| **헤더 / 네비게이션** | 고정 헤더, 반응형 모바일 탭바, 브랜드 로고 |
| **다크/라이트 모드** | DaisyUI `data-theme` 기반, localStorage 저장, 시스템 설정 감지, FOUC 없음 |
| **한/영 전환** | localStorage 저장, 전체 UI 텍스트 외부화 |
| **반응형 레이아웃** | 모바일 우선 설계, 모든 디바이스 대응 |
| **타이포그래피** | Outfit (본문) + JetBrains Mono (코드), Google Fonts 자동 최적화 |
| **애니메이션** | 그라디언트 블로브, hover 효과, 페이드인, 스케일 전환 |

### 미구현 / 플레이스홀더 ❌

| 기능 | 현재 상태 | 필요한 것 |
|------|----------|-----------|
| **소설 업로드** | 버튼만 존재 | Supabase Storage + 업로드 UI |
| **포트폴리오 관리** | 데이터 하드코딩 | Supabase DB + CRUD UI |
| **콘텐츠 매니저** | 버튼만 존재 | 컨텐츠 CRUD 시스템 |
| **인사이트 통계** | 버튼만 존재 | 조회수/방문자 데이터 수집 |
| **어드민 인증** | `isAdmin = true` 하드코딩 | Supabase Auth + 로그인 페이지 |
| **소설 아카이브** | `/novels` 링크만 존재 | 별도 레포지토리로 구현 예정 |
| **PDF 다운로드** | 플레이스홀더 링크 | `public/files/`에 실제 파일 배치 |
| **이메일 / 컨택트** | 아이콘만 존재 | 이메일 링크 또는 폼 연동 |
| **Supabase 연동** | 클라이언트 파일만 있음 | 환경변수 세팅 + DB 스키마 설계 |

---

## 기술 스택

### 프론트엔드

| 분류 | 기술 | 버전 | 역할 |
|------|------|------|------|
| 프레임워크 | Next.js | 16.2.3 | App Router, SSG, 라우팅 |
| UI 라이브러리 | React | 19.2.4 | 컴포넌트, Server Components |
| 언어 | TypeScript | ^5 | 타입 안전성, strict mode |
| CSS 엔진 | Tailwind CSS | ^4 | 유틸리티 퍼스트, `@theme` 방식 |
| 컴포넌트 UI | DaisyUI | 5.5.19 | 테마 시스템 (`data-theme`) |
| 아이콘 | Lucide React | ^1.8.0 | 트리쉐이커블 SVG 아이콘 |
| 클래스 유틸 | clsx + tailwind-merge | latest | 조건부 클래스 처리 |
| 폰트 | Google Fonts | — | Outfit + JetBrains Mono |

### 백엔드 (준비 중)

| 분류 | 기술 | 버전 | 역할 |
|------|------|------|------|
| BaaS | Supabase | ^2.103.0 | DB, Auth, Storage, Realtime |

### 개발 도구

| 분류 | 기술 |
|------|------|
| 번들러 | Next.js 내장 (Turbopack) |
| 린터 | ESLint 9 + `eslint-config-next` |
| PostCSS | `@tailwindcss/postcss` |
| 배포 | Vercel (예정) |

---

## 파일 구조

```
hunipopol/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 루트 레이아웃 (Header, Footer, MobileTabBar)
│   ├── globals.css               # 전역 스타일, Tailwind + DaisyUI 설정
│   ├── page.tsx                  # 홈 랜딩 페이지
│   ├── portfolio/
│   │   └── page.tsx              # 포트폴리오 쇼케이스
│   └── admin/
│       └── page.tsx              # 어드민 대시보드 (UI only)
│
├── lib/                          # 공용 유틸리티
│   ├── theme.tsx                 # useTheme 훅 (DaisyUI data-theme 기반)
│   ├── i18n.tsx                  # 다국어 Context + useI18n 훅
│   └── supabase.ts               # Supabase 클라이언트 (env 미설정)
│
├── public/                       # 정적 에셋
│   └── files/                    # PDF 포트폴리오 파일 예정 위치
│
├── CLAUDE.md                     # Claude Code 프로젝트 지침
├── AGENTS.md                     # Next.js 버전 주의사항
├── STRATEGY.md                   # 도메인/배포 전략 문서
├── next.config.ts                # Next.js 설정
├── postcss.config.mjs            # PostCSS 설정
├── tsconfig.json                 # TypeScript 설정
└── package.json
```

### 핵심 파일 설명

**`app/layout.tsx`**  
루트 레이아웃. 헤더(고정 네비), 모바일 탭바, 푸터, 배경 그라디언트 애니메이션 포함.  
`LanguageProvider`로 i18n 제공. `useTheme` 훅을 Header에서 직접 사용.

**`app/globals.css`**  
Tailwind v4 + DaisyUI v5 설정 핵심 파일.  
`@variant dark` 재정의로 `dark:` 클래스가 `[data-theme=dark]`에 반응하도록 연결.

**`lib/theme.tsx`**  
React Context Provider 없는 단순 훅. `localStorage`와 `document.documentElement.setAttribute('data-theme', ...)` 직접 조작.

**`lib/i18n.tsx`**  
Context 기반 한/영 번역 시스템. 모든 UI 텍스트를 `translations` 객체로 관리.

---

## GitHub 전략

STRATEGY.md 기반 Hub & Spoke 구조:

```
GitHub Organizations 또는 개인 계정
│
├── hunipopol          ← 현재 레포 (포트폴리오 허브)
├── huni-novels        ← 소설 아카이브 (별도 레포, 추후 생성)
└── huni-admin         ← 통합 관리 도구 (필요 시 분리)
```

### 브랜치 전략 (권장)

```
main          # 프로덕션 (Vercel 자동 배포)
└── dev       # 개발 통합 브랜치
    ├── feat/supabase-auth      # 기능 브랜치 예시
    ├── feat/portfolio-crud
    └── fix/mobile-layout
```

### 커밋 컨벤션

```
feat: 새 기능
fix:  버그 수정
style: UI 변경 (기능 변화 없음)
refactor: 리팩터링
chore: 설정/패키지 변경
```

### 배포 전략

| 환경 | 브랜치 | URL | 방식 |
|------|--------|-----|------|
| Production | `main` | `portfolio.huni2.net` | Vercel 자동 배포 |
| Preview | `dev`, PR | `*.vercel.app` | Vercel Preview URL |

---

## 이후 계획

### Phase 1 — 백엔드 연동 (Supabase)

- [ ] Supabase 프로젝트 생성 + `.env.local` 세팅
- [ ] DB 스키마 설계: `projects`, `novels`, `chapters` 테이블
- [ ] RLS(Row Level Security) 정책 설정
- [ ] 포트폴리오 데이터 DB로 이전 (하드코딩 제거)

### Phase 2 — 어드민 시스템

- [ ] Supabase Auth 로그인 페이지 (`/admin/login`)
- [ ] 포트폴리오 CRUD: 프로젝트 추가/수정/삭제
- [ ] PDF 업로드: Supabase Storage 연동
- [ ] 실제 `isAdmin` 권한 체크 로직

### Phase 3 — 소설 아카이브

- [ ] `huni-novels` 별도 레포지토리 생성
- [ ] `novels.huni2.net` 서브도메인 배포
- [ ] 포트폴리오 허브에서 링크 연결

### Phase 4 — 콘텐츠 고도화

- [ ] 실제 포트폴리오 PDF 파일 `public/files/`에 배치
- [ ] 프로젝트 카드에 실제 스크린샷 적용
- [ ] 소셜 링크 실제 URL로 교체 (GitHub, 이메일 등)
- [ ] OG 이미지 / SEO 메타데이터 추가

### Phase 5 — 인프라

- [ ] `huni2.net` 도메인 구입 및 Vercel 연결
- [ ] 서브도메인 매핑 (`portfolio.huni2.net`, `novels.huni2.net`)
- [ ] Vercel Analytics 연동

---

## 로컬 개발 시작

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
# → http://localhost:3000

# 프로덕션 빌드 확인
npm run build && npm start
```

### 환경변수 설정 (Supabase 연동 시)

```bash
# .env.local 생성
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 라이센스

Private — All rights reserved. © 2026 HUNI²
