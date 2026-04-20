'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

interface Slide {
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

const SLIDES: Slide[] = [
  {
    id: 0,
    tag: 'Full-Stack Developer',
    titleKo: '디지털 세계를\n정밀하게 구축합니다.',
    titleEn: 'Crafting Digital\nExperiences.',
    descKo: '아이디어를 기능적이고 아름다운 웹 애플리케이션으로 만들어냅니다.',
    descEn: 'Turning ideas into functional and beautiful web applications.',
    cta: 'About Me',
    href: '/about',
    accent: 'text-primary',
    blob1: 'bg-primary/20',
    blob2: 'bg-secondary/15',
  },
  {
    id: 1,
    tag: 'Portfolio',
    titleKo: '최근 작업들을\n확인해보세요.',
    titleEn: 'Explore My\nRecent Work.',
    descKo: '사이드 프로젝트부터 실무 경험까지, 다양한 작업물을 공유합니다.',
    descEn: "From side projects to production work — see what I've been building.",
    cta: 'View Portfolio',
    href: '/portfolio',
    accent: 'text-secondary',
    blob1: 'bg-secondary/20',
    blob2: 'bg-accent/15',
  },
  {
    id: 2,
    tag: 'Dev Log',
    titleKo: '배움과 경험을\n기록합니다.',
    titleEn: 'Thoughts &\nLearnings.',
    descKo: '개발하면서 배운 것들, 실험들, 그리고 생각들을 글로 남깁니다.',
    descEn: 'Documenting experiments, discoveries, and developer insights.',
    cta: 'Read the Log',
    href: '/log',
    accent: 'text-accent',
    blob1: 'bg-accent/20',
    blob2: 'bg-primary/15',
  },
];

const INTERVAL = 5000;

export default function Home() {
  const { lang } = useI18n();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const go = useCallback((idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  }, [current]);

  const next = useCallback(() => {
    const idx = (current + 1) % SLIDES.length;
    setDirection(1);
    setCurrent(idx);
  }, [current]);

  const prev = useCallback(() => {
    const idx = (current - 1 + SLIDES.length) % SLIDES.length;
    setDirection(-1);
    setCurrent(idx);
  }, [current]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, INTERVAL);
    return () => clearInterval(t);
  }, [paused, next]);

  const slide = SLIDES[current];

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
        {/* Animated background blobs */}
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

        {/* Slide content */}
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

              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight whitespace-pre-line">
                {(lang === 'ko' ? slide.titleKo : slide.titleEn).split('\n').map((line, i, arr) =>
                  i === arr.length - 1
                    ? <span key={i} className={`italic ${slide.accent}`}>{line}</span>
                    : <span key={i}>{line}<br /></span>
                )}
              </h1>

              <p className="text-base md:text-lg text-base-content/60 leading-relaxed max-w-xl mx-auto">
                {lang === 'ko' ? slide.descKo : slide.descEn}
              </p>

              <Link
                href={slide.href}
                className="btn btn-primary rounded-full px-8 mt-4 inline-flex gap-2"
              >
                {slide.cta} <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-base-100/60 backdrop-blur border-base-content/10 hover:bg-base-100"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-base-100/60 backdrop-blur border-base-content/10 hover:bg-base-100"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => go(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 h-2 bg-primary'
                  : 'w-2 h-2 bg-base-content/20 hover:bg-base-content/40'
              }`}
            />
          ))}
        </div>

        {/* Progress bar */}
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
        {SLIDES.map((s) => (
          <Link key={s.id} href={s.href}>
            <motion.div
              whileHover={{ y: -4 }}
              className="card bg-base-200 border border-base-content/5 hover:border-primary/30 transition-all cursor-pointer h-full"
            >
              <div className="card-body p-5 gap-2">
                <span className={`text-xs font-bold uppercase tracking-widest ${s.accent}`}>{s.tag}</span>
                <p className="font-bold text-sm leading-snug">
                  {lang === 'ko' ? s.titleKo.replace('\n', ' ') : s.titleEn.replace('\n', ' ')}
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
