# HUNI2 Digital Hub Strategy

## 🌐 Domain Strategy
- **Root Domain**: `huni2.net` (가비아, Namecheap 등에서 구입 권장)
- **Subdomain Mapping (Vercel)**:
  - `portfolio.huni2.net`: 메인 포트폴리오 허브 (현재 프로젝트)
  - `novels.huni2.net`: 개인 프로젝트 - 소설 저장소 (추후 별도 배포)
  - `admin.huni2.net`: 통합 관리 도구 (필요 시 분리)

## 📂 Project Architecture
- **Hub & Spoke 모델**:
  - **Hub**: `huni2.net/portfolio`가 모든 프로젝트의 시작점.
  - **Spoke**: 각각의 서브도메인 서비스들이 독립적으로 존재하며 서로 링크로 연결됨.

## 🚀 Deployment Workflow
1. 각 프로젝트(Portfolio, Novels 등)는 독립된 GitHub Repository로 관리.
2. Vercel에서 각각 프로젝트 생성.
3. Vercel Domain 설정에서 `huni2.net`의 서브도메인을 각각 할당.

## 🛠️ Next Steps
1. 포트폴리오 허브의 UI/UX 완성 (현재 진행 중).
2. `public/files/`에 포트폴리오용 PDF 아카이빙.
3. 소설 저장소 프로젝트 시작 시 별도 레포지토리 생성 및 링크 연결.
