// SYMPO STUDIO 개발 로그 (2026-08-17 ~ 2026-08-24, 프론트엔드 담당분)
// node --env-file=.env.local scripts/seed_logs_sympo_studio.mjs
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('❌ 환경변수 누락:');
  if (!url) console.error('   NEXT_PUBLIC_SUPABASE_URL 이 없습니다.');
  if (!key) console.error('   SUPABASE_SERVICE_ROLE_KEY 가 없습니다.');
  console.error('\n실행 방법: node --env-file=.env.local scripts/seed_logs_sympo_studio.mjs');
  process.exit(1);
}

console.log(`🎯 대상: ${url}`);

const supabase = createClient(url, key);

const logs = [
  {
    title: 'SYMPO STUDIO — 브랜드 아이덴티티 도입 + 다크 인트로 페이지',
    slug: 'sympo-studio-brand-identity-intro-2026-08-17',
    category: 'project',
    project: 'SympoStudio',
    tags: ['Design System', 'OKLCH'],
    published: true,
    created_at: '2026-08-17T01:14:00+09:00',
    content: `## 브랜드 토큰 (FE-10)

셸(콘솔·에디터·리포트·내비)이 그레이스케일뿐이었다. OKLCH 205도 틸 브랜드 토큰(brand/brandPress/brandSoft)을 lib/ui.ts에 추가했다 — 기존 테넌트 프리셋 5종(hue 72/158/252/305/255)과 겹치지 않는 값으로 골랐다. Logo.tsx를 새로 만들어서 이미지 파일 없이 div 3개로 로고 마크(LogoMark)와 워드마크 락업(LogoLockup)을 그렸다.

브랜드색은 "선택 상태·프라이머리 액션에만" 규칙으로 한정해서 적용했다. 참가자용 마이크로사이트(Microsite.tsx)는 원래부터 테넌트 색과 도구 색을 분리하고 있어서 손대지 않았고, 헤드리스 브라우저 스크린샷으로 브랜드색이 실제로 안 섞이는 걸 확인했다.

## 다크 인트로 페이지 (FE-11)

/intro에 다크 톤 소개 페이지를 만들었다. 문제 정의 문구는 아직 병합 안 된 problem-redefinition 브랜치의 정정된 README를 근거로 썼다 — main의 README는 실제 현장 경험(field-experience.md) 검증 결과 4개 주장 중 3개가 허구였다고 밝혀진 옛 버전이라, 그대로 옮기면 이미 정정된 주장을 새 페이지에 다시 심는 셈이었다.

콘솔·에디터·뷰어·리포트 스크린샷 4장은 정적 목업 대신 헤드리스 브라우저로 실제 화면을 캡처해서 넣었다. 그 과정에서 LogoLockup이 라이트 셸 색(UI.ink)을 고정값으로 쓰고 있어서 다크 배경에서 워드마크가 안 보이는 버그를 발견했다 — ink/sub prop을 받도록 고쳐서 라이트/다크 양쪽에서 재사용 가능하게 만들었다.`,
  },
  {
    title: '라이트/다크 테마 통합 — 90여 곳의 색상 리터럴을 흡수하다',
    slug: 'sympo-studio-light-dark-theme-2026-08-18',
    category: 'log',
    project: 'SympoStudio',
    tags: ['CSS Variables', 'Dark Mode'],
    published: true,
    created_at: '2026-08-18T23:34:00+09:00',
    content: `## 테마 시스템

셸(콘솔·에디터·리포트)에 기본 라이트 + 다크모드 토글을 추가했다. app/globals.css에 :root / :root[data-theme='dark'] CSS 변수 세트를 정의하고, lib/ui.ts의 UI 토큰을 전부 var(...) 참조로 바꿨다 — 흩어져 있던 #fff와 산발적 회색 리터럴 90여 곳을 이 변수 세트로 흡수시켰다. 항상 어두워야 하는 요소(벌크 선택 토스트바, 뷰어 기기 베젤)는 의도적으로 테마와 분리해 고정값으로 남겼다.

## ThemeToggle 구현

useSyncExternalStore로 만들어서 effect 안에서 setState하는 린트 규칙을 우회했다. app/layout.tsx에는 페인트 전에 실행되는 스크립트를 넣어 테마 전환 시 깜빡임을 없앴고, \`<html suppressHydrationWarning>\`으로 그 스크립트가 만드는 서버/클라이언트 불일치를 의도된 것으로 처리했다.

## 김에 정리한 것

EditorScreen의 섹션 내비 활성 상태가 파스텔 배경 + 좌측 브랜드 바 조합이었는데, AI가 생성한 대시보드에서 흔히 보이는 패턴이라 걷어내고 텍스트 색·굵기 변화만으로 표시하도록 단순화했다. 색 시스템 분리 원칙(도구 색 vs 행사 색), 타이포·레이아웃 규칙을 담은 design.md를 신설해 팀 위키에 정본으로 올렸다.

검증은 헤드리스 브라우저로 라이트→다크 토글, 새로고침 후 유지, 콘솔 에러 0건까지 확인했다.`,
  },
  {
    title: '인트로 페이지 반응형 재설계 + 스크롤 스파이 버그 두 방',
    slug: 'sympo-studio-intro-responsive-scrollspy-2026-08-18',
    category: 'log',
    project: 'SympoStudio',
    tags: ['Responsive', 'IntersectionObserver'],
    published: true,
    created_at: '2026-08-18T23:35:00+09:00',
    content: `## "PPT형" 구성이라는 피드백

/intro가 1440px 고정폭에 텍스트 위주 구성이라는 피드백을 받았다(FE-12).

반응형은 미디어쿼리 대신 auto-fit + minmax(min(Npx,100%), 1fr) 패턴으로 처리했다. 처음엔 고정 minmax(480px,1fr) 같은 값을 썼는데, 좁은 컨테이너보다 바닥값이 커서 375px 화면에서 가로 오버플로가 나는 걸 진단 스크립트로 발견했다 — min(Npx,100%)로 캡을 씌워 해결했다. grid로 못 푸는 두 곳(헤더 앵커 내비 숨김, 한계 리스트 라벨 줄바꿈)만 globals.css 미디어쿼리로 남겨뒀다.

내용도 다시 짰다. "설계 판단" 7행 표를 Before→After 비교 카드로 바꿔서 표 자체를 없애고 반응형 문제도 같이 해결했다. 결론 인용구는 브랜드 소프트 배경의 큰 텍스트로 격상하고, 전반적으로 폰트를 키우고 텍스트를 번호 배지·통계 칩·강조색으로 대체해서 밀도를 낮췄다.

## 스크롤 스파이 버그 두 개

IntroNav.tsx를 새로 만들어 IntersectionObserver로 현재 섹션을 추적해 내비 항목을 강조하게 했는데, 실측하다가 버그 두 개를 잡았다.

1. 콜백의 entries만 보면 "방금 화면에서 빠져나간 섹션"만 담긴 배치가 들어올 때 상태가 멈추는 문제 — 전체 상태를 Set에 누적하는 방식으로 고쳤다.
2. 인접 섹션이 동시에 감지 밴드에 걸릴 때 픽셀 좌표 비교가 경계에서 흔들리는 문제 — 문서 순서상 더 아래쪽 섹션을 우선하는 규칙으로 고쳤다.

앵커 클릭 시 sticky 헤더에 가려지지 않도록 scrollMarginTop을 추가하고, prefers-reduced-motion을 존중하는 smooth scroll을 적용했다. 이후 피드백으로 헤더도 64px에서 84px로, 로고·내비·CTA를 비례해서 키웠다.

검증은 375/820/1440px 헤드리스 스크린샷으로 가로 오버플로 0건, 전체 스크롤 트레이스로 5개 섹션 전환 순서까지 확인했다. 같은 시점에 CSS 로고를 실제 이미지 파일로 교체하고(sharp로 512×512 리사이즈+라운드+투명 처리), Next.js 파비콘 규칙에 맞춰 app/icon.png로도 등록했다.`,
  },
  {
    title: '리포트 화면 React key 중복 버그 + 스크롤 등장 애니메이션',
    slug: 'sympo-studio-report-key-bug-reveal-animation-2026-08-19',
    category: 'log',
    project: 'SympoStudio',
    tags: ['React', 'Bug Fix'],
    published: true,
    created_at: '2026-08-19T03:01:00+09:00',
    content: `## 세션 막대 키 충돌

ReportScreen의 세션 막대 리스트가 "Encountered two children with the same key" 에러를 냈다. bars.map이 time+title 문자열을 key로 쓰고 있었는데, 아젠다의 "라이브러리에서 가져오기" 기능이 세션 라이브러리(3개)를 순환 참조하는 구조라 4번째 클릭부터 같은 시간+제목 조합이 다시 들어가면서 키가 충돌했다. bars에 세션의 실제 id를 담아 key로 교체하고, "가져오기"를 5번 클릭해 강제 재현한 뒤 콘솔 에러가 사라지는 걸 확인했다.

## 스크롤 등장 애니메이션

Reveal.tsx를 신설했다. IntersectionObserver로 섹션이 뷰포트에 들어오면 한 번만 페이드+상승시키고 곧바로 disconnect한다 — 스크롤을 오가거나 리사이즈해도 재발동하거나 깜빡이지 않는다.

opacity·transform만 움직여서 리플로우가 없고, 이동 거리는 고정 px만 써서 화면 회전·리사이즈 중에 걸려도 어색하게 튀지 않는다. 전체를 @media (prefers-reduced-motion: no-preference) 안에 둬서, 그 설정을 끈 사용자에게는 애니메이션 자체가 없고 요소가 처음부터 완전히 보이도록 했다 — 숨겼다가 못 보여주는 사고를 원천 차단하는 방식.

히어로는 로드 시 CSS 키프레임으로 스태거시키고, 아래 섹션들은 섹션당 1개씩 \`<Reveal>\`로 묶어서 관찰자 개수를 적게(~10개) 유지했다. 헤드리스 브라우저로 히어로 완료 시점 opacity, 스크롤 전/후 opacity, 리사이즈 후 상태 유지, reduced-motion에서 즉시 표시까지 네 가지를 수치로 확인했다.

덧붙여 히어로 눈썹 라벨 "Portfolio · Solo project"를 "Portfolio"로 줄였다 — 이 시점부터 실제로는 팀원과 함께하는 2인 협업이었기 때문에.`,
  },
  {
    title: '이벤트별 편집 상태 분리 + 라우트 분리, Pretendard 자체 호스팅',
    slug: 'sympo-studio-event-state-route-split-2026-08-24',
    category: 'log',
    project: 'SympoStudio',
    tags: ['Refactor', 'App Router'],
    published: true,
    created_at: '2026-08-24T19:25:00+09:00',
    content: `## 콘솔 카드를 눌러도 항상 같은 아젠다가 보였다 (FE-1)

StudioState에 편집 필드(title/venue/date/host/cap/engage/presetId/mode/iconSet/density/keyVisual/kvPattern/sessions)가 평평하게 있었다. 어느 이벤트를 눌러도 같은 값을 보여주는 구조였던 것 — 이 필드들을 EventDetail로 묶어서 EventItem이 갖도록 옮기고, editingId + patchEvent로 "현재 편집 중인 이벤트만" 갱신하도록 고쳤다. 이번에 "새 이벤트" 버튼도 처음으로 실제 events 배열에 새 항목을 만들게 됐다. D1 API 연동은 범위 밖으로 남기고 순수 클라이언트 리팩터로 끝냈다.

## 라우트 분리 (FE-2)

콘솔/에디터/리포트 3개 화면을 App Router 라우트(/console, /events/[id]/edit, /report)로 분리해서 딥링크가 가능해졌다. 뷰어는 백엔드에 slug 조회 API가 아직 없고 "행사 페이지는 관리자 화면 우측 미리보기로만 보여준다"는 결정이 있어서 라우트 없이 오버레이로 남겨뒀다. 상태는 StudioApp에서 StudioProvider(Context)로 끌어올려 레이아웃과 페이지가 공유하게 했고, 내비·헤더 셸은 StudioShell로 분리했다.

Pretendard 폰트는 CDN 대신 next/font/local로 자체 호스팅했다 — npm 패키지 전체가 아니라 가변 폰트 파일 하나(2.1MB)만 public/fonts에 커밋해서 의존성이 늘지 않는다.

같은 날, 프론트엔드 담당 역할과 BE 영역 미접근 원칙을 CLAUDE.local.md에 명시하고 gitignore에 등록했다 — 2인 협업에서 각자 영역을 코드베이스 차원에서도 분명히 해두고 싶었다.`,
  },
  {
    title: '대비비 저장 게이트 + 브랜드 컬러 이미지 추출 + 네트워크 단절 대응',
    slug: 'sympo-studio-contrast-gate-color-extract-offline-2026-08-24',
    category: 'log',
    project: 'SympoStudio',
    tags: ['Accessibility', 'Vitest'],
    published: true,
    created_at: '2026-08-24T20:18:00+09:00',
    content: `## WCAG 대비비를 저장 게이트로 (FE-7)

lib/theme.ts에 있던 대비비 근사식(lum(L) = L³, 채도·색상은 무시)을 culori의 wcagContrast로 교체했다 — 실제 oklch 색을 sRGB로 변환해서 정확한 WCAG 대비비를 계산한다. contrastAllPass(preset, mode)로 게이트 판정을 모아서, "공개하기" 버튼과 뷰어 아이콘 둘 다 이 함수로 가드하고 미달이면 버튼을 비활성화 + 사유를 노출한다.

기존 내장 프리셋 5개는 실측으로도 전부 여유 있게 통과해서 회귀는 없었다. 이 저장소 첫 자동 테스트로 Vitest를 도입해서, 5프리셋×2모드 통과 회귀와 인위적 고채도 조합의 실패 케이스(4.48:1, 기준 4.5:1 근소 미달)를 검증했다.

## 브랜드 컬러를 이미지에서 추출 (FE-8)

브랜드 프리셋이 하드코딩된 5개뿐이라 그 브랜드가 아니면 고를 수 없었다. lib/colorExtract.ts로 이미지를 양자화 히스토그램(무채색 버킷 제외)으로 샘플링해서 주조색을 뽑고 culori로 OKLCH {h,c}로 변환한다.

Preset 타입을 theme.ts에서 types.ts로 옮겨 4개 파일에 흩어져 있던 PRESETS.find(...) 반복을 StudioProvider의 단일 소스로 정리했다. ThemeSection에 "+ 이미지에서 추출" 타일을 추가해서, 추출 성공 시 스와치·라벨·채도 슬라이더·실시간 대비비 배지가 뜨는 미리보기 패널을 보여주고, FE-7의 contrastAllPass가 참일 때만 저장할 수 있게 했다.

실측해보니 실제 sRGB에서 나올 수 있는 최고 채도급 색도 derive() 파이프라인의 넉넉한 명도 계층 덕에 항상 대비비를 통과했다 — 미달 UI는 실제 사진으로는 거의 트리거되지 않지만, FE-7에서 검증된 동일 함수를 재사용하는 구조라 기능 자체는 정상 동작한다.

## 네트워크 단절 대응, 범위를 줄이다 (FE-9)

착수 전에 확인해보니 이 저장소엔 fetch나 폴링이 아예 없었다 — Q&A/설문 연결(FE-3)이 아직 없어서 "폴링이 끊기는 상황" 자체가 존재하지 않았다. 팀원과 상의해서 온라인/오프라인 감지 인프라만 먼저 만들고, 실제 폴링 실패 처리는 나중에 FE-3에서 이 훅을 재사용하는 것으로 범위를 좁혔다.

useOnlineStatus.ts는 ThemeToggle이 이미 쓰던 useSyncExternalStore 패턴으로 navigator.onLine과 online/offline 이벤트를 구독한다. Microsite의 Q&A/설문 버튼에 연결해서 오프라인이면 비활성 스타일 + 사유 배너를 보여주고, 복귀 시 이벤트 기반으로 자동 재개하도록 했다.

## 하루 정리

FE-1·FE-2·FE-7·FE-8·FE-9까지, 리팩터부터 접근성·견고성까지 하루에 5개 작업을 마쳤다. 착수 전 저장소 상태를 먼저 확인하고 범위를 줄인 FE-9가 특히 기억에 남는다 — 없는 문제를 풀려고 하지 않는 것도 판단이다.`,
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
