'use client';

// 포트폴리오 프로젝트 목록 — 필터링, 카드 렌더링, 링크 노출 담당
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExternalLink, FileText, Tag, ArrowRight, Zap, BookOpen } from 'lucide-react';
import { Github } from '@/components/icons/SocialIcons';
import { useState, useMemo } from 'react';

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

export default function PortfolioClient({
  initialProjects,
  impactStats,
  logCounts = {},
}: {
  initialProjects: Project[];
  impactStats: ImpactStat[];
  logCounts?: Record<string, number>;
}) {
  const [view, setView] = useState<'projects' | 'impact'>('projects');
  const [filter, setFilter] = useState<'all' | 'personal' | 'company'>('all');

  const filteredProjects = initialProjects.filter(p => filter === 'all' || p.type === filter);

  // Impact tab: 프로젝트별 그룹핑
  const impactByProject = useMemo(() => {
    const groups: Record<string, ImpactStat[]> = {};
    const ungrouped: ImpactStat[] = [];
    impactStats.forEach(s => {
      if (s.project) {
        groups[s.project] = [...(groups[s.project] ?? []), s];
      } else {
        ungrouped.push(s);
      }
    });
    return { groups, ungrouped };
  }, [impactStats]);

  return (
    <div className="space-y-8">
      {/* ── 최상위 탭: Projects | Impact ── */}
      <div className="flex justify-center gap-2">
        {(['projects', 'impact'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`btn btn-sm rounded-full px-6 transition-all ${
              view === v ? 'btn-primary' : 'btn-ghost bg-base-200'
            }`}
          >
            {v === 'projects' ? 'Projects' : 'Impact'}
          </button>
        ))}
      </div>

      {/* ── Projects 탭 ── */}
      {view === 'projects' && (
        <div className="space-y-8">
          <div className="flex justify-center gap-2">
            {(['all', 'personal', 'company'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`btn btn-sm rounded-full px-6 transition-all ${
                  filter === f ? 'btn-primary' : 'btn-ghost bg-base-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="card bg-base-200 border border-base-content/5 overflow-hidden group"
              >
                <figure className="relative h-48 overflow-hidden bg-base-300">
                  {project.image_url ? (
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${
                      project.type === 'company'
                        ? 'bg-gradient-to-br from-secondary/20 to-secondary/5'
                        : 'bg-gradient-to-br from-primary/20 to-primary/5'
                    }`}>
                      <span className="text-5xl font-black font-mono opacity-30 select-none">
                        {project.title.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </figure>

                <div className="card-body p-6">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                      project.type === 'personal' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                    }`}>
                      {project.type}
                    </span>
                    {project.status && project.status !== 'live' && (
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                        project.status === 'wip' ? 'bg-warning/10 text-warning' : 'bg-base-content/10 text-base-content/40'
                      }`}>
                        {project.status}
                      </span>
                    )}
                  </div>

                  <h2 className="card-title text-lg">{project.title}</h2>
                  <p className="text-sm text-base-content/70">{project.description}</p>

                  {/* 태그 — 클릭 시 해당 태그로 Log 필터링 */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags?.map(tag => (
                      <Link
                        key={tag}
                        href={`/log?tag=${encodeURIComponent(tag)}`}
                        className="badge badge-ghost text-[10px] py-3 gap-1 hover:badge-primary transition-colors"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </Link>
                    ))}
                  </div>

                  {/* Impact + 로그 카운트 */}
                  {(() => {
                    const stats = impactStats.filter(s => s.project === project.title).slice(0, 2);
                    const logCount = logCounts[project.title] ?? 0;
                    if (stats.length === 0 && logCount === 0) return null;
                    return (
                      <div className="mt-4 pt-4 border-t border-base-content/5 space-y-2">
                        {stats.length > 0 && (
                          <div className="space-y-1.5">
                            {stats.map(s => (
                              <div key={s.id} className="flex items-baseline gap-2 min-w-0">
                                <span className="text-xs font-black font-mono text-primary shrink-0">{s.metric}</span>
                                <span className="text-[11px] text-base-content/50 truncate">{s.title}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {logCount > 0 && (
                          <Link
                            href={`/log?project=${encodeURIComponent(project.title)}`}
                            className="inline-flex items-center gap-1 text-[11px] text-base-content/40 hover:text-primary transition-colors"
                          >
                            <BookOpen className="w-3 h-3" />
                            개발 로그 {logCount}개
                            <ArrowRight className="w-2.5 h-2.5" />
                          </Link>
                        )}
                      </div>
                    );
                  })()}

                  {/* 링크 버튼 — 모바일 포함 항상 노출 */}
                  {(project.project_url || project.github_url || project.pdf_url) && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-base-content/5">
                      {project.project_url && (
                        <a
                          href={project.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-primary rounded-full gap-1 flex-1"
                        >
                          <ExternalLink className="w-3 h-3" /> Live
                        </a>
                      )}
                      {project.type === 'personal' && project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-ghost rounded-full gap-1 flex-1"
                        >
                          <Github className="w-3 h-3" /> GitHub
                        </a>
                      )}
                      {project.pdf_url && (
                        <a
                          href={project.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-ghost rounded-full gap-1"
                        >
                          <FileText className="w-3 h-3" /> PDF
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── Impact 탭 ── */}
      {view === 'impact' && (
        <div className="space-y-10">
          <p className="text-center text-base-content/50 text-sm font-mono">
            완벽보다는 완성, 완성 후에는 개선을.
          </p>
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
                      <Link
                        href={`/log?project=${encodeURIComponent(proj)}`}
                        className="inline-flex items-center gap-1 text-[11px] text-base-content/30 hover:text-primary transition-colors"
                      >
                        <BookOpen className="w-3 h-3" />
                        {logCounts[proj]}개
                      </Link>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {stats.map((stat, i) => (
                      <motion.div
                        key={stat.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: gi * 0.05 + i * 0.05 }}
                        className="card bg-base-200 border border-base-content/5 hover:border-primary/20 transition-colors"
                      >
                        <div className="card-body p-6 gap-2">
                          <p className="text-5xl font-black font-mono text-primary leading-none">
                            {stat.metric}
                          </p>
                          <p className="font-bold text-sm">{stat.title}</p>
                          {(stat.before || stat.after) && (
                            <div className="flex items-center gap-1.5 text-xs font-mono">
                              {stat.before && <span className="text-base-content/40 line-through">{stat.before}</span>}
                              {stat.before && stat.after && <ArrowRight className="w-3 h-3 text-base-content/30 shrink-0" />}
                              {stat.after && <span className="text-success font-bold">{stat.after}</span>}
                            </div>
                          )}
                          {stat.context && (
                            <p className="text-xs text-base-content/40 font-mono leading-relaxed">
                              {stat.context}
                            </p>
                          )}
                          {stat.log_slug && (
                            <Link
                              href={`/log/${stat.log_slug}`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mt-1 w-fit"
                            >
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
                    <motion.div
                      key={stat.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="card bg-base-200 border border-base-content/5 hover:border-primary/20 transition-colors"
                    >
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
