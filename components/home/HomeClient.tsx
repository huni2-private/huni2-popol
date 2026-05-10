'use client';

// 홈 벤토 그리드 — 뷰포트 한 화면 레이아웃 + 마우스 빛 반사 효과
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

interface LatestLog {
  title: string;
  slug: string;
  created_at: string;
}

// 마우스 움직임에 따라 CSS 변수로 좌표 전달 — ::before 그라디언트가 따라옴
function MagicCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
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
      className={`magic-card bg-base-200 border border-base-content/5 hover:border-primary/30 rounded-3xl transition-colors ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function HomeClient({
  bio,
  projectCount,
  latestLog,
}: {
  bio: Bio;
  projectCount: number;
  latestLog: LatestLog | null;
}) {
  const { lang } = useI18n();

  const title = lang === 'ko'
    ? (bio.title_ko || '작은 개선 하나하나를 의미있게 만듭니다.')
    : (bio.title_en || 'Making every small improvement count.');

  const desc = lang === 'ko'
    ? (bio.desc_ko || 'SK-hynix MAPS 프로젝트에서 23만 개 데이터 로딩 시간을 5초 → 1초로 단축했습니다. 웹 서비스를 만들고 운영하는 팀에서 함께 성장하고 싶습니다.')
    : (bio.desc_en || 'Cut 230K-row load time from 5s → 1s at SK-hynix. Looking to grow with a team that builds and runs web services.');

  return (
    /*
      모바일: 1열 자유 높이
      태블릿(sm): 2열 auto-rows
      데스크톱(lg): 4열 2행 — 헤더(64px) + 상하패딩(64px) 빼고 뷰포트 꽉 채움
    */
    <div className="
      grid gap-4
      grid-cols-1
      sm:grid-cols-2 sm:auto-rows-[220px]
      lg:grid-cols-4 lg:grid-rows-2 lg:auto-rows-[1fr] lg:h-[calc(100svh-8rem)]
    ">

      {/* ── 1. 히어로 카드 (좌측 절반 전체) ── */}
      <MagicCard className="
        flex flex-col justify-between p-8
        min-h-[300px]
        sm:col-span-2 sm:row-span-2
        lg:col-span-2 lg:row-span-2
      ">
        <div className="space-y-1">
          {/* Available 상태 */}
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

        <Link
          href="/about"
          className="btn btn-primary rounded-full w-max gap-2 mt-2"
        >
          {lang === 'ko' ? '소개 보기' : 'About Me'} <ArrowRight className="w-4 h-4" />
        </Link>
      </MagicCard>

      {/* ── 2. 임팩트 수치 카드 ── */}
      <MagicCard className="
        flex flex-col justify-between p-6
        sm:col-span-1
        lg:col-span-1 lg:row-span-1
      ">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-base-content/40">
          <Zap className="w-3.5 h-3.5 text-warning" />
          Impact
        </div>
        <div>
          <p className="text-5xl lg:text-6xl font-black font-mono text-primary leading-none">
            80<span className="text-3xl lg:text-4xl">%</span>
          </p>
          <p className="text-sm font-bold mt-2">로딩 속도 단축</p>
          <p className="text-xs text-base-content/40 mt-1 font-mono">
            SK-hynix 23만건 5s → 1s
          </p>
        </div>
      </MagicCard>

      {/* ── 3. 포트폴리오 카드 ── */}
      <Link href="/portfolio" className="contents">
        <MagicCard className="
          flex flex-col justify-between p-6 cursor-pointer group
          sm:col-span-1
          lg:col-span-1 lg:row-span-1
        ">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-base-content/40">
            <Package className="w-3.5 h-3.5 text-secondary" />
            Portfolio
          </div>
          <div>
            <p className="text-5xl lg:text-6xl font-black font-mono text-secondary leading-none">
              {projectCount > 0 ? projectCount : '–'}
            </p>
            <p className="text-sm font-bold mt-2">
              {lang === 'ko' ? '개 프로젝트' : 'Projects'}
            </p>
            <p className="text-xs text-base-content/40 mt-1">
              {lang === 'ko' ? '실무부터 사이드까지' : 'Work to Side Projects'}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            {lang === 'ko' ? '보러가기' : 'View All'} <ArrowRight className="w-3 h-3" />
          </div>
        </MagicCard>
      </Link>

      {/* ── 4. 최신 Dev Log 카드 (우측 하단 가로 전체) ── */}
      <Link href={latestLog ? `/log/${latestLog.slug}` : '/log'} className="contents">
        <MagicCard className="
          flex flex-col justify-between p-6 cursor-pointer group
          sm:col-span-2
          lg:col-span-2 lg:row-span-1
        ">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-accent opacity-70">
              Latest Dev Log
            </span>
            {latestLog && (
              <span className="text-[10px] font-mono text-base-content/40 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(latestLog.created_at).toLocaleDateString('ko-KR', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </span>
            )}
          </div>

          <div className="flex-1 flex items-center">
            {latestLog ? (
              <h2 className="text-xl md:text-2xl font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {latestLog.title}
              </h2>
            ) : (
              <p className="text-base-content/40 italic text-sm">
                {lang === 'ko' ? '아직 작성된 글이 없습니다.' : 'No posts yet.'}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            {lang === 'ko' ? '읽으러 가기' : 'Read Article'} <ArrowRight className="w-3 h-3" />
          </div>
        </MagicCard>
      </Link>

    </div>
  );
}
