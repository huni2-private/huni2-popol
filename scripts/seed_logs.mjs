// 로그 데이터 시딩 스크립트 — node --env-file=.env.local scripts/seed_logs.mjs
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('❌ 환경변수 누락:');
  if (!url) console.error('   NEXT_PUBLIC_SUPABASE_URL 이 없습니다.');
  if (!key) console.error('   SUPABASE_SERVICE_ROLE_KEY 가 없습니다.');
  console.error('\n실행 방법: node --env-file=.env.local scripts/seed_logs.mjs');
  process.exit(1);
}

console.log(`🎯 대상: ${url}`);

const supabase = createClient(url, key);

const logs = [
  {
    title: 'TimeSlot, 아주대 전공멘토링 행사에 실전 투입되다',
    slug: 'timeslot-ajou-mentoring-2026',
    category: 'log',
    project: 'Timeslot',
    tags: ['Firebase', '행사운영'],
    published: true,
    created_at: '2026-04-30T20:00:00+09:00',
    content: `## 실제 행사에서 첫 검증

4월 29~30일, 아주대학교 전공멘토링 행사에서 **TimeSlot**이 처음으로 실전 투입됐다. 수십 명의 참여자가 실시간으로 프로그램 슬롯을 예약하고, 현장 부스에서 QR 체크인을 진행하는 전 과정을 TimeSlot 하나로 운영했다.

행사 직전까지 예약 UI를 다듬고, 당일 새벽에도 버그를 잡았다. 그리고 실제로 돌아갔다.

## 행사 직전 막판 작업 (4/27)

행사 이틀 전, 예약 화면 전체를 손봤다.

- 프로그램 순서가 페이지 새로고침마다 바뀌는 문제 수정
- 슬롯 카드에 시작~종료 시간 범위 명시
- Timeline 탭에 멀티필터와 내림차순 정렬 추가

사소해 보이지만 현장 운영자 입장에서는 치명적인 UX 결함들이었다.

## 행사 당일 (4/29~4/30)

행사가 시작되자마자 예상치 못한 케이스들이 터졌다.

**카카오 외부브라우저 진입자 대응**: 카카오톡 링크로 들어온 사용자들이 인앱 브라우저 제한으로 예약을 완료하지 못하는 케이스. \`/open\` 페이지를 통해 외부 브라우저로 유도하는 흐름을 즉석에서 배포했다.

**새로고침 시 예약 초기화 현상**: 부스 앱에서 슬롯 선택 상태가 새로고침 후 날아가는 버그. \`localStorage\`에 active slot을 persist하는 방식으로 즉시 수정.

**카운터 재계산 오류**: \`booked\` / \`checkedIn\` 카운터가 실제 attendee 문서 수와 어긋나는 케이스. Firestore Transaction 재계산 로직을 보완했다.

이런 건 스테이징 환경에서 절대 잡히지 않는다. 수백 명이 동시에 쏟아져야 드러나는 문제들이다.

## 행사 종료 후: Analytics Dashboard (5/1)

행사가 끝난 다음 날, 운영 데이터를 분석할 수 있는 **Analytics Dashboard**를 Timeline 탭에 추가했다.

- 시간대별 예약량 차트 (어느 슬롯이 인기 있었나)
- 마감 속도 차트 (어떤 프로그램이 가장 빠르게 소진됐나)
- P0/P1 핵심 지표 카드 (전체 예약률, 체크인 전환율)
- PNG / Excel 내보내기

처음에 \`html2canvas\`로 PNG 내보내기를 구현했는데 SVG 아이콘이 깨지고 색상이 날아갔다. \`dom-to-image-more\`로 교체하고, scale 2배 + 캡처 영역 통일로 해결했다.

## 느낀 것

코드는 PR 통과 후에도 완성이 아니다. 실제 사람들이 쓸 때 비로소 완성에 가까워진다. 이번 행사는 그 격차를 온몸으로 확인한 경험이었다.`,
  },
  {
    title: 'IMAGINE AX 2026 랜딩페이지 — Figma에서 Next.js로',
    slug: 'imagineax-2026-landing-page',
    category: 'log',
    project: 'ImagineAX',
    tags: ['Next.js', '랜딩페이지'],
    published: true,
    created_at: '2026-04-30T16:00:00+09:00',
    content: `## 맥락

IMAGINE AX 2026은 CongKong이 준비 중인 행사다. 4월 30일, Figma 시안이 확정되자마자 랜딩페이지 개발을 시작했다.

기술 스택은 Next.js + Tailwind CSS. Firebase Hosting으로 배포하고, 정적 export(\`output: 'export'\`)로 구성했다.

## 개발 흐름

### 초기 셋업 → 반응형 → 애니메이션 순서로

첫 커밋에서 전체 섹션 구조를 잡고 (Hero / Invitation / Agenda / Location / FAQ / Footer), 그다음 날 반응형을 붙였다.

Figma 시안이 데스크톱 기준으로만 나와 있어서 모바일 레이아웃은 직접 판단해야 했다. 결국 **모바일에서는 Hero, Location, Footer만** 노출하고 Invitation/Agenda/FAQ는 숨기는 방향으로 결정했다. 행사 초대 컨텍스트상 모바일 유저에게 필요한 건 날짜/장소/등록 버튼이니까.

### Hero 섹션 삽질 로그

Hero에서 가장 많이 헤맸다.

**이중 스크롤바 문제**: Hero를 fullscreen으로 잡으면서 \`100vw\` + \`overflow-x: hidden\` 조합이 body 스크롤바 너비를 계산에서 빠뜨려 오른쪽에 갭이 생겼다. \`100dvh\`로 교체하고 \`scrollbar-gutter: stable\`을 추가해서 해결.

**Hero 콘텐츠 음수 left**: 스크롤 시 Hero content div의 left 값이 음수로 가서 화면 밖으로 잘리는 현상. transform 기반 parallax를 position 기반으로 교체.

**이미지 로드 전 애니메이션 튀는 현상**: 배경 이미지가 로드되기 전에 fade-in 애니메이션이 먼저 실행돼서 빈 화면이 번쩍이는 문제. \`onLoad\` 이벤트 뒤에 animation class를 붙이는 방식으로 처리.

### FAQ ↔ Location 섹션 경계

blur glow 효과를 쓰는 FAQ 섹션 상단과 gradient 처리된 Location 섹션 하단이 맞닿으면서 경계선이 눈에 띄게 생겼다. gradient bridge 레이어를 둘 사이에 끼워 자연스럽게 이어지도록 했다.

## 배포

Firebase Hosting에 정적 파일로 배포. CI는 GitHub Actions.

\`next export\`가 생성한 \`out/\` 폴더를 그대로 올리는 구조라 CDN 캐시와 잘 맞는다.`,
  },
  {
    title: 'CongKong AI 챗봇 — 파일 첨부, 타이핑 인디케이터, 비즈니스 시간 설정',
    slug: 'congkong-chatbot-4-28-4-30',
    category: 'log',
    project: 'Chatbot',
    tags: ['Firebase', 'SaaS'],
    published: true,
    created_at: '2026-04-30T22:00:00+09:00',
    content: `## 이번 주 챗봇에 추가된 것들

4월 28~30일 사이에 CongKong AI 챗봇에 굵직한 기능 세 가지가 들어갔다.

## 1. 파일/이미지 첨부 전송 (4/30)

위젯과 관리자 패널 양쪽에서 파일·이미지를 첨부해 전송할 수 있게 됐다. Firebase Storage에 업로드 후 다운로드 URL을 메시지에 포함하는 방식.

처음엔 PDF 업로드 시 403 에러가 계속 났다. Storage Rules와 CORS 설정이 맞지 않아서였다. Rules에서 \`contentType\` 검사 조건을 조정하고, \`storage.cors.json\`에 허용 origin을 추가해서 해결했다.

위젯은 Shadow DOM으로 CSS를 격리하고 있어서, 파일 첨부 input 스타일이 호스트 사이트에 영향을 주거나 반대로 영향받지 않도록 추가 처리가 필요했다.

## 2. 담당자 실시간 타이핑 인디케이터 (4/30)

고객이 채팅창을 열고 있을 때, 담당자가 답변을 입력 중이면 "입력 중..." 인디케이터가 표시된다.

구현은 Firestore의 session 문서에 \`agentTyping: boolean\` 필드를 두고 \`onSnapshot\`으로 구독하는 방식. 심플하지만 실시간성이 확실하다.

AI가 응답 중일 때는 이미 로딩 인디케이터가 있으므로, AI 인계 세션에서는 타이핑 인디케이터를 숨기도록 분기 처리했다.

## 3. 비즈니스 시간 설정 (4/29)

회사별로 영업 시간을 설정할 수 있는 기능. 영업 시간 외에 들어온 메시지는 안내 메시지를 자동 반환한다.

관리자 패널 설정 화면에 요일·시간 range 입력 UI를 추가하고, Firestore의 tenant 문서에 \`businessHours\` 배열로 저장하는 구조로 구현했다.

## 인프라 삽질: 호스팅 이전

4/29에는 기능 개발 외에 인프라 이슈도 있었다. Firebase Hosting에서 Cloudflare Pages로 옮겼다가 widget.js 캐시 헤더 규칙이 꼬이는 문제가 생겨 다시 Firebase로 롤백했다.

Firebase Hosting의 headers 규칙은 순서가 중요하다. \`**/*.js\`에 \`max-age\` 캐시를 걸어두면, 그보다 먼저 정의된 \`widget.js\`의 \`no-cache\` 규칙이 덮어씌워진다. 더 구체적인 패턴을 항상 앞에 두어야 한다는 것을 다시 확인했다.

## 채널 단위 지식베이스 스코핑 (4/28)

같은 챗봇 내에서도 채널(카테고리)별로 다른 지식베이스와 솔루션을 참조하도록 scoping 기능을 추가했다. FAQ 즉시 답변에서 링크 및 PDF 액션도 붙었다.`,
  },
  {
    title: 'CongKong 주간 개발 로그: TimeSlot 디자인 시스템 고도화',
    slug: 'congkong-weekly-log-2026-05-03',
    category: 'log',
    project: 'Timeslot',
    tags: ['DesignSystem', 'UI/UX'],
    published: true,
    created_at: '2026-05-03T18:00:00+09:00',
    content: `## TimeSlot 디자인 고도화

오늘은 **TimeSlot**의 브랜드 이미지를 강화하기 위해 로그인 화면과 관리자 페이지의 디자인 시스템을 전반적으로 개선했습니다.

### 주요 변경 사항
- **로고 교체**: 로그인 화면의 기존 로고를 새로운 브랜드 로고로 교체했습니다.
- **디자인 시스템 적용**: 관리자 페이지와 참가자 페이지 전반에 걸쳐 CongKong의 통합 디자인 시스템을 적용하여 UI 일관성을 확보했습니다.
- **UI 정리**: 어드민 로그인 화면의 불필요한 요소들을 제거하고 가독성을 높였습니다.`,
  },
  {
    title: 'CongKong 주간 개발 로그: Chatbot AI UI 정리 및 Imagine AX 디테일 개선',
    slug: 'congkong-weekly-log-2026-05-04',
    category: 'log',
    project: 'ImagineAX',
    tags: ['UI/UX'],
    published: true,
    created_at: '2026-05-04T22:00:00+09:00',
    content: `## Chatbot & Imagine AX 2026 개발 진척

오늘은 **Chatbot**의 AI 기능 비활성화 작업과 **Imagine AX 2026** 랜딩페이지의 디테일 완성도를 높이는 데 집중했습니다.

### Chatbot (AI 기능 정리)
- AI 어시스턴트 기능 비활성화에 따라 어드민 설정 탭에서 AI 관련 UI 인디케이터와 설정 항목들을 숨김 처리했습니다.

### Imagine AX 2026 (랜딩페이지 완성도 제고)
- **FAQ 섹션 개선**: Figma 시안에 맞춰 FAQ 배경의 blur 효과를 radial-gradient로 교체하여 성능과 시각적 효과를 모두 잡았습니다.
- **반응형 대응**: 모바일 환경에서의 맵 이미지 노출 방식(aspect ratio)을 최적화하고, 데스크톱 전용 줄바꿈 처리를 적용했습니다.
- **인터랙션**: 스크롤 버튼에 그라데이션 호버 애니메이션을 추가하고, 페이지 줌 스케일링을 조정했습니다.
- **타이포그래피**: 폰트 두께(font-weight 300/900)와 자간, 행간을 Figma 시안과 픽셀 단위로 맞췄습니다.`,
  },
  {
    title: 'CongKong 주간 개발 로그: AI 기능 전면 제거 및 챗봇 고도화',
    slug: 'congkong-weekly-log-2026-05-05',
    category: 'log',
    project: 'Chatbot',
    tags: ['Firebase', 'Realtime'],
    published: true,
    created_at: '2026-05-05T21:00:00+09:00',
    content: `## 챗봇 기능 대규모 업데이트 및 AI 전면 제거

오늘은 **Chatbot**에서 AI 기능을 완전히 제거하고, 대신 실시간 상담 기능을 대폭 강화했습니다.

### Chatbot 기능 강화
- **AI 기능 제거**: 글로벌하게 AI 자동 응답 및 관련 기능을 완전히 삭제하고 UI를 정리했습니다.
- **페이징 구현**: 채팅 이력 로딩 시 성능 최적화를 위해 '이전 메시지 더 보기' 버튼과 페이징 로직을 추가했습니다.
- **이메일 답장**: 상담원이 부재 중일 때 방문자가 남긴 메시지에 대해 이메일로 답장할 수 있는 기반 기능을 구현했습니다.
- **성능 최적화**: 실시간 세션 동기화 로직을 개선하여 상담원 답장 속도를 높이고 낙관적 UI(Optimistic UI)를 적용했습니다.

### TimeSlot
- 어드민 로그인 화면에서 불필요하게 중복 노출되던 타이틀을 제거하여 깔끔한 UI를 완성했습니다.`,
  },
  {
    title: 'CongKong 주간 개발 로그: 다크모드 완성 및 이벤트 접근 제어',
    slug: 'congkong-weekly-log-2026-05-06',
    category: 'log',
    project: 'Chatbot',
    tags: ['Security', 'UI/UX'],
    published: true,
    created_at: '2026-05-06T23:00:00+09:00',
    content: `## 다크모드 대응 및 보안 기능 강화

오늘은 **Chatbot**의 다크모드 완성도를 높이고, **TimeSlot**에 이벤트 보안 기능을 추가했습니다.

### Chatbot (다크모드 & 안정화)
- **다크모드 완성**: 채팅창 및 설정 탭의 모든 UI 요소에 다크모드 테마를 완벽하게 적용했습니다.
- **봇 트래픽 차단**: Google 봇 등 불필요한 검색 엔진 크롤러의 트래픽을 차단하는 로직을 추가했습니다.
- **방문자 추적**: Firestore 기반의 방문자 실시간 추적 안정성을 개선했습니다.

### Imagine AX 2026
- **Agenda 섹션 업데이트**: Figma 최신 시안을 반영하여 세션 카드 색상, 간격, 구분선 디자인을 수정했습니다.

### TimeSlot (보안 및 제어)
- **이벤트 접근 제어**: 이벤트 블록 숨김, PIN 번호 기반 입장 제한, 종료(Closed) 모드 등 이벤트 운영 환경에 필요한 다양한 보안 제어 기능을 구현했습니다.`,
  },
  {
    title: 'CongKong 주간 개발 로그: 챗봇 UX 대규모 개선',
    slug: 'congkong-weekly-log-2026-05-07',
    category: 'log',
    project: 'Chatbot',
    tags: ['UX', 'Mobile'],
    published: true,
    created_at: '2026-05-07T20:00:00+09:00',
    content: `## 사용자 경험(UX) 중심의 챗봇 고도화

오늘은 **Chatbot** 위젯과 어드민의 UX를 대폭 개선하여 실무 사용성을 높였습니다.

### 주요 개선 사항
- **파일 첨부 미리보기**: 파일 업로드 전 미리보기 기능을 추가하고, 업로드 과정의 안정성을 높였습니다.
- **상담원 현황**: 어드민 세션 상세 화면에서 상담원의 실시간 접속 여부(Presence Indicator)를 확인할 수 있는 기능을 추가했습니다.
- **모바일 UX**: 모바일 환경에 최적화된 바텀 시트 레이아웃과 백드롭 오버레이를 적용하여 네이티브 앱과 유사한 경험을 제공합니다.
- **세션 관리**: 다중 세션 환경에서의 세션 격리 버그를 수정하고, 돌아온 사용자에 대해 리드 폼 입력을 생략하는 로직을 추가했습니다.
- **i18n**: 언어 전환 시 네비게이션 라벨이 즉시 업데이트되도록 개선했습니다.`,
  },
  {
    title: 'CongKong 주간 개발 로그: 스토리지 설정 최적화',
    slug: 'congkong-weekly-log-2026-05-08',
    category: 'log',
    project: 'Chatbot',
    tags: ['Firebase'],
    published: true,
    created_at: '2026-05-08T15:00:00+09:00',
    content: `## 인프라 및 설정 최적화

오늘은 **Chatbot**의 파일 전송 안정성을 위해 Firebase Storage 설정을 최적화했습니다.

### 주요 변경 사항
- **Storage Bucket 업데이트**: Firebase의 최신 권장 사항에 따라 스토리지 버킷 도메인을 \`appspot.com\`에서 \`firebasestorage.app\`으로 변경했습니다.
- **위젯 설정 최적화**: 변경된 버킷 도메인을 위젯 설정에 반영하여 파일 첨부 시 발생할 수 있는 잠재적 이슈를 예방했습니다.`,
  },
  {
    title: 'CongKong 주간 개발 로그: IMAGINE AX 2026 모바일 최적화 및 포트폴리오 고도화',
    slug: 'congkong-weekly-log-2026-05-14',
    category: 'log',
    project: 'ImagineAX',
    tags: ['Mobile', 'UI/UX'],
    published: true,
    created_at: '2026-05-14T21:00:00+09:00',
    content: `## IMAGINE AX 2026 및 프로젝트 고도화

이번 주에는 **IMAGINE AX 2026** 랜딩페이지의 모바일 최적화 작업을 마무리하고, **Chatbot** 및 **Portfolio(hunipopol)** 사이트의 기능을 정교하게 다듬었습니다.

### IMAGINE AX 2026 (단독 개발)
- **모바일 최적화**: Invitation, Agenda, Location 섹션의 모바일 가독성을 극대화했습니다.
- **디자인 폴리싱**: 데스크톱 Invitation 섹션에도 모바일의 그라데이션 스타일을 이식하여 일관성을 높였습니다.

### Chatbot 기능 강화
- **상담 기능 고도화**: 상담 내역 로딩 시 페이징 처리를 안정화하고, 모바일 위젯의 UI 안내 문구를 사용자 친화적으로 개선했습니다.
- **인터랙션**: 채팅창 진입 및 메시지 전송 시의 애니메이션과 피드백을 강화했습니다.

### Portfolio (hunipopol)
- **UI 리파인**: Impact, Portfolio, DevLog 섹션 테마 컬러와 컴포넌트 스타일 개선.`,
  },
  {
    title: '글방 대개편 — Firebase Storage 버리고 Firestore 청크로 갈아탔다',
    slug: 'geulbang-firestore-chunk-rewrite-2026-05',
    category: 'log',
    project: '글방',
    tags: ['Firestore', 'PWA'],
    published: true,
    created_at: '2026-05-24T22:00:00+09:00',
    content: `## 배경

글방은 개인용 소설 리더다. 텍스트 파일을 업로드하면 책처럼 읽을 수 있게 해주는 앱인데, 업로드가 자꾸 터졌다. Firebase Storage를 쓰고 있었는데 권한 오류, CORS, 30MB 제한까지 겹치면서 결국 구조 자체를 바꾸기로 했다.

## Firebase Storage 제거 → Firestore 청크 저장

핵심 결정은 단순했다. 파일을 통째로 Storage에 올리는 대신, 텍스트를 일정 크기로 잘라서 Firestore 서브컬렉션에 청크 단위로 저장하는 방식으로 전환했다.

\`chunks/{chunkId}\` 서브컬렉션에 zero-padded ID로 정렬을 보장하고, 읽을 때는 순서대로 이어 붙인다. Storage 권한 이슈가 완전히 사라졌다.

청크를 쓰는 방식도 한 번 바꿨다. 처음엔 \`Promise.all\`로 병렬로 올렸는데 Firestore write stream 한도를 초과해서 실패했다. \`writeBatch\`로 묶어봤더니 이번엔 batch 크기 제한에 걸렸다. 결국 5개씩 묶어서 병렬 처리하는 방식(청크 5개씩 배치)으로 낙착됐다. 순차 대비 약 5배 빠른 업로드 속도가 나왔다.

## 업로드 UX 전면 개선

업로드 피드백이 없으면 사용자는 버튼을 계속 누른다. 기존에 \`alert/confirm\`으로 하던 걸 전부 Toast와 인라인 UI로 교체했다.

- 업로드 단계별 상태 카드 (파일 파싱 → 청크 생성 → DB 저장 → 완료)
- 에러 코드별 한국어 메시지
- 삭제 확인도 브라우저 confirm 대신 카드 인라인 UI로

레이스 컨디션도 있었다. 청크 저장이 끝나기 전에 완료로 표시되는 케이스가 있었는데, \`chunksReady\` 플래그를 따로 두고 모든 청크 쓰기가 완료된 뒤에야 완료 상태로 전환하도록 수정했다.

## 서재 UX 개선 및 기능 추가

파일 저장 방식을 바꾸는 김에 UI도 대거 손봤다.

- **커버 이니셜 카드**: 커버 이미지가 없어도 제목 이니셜로 시각적 식별 가능
- **정렬 드롭다운**: 최신순 / 제목순
- **검색바**: 서재 내 소설 제목 검색
- **스켈레톤 개선**: 첫 방문 시 스켈레톤이 5초간 뜨다 사라지는 현상 수정. 로딩 타임아웃을 줄이고 Firestore 오프라인 캐시를 비활성화해 즉시 정상 화면이 표시되도록 개선

뷰어에는 줄간격과 좌우 여백 설정이 추가됐다. 스크롤 복원도 \`progressRatio\` 기반으로 바꿔서 어떤 화면 크기에서도 읽던 위치가 정확하게 복원된다.

## 소설 내 검색 + 북마크 + PWA 오프라인

마지막으로 기능 세 개를 한 번에 붙였다.

- **소설 내 검색**: 현재 챕터 전체에서 키워드 검색, 매칭 위치로 스크롤
- **북마크**: 현재 위치 저장/복원
- **PWA 오프라인 지원**: Service Worker 등록, 이전에 읽었던 소설은 오프라인에서도 접근 가능

PWA 추가 후에 Auth 무한 로딩이 생겼다. Service Worker가 Firebase Auth 내부 요청을 가로채서 캐시를 반환하는 간섭 문제였다. Auth 관련 URL 패턴을 SW 캐시 대상에서 제외하는 방식으로 해결했다.

## 인프라 (CI)

Firestore rules를 CI에서 배포하려고 했는데 서비스 계정에 권한이 없었다. rules 배포 단계를 CI에서 제거하고, Hosting만 CI에서 배포하는 방식으로 정리했다.`,
  },
  {
    title: '챗봇 스티비 이메일 연동 삽질기 + SSO 지원 추가',
    slug: 'chatbot-stibee-sso-2026-05',
    category: 'log',
    project: 'Chatbot',
    tags: ['SSO', 'Email'],
    published: true,
    created_at: '2026-05-22T21:00:00+09:00',
    content: `## 이번 주 챗봇에서 무슨 일이 있었나

5월 18일부터 22일까지 챗봇에서 두 가지 큰 작업이 있었다. 스티비 이메일 자동화 연동과 SSO 유저 정보 주입이다.

## 스티비 이메일 자동화 연동 — 하루 종일 API와 씨름

방문자가 채팅 폼을 완료하면 스티비 주소록에 자동 등록되고 자동이메일이 발송되는 플로우를 구현했다.

스티비 API가 문서와 실제 동작이 달랐다. commit이 무려 15개 가까이 쌓였는데 대부분이 payload 형식 싸움이었다.

- \`subscriber\` vs \`subscribers\` (단수/복수 혼용)
- 시스템 필드명이 영어(\`email\`)인지 한국어(\`이메일\`)인지
- \`AccessToken\` 헤더가 필요한지 아닌지 (자동이메일 트리거 URL 자체가 토큰 역할을 한다는 걸 나중에야 확인)
- 자동이메일 트리거(Step2)를 주소록 등록과 별도로 쏴야 하는지, 한 번에 되는지

결국 공식 문서를 처음부터 다시 읽고, 주소록 등록 API와 자동이메일 트리거 API를 각각 명확히 분리해서 순차 호출하는 방식으로 확정됐다. 에러 직렬화도 수정해서 API 응답 전체가 로깅되도록 해둔 덕에 원인을 빨리 잡을 수 있었다.

이메일 발송이 채팅 응답 속도에 영향을 주는 문제도 있었다. 처음엔 \`await\`로 이메일 발송을 기다렸는데 채팅이 느려졌다. Firestore 트리거를 별도로 두어 채팅과 이메일 발송을 분리했다.

## SSO 유저 정보 주입

SaaS로 붙이는 고객사 사이트에서 이미 로그인된 유저 정보를 챗봇에 그대로 전달하는 기능이 필요했다.

위젯 스크립트 태그에 \`data-sso-*\` 속성으로 전달하거나, \`window.CKSsoUser\` 전역 객체에 미리 세팅하는 두 가지 방법을 지원한다. 어느 쪽이든 챗봇이 자동으로 감지해서 리드 폼을 건너뛰고 세션을 생성한다.

## 위젯 런처 리디자인 + 기타

위젯 런처도 손봤다. 기존 컬러 배경 버튼에서 말풍선 아이콘 + 검정 배경으로 바꿨다. 버튼 색상, 텍스트 색상을 채널별로 커스텀할 수 있도록 옵션을 열었다.

슈퍼관리자는 세션 상태와 무관하게 세션을 삭제할 수 있도록 권한을 분리했고, 메시지 전송 시 시각이 스피너 없이 즉시 표시되도록 UI를 다듬었다.

22일에는 어드민에서 메시지 발신자 이름이 표시되고, 구글 스페이스 알림 클릭 시 해당 세션으로 바로 이동하는 링크가 들어갔다.`,
  },
  {
    title: 'RoundWait Firebase 마이그레이션 — 인프라 전면 교체',
    slug: 'roundwait-firebase-migration-2026-05-06',
    category: 'log',
    project: 'RoundWait',
    tags: ['Firebase', 'Migration'],
    published: true,
    created_at: '2026-06-03T20:00:00+09:00',
    content: `## 배경

RoundWait는 행사 현장 대기열 관리 시스템이다. 부스별 예약, 현장 호출, 알림톡 발송까지 한 번에 처리한다. 기존 시스템의 실시간 처리 한계 때문에 Firebase RTDB로의 마이그레이션이 결정됐다.

5월 18일 기반 작업을 시작해서 6월 초까지 이어진 꽤 긴 마이그레이션이었다.

## 마이그레이션 전략

처음부터 전면 교체가 아니라 **Dual Write** 방식을 선택했다. 기존 시스템에 쓰는 동시에 Firebase RTDB에도 미러링하면서 검증하는 단계를 거쳤다.

5월 18일에 기반 코드를 올렸다.

- Firebase RTDB 실시간 게시 헬퍼
- 이벤트 스코프 기반 예약 페이로드 미러링
- Firebase Auth 클라이언트 기반 코드

5월 19일에는 백엔드 연결을 마무리했고, k6로 부하 테스트를 돌려 error rate 4.4%를 확인했다.

## 기능 구현 (5/25 ~ 6/3)

인프라가 안정되자 기능 구현을 병렬로 진행했다.

- **부스 예약 시스템**: 이벤트 스코프 부스 카테고리, 반복 예약 실시간 처리, 예약 한도 설정
- **SSO 연동**: 고객사 시스템 로그인 유저를 RoundWait에 자동 진입
- **호스트 관리**: 호스트 액세스 키 통합 인쇄 기능, 이미지/썸네일 관리 화면
- **부스 구역**: 구역(Zone) 단위 부스 묶음 기능, 부스 숨김 처리
- **PIN 인증 플로우**: PIN 번호 기반 입장 제한

Github Actions CI/CD도 이 기간에 셋업됐다.

## 알림톡 (6/11)

6월 11일에 카카오 알림톡 관련 작업이 몰렸다.

- **호출 알림톡**: 부스명에 구역명이 포함되도록 변경. \`[구역명] 부스명\` 형식.
- **재호출 알림톡**: 재호출 시에도 동일 템플릿으로 발송
- **노쇼 자동취소 알림톡**: 일정 시간 내 미체크인 시 예약이 자동 취소되는데, 이때 참여자에게 알림톡이 발송되도록 추가

알림톡 템플릿은 카카오 비즈플러스에 등록된 내용과 정확히 맞아야 하기 때문에 변수명 하나하나 확인하면서 수정했다.

다국어(영어) 지원도 이벤트 상세 화면과 보고서에 추가됐다.`,
  },
  {
    title: 'IMAGINE AX 2026 — 행사 다가오면서 계속 바뀌는 스피커와 아젠다',
    slug: 'imagineax-2026-content-updates-may-june',
    category: 'log',
    project: 'ImagineAX',
    tags: ['랜딩페이지', '단독개발'],
    published: true,
    created_at: '2026-06-12T18:00:00+09:00',
    content: `## 단독 개발 프로젝트

IMAGINE AX 2026 랜딩페이지는 내가 혼자 맡아서 진행하는 프로젝트다. CongKong이 주최하는 행사인데 나는 개발만 담당한다.

4월 말에 Figma 시안 기반으로 처음 만들었고, 이후로는 행사 기획팀에서 내용이 바뀔 때마다 반영하는 방식으로 계속 이어지고 있다.

## 5월 18일 — 아젠다 섹션 전면 재작성

기존 아젠다 섹션을 완전히 갈아엎었다. 새 세션 구성을 받아서 데스크톱 3열 테이블 레이아웃으로 재구성하고, 모바일도 새 내용으로 업데이트했다.

## 5월 18일 이후 — 반복 수정

행사가 가까워질수록 수정 요청이 잦아졌다. 아젠다, 스피커, 파트너십 섹션이 주로 바뀌었다.

- **5/20**: SK Hy → SK Hynix 표기 수정
- **5/29**: 아젠다 Opening, Master Plan, 스피커 교체
- **6/2**: 스피커 대거 추가 및 수정, Partnerships / APAC 섹션 변경, 모바일 스피커 경력 레이아웃 수정
- **6/4**: 지도 이미지(모바일) 교체, 전체 오타 수정
- **6/5**: 스피커 이미지 교체, 세션명 변경
- **6/8~9**: 스피커 hover 효과 수정, 스피커 이미지 추가 교체
- **6/12**: 최종 스피커 이미지 일부 교체

## 이런 작업에서 배운 것

컨텐츠 주도형 랜딩페이지는 초반 구조 설계가 수정 비용을 결정한다. 스피커 카드 하나를 추가·수정·숨김·교체할 때 코드 변경이 최소화되도록 데이터 배열로 관리한 덕분에 매 수정이 단순했다.

다만 \`speaker-5.png\`, \`speaker-9.png\` 같은 이미지 파일명이 고정되어 있어서, 파일을 교체할 때 캐시 문제가 간혹 생겼다. 버전 쿼리스트링(\`?v=2\`)을 붙이는 것으로 처리했다.`,
  },
  {
    title: 'AI Dev Team 프레임워크 시작 + 최근 업데이트 모음',
    slug: 'ai-dev-team-and-recent-updates-2026-06',
    category: 'log',
    tags: ['AI', 'DevTeam'],
    published: true,
    created_at: '2026-06-13T20:00:00+09:00',
    content: `## AI Dev Team 프레임워크

5월 22일, 새 실험 프로젝트를 시작했다. 페르소나 기반 AI 개발팀 프레임워크다.

팀원 역할(PM, 시니어 개발자, QA 등)을 페르소나로 정의해두고, 개발 작업을 팀 논의처럼 진행하는 방식을 실험한다. 실제로 혼자 개발하다 보면 특정 관점을 놓치는 경우가 많은데, 그 부분을 보완하려는 시도다.

Vercel에 배포해두었고, 초기 셋업 과정에서 \`rootDirectory\` 설정 문제(vercel.json에 유효하지 않은 키가 있었음)를 수정하면서 몇 번의 재배포가 있었다.

아직 초기 단계라 앞으로 어떤 방향으로 발전할지 지켜봐야 한다.

## 챗봇 — 추가 메시지 웹훅 + 미확인 뱃지 (6/11)

6월 11일에 챗봇에 두 가지가 추가됐다.

**추가 메시지 웹훅 알림**: 상담 중인 세션에 방문자가 새 메시지를 보내면, 상담원에게 웹훅으로 알림을 보내는 기능. 기존에는 새 세션 생성 시에만 알림이 갔는데, 이제 진행 중인 대화에 메시지가 추가돼도 알림이 간다.

**세션 목록 미확인 뱃지**: 어드민 세션 목록에서 읽지 않은 메시지가 있는 세션에 뱃지가 표시된다. 실시간으로 업데이트된다.

## hunipopol 포트폴리오 사이트 UI (6/12)

오랫동안 방치했던 포트폴리오 사이트를 조금 손봤다.

Primary 색상을 인디고-바이올렛 계열로 교체했다. 기존 색상보다 개성이 있고 기술적인 느낌이 더 난다. 포트폴리오 헤더 문구도 영어에서 한국어로 바꿨다.

작은 변경이지만 사이트를 다시 열어보니 확실히 달라 보인다.

## 이 기간을 돌아보면

5월 중순부터 한 달 동안 글방 구조 개편, 챗봇 이메일 연동, RoundWait 마이그레이션, IMAGINE AX 업데이트가 동시에 돌아갔다. 어느 하나가 특별히 크다기보다 각각이 제법 됩직한 작업들이었다.

바빠서 일지를 못 썼는데, 이렇게 몰아쓰고 보니 꽤 많이 했다.`,
  },
  {
    title: 'SalesPulse — IMAGINE AX 2026에 실전 투입한 VIP 세일즈 대시보드',
    slug: 'salespulse-vip-dashboard-imagine-ax',
    category: 'project',
    project: 'SalesPulse',
    tags: ['Vue 3', 'Go', 'KakaoTalk'],
    published: true,
    created_at: '2026-06-14T19:00:00+09:00',
    content: `## 무엇을 만들었나

IMAGINE AX 2026은 CongKong이 주관한 기술 컨퍼런스다. VIP 참가자 수십 명이 현장 체크인을 할 때마다 담당 영업사원이 실시간으로 알림을 받고, 모바일 웹에서 VIP 목록과 체크인 상태를 즉시 확인할 수 있는 시스템을 만들었다.

이름은 **SalesPulse**. CongKong 플랫폼(Go Echo v4 + Vue 3)에 신규 모듈로 붙였다.

## 왜 만들었나

행사 운영팀이 수동으로 VIP 체크인을 영업사원에게 전달하고 있었다. 현장에서 VIP를 놓치면 비즈니스 미팅 기회가 사라지는데, 연락 지연이 5~10분씩 나는 경우가 많았다. 알림이 자동화되면 그 격차가 0이 된다.

## 아키텍처 결정

### 비동기 알림톡

체크인 처리 흐름은 이미 있었다. 거기에 VIP 체크인 훅을 붙이는 방식을 선택했다.

\`\`\`
[체크인 API] → IsVIP() 판별
             ↓ (non-blocking)
           owlbear 비동기 발행
             ↓
           processVipCheckin()
             ├─ field1 파싱 → 담당자 ID 목록
             ├─ 담당자 Attendee 조회 → 핸드폰 번호
             └─ 카카오 알림톡 발송 + 로그 기록
\`\`\`

체크인 응답이 알림톡 발송을 기다리면 안 되기 때문에 owlbear(내부 이벤트 버스)를 통해 비동기로 처리했다. 현장 체크인 속도는 그대로 유지되면서 알림은 병렬로 간다.

### 인증 최소화

영업사원을 위해 별도 계정을 만드는 건 오버엔지니어링이었다. 이름 + 핸드폰 번호로 기존 Attendee 레코드를 매칭하고 Redis 임시 토큰(TTL 24h)을 발급하는 방식으로 해결했다. 행사 당일 하루짜리 세션이라 영구 계정이 필요 없다.

### VIP-담당자 매핑

신규 테이블을 만드는 대신 기존 \`attendee.field1\` 컬럼을 재활용했다. VIP 레코드의 field1에 담당자 Attendee ID를 \`|\` 구분 문자열로 저장하는 방식. 1:N, N:M 모두 지원하면서 스키마 변경을 최소화했다.

## 백엔드 구현 (\`server/featurev3/vipsales/\`)

Go 모듈 4개 파일로 구성했다.

- **domain.go**: 모델 정의 (\`VipConsultationLog\`, \`VipCheckinNotifyLog\`)와 유틸 함수 (\`IsVIP\`, \`IsSales\`, \`ParseManagerIDs\`)
- **notifier.go**: owlbear 구독/발행, 알림톡 발송, Redis 토큰 관리, AutoMigrate
- **handler.go**: API 핸들러 5개 (영업사원 API 3개 + 어드민 API 2개)
- **router.go**: \`init()\`에서 라우트 등록

SQL 최적화도 했다. VIP 목록 조회 시 이벤트 전체 \`check_log\`를 GROUP BY하면 규모가 커질수록 느려진다. VIP ID 목록을 먼저 뽑고 그 범위 안에서만 체크인 로그를 JOIN하는 2-step 쿼리로 바꿨다.

## 프론트엔드 구현 (\`front/src/features/vip-sales-dashboard/\`)

Vue 3 Composition API + Pinia + Tailwind. 모바일 퍼스트로 설계했다.

**대시보드 핵심 UI:**

- **2×2 탭 그리드**: 전체 / 도착 / 사전등록 / 미도착 — 탭 클릭으로 VIP 목록 즉시 필터
- **VIP 카드**: 이름, 소속, 직책, 체크인 상태 배지, 전화(\`tel:\`) / 문자(\`sms:\`) 버튼
- **알림 Bottom Sheet**: 🔔 클릭 시 slide-up 애니메이션, VIP 알림 목록, 카드로 스크롤 이동
- **상담일지 모달**: VIP별 메모 작성/조회 (fade-in 애니메이션)

알림 폴링은 30초 주기 setInterval로 구현했다. SSE나 WebSocket은 이 사용 패턴에 과했다. 행사 당일 몇 시간 동안만 쓰는 기능이고, 영업사원 수십 명이 동시 접속하는 규모이기 때문에 폴링이 더 예측 가능하고 운영하기 쉬웠다.

어드민 탭도 추가했다. VIP-담당자 매핑 현황 테이블, 담당자 검색 드롭다운, 알림톡 성공/실패 표시까지.

## IMAGINE AX 2026 실전

행사 당일 VIP 수십 명이 체크인하면서 SalesPulse가 실제로 돌아갔다. 알림톡이 VIP 체크인 직후 자동으로 발송되었고, 영업사원들이 모바일 웹에서 VIP 상태를 실시간으로 확인했다.

수동으로 연락을 전달하던 방식에서 알림이 자동화되면서 영업팀의 응대 속도가 올라갔다.

## 돌아보면

기존 플랫폼(CongKong)에 새 기능을 붙이는 작업이라 기존 코드 구조를 먼저 파악하는 게 중요했다. 어드민 권한 체계(Casbin), 기존 체크인 플로우, owlbear 이벤트 버스 등 내부 인프라를 제대로 이해하고 나서야 최소한의 변경으로 원하는 기능을 구현할 수 있었다.

신규 테이블을 최소화하고, 기존 구조를 최대한 재활용하는 방향으로 설계한 것이 결과적으로 빠른 구현과 안정적인 운영으로 이어졌다.`,
  },
  {
    title: 'HUNI² 포트폴리오 사이트 구축기 — 내 기록을 담는 공간',
    slug: 'huni2-portfolio-site-launch',
    category: 'project',
    project: 'hunipopol',
    tags: ['Next.js', 'Supabase'],
    published: true,
    created_at: '2026-06-19T20:00:00+09:00',
    content: `## 왜 만들었나

개발 일지를 Notion에 쓰다 보면 공개하기 애매하고, GitHub README에 넣기엔 형식이 맞지 않는다. 내가 쌓아온 것들을 제대로 보여줄 수 있는 공간이 필요했다.

그래서 4월 중순, 포트폴리오 사이트를 직접 만들기 시작했다.

## 기술 선택

| 레이어 | 선택 | 이유 |
|--------|------|------|
| 프레임워크 | Next.js 16 App Router | 서버 컴포넌트로 초기 로드 최적화 |
| 백엔드/DB | Supabase | Auth + PostgreSQL + Storage를 한 곳에서 |
| 스타일 | Tailwind CSS v4 + DaisyUI v5 | 다크/라이트 테마를 \`data-theme\` 하나로 관리 |
| 애니메이션 | Framer Motion | 페이지 진입 효과, 벤토 그리드 hover |
| 배포 | Vercel + GitHub Actions | main push → 자동 배포 |

## 기간별 구현 흐름

### 4월 16~20일 — 기반 구축

첫 커밋부터 배포까지 4일 만에 달렸다.

- Supabase 스키마 설계 (\`projects\`, \`logs\`, \`site_settings\`)
- Portfolio CMS + 마크다운 블로그 시스템
- Admin 패널 (About · Contact · SEO · 포트폴리오 관리 · 글쓰기)
- 한국어/영어 i18n (\`useTranslation\` 훅)
- GitHub Actions → Vercel 자동 배포 파이프라인

Next.js 16에서 middleware 파일명 컨벤션이 바뀌어서(\`middleware.ts\` → \`proxy.ts\`) 초반에 약간 헤맸다. 훈련 데이터 기반의 Next.js 지식과 실제 최신 버전이 다른 대표적인 케이스였다.

### 5월 10일 — 홈 페이지 전면 개편

정보를 나열하는 형태에서 **벤토 그리드**로 바꿨다.

마우스 움직임에 따라 카드 위에 빛 반사 효과(mouse light reflection)가 생긴다. \`mousemove\` 이벤트를 rAF(requestAnimationFrame)로 throttle해서 60fps에서도 성능 문제 없이 돌아간다. 나중에 모바일 카드 높이 \`auto\` 전환과 CSS 셀렉터 범위 축소도 추가해서 불필요한 레이아웃 재계산을 줄였다.

홈에 Impact CRUD 기능, Dev Log 다중 표시도 붙었다.

### 5월 10일 — Log 기능 고도화

- 무한 스크롤 (IntersectionObserver 기반)
- 태그 필터링 + 포트폴리오-Log 태그 연결 (같은 태그면 크로스 링크)
- 검색 + 필터링 고도화

태그 클라우드 최적화도 했다. 태그를 빈도수 기준으로 정렬하고 크기를 조절하는 방식.

### 6월 14일 — Impact 시스템 + Contact 폼

**Impact 페이지**: 숫자로 보여주는 나의 작업 결과. 각 수치에 관련 개발 로그 링크를 연결했다. 단순한 숫자가 아니라 맥락이 있어야 의미 있다고 생각했다.

Supabase \`site_settings\` 테이블의 \`impact_stats\` 키에 JSON으로 저장하고, 어드민에서 CRUD하는 구조.

**Contact 폼**: Resend로 실제 이메일 전송 + Supabase에 메시지 저장. 어드민 패널에서 받은 메시지를 확인할 수 있다.

### 6월 19일 — 디자인 시스템 정제

전체 primary 색상을 인디고-바이올렛으로 통일했다. 컴포넌트마다 조금씩 달랐던 색상, 여백, 폰트 크기를 정리했다.

히어로 카피는 XYZ 기법(X를 Y함으로써 Z를 달성했다)으로 리라이팅. 단순한 기술 나열보다 임팩트가 훨씬 명확해졌다.

## 구조 설계에서 신경 쓴 것

**서버/클라이언트 분리**: 데이터 페치는 \`page.tsx\`(서버 컴포넌트), 인터랙션은 \`*Client.tsx\`(클라이언트 컴포넌트). 서버 컴포넌트가 기본값인 Next.js 16 철학을 그대로 따랐다.

**Admin CMS**: 별도 서비스 없이 Supabase Row Level Security로 인증 처리. 로그인한 사용자만 쓰기 가능, 읽기는 공개.

**i18n 설계**: 라이브러리 없이 \`lib/i18n.tsx\`의 \`useTranslation\` 훅 하나로 해결. 오버엔지니어링 없이 필요한 것만.

## 이 사이트 자체가 포트폴리오

개발 과정을 문서화하고, 임팩트를 숫자로 정리하고, 코드를 Admin CMS로 운영하는 경험을 이 사이트 자체로 담았다.

지금 보고 있는 이 글도 그 일부다.`,
  },
  {
    title: 'RoundWait — Zone 정보 카카오 알림톡 연동 + 호스트 UI 개선',
    slug: 'roundwait-zone-kakao-notification-2026-06-23',
    category: 'log',
    project: 'RoundWait',
    tags: ['Go', 'KakaoTalk'],
    published: true,
    created_at: '2026-06-23T20:00:00+09:00',
    content: `## 작업 내용

**프로젝트**: RoundWait (Go + Next.js)

### 1. 카카오 알림톡에 Zone 정보 추가

\`bookingDashboardPayload\`에 \`EventBooth\`와 \`EventBoothZone\` 정보를 포함시켜 카카오 알림톡 발송 시 부스 이름과 Zone 정보가 함께 전달되도록 했다.

\`\`\`go
if booking.EventBoothZone != nil {
    payload["zoneId"] = strconv.FormatInt(booking.EventBoothZone.Id, 10)
    payload["zoneName"] = booking.EventBoothZone.Name
    payload["zoneNameKo"] = booking.EventBoothZone.NameKo
    // ... 다국어 필드
}
\`\`\`

알림톡 수신자(참가자)가 어느 Zone에 배정됐는지 메시지에서 바로 확인할 수 있게 됐다.

### 2. \`GetById\` 엔드포인트 신규 추가

단건 booking 조회 API — \`Event\`, \`EventBooth\`, \`EventBoothZone\`을 Preload해서 반환. 참가자 앱 입장 확인 화면(\`EntryConfirmationScreen\`)에서 Zone 정보를 표시하는 데 사용.

### 3. 호스트 모바일 큐 UI 개선

큐 행 높이와 버튼/셀렉트 크기를 터치 타겟 기준으로 올렸다.

| 요소 | 변경 전 | 변경 후 |
|------|--------|--------|
| \`.rw3-qrow\` min-height | 62px | 72px |
| \`select\` height | 34px | 42px |
| \`button\` height | 34px | 42px |

### 4. 참가자 앱 입장 확인 화면 Zone 표시

\`EntryConfirmationScreen.tsx\`와 \`UserApp.tsx\`에서 Zone 이름을 가져와 표시. \`userStore\`에 Zone 관련 상태 필드 추가.`,
  },
  {
    title: 'RoundWait — 삭제된 사용자 재가입 시 충돌 버그 수정',
    slug: 'roundwait-delete-user-reregister-bug-2026-06-24',
    category: 'log',
    project: 'RoundWait',
    tags: ['BugFix', 'Go'],
    published: true,
    created_at: '2026-06-24T02:00:00+09:00',
    content: `## 버그 설명

**프로젝트**: RoundWait (Go)

어드민이 사용자를 삭제(soft-delete)한 뒤, 같은 전화번호로 재가입을 시도하면 로그인에 실패하는 문제.

### 근본 원인

\`getOrCreatePhoneUserCredential\`이 기존 자격증명을 조회할 때 GORM의 기본 soft-delete 필터(\`WHERE deleted_at IS NULL\`)만 적용됐다. 연결된 \`Account\`나 \`UserProfile\`이 soft-delete된 경우는 필터에서 제외됐고, 삭제된 자격증명이 "유효한 기존 유저"로 반환돼 로그인 흐름이 막혔다.

## 수정 내용

### 1. GORM 조회를 \`Unscoped()\`로 변경

\`\`\`go
// After — 삭제된 레코드도 포함해서 조회
s.db.Unscoped().
    Preload("Account", func(db *gorm.DB) *gorm.DB { return db.Unscoped() }).
    Preload("UserProfile", func(db *gorm.DB) *gorm.DB { return db.Unscoped() }).
    Where("event_id = ?", eventId).
    Where("phone_number_text IN ?", lookupCandidates).
    First(&existingCred)
\`\`\`

### 2. \`isDisabledPhoneCredential\` 검사 추가

조회된 자격증명이 비활성 상태인지 판단.

### 3. 비활성 자격증명 아카이빙

삭제된 자격증명의 번호를 \`phone#disabled:id\` 형식으로 변경해서 충돌을 방지하고 새 자격증명 생성을 허용.

### 4. \`active_session_guard.go\` 추가

로그인 세션 유효성 검사 미들웨어. 세션이 살아있어도 관련 계정/프로필이 삭제된 경우 401 반환.

## 테스트 추가

\`phone_number_service_test.go\`와 \`user_delete_cleanup_test.go\`에 테스트 케이스 추가 (총 16개 파일 변경, +706 줄).

## 교훈

GORM의 soft-delete 필터는 연관 테이블에 자동 적용되지 않는다. Preload 안에서 별도로 \`Unscoped()\`를 명시해야 삭제된 연관 레코드까지 가져올 수 있다.`,
  },
  {
    title: 'Timeslot — 이벤트 slug 변경 후 상태 불일치 버그 수정',
    slug: 'timeslot-use-current-event-slug-mismatch-2026-07-01',
    category: 'log',
    project: 'Timeslot',
    tags: ['BugFix', 'Firestore'],
    published: true,
    created_at: '2026-07-01T20:00:00+09:00',
    content: `## 버그 설명

**프로젝트**: Timeslot Event OS (Next.js 15 + Firebase)

어드민에서 이벤트의 \`slug\` 필드를 변경했을 때, 참가자 앱이 여전히 변경 전 이벤트 데이터를 표시하는 문제.

### 근본 원인

\`useCurrentEvent\` 훅에서 이벤트를 조회할 때 두 가지 경로를 사용했다.

1. **직접 조회**: \`doc(db, 'events', slug)\` — Firestore 문서 ID가 slug와 동일하다고 가정
2. **쿼리 조회**: \`where('slug', '==', eventSlug)\` — fallback

Firestore **문서 ID는 변경 불가**하기 때문에, \`slug\` 필드는 바뀌어도 문서 ID(= 구 slug)는 그대로였다. 직접 조회 경로가 구 문서를 찾아 잘못된 상태를 반환하고 있었다.

## 수정 내용

직접 조회로 문서를 찾았더라도, 반환된 문서의 \`slug\` 필드가 요청한 slug와 일치하는지 검증하도록 변경. 불일치하면 \`where('slug', '==', eventSlug)\` 쿼리로 fall through.

\`\`\`typescript
// After — slug 필드 일치 여부 확인 후 신뢰
if (directSnap.exists() && directSnap.data().slug === eventSlug) {
    return { id: directSnap.id, ...directSnap.data() };
}
// 불일치 → fall through to where query
\`\`\`

## 교훈

Firestore 문서 ID를 애플리케이션 slug와 동일하게 만드는 패턴은 초기에 조회 성능을 높여주지만, slug가 변경 가능한 필드라면 반드시 **문서 ID와 slug 필드 불일치 가능성**을 처리해야 한다.`,
  },
  {
    title: 'BLE 체크인 미들웨어 MVP 구현 — Go + Redis + Hygate',
    slug: 'ble-checkin-middleware-mvp-2026-07-02',
    category: 'log',
    project: 'BLE미들웨어',
    tags: ['Go', 'Redis', 'MVP'],
    published: true,
    created_at: '2026-07-02T21:00:00+09:00',
    content: `## 배경

**프로젝트**: ble-checkin-middleware (신규, Go)

Hygate BLE 게이트웨이가 TCP로 전송하는 BLE 신호 데이터를 수신해서, 중복 처리를 막고 COP(Check-Out Point) API로 체크인 이벤트를 전달하는 미들웨어가 필요했다. 기존에는 게이트웨이가 직접 COP API를 호출했는데, 디바운싱·라우팅·재시도 로직을 중앙화하기 위해 별도 미들웨어를 만들었다.

## 아키텍처

\`\`\`
Hygate Gateway ──TCP──▶ ble-checkin-middleware ──HTTP──▶ COP API
                              │
                         Redis (디바운싱 + 라우팅)
\`\`\`

## 구현 내용

### TCP 서버

고루틴 기반으로 여러 Hygate 게이트웨이의 동시 접속을 처리. \`processLine\`을 \`recover\`로 감싸 panic에도 연결이 끊기지 않도록 안전망 추가.

### CSV 파싱 — 실제 Hygate 포맷 파악

처음에 필드 인덱스를 잘못 매핑했다가 디버그 로그로 실제 포맷을 확인 후 수정:

\`\`\`
실제 Hygate CSV 포맷:
BLE_PAYLOAD, BEACON_MAC, RSSI, BATTERY, GATEWAY_MAC
인덱스:  [0]         [1]        [2]   [3]       [4]
\`\`\`

### RSSI 필터링

\`-80 dBm\` 미만 신호는 드롭. 너무 약한 신호는 오탐을 유발하기 때문.

### Redis 디바운싱 (TTL 30초)

\`GATEWAY_MAC + BEACON_MAC\` 조합을 키로 Redis에 30초 TTL로 저장. 30초 내 같은 신호는 COP API 호출을 건너뜀.

### Redis 라우팅

\`GATEWAY_MAC → COP API URL\` 매핑을 Redis에 저장. 어드민이 런타임에 게이트웨이별 엔드포인트를 바꿀 수 있다.

### HTTP 전송 — 지수 백오프 재시도

COP API 호출 실패 시 최대 3회, 지수 백오프로 재시도.

### EventDecider 인터페이스

현재는 단순 IN 판정이지만, A/B 게이트웨이 RSSI 피크 비교 기반 입퇴장 판정으로 교체 가능하도록 인터페이스로 분리.

## 추가 설계 문서

- \`docs/direction-detection.md\`: Hygate A/B 게이트웨이 RSSI 피크 비교 기반 입퇴장 방향 판정 설계
- \`docs/infra-roadmap.md\`: EC2 MVP → 고가용성 인프라 확장 로드맵

## 결과

| 항목 | 내용 |
|------|------|
| 언어 | Go 1.22 |
| 의존성 | Redis (go-redis), net/http |
| 처리량 | 고루틴 기반 무제한 동시 접속 |
| 중복 방지 | Redis TTL 30초 디바운싱 |
| 신뢰성 | 지수 백오프 3회 재시도 + panic recover |`,
  },
  {
    title: 'hunipopol — /resume 인쇄 전용 이력서 페이지 추가',
    slug: 'hunipopol-resume-print-page-2026-07-05',
    category: 'log',
    project: 'hunipopol',
    tags: ['Next.js', 'PrintCSS'],
    published: true,
    created_at: '2026-07-05T21:35:00+09:00',
    content: `## 목적

**프로젝트**: hunipopol (Next.js 16 + Supabase)

포트폴리오 사이트에서 인쇄 가능한 이력서가 필요했다. PDF 파일을 별도로 관리하는 대신, 사이트 데이터(Supabase)를 그대로 가져와서 \`/resume\` 페이지에서 Ctrl+P로 바로 출력할 수 있는 방식을 선택했다.

## 구현 내용

### 파일 구조

\`\`\`
app/resume/
├── layout.tsx              # 네비게이션 없는 resume 전용 레이아웃
├── page.tsx                # 서버 컴포넌트, Supabase에서 모든 데이터 fetch
└── ResumePrintClient.tsx   # 인쇄 최적화 레이아웃 (182줄)
\`\`\`

### layout.tsx — 네비게이션 제거

루트 레이아웃의 \`Header\`와 \`BottomTabNav\`가 이력서 페이지에는 불필요하다. \`app/resume/layout.tsx\`로 별도 레이아웃을 만들어 네비게이션을 제거했다.

### page.tsx — 서버 컴포넌트에서 데이터 통합

\`about_bio\`, \`career_timeline\`, \`tech_stack\` 등 \`site_settings\`와 \`projects\`, \`impact\` 테이블을 서버에서 모두 가져와 \`ResumePrintClient\`에 props로 전달.

### ResumePrintClient.tsx — 인쇄 최적화 레이아웃

- 섹션 구성: About(이름·소개·기술 스택), Impact(수치화된 성과), Career(경력 타임라인), Projects(프로젝트 목록), Skills
- 인쇄 배려: \`page-break-inside: avoid\`, 링크는 괄호로 URL 출력
- 스크린 뷰: 흰 배경 + A4 비율 카드, 인쇄 버튼 노출

\`\`\`tsx
// 스크린 전용 컨트롤
<div className="print:hidden">
  <button onClick={() => window.print()}>인쇄 / PDF 저장</button>
</div>
\`\`\`

### globals.css — print 미디어 쿼리

\`\`\`css
@media print {
  .resume-root { background: white; }
  @page { margin: 15mm; }
}
\`\`\`

## 결과

| 항목 | 내용 |
|------|------|
| 신규 파일 | 4개 (layout, page, ResumePrintClient, globals.css 수정) |
| 데이터 소스 | Supabase — site_settings + projects + impact |
| 인쇄 방식 | 브라우저 Ctrl+P / window.print() |
| PDF 관리 | 불필요 (항상 최신 데이터 자동 반영) |`,
  },
  {
    title: 'RoundWait 1만 명 부하 테스트 — 서버리스 스택의 한계를 직접 확인하다',
    slug: 'roundwait-10k-load-test',
    category: 'log',
    project: 'RoundWait',
    tags: ['부하테스트', 'k6'],
    published: true,
    created_at: '2026-06-22T21:00:00+09:00',
    content: `## 배경

RoundWait는 대규모 행사 현장에서 부스 예약과 대기열을 실시간으로 관리하는 시스템이다. Firebase 기반 서버리스 스택으로 재구축한 뒤, 실제 행사 투입 전에 1만 명 규모의 부하 테스트가 필요했다.

테스트 대상 행사: **마비노기 Fantasy Party 2026** (예상 참가자 1만 명+)

## 테스트 설계

### 핵심 SLO

- 예약 성공률 ≥ 99%
- 예약 처리 p95 ≤ 2초
- 알림톡 오발송 0건

### 환경 구성

실제 마비노기 행사 이벤트를 테스트 환경에 그대로 복제했다. 실데이터는 건드리지 않고, 참가자 1만 명 + 부스 5개 구성.

부하 생성기는 Cloud Run Job으로 구성했다. 로컬 머신으로 1만 건의 Firebase 인증을 시뮬레이션하면 Google Identity Toolkit의 API 쿼터에 금방 걸린다. 인-리전(asia-northeast3) Cloud Run Job을 쓰면 Firebase 프로젝트와 같은 리전에서 실행되어 쿼터 조건이 다르게 적용된다.

테스트 도구는 k6. RAMP_SEC 파라미터를 두어서 1만 명의 로그인이 시간에 걸쳐 퍼지도록 했다. 한꺼번에 몰리면 Identity Toolkit 쿼터를 먼저 소진한다.

## 결과

\`\`\`
예약 성공률:    99.94%  (10,000건 중 실패 6건)
예약 처리 속도: 평균 0.26초
오토스케일:     정상 작동
DB 연결:        한도 내 안정
알림 오발송:    0건
\`\`\`

**→ 핵심 SLO 전부 통과.**

전체 측정에서 약 3% 실패율이 보였지만, 분석해보니 98%는 Cloud Run Job이 1만 건의 가짜 로그인을 한꺼번에 발급하다가 Identity Toolkit 쿼터에 걸린 것이었다. 실제 예약 처리 실패율만 보면 **0.06%**.

## 주요 기술적 발견

### DB 연결 관리

Cloud Run 인스턴스가 오토스케일로 늘어날 때 PostgreSQL 연결 풀이 급증한다. \`maxInstances\` 캡과 인스턴스당 풀 크기를 조정해서 연결 한도 내에서 안정적으로 유지되도록 했다.

### 트랜잭션 모드

부하 집중 시 예약 중복이 발생하지 않도록 raw-pg 트랜잭션 모드를 테스트했다. 동시성 제어가 실제로 작동하는지 검증하는 과정이었다.

### 비용 구조

1만 명 테스트 1회 비용: **약 1만 원 미만.**

서버리스 스택의 특성상 행사 전날 용량을 높이고, 행사가 끝나면 내린다. 평상시 비용은 거의 0에 가깝다. 대규모 행사를 자주 하지 않는 운영 환경에서 서버리스가 맞는 이유다.

## 남은 과제

꼬리 지연(tail latency)이 있다. 99%는 빠른데 극히 일부 사용자가 느린 응답을 받는다. 예약 오픈 시간을 시간대별로 분산하면 완화할 수 있다.

Firebase RTDB Fanout 테스트(100명 p95 715ms, 500명에서 꼬리 지연 확인)에서 드러난 것처럼, 동시 소켓 수가 늘어날수록 fanout 지연이 길어진다. 현재는 참가자 수에 비해 실시간 구독 클라이언트 수가 제한적이라 실제 운영에서는 문제가 없지만, 스케일이 더 커지면 RTDB Fanout 경로 최적화가 필요할 수 있다.

## 배운 것

부하 테스트는 숫자를 뽑는 것보다 **어디서 병목이 생기는지 이해하는 게 더 중요**하다. 이번에도 겉보기 실패율 3%의 대부분이 테스트 도구 자체의 한계였고, 실제 서비스 경로는 0.06% 실패율로 정상이었다.

숫자를 그대로 믿지 말고, 원인을 파고드는 게 맞다.`,
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
