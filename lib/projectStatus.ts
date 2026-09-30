// 프로젝트 status를 카드/상세 페이지에 쓸 라벨·색상으로 매핑하는 공용 로직.
// 예전엔 RESOLVED/env:production/stack:go 같은 인시던트 대시보드 용어를 썼는데,
// "장애 해결"과 "프로젝트 운영 상태"가 다른 개념이라 혼동을 준다는 피드백을 받아
// 프로젝트 상태 자체는 평이한 말로 표시한다. (포스트모템 타임라인의
// ROOT CAUSE → FIX 같은 라벨은 실제 문제-해결 서사라 그대로 유지)
export type ProjectStatus = 'live' | 'wip' | 'archived';

const LABELS = {
  ko: { live: '운영 중', wip: '개발 중', archived: '종료' },
  en: { live: 'Live', wip: 'In Progress', archived: 'Archived' },
} as const;

// 카드 하단 기술 태그와 같은 아웃라인 칩 스타일로 통일 (점+원색 텍스트 조합은
// 상태별 색만 다를 뿐 위치/역할이 같아 badgeClass 하나로 공용 처리한다).
const BADGE_CLASS =
  'inline-flex items-center rounded border border-base-content/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-base-content/50';

export function projectStatusMeta(status: ProjectStatus | string, lang: 'ko' | 'en' = 'ko') {
  const labels = LABELS[lang];
  const label = status === 'live' || status === 'wip' ? labels[status] : labels.archived;
  return { label, badgeClass: BADGE_CLASS };
}
