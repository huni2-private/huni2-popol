'use client';

// 포트폴리오 — 컴팩트 카드 + 클릭 시 상세 페이지로 이동
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight, Zap, BookOpen, Search, X } from 'lucide-react';
import { Github } from '@/components/icons/SocialIcons';
import { useState, useMemo } from 'react';
import ProjectThumbnail from '@/components/portfolio/ProjectThumbnail';
import { projectStatusMeta } from '@/lib/projectStatus';
import { useI18n } from '@/lib/i18n';

interface Project {
  id: string;
  title: string;
  project_key?: string;
  type: 'personal' | 'company';
  status: 'live' | 'wip' | 'archived';
  description: string;
  resume_summary?: string;
  role_summary?: string;
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
  const router = useRouter();
  const { lang, t } = useI18n();
  const [view, setView] = useState<'projects' | 'impact'>('projects');
  const [filter, setFilter] = useState<'all' | 'personal' | 'company'>('all');
  const [search, setSearch] = useState('');

  const filteredProjects = useMemo(() => {
    const searchLower = search.toLowerCase();
    return initialProjects.filter(p => {
      const matchesFilter = filter === 'all' || p.type === filter;
      const matchesSearch =
        !searchLower ||
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchLower));
      return matchesFilter && matchesSearch;
    });
  }, [initialProjects, filter, search]);

  const impactByProject = useMemo(() => {
    const groups: Record<string, ImpactStat[]> = {};
    const ungrouped: ImpactStat[] = [];
    impactStats.forEach(s => {
      if (s.project) groups[s.project] = [...(groups[s.project] ?? []), s];
      else ungrouped.push(s);
    });
    return { groups, ungrouped };
  }, [impactStats]);

  // logs.project는 짧은 코드네임이라 대소문자가 섞여 있어(Timeslot/TimeSlot) 소문자로 정규화해서 매칭
  const logCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    logs.forEach(l => { if (l.project) counts[l.project.toLowerCase()] = (counts[l.project.toLowerCase()] ?? 0) + 1; });
    return counts;
  }, [logs]);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold italic">{t.portfolio.page_title}</h1>
        <p className="text-base-content/70">{t.portfolio.page_desc}</p>
      </div>

      {/* 최상위 탭 */}
      <div className="flex justify-center gap-2">
        {(['projects', 'impact'] as const).map((v) => (
          <button key={v} onClick={() => setView(v)}
            className={`btn btn-sm rounded-full px-6 transition-all ${view === v ? 'btn-primary' : 'btn-ghost bg-base-200'}`}>
            {v === 'projects' ? t.portfolio.tab_projects : t.portfolio.tab_impact}
          </button>
        ))}
      </div>

      {/* ── Projects 탭 ── */}
      {view === 'projects' && (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative group w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder={t.portfolio.search_placeholder}
                className="input input-bordered pl-12 bg-base-200 rounded-2xl w-full h-12 focus:ring-2 focus:ring-primary/20 border-base-content/10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-base-300 rounded-full transition-colors"
                >
                  <X className="w-3 h-3 opacity-50" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              {(['all', 'personal', 'company'] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`btn btn-sm rounded-full px-6 transition-all ${filter === f ? 'btn-primary' : 'btn-ghost bg-base-200'}`}>
                  {f === 'all' ? t.portfolio.filter_all : f === 'personal' ? t.portfolio.filter_personal : t.portfolio.filter_company}
                </button>
              ))}
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-32 space-y-4 bg-base-200/50 rounded-3xl border border-dashed border-base-content/10">
              <div className="bg-base-300 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 opacity-20" />
              </div>
              <p className="text-lg font-bold opacity-40">{t.portfolio.no_results}</p>
              {(search || filter !== 'all') && (
                <button
                  onClick={() => { setSearch(''); setFilter('all'); }}
                  className="btn btn-outline btn-sm rounded-xl px-6"
                >
                  {t.portfolio.clear_filters}
                </button>
              )}
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => {
              const matchKey = (project.project_key || project.title).toLowerCase();
              const stat = impactStats.find(s => s.project?.toLowerCase() === matchKey);
              const meta = projectStatusMeta(project.status, lang);
              const typeLabel = project.type === 'company' ? t.portfolio.filter_company : t.portfolio.filter_personal;
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  onClick={() => router.push(`/portfolio/${encodeURIComponent(project.project_key || project.id)}`)}
                  className="relative card bg-base-200 border border-base-content/5 hover:border-primary/30 overflow-hidden group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
                >
                  {/* 이미지 */}
                  <figure className="relative h-44 overflow-hidden bg-base-300">
                    {project.image_url ? (
                      <>
                        <div className="absolute inset-0 z-0" aria-hidden="true">
                          <Image src={project.image_url} alt="" fill
                            className="object-cover blur-xl scale-110 opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                            sizes="33vw" />
                        </div>
                        <div className="absolute inset-0 z-10">
                          <Image src={project.image_url} alt={project.title} fill
                            className="object-contain p-2"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                        </div>
                      </>
                    ) : (
                      <ProjectThumbnail title={project.title} type={project.type} />
                    )}
                  </figure>

                  <div className="card-body p-5 gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className={meta.badgeClass}>{meta.label}</span>
                      <span className="ml-auto text-[10px] text-base-content/30">
                        {typeLabel}
                      </span>
                    </div>

                    <h2 className="font-bold text-base leading-snug">
                      <Link
                        href={`/portfolio/${encodeURIComponent(project.project_key || project.id)}`}
                        className="rounded-sm group-hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                        onClick={e => e.stopPropagation()}
                      >
                        {project.title}
                      </Link>
                    </h2>

                    {/* 서비스 요약 */}
                    {project.resume_summary && (
                      <p className="text-xs text-base-content/60 leading-relaxed line-clamp-2">
                        {project.resume_summary}
                      </p>
                    )}

                    {/* 담당 역할 (있을 때만) */}
                    {project.role_summary && (
                      <p className="text-[11px] text-base-content/40 leading-relaxed line-clamp-1">
                        {project.role_summary}
                      </p>
                    )}

                    {/* 임팩트 수치 (있을 때만) */}
                    {stat && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black font-mono text-primary">{stat.metric}</span>
                        <span className="text-xs text-base-content/50 truncate">{stat.title}</span>
                      </div>
                    )}

                    {/* 태그 */}
                    <div className="flex flex-wrap gap-1.5">
                      {[...new Set(project.tags)].slice(0, 4).map(tag => (
                        <span key={tag} className="font-mono text-[9px] px-1.5 py-0.5 rounded border border-base-content/10 text-base-content/40">
                          {tag}
                        </span>
                      ))}
                      {[...new Set(project.tags)].length > 4 && (
                        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border border-base-content/10 text-base-content/40">
                          +{[...new Set(project.tags)].length - 4}
                        </span>
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
                      {logCounts[matchKey] > 0 && (
                        <span className="ml-auto flex items-center gap-1 text-[10px] text-base-content/30">
                          <BookOpen className="w-3 h-3" /> {logCounts[matchKey]}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          )}
        </div>
      )}

      {/* ── Impact 탭 ── */}
      {view === 'impact' && (
        <div className="space-y-10">
          <p className="text-center text-base-content/50 text-sm font-mono">{t.portfolio.tagline}</p>
          {impactStats.length === 0 ? (
            <p className="text-base-content/40 italic py-8 text-center">{t.portfolio.no_impact}</p>
          ) : (
            <>
              {Object.entries(impactByProject.groups).map(([proj, stats], gi) => (
                <div key={proj} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black uppercase tracking-widest text-base-content/30 font-mono">{proj}</span>
                    <div className="flex-1 h-px bg-base-content/10" />
                    {logCounts[proj.toLowerCase()] > 0 && (
                      <Link href={`/log?project=${encodeURIComponent(proj)}`}
                        className="inline-flex items-center gap-1 text-[11px] text-base-content/30 hover:text-primary transition-colors">
                        <BookOpen className="w-3 h-3" /> {logCounts[proj.toLowerCase()]}개
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
                              <Zap className="w-3 h-3" /> {t.portfolio.dev_log_link} <ArrowRight className="w-3 h-3" />
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
    </div>
  );
}
