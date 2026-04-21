'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

interface Bio {
  title_ko?: string;
  title_en?: string;
  desc_ko?: string;
  desc_en?: string;
}

interface SlideConfig {
  id: number;
  tag: string;
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
  cta: string;
  href: string;
  accent: string;
  blob1: string;
  blob2: string;
}

const NAV_SLIDES: SlideConfig[] = [
  {
    id: 1,
    tag: 'Portfolio',
    titleKo: '실무와 사이드 프로젝트\n작업물을 공유합니다.',
    titleEn: 'Explore My\nRecent Work.',
    descKo: 'SK-hynix 실무부터 사이드 프로젝트까지, 직접 만든 것들을 모아뒀습니다.',
    descEn: "From SK-hynix production work to side projects — things I've actually shipped.",
    cta: '포트폴리오 보기',
    href: '/portfolio',
    accent: 'text-secondary',
    blob1: 'bg-secondary/20',
    blob2: 'bg-accent/15',
  },
  {
    id: 2,
    tag: 'Dev Log',
    titleKo: '배우면서 느낀 것들을\n기록합니다.',
    titleEn: 'Things I learned\nthe hard way.',
    descKo: '삽질했던 것, 고쳤던 것, 그 과정에서 깨달은 것들.',
    descEn: 'Bugs I fixed, things I broke, and what I figured out along the way.',
    cta: '로그 보기',
    href: '/log',
    accent: 'text-accent',
    blob1: 'bg-accent/20',
    blob2: 'bg-primary/15',
  },
];

const INTERVAL = 5000;

export default function HomeClient({ bio }: { bio: Bio }) {
  const { lang } = useI18n();

  const slides: SlideConfig[] = [
    {
      id: 0,
      tag: 'Frontend Developer · 1년차',
      titleKo: bio.title_ko || '작은 개선 하나하나를\n의미있게 만듭니다.',
      titleEn: bio.title_en || 'Making every small\nimprovement count.',
      descKo: bio.desc_ko || 'SK-hynix MAPS 프로젝트에서 23만 개 데이터 로딩 시간을 5초 → 1초로 단축했습니다. 웹 서비스를 만들고 운영하는 팀에서 함께 성장하고 싶습니다.',
      descEn: bio.desc_en || 'Cut 230K-row load time from 5s → 1s at SK-hynix. Looking to grow with a team that builds and runs web services.',
      cta: '소개 보기',
      href: '/about',
      accent: 'text-primary',
      blob1: 'bg-primary/20',
      blob2: 'bg-secondary/15',
    },
    ...NAV_SLIDES,
  ];

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const go = useCallback((idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent(i => (i + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent(i => (i - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, INTERVAL);
    return () => clearInterval(t);
  }, [paused, next]);

  const slide = slides[current];

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <div className="flex flex-col gap-16">
      {/* Hero Carousel */}
      <section
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden rounded-3xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl bg-base-200">
          <motion.div
            key={`blob1-${current}`}
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className={`absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[550px] md:h-[550px] ${slide.blob1} blur-3xl transition-colors duration-700`}
          />
          <motion.div
            key={`blob2-${current}`}
            animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className={`absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[450px] md:h-[450px] ${slide.blob2} blur-3xl transition-colors duration-700`}
          />
        </div>

        <div className="relative w-full max-w-3xl px-6 md:px-12 py-20">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              className="space-y-6 text-center"
            >
              <span className="inline-block px-3 py-1 rounded-full bg-base-100/60 backdrop-blur text-xs font-bold tracking-widest uppercase border border-base-content/10">
                {slide.tag}
              </span>

              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                {(lang === 'ko' ? slide.titleKo : slide.titleEn).split('\n').map((line, i, arr) =>
                  i === arr.length - 1
                    ? <span key={i} className={`italic ${slide.accent}`}>{line}</span>
                    : <span key={i}>{line}<br /></span>
                )}
              </h1>

              <p className="text-base md:text-lg text-base-content/60 leading-relaxed max-w-xl mx-auto">
                {lang === 'ko' ? slide.descKo : slide.descEn}
              </p>

              <Link href={slide.href} className="btn btn-primary rounded-full px-8 mt-4 inline-flex gap-2">
                {slide.cta} <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-base-100/60 backdrop-blur border-base-content/10 hover:bg-base-100">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-base-100/60 backdrop-blur border-base-content/10 hover:bg-base-100">
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => go(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-base-content/20 hover:bg-base-content/40'
              }`}
            />
          ))}
        </div>

        {!paused && (
          <motion.div
            key={`progress-${current}`}
            className="absolute bottom-0 left-0 h-0.5 bg-primary/50"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
          />
        )}
      </section>

      {/* Nav cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {slides.map((s) => (
          <Link key={s.id} href={s.href}>
            <motion.div
              whileHover={{ y: -4 }}
              className="card bg-base-200 border border-base-content/5 hover:border-primary/30 transition-all cursor-pointer h-full"
            >
              <div className="card-body p-5 gap-2">
                <span className={`text-xs font-bold uppercase tracking-widest ${s.accent}`}>{s.tag}</span>
                <p className="font-bold text-sm leading-snug">
                  {(lang === 'ko' ? s.titleKo : s.titleEn).replace('\n', ' ')}
                </p>
                <div className="flex items-center gap-1 text-xs text-base-content/40 mt-1">
                  {s.cta} <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </section>
    </div>
  );
}
