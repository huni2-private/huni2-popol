// 프로젝트 설명(## 헤더 구조 마크다운)을 포스트모템 타임라인 섹션으로 파싱한다.
// 콘텐츠를 새로 쓰지 않고 기존 저자 헤더(원문)를 그대로 보존한 채,
// 헤더 문구로 역할(배경/원인·해결/기술/결과/회고/담당)만 분류해 시각적으로 묶어준다.
export type PostmortemKind = 'context' | 'process' | 'stack' | 'result' | 'learned' | 'role' | 'other';

export interface PostmortemSection {
  id: string;
  rawTitle: string;
  kind: PostmortemKind;
  body: string;
}

const KIND_RULES: Array<{ kind: PostmortemKind; match: RegExp }> = [
  { kind: 'context', match: /목적|왜 만들었나|무엇을 만들었나|배경/ },
  { kind: 'process', match: /문제|과정|핵심 선택|핵심 설계|만들면서/ },
  { kind: 'stack', match: /기술|스택/ },
  { kind: 'result', match: /결과|성과/ },
  { kind: 'learned', match: /배운|회고/ },
  { kind: 'role', match: /담당|역할/ },
];

function classify(title: string): PostmortemKind {
  for (const rule of KIND_RULES) {
    if (rule.match.test(title)) return rule.kind;
  }
  return 'other';
}

export function parsePostmortem(markdown: string | undefined | null): PostmortemSection[] {
  if (!markdown || !/^##\s+.+$/m.test(markdown)) return [];

  // "## 제목" 줄 기준으로 쪼갠다 — 캡처 그룹이 있는 split이라 [전문, 제목1, 본문1, 제목2, 본문2, ...] 형태가 된다.
  const parts = markdown.split(/^##\s+(.+)$/m).slice(1);
  const sections: PostmortemSection[] = [];

  for (let i = 0; i < parts.length; i += 2) {
    const rawTitle = parts[i].trim();
    const body = (parts[i + 1] ?? '').trim();
    if (!rawTitle || !body) continue;
    sections.push({ id: `${i}-${rawTitle}`, rawTitle, kind: classify(rawTitle), body });
  }

  return sections;
}
