'use client';

// 포트폴리오 — 넓은 2열 카드 + 클릭 시 상세 페이지로 이동
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, ArrowRight, Zap, BookOpen, Search } from 'lucide-react';
import { Github } from '@/components/icons/SocialIcons';
import { useState, useMemo, useEffect, useRef } from 'react';
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
  const ko = lang === 'ko';
  const reduceMotion = useReducedMotion();
  const [view, setView] = useState<'projects' | 'impact'>('projects');
  const [filter, setFilter] = useState<'all' | 'personal' | 'company'>('all');

  // 필터를 URL에 반영해 상세 페이지에서 "목록으로" 돌아올 때 복원되게 한다.
  // 서버 렌더는 window에 접근할 수 없어 기본값(all)으로 내려오므로, 하이드레이션
  // 후 1회 URL을 읽어 보정하는 효과 — 외부 시스템(브라우저 URL) 동기화의 표준 예외.
  const didInit = useRef(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 하이드레이션 이후 1회만 URL에서 복원
    if (type === 'personal' || type === 'company') setFilter(type);
    didInit.current = true;
  }, []);

  useEffect(() => {
    if (!didInit.current) return;
    const params = new URLSearchParams();
    if (filter !== 'all') params.set('type', filter);
    const qs = params.toString();
    const url = qs ? `/portfolio?${qs}` : '/portfolio';
    router.replace(url, { scroll: false });
    sessionStorage.setItem('portfolio-list-url', url);
  }, [filter, router]);

  const filteredProjects = useMemo(() => {
    return initialProjects.filter(p => filter === 'all' || p.type === filter);
  }, [initialProjects, filter]);

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

  const fadeIn = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight [word-break:keep-all] text-balance">
          {t.portfolio.page_title}
        </h1>
        <p className="mt-3 max-w-xl text-sm sm:text-base text-base-content/60 leading-relaxed [word-break:keep-all]">
          {t.portfolio.page_desc}
        </p>
      </div>

      {/* 탭 + 필터 — 하나의 툴바로 묶어 좌측 정렬 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex gap-1 self-start rounded-xl bg-base-200 p-1">
          {(['projects', 'impact'] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`rounded-lg px-4 py-2 text-sm font-bold motion-safe:transition-colors ${view === v ? 'bg-primary text-primary-content shadow-sm' : 'text-base-content/55 hover:text-base-content'}`}>
              {v === 'projects' ? t.portfolio.tab_projects : t.portfolio.tab_impact}
            </button>
          ))}
        </div>

        {view === 'projects' && (
          <div className="flex gap-2 self-start sm:self-auto">
            {(['all', 'personal', 'company'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold motion-safe:transition-colors ${filter === f ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content/55 hover:text-base-content'}`}>
                {f === 'all' ? t.portfolio.filter_all : f === 'personal' ? t.portfolio.filter_personal : t.portfolio.filter_company}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Projects 탭 ── */}
      {view === 'projects' && (
        <div className="space-y-8">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-32 space-y-4 bg-base-200/50 rounded-3xl border border-dashed border-base-content/10">
              <div className="bg-base-300 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 opacity-20" />
              </div>
              <p className="text-lg font-bold opacity-40">{t.portfolio.no_results}</p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="btn btn-outline btn-sm rounded-xl px-6"
                >
                  {t.portfolio.clear_filters}
                </button>
              )}
            </div>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {filteredProjects.map((project, index) => {
              const matchKey = (project.project_key || project.title).toLowerCase();
              const stat = impactStats.find(s => s.project?.toLowerCase() === matchKey);
              const meta = projectStatusMeta(project.status, lang);
              const typeLabel = project.type === 'company' ? t.portfolio.filter_company : t.portfolio.filter_personal;
              const href = `/portfolio/${encodeURIComponent(project.project_key || project.id)}`;
              return (
                <motion.article
                  key={project.id}
                  layout
                  {...fadeIn}
                  transition={reduceMotion ? undefined : { duration: 0.3, delay: index * 0.04 }}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-base-content/10 bg-base-200/60 motion-safe:transition-shadow hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 focus-within:ring-2 focus-within:ring-primary/40"
                >
                  {/* 카드 전체를 상세 페이지로 — 키보드 포커스도 받는 stretched link */}
                  <Link
                    href={href}
                    aria-label={`${project.title} ${ko ? '자세히 보기' : 'view project details'}`}
                    className="absolute inset-0 z-10 rounded-3xl"
                  />

                  {/* 이미지 */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-base-300 shrink-0">
                    {project.image_url ? (
                      <>
                        <div className="absolute inset-0 z-0" aria-hidden="true">
                          <Image src={project.image_url} alt="" fill
                            className="object-cover blur-2xl scale-110 opacity-25"
                            sizes="50vw" />
                        </div>
                        <div className="absolute inset-0 z-[1] motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]">
                          <Image src={project.image_url} alt={project.title} fill
                            className="object-contain p-4 drop-shadow-[0_18px_30px_rgba(0,0,0,0.18)]"
                            sizes="(max-width: 1024px) 100vw, 50vw" />
                        </div>
                      </>
                    ) : (
                      <ProjectThumbnail title={project.title} type={project.type} />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
                    <div className="flex items-center gap-1.5">
                      <span className={meta.badgeClass}>{meta.label}</span>
                      <span className="ml-auto text-[10px] text-base-content/30">
                        {typeLabel}
                      </span>
                    </div>

                    <h2 className="font-extrabold text-lg sm:text-xl leading-snug [word-break:keep-all]">
                      {project.title}
                    </h2>

                    {/* 서비스 요약 */}
                    {project.resume_summary && (
                      <p className="text-sm text-base-content/70 leading-relaxed line-clamp-2 [word-break:keep-all]">
                        {project.resume_summary}
                      </p>
                    )}

                    {/* 담당 역할 — 또렷하게, 잘리지 않게 */}
                    {project.role_summary && (
                      <p className="text-sm font-semibold text-base-content/90 leading-relaxed line-clamp-2 border-l-2 border-primary/50 pl-3 [word-break:keep-all]">
                        {project.role_summary}
                      </p>
                    )}

                    {/* 대표 성과 */}
                    {stat && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black font-mono text-primary">{stat.metric}</span>
                        <span className="text-xs text-base-content/50 truncate">{stat.title}</span>
                      </div>
                    )}

                    {/* 태그 */}
                    <div className="flex flex-wrap gap-1.5">
                      {[...new Set(project.tags)].slice(0, 5).map(tag => (
                        <span key={tag} className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-base-content/10 text-base-content/40">
                          {tag}
                        </span>
                      ))}
                      {[...new Set(project.tags)].length > 5 && (
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-base-content/10 text-base-content/40">
                          +{[...new Set(project.tags)].length - 5}
                        </span>
                      )}
                    </div>

                    {/* 링크 + 자세히 보기 */}
                    <div className="relative z-20 mt-auto flex flex-wrap items-center gap-3 pt-4 border-t border-base-content/10">
                      <div className="flex items-center gap-1">
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
                      </div>
                      <div className="ml-auto flex items-center gap-3">
                        {logCounts[matchKey] > 0 && (
                          <span className="flex items-center gap-1 text-[10px] text-base-content/30">
                            <BookOpen className="w-3 h-3" /> {logCounts[matchKey]}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
                          {ko ? '자세히 보기' : 'Details'}
                          <ArrowRight className="w-4 h-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
          )}
        </div>
      )}

      {/* ── Impact 탭 ── */}
      {view === 'impact' && (
        <div className="space-y-10">
          <p className="text-sm font-mono text-base-content/50">{t.portfolio.tagline}</p>
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
                      <motion.div key={stat.id} {...fadeIn}
                        transition={reduceMotion ? undefined : { delay: gi * 0.05 + i * 0.05 }}
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
                    <motion.div key={stat.id} {...fadeIn}
                      transition={reduceMotion ? undefined : { delay: i * 0.05 }}
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
