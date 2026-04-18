'use client';

import { motion } from 'framer-motion';
import { Terminal, ArrowRight } from 'lucide-react';
import { Github } from '@/components/icons/SocialIcons';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-20">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], borderRadius: ["40% 60% 70% 30% / 40% 40% 60% 50%", "30% 60% 70% 40% / 50% 60% 30% 40%", "40% 60% 70% 30% / 40% 40% 60% 50%"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-primary/20 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0], borderRadius: ["60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 70% 30% / 40% 40% 60% 50%", "60% 40% 30% 70% / 60% 30% 70% 40%"] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[450px] md:h-[450px] bg-secondary/20 blur-3xl"
          />
        </div>

        <div className="text-center space-y-6 max-w-2xl px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold tracking-tight whitespace-pre-line"
          >
            {t.home.hero_title.split('\n').map((line, i) =>
              i === 0 ? <span key={i}>{line}<br /></span>
                      : <span key={i} className="text-primary italic">{line}</span>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-base-content/70 leading-relaxed"
          >
            {t.home.hero_desc}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-8"
          >
            <Link href="/portfolio" className="btn btn-primary rounded-full px-8">
              {t.home.btn_portfolio}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="btn btn-ghost rounded-full px-8">
              {t.home.btn_contact}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        <motion.div whileHover={{ y: -5 }} className="card bg-base-200 shadow-xl overflow-hidden border border-base-content/5">
          <div className="card-body">
            <h2 className="card-title text-primary"><Terminal className="w-5 h-5" /> {t.home.latest_log}</h2>
            <p className="text-sm opacity-70 italic">"Exploring the boundaries of Next.js 16 Server Actions..."</p>
            <div className="card-actions justify-end mt-4">
              <Link href="/log" className="btn btn-sm btn-ghost gap-1">{t.log.read_more} <ArrowRight className="w-3 h-3" /></Link>
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="card bg-base-200 shadow-xl overflow-hidden border border-base-content/5">
          <div className="card-body">
            <h2 className="card-title text-secondary"><Github className="w-5 h-5" /> {t.home.recent_work}</h2>
            <p className="text-sm opacity-70 italic">"Personal Digital Realm - Portfolio & Blog CMS Integration"</p>
            <div className="card-actions justify-end mt-4">
              <Link href="/portfolio" className="btn btn-sm btn-ghost gap-1">{t.nav.portfolio} <ArrowRight className="w-3 h-3" /></Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
