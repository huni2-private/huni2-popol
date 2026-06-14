'use client';

// 홈 벤토 그리드 — 뷰포트 한 화면 레이아웃 + 마우스 빛 반사 + 인라인 섹션 확장
import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Package, Zap } from 'lucide-react';
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
  type?: string;
  status?: string;
}

interface ImpactStat {
  id: string;
  metric: string;
  title: string;
  context: string;
  log_slug?: string | null;
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
  const rafRef = useRef<number | null>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || rafRef.current !== null) return;
    const x = e.clientX;
    const y = e.clientY;
    rafRef.current = requestAnimationFrame(() => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        ref.current.style.setProperty('--mouse-x', `${x - rect.left}px`);
        ref.current.style.setProperty('--mouse-y', `${y - rect.top}px`);
      }
      rafRef.current = null;
    });
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

  const title = lang === 'ko'
    ? (bio.title_ko || 'SK-하이닉스 MAPS, 23만 건 로딩을 5s→1s로. Next.js로 실서비스 6개를 만들고 운영합니다.')
    : (bio.title_en || '5s→1s on 230K rows at SK-hynix MAPS. Shipped 6 live services with Next.js.');

  const desc = lang === 'ko'
    ? (bio.desc_ko || '실무에서 측정된 성과(로딩 80% 단축, 업로드 5× 향상)와 사이드에서 직접 기획·배포한 6개 실서비스. 기능 구현을 넘어 성능과 사용성까지 책임지는 프론트엔드 개발자입니다.')
    : (bio.desc_en || 'Measured outcomes at work: 80% faster load, 5× upload speed. On the side: 6 live services built and shipped solo — from concept to production. A frontend developer who owns the outcome, not just the code.');

  const latestLog = recentLogs[0] ?? null;
  const moreLogs = recentLogs.slice(1, 4);

  return (
    <div className="space-y-4">
      <div className="
        grid gap-4
        grid-cols-1
        sm:grid-cols-2 sm:auto-rows-[minmax(240px,auto)]
        lg:grid-cols-4 lg:grid-rows-2 lg:auto-rows-[1fr] lg:h-[calc(100svh-8rem)]
      ">

        {/* ── 1. 히어로 카드 ── */}
        <MagicCard className="
          flex flex-col justify-between p-8
          min-h-[300px]
          sm:col-span-2 sm:row-span-2
          lg:col-span-2 lg:row-span-2
        ">
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl [z-index:0]">
            <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-secondary/10 blur-3xl" />
          </div>
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center px-2.5 py-1 border border-success/50 text-success text-xs font-mono font-bold tracking-wider rounded">
              {lang === 'ko' ? '구직 중' : 'Available for Work'}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['React', 'Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'].map(t => (
                <span key={t} className="badge badge-sm badge-ghost font-mono opacity-60">{t}</span>
              ))}
            </div>
          </div>

          <div className="space-y-4 flex-1 flex flex-col justify-center relative z-10">
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-primary opacity-70">
              허창훈 · Frontend Developer
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
              {title.replace('\n', ' ')}
            </h1>
            <p className="text-base-content/60 leading-relaxed text-sm md:text-base line-clamp-3">
              {desc}
            </p>
          </div>

          <Link href="/about" className="btn btn-primary rounded-full w-max gap-2 mt-2 relative z-10">
            {lang === 'ko' ? '소개 보기' : 'About Me'} <ArrowRight className="w-4 h-4" />
          </Link>
        </MagicCard>

        {/* ── 2. 임팩트 카드 ── */}
        <MagicCard className="flex flex-col justify-between p-6 group min-h-[200px] sm:col-span-1 lg:col-span-1 lg:row-span-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-base-content/40">
            <Zap className="w-3.5 h-3.5 text-primary" />
            Impact
          </div>

          <div className="flex-1 flex flex-col justify-center gap-2 my-2">
            {impactStats[0] && (
              <>
                <div>
                  <p className="text-5xl lg:text-6xl font-black font-mono text-primary leading-none">
                    {impactStats[0].metric}
                  </p>
                  <p className="text-sm font-bold mt-2">{impactStats[0].title}</p>
                  {impactStats[0].log_slug ? (
                    <Link
                      href={`/log/${impactStats[0].log_slug}`}
                      className="text-xs text-base-content/40 mt-0.5 font-mono hover:text-primary transition-colors block truncate"
                    >
                      {impactStats[0].context} →
                    </Link>
                  ) : (
                    <p className="text-xs text-base-content/40 mt-0.5 font-mono">{impactStats[0].context}</p>
                  )}
                </div>
                {impactStats.slice(1).length > 0 && (
                  <div className="space-y-2 border-t border-base-content/5 pt-2">
                    {impactStats.slice(1).map(stat => (
                      <div key={stat.id} className="flex items-start gap-2 text-xs text-base-content/40">
                        <span className="w-1 h-1 rounded-full bg-base-content/20 shrink-0 mt-1.5" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-mono font-bold text-primary shrink-0">{stat.metric}</span>
                            <span className="truncate">{stat.title}</span>
                          </div>
                          {stat.context && (
                            stat.log_slug ? (
                              <Link
                                href={`/log/${stat.log_slug}`}
                                className="text-[10px] font-mono truncate opacity-50 mt-0.5 hover:opacity-100 hover:text-primary transition-colors block"
                              >
                                {stat.context} →
                              </Link>
                            ) : (
                              <p className="text-[10px] font-mono truncate opacity-50 mt-0.5">{stat.context}</p>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <Link
            href="/portfolio"
            className="flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {lang === 'ko' ? '전체 보기' : 'View All'} <ArrowRight className="w-3 h-3" />
          </Link>
        </MagicCard>

        {/* ── 3. 포트폴리오 카드 ── */}
        <MagicCard className="flex flex-col justify-between p-6 group min-h-[200px] sm:col-span-1 lg:col-span-1 lg:row-span-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-base-content/40">
            <Package className="w-3.5 h-3.5 text-primary" />
            Portfolio
          </div>
          <div>
            <p className="text-5xl lg:text-6xl font-black font-mono text-primary leading-none">
              {projects.length > 0 ? projects.length : '–'}
              <span className="text-lg font-bold ml-1">{lang === 'ko' ? '개' : ''}</span>
            </p>
            <p className="text-sm font-bold">{lang === 'ko' ? '프로젝트' : 'Projects'}</p>
            <p className="text-xs text-base-content/40 mt-1">
              {lang === 'ko' ? '실무부터 사이드까지' : 'Work to Side Projects'}
            </p>
          </div>
          <Link
            href="/portfolio"
            className="flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {lang === 'ko' ? '전체 보기' : 'View All'} <ArrowRight className="w-3 h-3" />
          </Link>
        </MagicCard>

        {/* ── 4. Dev Log 카드 ── */}
        <MagicCard className="
          flex flex-col justify-between p-6 group
          min-h-[220px] sm:col-span-2
          lg:col-span-2 lg:row-span-1
        ">
          <div className="flex items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary opacity-50">
              Latest Dev Log
            </span>
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

    </div>
  );
}
