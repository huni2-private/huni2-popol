'use client';

// 홈 벤토 그리드 — 뷰포트 한 화면 레이아웃 + 마우스 빛 반사 + 인라인 섹션 확장
import { useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { Github } from '@/components/icons/Github';
import HeroGlow from '@/components/home/HeroGlow';
import RadialGauge from '@/components/home/RadialGauge';
import ProjectThumbnail from '@/components/portfolio/ProjectThumbnail';
import MovingGradientButton from '@/components/originkit/ui/moving-gradient-button';
import { projectStatusMeta } from '@/lib/projectStatus';

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
  project?: string | null;
}

interface Project {
  id: string;
  title: string;
  project_key?: string;
  description?: string;
  resume_summary?: string;
  role_summary?: string;
  image_url?: string;
  tags?: string[];
  type?: string;
  status?: string;
  featured?: boolean;
}

interface ImpactStat {
  id: string;
  project?: string;
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
      whileTap={{ scale: 0.97, opacity: 0.85 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className={`magic-card bg-base-200 rounded-2xl transition-colors ${
        isActive
          ? 'border border-primary/50 ring-2 ring-primary/20'
          : 'border border-base-content/5 hover:border-primary/30'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}

function getExcerpt(description: string | undefined, max = 110) {
  if (!description) return '';
  const clean = description
    .replace(/^#{1,6}\s.*$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[*_`>]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
  return clean.length > max ? clean.slice(0, max).trim() + '…' : clean;
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

  const featuredProjects = projects.filter(p => p.featured);
  const [activeIndex, setActiveIndex] = useState(0);
  const goTo = (i: number) => setActiveIndex(Math.max(0, Math.min(featuredProjects.length - 1, i)));
  const activeProject = featuredProjects[activeIndex] ?? featuredProjects[0];
  const liveCount = projects.filter(p => p.status === 'live').length;
  const companyCount = projects.filter(p => p.type === 'company').length;

  const scrollToFeatured = () => {
    document.getElementById('featured-projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const title = lang === 'ko'
    ? (bio.title_ko || '3,000명이 실제로 쓴 서비스를 만든 백엔드 중심 풀스택 개발자입니다.')
    : (bio.title_en || 'Backend-leaning fullstack developer who shipped services used by 3,000+ real users.');

  const desc = lang === 'ko'
    ? (bio.desc_ko || '실무에서 측정된 성과(로딩 80% 단축, 업로드 5× 향상)와 사이드에서 직접 기획·배포한 6개 실서비스. Go·MySQL·Redis로 서버와 성능을 책임지고, 필요하면 Next.js 프론트까지 직접 연결하는 개발자입니다.')
    : (bio.desc_en || 'Measured outcomes at work: 80% faster load, 5× upload speed. On the side: 6 live services built and shipped solo — from concept to production. A backend-leaning developer who owns servers and performance, and wires in the frontend when needed.');

  // 첫 임팩트 지표가 퍼센트 값이면 게이지로, 아니면 일반 텍스트로 보여준다
  const primaryStat = impactStats[0];
  const gaugeValue = primaryStat?.metric.endsWith('%')
    ? parseFloat(primaryStat.metric)
    : NaN;
  const secondaryStats = impactStats.slice(1, 3);

  const activeMatchKey = activeProject ? (activeProject.project_key || activeProject.title).toLowerCase() : '';
  const activeStat = impactStats.find(s => s.project?.toLowerCase() === activeMatchKey);
  const activeLogs = recentLogs.filter(l => l.project?.toLowerCase() === activeMatchKey).slice(0, 3);
  const activeMeta = activeProject ? projectStatusMeta(activeProject.status ?? 'archived', lang) : null;

  return (
    <div className="space-y-4">
      {/* ── 히어로: Status Board ── */}
      <MagicCard className="relative flex flex-col gap-6 p-8 overflow-hidden">
        <HeroGlow />

        <div className="relative z-10 order-1 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-success hover:text-success/70 transition-colors"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
            {lang === 'ko' ? '실서비스 운영 중' : 'Running Live Services'}
          </Link>
          <div className="flex flex-wrap gap-1.5">
            {['Go', 'Spring Boot', 'TypeScript', 'Redis', 'Next.js', 'AWS'].map(t => (
              <span key={t} className="badge badge-sm badge-outline border-primary/30 text-primary/80 font-mono">{t}</span>
            ))}
          </div>
        </div>

        <div className="relative z-10 order-2 max-w-3xl space-y-4">
          <p className="text-base md:text-lg font-bold">
            허창훈
            <span className="ml-2 text-sm md:text-base font-medium text-base-content/50">
              · {lang === 'ko' ? '백엔드 중심 풀스택 개발자' : 'Backend-leaning Fullstack Developer'}
            </span>
          </p>
          <h1
            className="font-black leading-[0.98] break-keep"
            style={{ fontSize: 'clamp(2rem, 5.4vw, 4rem)', letterSpacing: '-0.035em' }}
          >
            {title.replace('\n', ' ')}
          </h1>
          <p className="text-base-content/60 leading-relaxed text-sm md:text-base">
            {desc}
          </p>
        </div>

        {/* ── Status Board 지표 스트립 — 데스크톱은 CTA보다 먼저(근거 우선), 모바일은 CTA 다음(버튼에 빨리 닿게) ── */}
        {primaryStat && (
          <div className="relative z-10 order-4 md:order-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-2xl border border-base-content/10 bg-base-100/40 p-4">
              {Number.isFinite(gaugeValue) ? (
                <RadialGauge value={gaugeValue} size={88} />
              ) : (
                <span className="font-mono text-2xl font-black text-primary shrink-0">{primaryStat.metric}</span>
              )}
              <div className="min-w-0">
                <p className="text-sm font-bold leading-snug">{primaryStat.title}</p>
                {primaryStat.log_slug ? (
                  <Link
                    href={`/log/${primaryStat.log_slug}`}
                    className="text-sm text-base-content/60 mt-0.5 font-mono hover:text-primary transition-colors line-clamp-2"
                  >
                    {primaryStat.context} →
                  </Link>
                ) : (
                  <p className="text-sm text-base-content/60 mt-0.5 font-mono line-clamp-2">{primaryStat.context}</p>
                )}
              </div>
            </div>
            {secondaryStats.map(stat => (
              <div key={stat.id} className="flex flex-col justify-center gap-1 rounded-2xl border border-base-content/10 bg-base-100/40 p-4">
                <span className="font-mono font-black text-primary">{stat.metric}</span>
                <span className="text-xs font-bold truncate">{stat.title}</span>
                {stat.context && (
                  stat.log_slug ? (
                    <Link href={`/log/${stat.log_slug}`} className="text-xs font-mono line-clamp-2 text-base-content/50 hover:text-primary transition-colors">
                      {stat.context} →
                    </Link>
                  ) : (
                    <p className="text-xs font-mono line-clamp-2 text-base-content/50">{stat.context}</p>
                  )
                )}
              </div>
            ))}
          </div>
        )}

        <div className="relative z-10 order-3 md:order-4 flex flex-wrap items-center gap-3 border-t border-base-content/10 pt-6">
          <MovingGradientButton
            link="#featured-projects"
            newTab={false}
            onClick={(e) => {
              // 좌클릭 단독일 때만 스크롤 — ctrl/cmd/shift/중클릭은 브라우저 기본 동작(새 탭 등)을 그대로 둔다
              if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              scrollToFeatured();
            }}
            label={lang === 'ko' ? '대표 프로젝트 보기' : 'View Featured Work'}
            addIcon
            icon={{ side: 'right', symbol: '→', size: 16, color: 'var(--color-primary-content)', hoverColor: 'var(--color-primary-content)' }}
            rounded={100}
            padding="14px 30px"
            font={{ fontFamily: 'inherit', fontWeight: 700, fontSize: 16, lineHeight: '1.2', letterSpacing: '-0.01em' }}
            colors={{
              fill: 'var(--color-primary)',
              textColor: 'var(--color-primary-content)',
              hoverFill: 'color-mix(in srgb, var(--color-primary) 85%, black)',
              hoverTextColor: 'var(--color-primary-content)',
            }}
            border={{ borderWidth: 2, borderStyle: 'solid', borderColor: 'transparent' }}
            stroke={{ color: '#8b5cf6', headColor: '#c026d3', count: 2, speed: 22, trail: 100 }}
          />
          <Link href="/resume" className="btn btn-outline btn-primary rounded-full gap-2">
            {lang === 'ko' ? '이력서 보기' : 'Resume'}
          </Link>
          <a
            href="https://github.com/huni2-private/huni2-popol"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm rounded-full gap-2 opacity-60 hover:opacity-100"
            aria-label="이 사이트 소스 코드"
          >
            <Github className="w-4 h-4" />
            {lang === 'ko' ? '이 사이트 소스' : 'This Site’s Source'}
          </a>
        </div>
      </MagicCard>

      {/* ── 대표 프로젝트 — 히어로 바로 다음, 가장 먼저 보여줄 근거 ── */}
      {featuredProjects.length > 0 && activeProject && activeMeta && (
        <section
          id="featured-projects"
          className="space-y-4 scroll-mt-20"
        >
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-primary opacity-70">
                {lang === 'ko' ? '대표 프로젝트' : 'Featured Projects'}
              </span>
              <span className="text-xs text-base-content/40">
                {lang === 'ko'
                  ? `실무 ${companyCount}개 · 전체 ${projects.length}개 · ${liveCount}개 운영 중`
                  : `${companyCount} professional · ${projects.length} total · ${liveCount} live`}
              </span>
            </div>
            <Link href="/portfolio" className="text-xs font-bold text-primary flex items-center gap-1">
              {lang === 'ko' ? '전체 보기' : 'View all'} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* DOM 순서 = nav → panel → image, 모바일 시각 순서와 동일하게 맞춰서
              키보드 Tab 순서가 화면에 보이는 순서와 어긋나지 않게 한다(WCAG 1.3.2).
              데스크톱은 이미지 왼쪽 · 설명 오른쪽, nav는 이미지 아래로 — named grid
              area로 DOM 순서는 그대로 두고 시각 배치만 breakpoint별로 바꾼다 */}
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 lg:gap-10 items-start lg:items-center [grid-template-areas:'nav'_'panel'_'image'] lg:[grid-template-areas:'image_panel'_'nav_panel']"
          >
            {/* 프로젝트 선택(이전/다음 + 이름 탭) — DOM 순서를 모바일 시각 순서(선택 →
                설명 → 이미지)와 맞춰, 키보드로 프로젝트를 고른 다음 Tab하면 바로 그
                프로젝트의 설명·"프로젝트 보기"로 이어지게 한다 */}
            {featuredProjects.length > 1 && (
              <div className="flex items-center justify-center gap-4 [grid-area:nav]">
                <button
                  type="button"
                  onClick={() => goTo(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  aria-label={lang === 'ko' ? '이전 프로젝트' : 'Previous project'}
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-base-content/15 hover:border-primary/40 hover:text-primary disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
                  {featuredProjects.map((p, i) => {
                    const label = p.project_key || p.title || `${lang === 'ko' ? '프로젝트' : 'Project'} ${i + 1}`;
                    const isActive = i === activeIndex;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={label}
                        aria-pressed={isActive}
                        className={`px-2.5 py-1.5 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                          isActive
                            ? 'text-primary border-primary'
                            : 'text-base-content/35 border-transparent hover:text-base-content/60'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => goTo(activeIndex + 1)}
                  disabled={activeIndex === featuredProjects.length - 1}
                  aria-label={lang === 'ko' ? '다음 프로젝트' : 'Next project'}
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-base-content/15 hover:border-primary/40 hover:text-primary disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 [grid-area:panel]"
            >
              <span className={activeMeta.badgeClass}>{activeMeta.label}</span>
              <h3 className="font-black text-2xl md:text-3xl leading-tight">{activeProject.title}</h3>
              {activeProject.role_summary && (
                <p className="text-sm font-mono text-primary/80">{activeProject.role_summary}</p>
              )}
              <p className="text-sm md:text-base text-base-content/60 leading-relaxed">
                {activeProject.resume_summary || getExcerpt(activeProject.description, 220)}
              </p>
              {activeStat && (
                <p className="flex items-baseline gap-1.5 text-sm">
                  <span className="font-mono font-black text-primary text-lg">{activeStat.metric}</span>
                  <span className="text-base-content/50">{activeStat.title}</span>
                </p>
              )}
              {activeProject.tags && activeProject.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {activeProject.tags.slice(0, 5).map(t => (
                    <span key={t} className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-base-content/10 text-base-content/40">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href={`/portfolio/${encodeURIComponent(activeProject.project_key || activeProject.id)}`}
                  className="btn btn-primary rounded-full gap-2"
                >
                  {lang === 'ko' ? '프로젝트 보기' : 'View project'} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/portfolio" className="btn btn-outline rounded-full gap-2">
                  {lang === 'ko' ? '포트폴리오 전체보기' : 'All Projects'}
                </Link>
              </div>

              {activeLogs.length > 0 && (
                <div className="space-y-1.5 border-t border-base-content/10 pt-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-base-content/40">
                    {lang === 'ko' ? '관련 로그' : 'Related Logs'}
                  </p>
                  {activeLogs.map(log => (
                    <Link
                      key={log.slug}
                      href={`/log/${log.slug}`}
                      className="flex items-center gap-2 text-sm text-base-content/60 hover:text-primary transition-colors group/log"
                    >
                      <span className="w-1 h-1 rounded-full bg-base-content/20 shrink-0 group-hover/log:bg-primary" />
                      <span className="truncate">{log.title}</span>
                      <span className="text-[10px] font-mono shrink-0 opacity-50 ml-auto flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(log.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>

            {/* 3D 코버플로우 이미지 */}
            <div className="relative [grid-area:image]">
              <div
                className="relative h-[320px] sm:h-[380px] overflow-hidden"
                style={{ perspective: '1600px' }}
              >
                {featuredProjects.map((p, i) => {
                  const offset = i - activeIndex;
                  const abs = Math.abs(offset);
                  const isActive = offset === 0;
                  if (abs > 2) return null;
                  return (
                    <motion.div
                      key={p.id}
                      className="absolute inset-0 m-auto w-[78%] sm:w-[64%] h-full"
                      animate={{
                        x: `${offset * 78}%`,
                        rotateY: offset === 0 ? 0 : offset > 0 ? -34 : 34,
                        scale: isActive ? 1 : 0.82,
                        opacity: 1 - abs * 0.32,
                        zIndex: 10 - abs,
                      }}
                      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                    >
                      <Link
                        href={`/portfolio/${encodeURIComponent(p.project_key || p.id)}`}
                        tabIndex={isActive ? 0 : -1}
                        aria-hidden={!isActive}
                        onClick={e => { if (!isActive) { e.preventDefault(); goTo(i); } }}
                        className="group relative block h-full w-full overflow-hidden rounded-3xl border border-base-content/10 bg-base-200 shadow-2xl shadow-black/20 hover:border-primary/30 transition-colors cursor-pointer"
                      >
                        {p.image_url ? (
                          <>
                            <Image src={p.image_url} alt="" fill aria-hidden="true"
                              className="object-cover blur-xl scale-110 opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                              sizes="(max-width: 640px) 78vw, 32vw" />
                            <Image src={p.image_url} alt={p.title} fill
                              className="object-contain"
                              sizes="(max-width: 640px) 78vw, 32vw" />
                          </>
                        ) : (
                          <ProjectThumbnail title={p.title} type={p.type === 'company' ? 'company' : 'personal'} />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── About로 이어주는 클로징 배너 — 반복되는 카드 그리드와 다른 단독 레이아웃 ── */}
      <Link
        href="/about"
        className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 overflow-hidden rounded-3xl border border-base-content/10 bg-base-200 px-8 py-10 sm:px-12 sm:py-14 transition-colors hover:border-primary/40"
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 rounded-full bg-primary/10 blur-3xl transition-colors group-hover:bg-primary/20"
          aria-hidden="true"
        />
        <div className="relative z-10 space-y-2 max-w-lg">
          <span className="text-xs font-bold uppercase tracking-widest text-primary/70">
            {lang === 'ko' ? '사람' : 'About'}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black leading-snug">
            {lang === 'ko' ? '숫자 뒤에 있는 사람이 궁금하다면' : 'Curious about the person behind the numbers?'}
          </h3>
          <p className="text-sm text-base-content/50">
            {lang === 'ko' ? '커리어, 기술 스택, 그리고 일하는 방식.' : 'My career, tech stack, and how I work.'}
          </p>
        </div>
        <span className="relative z-10 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-primary/30 text-primary shrink-0 transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-content">
          <ArrowRight className="w-5 h-5" />
        </span>
      </Link>
    </div>
  );
}
