'use client';

// 홈 벤토 그리드 — 뷰포트 한 화면 레이아웃 + 마우스 빛 반사 + 인라인 섹션 확장
import { useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, Package, Zap, X, ChevronRight, Tag } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

interface Bio {
  title_ko?: string;
  title_en?: string;
  desc_ko?: string;
  desc_en?: string;
}

interface Log {
  title: string;
  slug: string;
  created_at: string;
}

interface Project {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  tech_stack?: string[];
}

interface ImpactStat {
  id: string;
  metric: string;
  title: string;
  context: string;
}

function MagicCard({
  children,
  className = '',
  onClick,
  isActive,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    ref.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }, []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`magic-card bg-base-200 rounded-3xl transition-colors ${
        isActive
          ? 'border border-primary/50 ring-2 ring-primary/20'
          : 'border border-base-content/5 hover:border-primary/30'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function HomeClient({
  bio,
  projects,
  recentLogs,
  impactStats,
}: {
  bio: Bio;
  projects: Project[];
  recentLogs: Log[];
  impactStats: ImpactStat[];
}) {
  const { lang } = useI18n();
  const [activeSection, setActiveSection] = useState<'portfolio' | 'impact' | null>(null);

  const title = lang === 'ko'
    ? (bio.title_ko || '작은 개선 하나하나를 의미있게 만듭니다.')
    : (bio.title_en || 'Making every small improvement count.');

  const desc = lang === 'ko'
    ? (bio.desc_ko || 'SK-hynix MAPS 프로젝트에서 23만 개 데이터 로딩 시간을 5초 → 1초로 단축했습니다. 웹 서비스를 만들고 운영하는 팀에서 함께 성장하고 싶습니다.')
    : (bio.desc_en || 'Cut 230K-row load time from 5s → 1s at SK-hynix. Looking to grow with a team that builds and runs web services.');

  const latestLog = recentLogs[0] ?? null;
  const moreLogs = recentLogs.slice(1, 4);
  const firstImpact = impactStats[0] ?? null;

  const toggle = (section: 'portfolio' | 'impact') => {
    setActiveSection(prev => prev === section ? null : section);
  };

  return (
    <div className="space-y-4">
      <div className="
        grid gap-4
        grid-cols-1
        sm:grid-cols-2 sm:auto-rows-[220px]
        lg:grid-cols-4 lg:grid-rows-2 lg:auto-rows-[1fr] lg:h-[calc(100svh-8rem)]
      ">

        {/* ── 1. 히어로 카드 ── */}
        <MagicCard className="
          flex flex-col justify-between p-8
          min-h-[300px]
          sm:col-span-2 sm:row-span-2
          lg:col-span-2 lg:row-span-2
        ">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20 text-success text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Available for Work
            </div>
          </div>

          <div className="space-y-4 flex-1 flex flex-col justify-center">
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-primary opacity-70">
              Frontend Developer · 1년차
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
              {title.replace('\n', ' ')}
            </h1>
            <p className="text-base-content/60 leading-relaxed text-sm md:text-base line-clamp-3">
              {desc}
            </p>
          </div>

          <Link href="/about" className="btn btn-primary rounded-full w-max gap-2 mt-2">
            {lang === 'ko' ? '소개 보기' : 'About Me'} <ArrowRight className="w-4 h-4" />
          </Link>
        </MagicCard>

        {/* ── 2. 임팩트 카드 ── */}
        <MagicCard
          onClick={() => toggle('impact')}
          isActive={activeSection === 'impact'}
          className="flex flex-col justify-between p-6 sm:col-span-1 lg:col-span-1 lg:row-span-1"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-base-content/40">
              <Zap className="w-3.5 h-3.5 text-warning" />
              Impact
            </div>
            {impactStats.length > 1 && (
              <span className="text-[10px] font-mono text-base-content/30">+{impactStats.length - 1}개 더</span>
            )}
          </div>
          <div>
            <p className="text-5xl lg:text-6xl font-black font-mono text-primary leading-none">
              {firstImpact ? firstImpact.metric : '80%'}
            </p>
            <p className="text-sm font-bold mt-2">{firstImpact ? firstImpact.title : '로딩 속도 단축'}</p>
            <p className="text-xs text-base-content/40 mt-1 font-mono">
              {firstImpact ? firstImpact.context : 'SK-hynix 23만건 5s → 1s'}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-primary opacity-60">
            {activeSection === 'impact' ? '접기' : '전체 보기'}
            <ChevronRight className={`w-3 h-3 transition-transform ${activeSection === 'impact' ? 'rotate-90' : ''}`} />
          </div>
        </MagicCard>

        {/* ── 3. 포트폴리오 카드 ── */}
        <MagicCard
          onClick={() => toggle('portfolio')}
          isActive={activeSection === 'portfolio'}
          className="flex flex-col justify-between p-6 sm:col-span-1 lg:col-span-1 lg:row-span-1"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-base-content/40">
            <Package className="w-3.5 h-3.5 text-secondary" />
            Portfolio
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl lg:text-6xl font-black font-mono text-secondary leading-none">
                {projects.length > 0 ? projects.length : '–'}
              </span>
              <span className="text-sm font-bold">{lang === 'ko' ? '개 프로젝트' : 'Projects'}</span>
            </div>
            <p className="text-xs text-base-content/40 mt-1">
              {lang === 'ko' ? '실무부터 사이드까지' : 'Work to Side Projects'}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-primary opacity-60">
            {activeSection === 'portfolio' ? '접기' : (lang === 'ko' ? '보러가기' : 'View All')}
            <ChevronRight className={`w-3 h-3 transition-transform ${activeSection === 'portfolio' ? 'rotate-90' : ''}`} />
          </div>
        </MagicCard>

        {/* ── 4. Dev Log 카드 ── */}
        <MagicCard className="
          flex flex-col justify-between p-6 group
          sm:col-span-2
          lg:col-span-2 lg:row-span-1
        ">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-accent opacity-70">
              Latest Dev Log
            </span>
            <Link
              href="/log"
              onClick={e => e.stopPropagation()}
              className="text-[10px] font-mono text-base-content/40 hover:text-primary transition-colors"
            >
              {lang === 'ko' ? '모두 보기' : 'All'} →
            </Link>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-2 my-2">
            {latestLog ? (
              <>
                <Link
                  href={`/log/${latestLog.slug}`}
                  onClick={e => e.stopPropagation()}
                  className="group/latest"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg md:text-xl font-bold leading-snug group-hover/latest:text-primary transition-colors line-clamp-2 flex-1">
                      {latestLog.title}
                    </h2>
                    <span className="text-[10px] font-mono text-base-content/40 flex items-center gap-1 shrink-0 mt-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(latestLog.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </Link>
                {moreLogs.length > 0 && (
                  <div className="space-y-1.5 border-t border-base-content/5 pt-2">
                    {moreLogs.map(log => (
                      <Link
                        key={log.slug}
                        href={`/log/${log.slug}`}
                        onClick={e => e.stopPropagation()}
                        className="flex items-center gap-2 text-xs text-base-content/40 hover:text-primary transition-colors truncate group/more"
                      >
                        <span className="w-1 h-1 rounded-full bg-base-content/20 shrink-0" />
                        <span className="truncate font-mono">{log.title}</span>
                        <span className="text-[10px] shrink-0 opacity-50 ml-auto">
                          {new Date(log.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-base-content/40 italic text-sm">
                {lang === 'ko' ? '아직 작성된 글이 없습니다.' : 'No posts yet.'}
              </p>
            )}
          </div>

          <Link
            href="/log"
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {lang === 'ko' ? '로그 전체 보기' : 'All Dev Logs'} <ArrowRight className="w-3 h-3" />
          </Link>
        </MagicCard>

      </div>

      {/* ── 인라인 확장 패널 ── */}
      <AnimatePresence>
        {activeSection === 'portfolio' && (
          <motion.div
            key="portfolio-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Package className="w-5 h-5 text-secondary" />
                  {lang === 'ko' ? '포트폴리오' : 'Portfolio'}
                </h2>
                <div className="flex gap-2">
                  <Link href="/portfolio" className="btn btn-ghost btn-sm rounded-full gap-1">
                    {lang === 'ko' ? '전체 보기' : 'View All'} <ArrowRight className="w-3 h-3" />
                  </Link>
                  <button onClick={() => setActiveSection(null)} className="btn btn-ghost btn-sm btn-circle">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {projects.length === 0 ? (
                <p className="text-sm text-base-content/40 italic py-8 text-center">등록된 프로젝트가 없습니다.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map(p => (
                    <div key={p.id} className="card bg-base-200 border border-base-content/5 hover:border-primary/20 transition-all">
                      <div className="card-body p-5 gap-3">
                        <h3 className="font-bold">{p.title}</h3>
                        {p.description && (
                          <p className="text-xs text-base-content/60 line-clamp-2">{p.description}</p>
                        )}
                        {p.tech_stack && p.tech_stack.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {p.tech_stack.slice(0, 4).map(t => (
                              <span key={t} className="badge badge-xs badge-ghost font-mono">{t}</span>
                            ))}
                          </div>
                        )}
                        {p.tags && p.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-auto pt-1 border-t border-base-content/5">
                            {p.tags.map(tag => (
                              <Link
                                key={tag}
                                href={`/log?tag=${encodeURIComponent(tag)}`}
                                className="badge badge-xs badge-primary gap-1 hover:badge-secondary transition-colors"
                                onClick={e => e.stopPropagation()}
                              >
                                <Tag className="w-2.5 h-2.5" /> {tag}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeSection === 'impact' && (
          <motion.div
            key="impact-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-warning" />
                  Impact
                </h2>
                <button onClick={() => setActiveSection(null)} className="btn btn-ghost btn-sm btn-circle">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {impactStats.length === 0 ? (
                <p className="text-sm text-base-content/40 italic py-8 text-center">등록된 임팩트 수치가 없습니다.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {impactStats.map(stat => (
                    <div key={stat.id} className="card bg-base-200 border border-base-content/5">
                      <div className="card-body p-5 gap-1">
                        <p className="text-4xl font-black font-mono text-warning leading-none">{stat.metric}</p>
                        <p className="font-bold text-sm mt-2">{stat.title}</p>
                        {stat.context && (
                          <p className="text-xs text-base-content/40 font-mono">{stat.context}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
