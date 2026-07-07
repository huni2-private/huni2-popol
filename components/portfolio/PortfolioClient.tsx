'use client';

// 포트폴리오 — 컴팩트 카드 + 클릭 시 상세 모달
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, FileText, ArrowRight, Zap, BookOpen, X } from 'lucide-react';
import { Github } from '@/components/icons/SocialIcons';
import { useState, useMemo, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const THUMB_PALETTES = [
  { grad: 'from-sky-500/55 to-indigo-600/30',    blob1: 'bg-sky-400',     blob2: 'bg-indigo-500'  },
  { grad: 'from-violet-500/55 to-fuchsia-600/30', blob1: 'bg-violet-400',  blob2: 'bg-fuchsia-500' },
  { grad: 'from-emerald-500/55 to-teal-600/30',   blob1: 'bg-emerald-400', blob2: 'bg-teal-500'    },
  { grad: 'from-amber-500/55 to-orange-600/30',   blob1: 'bg-amber-400',   blob2: 'bg-orange-500'  },
  { grad: 'from-rose-500/55 to-pink-600/30',      blob1: 'bg-rose-400',    blob2: 'bg-pink-500'    },
  { grad: 'from-cyan-500/55 to-blue-600/30',      blob1: 'bg-cyan-400',    blob2: 'bg-blue-500'    },
] as const;

function hashTitle(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % THUMB_PALETTES.length;
}

function ProjectThumbnail({ title, type }: { title: string; type: 'personal' | 'company' }) {
  const p = THUMB_PALETTES[hashTitle(title)];
  const initials = title.replace(/[^A-Za-z가-힣]/g, '').slice(0, 2).toUpperCase() || title.slice(0, 2).toUpperCase();
  return (
    <div className="relative w-full h-full overflow-hidden bg-base-300">
      <div className={`absolute inset-0 bg-gradient-to-br ${p.grad}`} />
      <div className="absolute inset-0 opacity-[0.09]"
        style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
      <div className={`absolute -top-8 -right-8 w-44 h-44 rounded-full blur-3xl opacity-50 ${p.blob1}`} />
      <div className={`absolute -bottom-8 -left-8 w-32 h-32 rounded-full blur-3xl opacity-35 ${p.blob2}`} />
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[96px] font-black font-mono leading-none select-none opacity-[0.12] pointer-events-none">
        {initials}
      </span>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.25em] opacity-50 font-mono">{type}</p>
        <p className="text-sm font-black leading-tight truncate">{title}</p>
      </div>
    </div>
  );
}

interface Project {
  id: number;
  title: string;
  type: 'personal' | 'company';
  status: 'live' | 'wip' | 'archived';
  description: string;
  tags: string[];
  image_url: string;
  project_url?: string;
  github_url?: string;
  pdf_url?: string;
}

interface ImpactStat {
  id: string;
  project?: string;
  metric: string;
  title: string;
  before?: string;
  after?: string;
  context: string;
  log_slug?: string | null;
}

interface Log {
  title: string;
  slug: string;
  project?: string;
  created_at: string;
}

