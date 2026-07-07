'use client';

// 이력서 인쇄 전용 클라이언트 — window.print() 트리거 + @media print 레이아웃
import { Printer } from 'lucide-react';

interface Bio     { title_ko?: string; desc_ko?: string; }
interface Career  { year: string; company: string; title_ko: string; desc_ko: string; }
interface Stack   { name_ko: string; items: string[]; }
interface Impact  { id: string; project?: string; metric: string; title: string; before?: string; after?: string; context?: string; }
interface Project { id: string; title: string; description?: string; tags?: string[]; type?: string; status?: string; project_url?: string; github_url?: string; }
interface Contact { email?: string; github?: string; linkedin?: string; }

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-700 border-b border-slate-200 pb-1.5 mb-3">
      {children}
    </h2>
  );
}

// README 마크다운 붙여넣기 대비 — 태그 제거 후 첫 문장만
function plainText(s: string, maxLen = 120): string {
  return s
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

export default function ResumePrintClient({
  bio, career, stack, impactStats, projects, contact,
}: {
  bio: Bio;
  career: Career[];
  stack: Stack[];
  impactStats: Impact[];
  projects: Project[];
  contact: Contact;
}) {
  const name = '허창훈';
  const role = bio.title_ko || '프론트엔드 개발자';
  const desc = bio.desc_ko || 'React · Next.js로 실서비스를 운영하며 성능 개선과 안정성 확보에 집중해온 개발자입니다.';

  const skillList: Stack[] = stack.length > 0 ? stack : [
    { name_ko: '프론트엔드', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
    { name_ko: '백엔드',     items: ['Go', 'Node.js', 'Supabase', 'PostgreSQL', 'Redis'] },
    { name_ko: '인프라·기타', items: ['Firebase', 'Vercel', 'Docker', 'Git', 'k6'] },
  ];

  // 프로젝트별 임팩트 매핑
  const impactByProject = impactStats.reduce<Record<string, Impact[]>>((acc, s) => {
    if (s.project) acc[s.project] = [...(acc[s.project] ?? []), s];
    return acc;
  }, {});

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          *, *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body, html { background: #fff !important; }
          @page { size: A4; margin: 0; }
          .resume-root {
            padding: 14mm 20mm !important;
            max-width: none !important;
            margin: 0 !important;
          }
          .avoid-break { break-inside: avoid; page-break-inside: avoid; }
          /* 잉크 최소화 — 배경색 제거 */
          .print-no-bg { background: transparent !important; border-color: #ddd !important; }
        }
      `}</style>

      {/* ── 툴바 ── */}
      <div className="no-print sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-4">
        <span className="text-sm text-slate-400 font-mono hidden sm:block">이력서 미리보기</span>
        <button
          onClick={() => window.print()}
          className="btn btn-primary btn-sm rounded-full gap-2 ml-auto shrink-0"
        >
          <Printer className="w-4 h-4" /> PDF로 저장
        </button>
      </div>

      {/* ── 이력서 본문 ── */}
      <div className="resume-root max-w-[780px] mx-auto px-10 py-10 space-y-7 text-slate-800">

        {/* ── 헤더 ── */}
        <header className="avoid-break flex items-start justify-between gap-6 pb-5 border-b-2 border-slate-900">
          <div>
            <h1 className="text-[38px] font-black tracking-tight leading-none text-slate-900">{name}</h1>
            <p className="text-[15px] font-semibold text-blue-700 mt-2">{role}</p>
          </div>
          <div className="text-right text-[12px] text-slate-500 font-mono space-y-1 shrink-0 pt-1">
            {contact.email    && <p>{contact.email}</p>}
            {contact.github   && <a href={contact.github}   className="block hover:text-blue-700 transition-colors">{contact.github.replace('https://', '')}</a>}
            {contact.linkedin && <a href={contact.linkedin} className="block hover:text-blue-700 transition-colors">{contact.linkedin.replace('https://', '')}</a>}
            <a href="https://huni2-popol.vercel.app" className="block hover:text-blue-700 transition-colors">huni2-popol.vercel.app</a>
          </div>
        </header>

        {/* ── 소개 ── */}
        <section className="avoid-break">
          <SectionTitle>About</SectionTitle>
          <p className="text-[13px] leading-relaxed text-slate-600">{desc}</p>
        </section>

        {/* ── 경력 ── */}
        {career.length > 0 && (
          <section className="avoid-break">
            <SectionTitle>Experience</SectionTitle>
            <div className="space-y-4">
              {career.map((c, i) => (
                <div key={i} className="avoid-break grid gap-x-4" style={{ gridTemplateColumns: '110px 1fr' }}>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5 leading-snug">{c.year}</p>
                  <div>
                    <p className="text-[13px] font-bold text-slate-900">{c.title_ko}</p>
                    <p className="text-[11px] font-semibold text-blue-700">{c.company}</p>
                    {c.desc_ko && (
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{c.desc_ko}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 기술 스택 ── */}
        <section className="avoid-break">
          <SectionTitle>Skills</SectionTitle>
          <div className="space-y-2">
            {skillList.map((s, i) => (
              <div key={i} className="grid items-start gap-x-4" style={{ gridTemplateColumns: '110px 1fr' }}>
                <span className="text-[11px] font-bold text-slate-500 pt-0.5">{s.name_ko}</span>
                <div className="flex flex-wrap gap-1.5">
                  {s.items.map(item => (
                    <span key={item} className="print-no-bg text-[11px] font-mono text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 프로젝트 ── */}
        {projects.length > 0 && (
          <section>
            <SectionTitle>Projects</SectionTitle>
            <div className="space-y-4">
              {projects.map(p => {
                const impacts = (impactByProject[p.title] ?? [])
                  .filter(s => /[0-9%×↑→~]/.test(s.metric))
                  .slice(0, 2);
                return (
                  <div key={p.id} className="avoid-break">
                    {/* 프로젝트 헤더 */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-bold text-slate-900">{p.title}</span>
                      {p.status === 'live' && (
                        <span className="text-[9px] font-bold text-emerald-600 border border-emerald-300 px-1.5 py-0.5 rounded uppercase tracking-wide">live</span>
                      )}
                      {p.type && (
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wide">{p.type}</span>
                      )}
                      {p.project_url && (
                        <a href={p.project_url} className="text-[10px] font-mono text-blue-600 hover:underline">
                          {p.project_url.replace(/^https?:\/\//, '')}
                        </a>
                      )}
                      {p.github_url && (
                        <a href={p.github_url} className="text-[10px] font-mono text-slate-400 hover:underline">
                          {p.github_url.replace('https://github.com/', 'github/')}
                        </a>
                      )}
                    </div>

                    {/* 프로젝트별 임팩트 */}
                    {impacts.length > 0 && (
                      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-1.5">
                        {impacts.map(s => (
                          <div key={s.id} className="flex items-baseline gap-1.5">
                            <span className="text-[14px] font-black font-mono text-blue-700 leading-none">{s.metric}</span>
                            <span className="text-[11px] text-slate-600">{s.title}</span>
                            {s.before && s.after && (
                              <span className="text-[10px] font-mono text-slate-400">
                                <span className="line-through">{s.before}</span>
                                {' → '}
                                <span className="text-emerald-600 font-semibold">{s.after}</span>
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 기술 태그 */}
                    {p.tags && p.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {p.tags.slice(0, 5).map(tag => (
                          <span key={tag} className="print-no-bg text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{tag}</span>
                        ))}
                      </div>
                    )}

                    {/* 설명 (마크다운 제거 후 1줄) */}
                    {p.description && (
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {plainText(p.description)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </>
  );
}
