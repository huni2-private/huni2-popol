import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://sbmekgmjzbksmfzthidu.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
);

const logs = [
  {
    title: 'TimeSlot, 아주대 전공멘토링 행사에 실전 투입되다',
    slug: 'timeslot-ajou-mentoring-2026',
    category: 'log',
    tags: ['TimeSlot', 'Firebase', 'Next.js', '행사운영'],
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
    tags: ['Next.js', '랜딩페이지', 'Figma', '반응형'],
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
    tags: ['챗봇', 'Firebase', 'AI', 'SaaS'],
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
    tags: ['TimeSlot', 'DesignSystem', 'UI/UX'],
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
    tags: ['Chatbot', 'ImagineAX', 'Next.js', 'UI/UX'],
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
    tags: ['Chatbot', 'TimeSlot', 'Firebase', 'Realtime'],
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
    tags: ['Chatbot', 'ImagineAX', 'TimeSlot', 'Security'],
    published: true,
    created_at: '2026-05-06T23:00:00+09:00',
    content: `## 다크모드 대응 및 보안 기능 강화

오늘은 **Chatbot**의 다크모드 완성도를 높이고, **TimeSlot**에 이벤트 보안 기능을 추가했습니다.

### Chatbot (다크모드 & 안정화)
- **다크모드 완성**: 채팅창 및 설정 탭의 모든 UI 요소에 다크모드 테마를 완벽하게 적용했습니다.
- **봇 트래픽 차단**: Google 봇 등 불필요한 검색 엔진 크롤러의 트래픽을 차단하는 로직을 추가했습니다.
- **방문자 추적**: Firestore 기반의 방문자 실시간 추적 안정성을 개선했습니다.

### Imagine AX 2026
- **Agenda 섹션 업데이트**: Figma 최신 시안을 반영하여 세션 카드 색상, 간격, 구분선 디자인을 수정했습니다. 점심 시간 아이콘 및 배경색도 세밀하게 조정했습니다.

### TimeSlot (보안 및 제어)
- **이벤트 접근 제어**: 이벤트 블록 숨김, PIN 번호 기반 입장 제한, 종료(Closed) 모드 등 이벤트 운영 환경에 필요한 다양한 보안 제어 기능을 구현했습니다.`,
  },
  {
    title: 'CongKong 주간 개발 로그: 챗봇 UX 대규모 개선',
    slug: 'congkong-weekly-log-2026-05-07',
    category: 'log',
    tags: ['Chatbot', 'UX', 'Mobile', 'UI/UX'],
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
    tags: ['Chatbot', 'Firebase', 'Configuration'],
    published: true,
    created_at: '2026-05-08T15:00:00+09:00',
    content: `## 인프라 및 설정 최적화

오늘은 **Chatbot**의 파일 전송 안정성을 위해 Firebase Storage 설정을 최적화했습니다.

### 주요 변경 사항
- **Storage Bucket 업데이트**: Firebase의 최신 권장 사항에 따라 스토리지 버킷 도메인을 \`appspot.com\`에서 \`firebasestorage.app\`으로 변경했습니다.
- **위젯 설정 최적화**: 변경된 버킷 도메인을 위젯 설정에 반영하여 파일 첨부 시 발생할 수 있는 잠재적 이슈를 예방했습니다.`,
  },
];

async function main() {
  console.log('inserting logs...');
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
      console.error(`failed [${log.title}]:`, error.message);
    } else {
      console.log(`ok: ${log.title}`);
    }
  }
}

main();
