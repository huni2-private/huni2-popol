'use client';

// 이력서 인쇄 전용 클라이언트 — window.print() 트리거 + @media print 레이아웃
import { Printer, ExternalLink } from 'lucide-react';

interface Bio      { title_ko?: string; title_en?: string; desc_ko?: string; desc_en?: string; }
interface Career   { year: string; company: string; title_ko: string; desc_ko: string; }
interface Stack    { name_ko: string; items: string[]; }
interface Impact   { id: string; metric: string; title: string; context: string; }
interface Project  { id: string; title: string; description?: string; tags?: string[]; type?: string; status?: string; }
interface Contact  { email?: string; github?: string; linkedin?: string; }

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
  const name    = '허창훈';
  const title   = '프론트엔드 개발자';
  const desc    = bio.desc_ko || 'SK-hynix MAPS에서 23만 건 데이터 로딩을 5s → 1s로 단축했습니다. React · Next.js로 실서비스를 만들고, 채팅 위젯까지 직접 구현한 실행력 있는 프론트엔드 개발자입니다.';

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }

          /* DaisyUI CSS 변수를 인쇄용 흰색 테마로 덮어씀 */
          *, *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          :root, html, [data-theme] {
            --color-base-100: #ffffff !important;
            --color-base-200: #f8fafc !important;
            --color-base-300: #f1f5f9 !important;
            --color-base-content: #0f172a !important;
            --color-primary: #2563eb !important;
            --b1: #ffffff !important;
            --b2: #f8fafc !important;
            --b3: #f1f5f9 !important;
            --bc: #0f172a !important;
            --p: #2563eb !important;
          }
          body, html {
            background: #ffffff !important;
            color: #0f172a !important;
          }
          .resume-page {
            padding: 0 !important;
            max-width: none !important;
            margin: 0 !important;
          }
          .resume-card {
            border: 1px solid #e2e8f0 !important;
            background: #f8fafc !important;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .resume-section {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          @page {
            size: A4;
            margin: 12mm 20mm;
          }
        }
      `}</style>

      {/* 인쇄 버튼 */}
      <div className="no-print sticky top-0 z-50 bg-base-100/90 backdrop-blur border-b border-base-content/5 px-6 py-3 flex items-center justify-between gap-4">
        <p className="text-sm text-base-content/50 font-mono hidden sm:block">이력서 미리보기</p>
        <div className="flex items-center gap-3 ml-auto">
          <p className="text-xs text-base-content/40 font-mono text-right leading-tight">
            PDF 저장 전 인쇄 설정에서<br />
            <span className="text-warning font-bold">머리글 및 바닥글 해제</span> 권장
          </p>
          <button
            onClick={() => window.print()}
            className="btn btn-primary btn-sm rounded-full gap-2 shrink-0"
          >
            <Printer className="w-4 h-4" /> PDF로 저장
          </button>
        </div>
      </div>

      <div className="resume-page max-w-[800px] mx-auto px-8 py-10 space-y-8">

        {/* ── 헤더 ── */}
        <header className="resume-section border-b border-base-content/10 pb-6">
          <h1 className="text-4xl font-black tracking-tight">{name}</h1>
          <p className="text-lg font-semibold text-primary mt-1">{title} · 1년차</p>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-base-content/60 font-mono">
            {contact.email  && <span>{contact.email}</span>}
            {contact.github && (
              <a href={contact.github} className="flex items-center gap-1 hover:text-primary transition-colors">
                GitHub <ExternalLink className="w-3 h-3 no-print" />
              </a>
            )}
            {contact.linkedin && (
              <a href={contact.linkedin} className="flex items-center gap-1 hover:text-primary transition-colors">
                LinkedIn <ExternalLink className="w-3 h-3 no-print" />
              </a>
            )}
            <a href="https://huni2-popol.vercel.app" className="flex items-center gap-1 hover:text-primary transition-colors">
              Portfolio <ExternalLink className="w-3 h-3 no-print" />
            </a>
          </div>
        </header>

        {/* ── 소개 ── */}
        <section className="resume-section space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary/70">About</h2>
          <p className="text-sm leading-relaxed text-base-content/80">{desc}</p>
        </section>

        {/* ── Impact ── */}
        {impactStats.length > 0 && (
          <section className="resume-section space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary/70">Impact</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {impactStats.map(stat => (
                <div key={stat.id} className="resume-card rounded-xl border border-base-content/10 bg-base-200 p-4">
                  <p className="text-2xl font-black font-mono text-primary leading-none">{stat.metric}</p>
                  <p className="text-xs font-bold mt-1">{stat.title}</p>
                  {stat.context && (
                    <p className="text-[10px] text-base-content/50 font-mono mt-0.5">{stat.context}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 커리어 ── */}
        {career.length > 0 && (
          <section className="resume-section space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary/70">Experience</h2>
            <div className="space-y-4">
              {career.map((c, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-28 shrink-0">
                    <p className="text-xs font-mono text-base-content/50 mt-0.5">{c.year}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{c.title_ko}</p>
                    <p className="text-xs text-primary font-semibold">{c.company}</p>
                    {c.desc_ko && (
                      <p className="text-xs text-base-content/60 mt-1 leading-relaxed">{c.desc_ko}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 프로젝트 ── */}
        {projects.length > 0 && (
          <section className="resume-section space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary/70">Projects</h2>
            <div className="space-y-4">
              {projects.map(p => (
                <div key={p.id} className="resume-card rounded-xl border border-base-content/10 bg-base-200 p-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-sm">{p.title}</p>
                    {p.status && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-success/10 text-success border border-success/20">
                        {p.status}
                      </span>
                    )}
                    {p.type && (
                      <span className="text-[10px] font-mono text-base-content/40">{p.type}</span>
                    )}
                  </div>
                  {p.description && (
                    <p className="text-xs text-base-content/60 mt-1 leading-relaxed">{p.description}</p>
                  )}
                  {p.tags && p.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-base-content/5 border border-base-content/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 기술 스택 ── */}
        {stack.length > 0 && (
          <section className="resume-section space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary/70">Skills</h2>
            <div className="space-y-2">
              {stack.map((s, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="w-24 shrink-0 text-xs font-bold text-base-content/50 pt-0.5">{s.name_ko}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {s.items.map(item => (
                      <span key={item} className="text-xs font-mono px-2 py-0.5 rounded bg-base-content/5 border border-base-content/10">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </>
  );
}
