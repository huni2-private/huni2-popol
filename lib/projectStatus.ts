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

export function projectStatusMeta(status: ProjectStatus | string, lang: 'ko' | 'en' = 'ko') {
  const labels = LABELS[lang];
  switch (status) {
    case 'live':
      return { label: labels.live, dotClass: 'bg-success', textClass: 'text-success' };
    case 'wip':
      return { label: labels.wip, dotClass: 'bg-warning', textClass: 'text-warning' };
    case 'archived':
    default:
      return { label: labels.archived, dotClass: 'bg-base-content/30', textClass: 'text-base-content/40' };
  }
}
