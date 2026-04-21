# HUNI² | Portfolio & Log

> 작은 개선 하나하나를 의미있게 만드는 성장형 프론트엔드 개발자 허창훈의 포트폴리오 사이트입니다.

🌐 **Live:** https://huni2-popol.vercel.app/ _(도메인 변경 예정)_

---

## Tech Stack

| | |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Backend** | Supabase (Auth · PostgreSQL · Storage) |
| **Styling** | Tailwind CSS v4 + DaisyUI v5 |
| **Animation** | Framer Motion |
| **Deployment** | Vercel + GitHub Actions (main push → auto deploy) |

## Features

- 포트폴리오 카드 관리 (로컬 이미지 업로드)
- 마크다운 기반 Dev Log (블로그)
- 한국어 / 영어 i18n
- 다크 / 라이트 테마
- Admin 패널로 모든 콘텐츠 CMS 관리 (About · Contact · SEO)

## Local Setup

```bash
npm install
cp .env.example .env.local   # Supabase 환경변수 입력
npm run dev
```

## License

Private — All rights reserved. © 2026 허창훈