export default function PortfolioClient({
  initialProjects,
  impactStats,
  logs = [],
}: {
  initialProjects: Project[];
  impactStats: ImpactStat[];
  logs?: Log[];
}) {
  const [view, setView] = useState<'projects' | 'impact'>('projects');
  const [filter, setFilter] = useState<'all' | 'personal' | 'company'>('all');
  const [selected, setSelected] = useState<Project | null>(null);

  const filteredProjects = initialProjects.filter(p => filter === 'all' || p.type === filter);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  const impactByProject = useMemo(() => {
    const groups: Record<string, ImpactStat[]> = {};
    const ungrouped: ImpactStat[] = [];
    impactStats.forEach(s => {
      if (s.project) groups[s.project] = [...(groups[s.project] ?? []), s];
      else ungrouped.push(s);
    });
    return { groups, ungrouped };
  }, [impactStats]);

  const logCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    logs.forEach(l => { if (l.project) counts[l.project] = (counts[l.project] ?? 0) + 1; });
    return counts;
  }, [logs]);

  return (
    <div className="space-y-8">
      {/* 최상위 탭 */}
      <div className="flex justify-center gap-2">
        {(['projects', 'impact'] as const).map((v) => (
          <button key={v} onClick={() => setView(v)}
            className={`btn btn-sm rounded-full px-6 transition-all ${view === v ? 'btn-primary' : 'btn-ghost bg-base-200'}`}>
            {v === 'projects' ? 'Projects' : 'Impact'}
          </button>
        ))}
      </div>

      {/* ── Projects 탭 ── */}
      {view === 'projects' && (
        <div className="space-y-8">
          <div className="flex justify-center gap-2">
            {(['all', 'personal', 'company'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`btn btn-sm rounded-full px-6 transition-all ${filter === f ? 'btn-primary' : 'btn-ghost bg-base-200'}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => {
              const stat = impactStats.find(s => s.project === project.title);
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  onClick={() => setSelected(project)}
                  className="card bg-base-200 border border-base-content/5 hover:border-primary/30 overflow-hidden group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
                >
                  {/* 이미지 */}
                  <figure className="relative h-40 overflow-hidden bg-base-300">
                    {project.image_url ? (
                      <Image src={project.image_url} alt={project.title} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    ) : (
                      <ProjectThumbnail title={project.title} type={project.type} />
                    )}
                    {project.status === 'live' && (
                      <span className="absolute top-2 right-2 text-[9px] font-bold text-success bg-success/10 border border-success/30 px-1.5 py-0.5 rounded-full">LIVE</span>
                    )}
                  </figure>

                  <div className="card-body p-5 gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                        project.type === 'personal' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                      }`}>{project.type}</span>
                    </div>

                    <h2 className="font-bold text-base leading-snug group-hover:text-primary transition-colors">{project.title}</h2>

                    {/* 임팩트 수치 (있을 때만) */}
                    {stat && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black font-mono text-primary">{stat.metric}</span>
                        <span className="text-xs text-base-content/50 truncate">{stat.title}</span>
                      </div>
                    )}

                    {/* 태그 */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags?.slice(0, 4).map(tag => (
                        <span key={tag} className="badge badge-ghost text-[10px] py-2.5">{tag}</span>
                      ))}
                      {(project.tags?.length ?? 0) > 4 && (
                        <span className="badge badge-ghost text-[10px] py-2.5">+{project.tags.length - 4}</span>
                      )}
                    </div>

                    {/* 링크 + 로그 카운트 */}
                    <div className="flex items-center gap-1 pt-2 border-t border-base-content/5" onClick={e => e.stopPropagation()}>
                      {project.project_url && (
                        <a href={project.project_url} target="_blank" rel="noopener noreferrer"
                          className="btn btn-xs btn-ghost gap-1 rounded-full">
                          <ExternalLink className="w-3 h-3" /> Live
                        </a>
                      )}
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                          className="btn btn-xs btn-ghost gap-1 rounded-full">
                          <Github className="w-3 h-3" /> GitHub
                        </a>
                      )}
                      {logCounts[project.title] > 0 && (
                        <span className="ml-auto flex items-center gap-1 text-[10px] text-base-content/30">
                          <BookOpen className="w-3 h-3" /> {logCounts[project.title]}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Impact 탭 ── */}
      {view === 'impact' && (
        <div className="space-y-10">
          <p className="text-center text-base-content/50 text-sm font-mono">완벽보다는 완성, 완성 후에는 개선을.</p>
          {impactStats.length === 0 ? (
            <p className="text-base-content/40 italic py-8 text-center">등록된 수치가 없습니다.</p>
          ) : (
            <>
              {Object.entries(impactByProject.groups).map(([proj, stats], gi) => (
                <div key={proj} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black uppercase tracking-widest text-base-content/30 font-mono">{proj}</span>
                    <div className="flex-1 h-px bg-base-content/10" />
                    {logCounts[proj] > 0 && (
                      <Link href={`/log?project=${encodeURIComponent(proj)}`}
                        className="inline-flex items-center gap-1 text-[11px] text-base-content/30 hover:text-primary transition-colors">
                        <BookOpen className="w-3 h-3" /> {logCounts[proj]}개
                      </Link>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {stats.map((stat, i) => (
                      <motion.div key={stat.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: gi * 0.05 + i * 0.05 }}
                        className="card bg-base-200 border border-base-content/5 hover:border-primary/20 transition-colors">
                        <div className="card-body p-6 gap-2">
                          <p className="text-5xl font-black font-mono text-primary leading-none">{stat.metric}</p>
                          <p className="font-bold text-sm">{stat.title}</p>
                          {(stat.before || stat.after) && (
                            <div className="flex items-center gap-1.5 text-xs font-mono">
                              {stat.before && <span className="text-base-content/40 line-through">{stat.before}</span>}
                              {stat.before && stat.after && <ArrowRight className="w-3 h-3 text-base-content/30 shrink-0" />}
                              {stat.after && <span className="text-success font-bold">{stat.after}</span>}
                            </div>
                          )}
                          {stat.context && <p className="text-xs text-base-content/40 font-mono leading-relaxed">{stat.context}</p>}
                          {stat.log_slug && (
                            <Link href={`/log/${stat.log_slug}`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mt-1 w-fit">
                              <Zap className="w-3 h-3" /> 개발 로그 <ArrowRight className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
              {impactByProject.ungrouped.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {impactByProject.ungrouped.map((stat, i) => (
                    <motion.div key={stat.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="card bg-base-200 border border-base-content/5">
                      <div className="card-body p-6 gap-2">
                        <p className="text-5xl font-black font-mono text-primary leading-none">{stat.metric}</p>
                        <p className="font-bold text-sm">{stat.title}</p>
                        {stat.context && <p className="text-xs text-base-content/40 font-mono">{stat.context}</p>}
                        {stat.log_slug && (
                          <Link href={`/log/${stat.log_slug}`} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mt-1 w-fit">
                            <Zap className="w-3 h-3" /> 개발 로그 <ArrowRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── 프로젝트 상세 모달 ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <div className="absolute inset-0 bg-base-300/70 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
              className="relative bg-base-100 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-base-content/5"
            >
              {/* 모달 이미지 헤더 */}
              {selected.image_url && (
                <div className="relative h-48 overflow-hidden rounded-t-3xl">
                  <Image src={selected.image_url} alt={selected.title} fill className="object-cover" sizes="672px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-base-100 to-transparent" />
                </div>
              )}

              <div className="p-8 space-y-6">
                {/* 헤더 */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                        selected.type === 'personal' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                      }`}>{selected.type}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                        selected.status === 'live' ? 'bg-success/10 text-success' :
                        selected.status === 'wip' ? 'bg-warning/10 text-warning' : 'bg-base-content/10 text-base-content/40'
                      }`}>{selected.status}</span>
                    </div>
                    <h2 className="text-2xl font-black leading-tight">{selected.title}</h2>
                  </div>
                  <button onClick={() => setSelected(null)} className="btn btn-ghost btn-circle btn-sm shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 설명 — 마크다운 렌더링 */}
                {selected.description && (
                  <div className="prose prose-sm max-w-none text-base-content/70
                    prose-headings:text-base-content prose-headings:font-bold
                    prose-code:bg-base-200 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-primary prose-code:text-xs prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-base-200 prose-pre:rounded-xl
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-base-content
                    prose-li:marker:text-primary">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {selected.description}
                    </ReactMarkdown>
                  </div>
                )}

                {/* 임팩트 수치 */}
                {impactStats.filter(s => s.project === selected.title).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-base-content/30">Impact</p>
                    <div className="grid grid-cols-2 gap-3">
                      {impactStats.filter(s => s.project === selected.title).map(stat => (
                        <div key={stat.id} className="bg-base-200 rounded-2xl p-4 space-y-1">
                          <p className="text-3xl font-black font-mono text-primary leading-none">{stat.metric}</p>
                          <p className="text-xs font-bold">{stat.title}</p>
                          {stat.context && <p className="text-[11px] text-base-content/40 font-mono">{stat.context}</p>}
                          {stat.log_slug && (
                            <Link href={`/log/${stat.log_slug}`} onClick={() => setSelected(null)}
                              className="inline-flex items-center gap-1 text-[11px] text-primary font-bold hover:underline">
                              로그 보기 <ArrowRight className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 기술 스택 */}
                {selected.tags?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-base-content/30">Tech Stack</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.tags.map(tag => (
                        <span key={tag} className="badge badge-ghost py-3 text-xs">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 관련 Dev 로그 */}
                {logs.filter(l => l.project === selected.title).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-base-content/30">Dev Log</p>
                    <div className="space-y-1">
                      {logs.filter(l => l.project === selected.title).map(log => (
                        <Link key={log.slug} href={`/log/${log.slug}`} onClick={() => setSelected(null)}
                          className="flex items-center justify-between gap-2 p-3 rounded-xl bg-base-200 hover:bg-base-300 transition-colors group/log">
                          <div className="flex items-center gap-2 min-w-0">
                            <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="text-sm font-medium truncate group-hover/log:text-primary transition-colors">{log.title}</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-base-content/30 shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 링크 버튼 */}
                {(selected.project_url || selected.github_url || selected.pdf_url) && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-base-content/5">
                    {selected.project_url && (
                      <a href={selected.project_url} target="_blank" rel="noopener noreferrer"
                        className="btn btn-primary btn-sm rounded-full gap-2">
                        <ExternalLink className="w-3.5 h-3.5" /> Live 보기
                      </a>
                    )}
                    {selected.github_url && (
                      <a href={selected.github_url} target="_blank" rel="noopener noreferrer"
                        className="btn btn-outline btn-sm rounded-full gap-2">
                        <Github className="w-3.5 h-3.5" /> GitHub
                      </a>
                    )}
                    {selected.pdf_url && (
                      <a href={selected.pdf_url} target="_blank" rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm rounded-full gap-2">
                        <FileText className="w-3.5 h-3.5" /> PDF
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
