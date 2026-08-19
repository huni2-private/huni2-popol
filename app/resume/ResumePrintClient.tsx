'use client';

// 이력서 인쇄 전용 클라이언트 — window.print() 트리거 + @media print 레이아웃
import { Printer } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Bio          { title_ko?: string; desc_ko?: string; photo_url?: string; }
interface Career       { year: string; company: string; title_ko: string; desc_ko: string; }
interface Stack        { name_ko: string; items: string[]; }
interface Impact       { id: string; project?: string; metric: string; title: string; before?: string; after?: string; context?: string; }
interface Project      { id: string; title: string; description?: string; tags?: string[]; type?: string; status?: string; project_url?: string; github_url?: string; project_key?: string; }
interface Education    { year: string; institution: string; title: string; desc?: string; project_desc?: string; }
interface Contact      { email?: string; github?: string; linkedin?: string; }
interface CoverSection { id: string; title: string; content: string; }
interface CoverLetter  { company: string; position: string; sections: CoverSection[]; isGeneral?: boolean; }

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[10px] font-black uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-1.5 mb-3">
      {children}
    </h2>
  );
}

function ProjectDesc({ text, impacts }: { text: string; impacts: Impact[] }) {
  const clean = text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1');

  const firstSentence = (s: string) => {
    const m = s.trim().match(/^[\s\S]+?[.。!?]/);
    return m ? m[0].trim() : s.trim().slice(0, 120);
  };

  let desc = '';
  let bullets: string[] = [];

  if (/^##/m.test(clean)) {
    // ## 섹션 구조 — 첫 섹션은 서비스 설명, 나머지는 불릿
    const parts = clean.split(/^##[^\n]*/m).map(s => s.trim()).filter(Boolean);
    desc = firstSentence(parts[0] ?? '');
    bullets = parts.slice(1, 5).map(s => {
      const bulletLine = s.match(/^[-*+]\s+(.+)/m);
      return bulletLine ? bulletLine[1].trim() : firstSentence(s);
    }).filter(l => l.length > 5);
  } else {
    // 헤더 없음 — 명시적 불릿 또는 첫 줄
    bullets = clean
      .split('\n')
      .filter(l => /^[-*+]\s+/.test(l.trim()))
      .map(l => l.replace(/^[-*+]\s+/, '').trim())
      .filter(l => l.length > 5)
      .slice(0, 4);
    if (bullets.length === 0)
      desc = clean.split('\n').find(l => l.trim().length > 5)?.trim() ?? '';
  }

  if (!desc && impacts.length === 0 && bullets.length === 0) return null;

  return (
    <div className="mt-1">
      {desc && (
        <p className="text-[11px] text-slate-500 leading-relaxed mb-0.5">{desc}</p>
      )}
      {(impacts.length > 0 || bullets.length > 0) && (
        <ul className="space-y-0.5">
          {impacts.map(s => (
            <li key={s.id} className="text-[11px] leading-relaxed flex gap-1.5">
              <span className="text-blue-700/40 shrink-0 mt-0.5">·</span>
              <span>
                <span className="font-bold font-mono text-blue-700">{s.metric}</span>
                {s.title && <span className="text-slate-700"> {s.title}</span>}
                {s.before && s.after && (
                  <span className="text-slate-400 font-mono text-[10px]"> ({s.before} → {s.after})</span>
                )}
              </span>
            </li>
          ))}
          {bullets.map((line, i) => (
            <li key={i} className="text-[11px] text-slate-500 leading-relaxed flex gap-1.5">
              <span className="text-blue-700/40 shrink-0 mt-0.5">·</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ResumePrintClient({
  bio, career, stack, education, impactStats, projects, contact, isAdmin, coverLetter,
}: {
  bio: Bio;
  career: Career[];
  stack: Stack[];
  education: Education[];
  impactStats: Impact[];
  projects: Project[];
  contact: Contact;
  isAdmin: boolean;
  coverLetter: CoverLetter | null;
}) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      // 780px 컨텐츠 + 양쪽 px-10(40px*2) = 860px 기준, 32px 여백
      setScale(Math.min(1, (window.innerWidth - 32) / 860));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

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
          header, #ck-chatbot-root { display: none !important; }
          *, *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-family: "Malgun Gothic", "맑은 고딕", "Apple SD Gothic Neo", sans-serif !important;
          }
          body, html { background: #fff !important; }
          @page { size: A4; margin: 14mm 20mm; }
          .resume-root {
            width: 100% !important;
            padding: 0 !important;
            max-width: none !important;
            margin: 0 !important;
            box-sizing: border-box !important;
          }
          .resume-scale { zoom: 1 !important; transform: none !important; }
          .avoid-break { break-inside: avoid; page-break-inside: avoid; }
          /* 잉크 최소화 — 배경색 제거 */
          .print-no-bg { background: transparent !important; border-color: #ddd !important; }
        }
      `}</style>

      {/* ── 툴바 ── */}
      <div className="no-print sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-4">
        <span className="text-sm text-slate-400 font-mono hidden sm:block">이력서 미리보기</span>
        <div className="flex items-center gap-2 ml-auto">
          {isAdmin && <a href="/admin/cover" className="btn btn-ghost btn-sm rounded-full text-slate-400">자기소개서 관리</a>}
          <button
            onClick={() => window.print()}
            className="btn btn-primary btn-sm rounded-full gap-2 shrink-0"
          >
            <Printer className="w-4 h-4" /> PDF로 저장
          </button>
        </div>
      </div>

      {/* ── 이력서 본문 ── */}
      <div className="resume-scale overflow-x-hidden" style={{ zoom: scale }}>
      <div className="resume-root w-[780px] mx-auto px-10 py-10 space-y-7 text-slate-800">

        {/* ── 헤더 ── */}
        <header className="avoid-break flex items-start justify-between gap-6 pb-5 border-b-2 border-slate-900">
          <div className="flex items-center gap-5">
            {bio.photo_url && (
              <img
                src={bio.photo_url}
                alt=""
                className="w-28 h-28 rounded-lg object-cover object-top border border-slate-300 shrink-0"
              />
            )}
            <div>
              <h1 className="text-[38px] font-black tracking-tight leading-none text-slate-900">{name}</h1>
              <p className="text-[15px] font-semibold text-blue-700 mt-2">{role}</p>
            </div>
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
                    <p className="text-[13px] font-bold text-slate-900">{c.company}</p>
                    <p className="text-[11px] font-semibold text-blue-700">{c.title_ko}</p>
                    {c.desc_ko && (
                      <ul className="mt-1 space-y-0.5">
                        {c.desc_ko.split('\n').filter(Boolean).map((line, li) => (
                          <li key={li} className="text-[11px] text-slate-500 leading-relaxed flex gap-1.5">
                            <span className="text-blue-700/40 shrink-0 mt-0.5">·</span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 학력 ── */}
        {education.length > 0 && (
          <section className="avoid-break">
            <SectionTitle>Education</SectionTitle>
            <div className="space-y-3">
              {education.map((edu, i) => (
                <div key={i} className="grid gap-x-4" style={{ gridTemplateColumns: '110px 1fr' }}>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">{edu.year}</p>
                  <div>
                    <p className="text-[13px] font-bold text-slate-900">{edu.institution}</p>
                    <p className="text-[11px] text-blue-700">{edu.title}</p>
                    {edu.desc && <p className="text-[11px] text-slate-500 mt-0.5">{edu.desc}</p>}
                    {edu.project_desc && (
                      <ul className="mt-1 space-y-0.5">
                        {edu.project_desc.split('\n').filter(Boolean).map((line, li) => (
                          <li key={li} className="text-[11px] text-slate-500 leading-relaxed flex gap-1.5">
                            <span className="text-blue-700/40 shrink-0 mt-0.5">·</span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
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
                const impacts = (impactByProject[p.project_key ?? p.title] ?? [])
                  .filter(s => /[0-9%×↑→~]/.test(s.metric));
                return (
                  <div key={p.id} className="avoid-break">
                    {/* 프로젝트 헤더 */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-bold text-slate-900">{p.title}</span>
                      {p.status === 'live' && (
                        <span className="text-[9px] font-bold text-emerald-600 border border-emerald-300 px-1.5 py-0.5 rounded uppercase">live</span>
                      )}
                      {p.type && (
                        <span className="text-[9px] font-mono text-slate-400 uppercase">{p.type}</span>
                      )}
                      {p.project_url && (
                        <a href={p.project_url} className="text-[9px] font-mono text-blue-500 hover:underline">
                          ↗ {p.project_url.replace(/^https?:\/\//, '')}
                        </a>
                      )}
                      {p.github_url && (
                        <a href={p.github_url} className="text-[9px] font-mono text-slate-400 hover:underline">
                          ↗ {p.github_url.replace('https://github.com/', 'github/')}
                        </a>
                      )}
                    </div>

                    {/* 기술 태그 */}
                    {p.tags && p.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {p.tags.slice(0, 5).map(tag => (
                          <span key={tag} className="print-no-bg text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{tag}</span>
                        ))}
                      </div>
                    )}

                    {/* 임팩트 + 설명 — · 불릿 통합 */}
                    <ProjectDesc text={p.description ?? ''} impacts={impacts} />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── 자기소개서 (어드민 + enabled + 섹션 있을 때만 — 인쇄 시 새 페이지) ── */}
        {isAdmin && coverLetter && coverLetter.sections.length > 0 && (
          <div style={{ pageBreakBefore: 'always' }} className="pt-2 space-y-7">
            <header className="avoid-break flex items-end justify-between pb-5 border-b-2 border-slate-900">
              <div>
                <h1 className="text-[28px] font-black tracking-tight leading-none text-slate-900">자기소개서</h1>
                {(coverLetter.isGeneral || coverLetter.company || coverLetter.position) && (
                  <p className="text-[13px] font-semibold text-blue-700 mt-1.5">
                    {coverLetter.isGeneral ? '범용' : [coverLetter.company, coverLetter.position].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>
            </header>
            {coverLetter.sections.map((s, i) => (
              <div key={s.id} className="avoid-break">
                <h2 className="text-[10px] font-black uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-1.5 mb-3 flex items-center gap-2">
                  <span className="font-mono text-slate-300">{String(i + 1).padStart(2, '0')}</span>
                  {s.title}
                </h2>
                <p className="text-[13px] leading-[1.95] text-slate-600 whitespace-pre-wrap">{s.content}</p>
              </div>
            ))}
          </div>
        )}

      </div>
      </div>
    </>
  );
}
