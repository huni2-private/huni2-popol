'use client';

import { motion } from 'framer-motion';
import { Terminal, Mail, ArrowRight } from 'lucide-react';
import { Github } from '@/components/icons/SocialIcons';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col gap-20">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Blob Animation Background */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              borderRadius: ["40% 60% 70% 30% / 40% 40% 60% 50%", "30% 60% 70% 40% / 50% 60% 30% 40%", "40% 60% 70% 30% / 40% 40% 60% 50%"],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-primary/20 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
              borderRadius: ["60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 70% 30% / 40% 40% 60% 50%", "60% 40% 30% 70% / 60% 30% 70% 40%"],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[450px] md:h-[450px] bg-secondary/20 blur-3xl"
          />
        </div>

        <div className="text-center space-y-6 max-w-2xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base-300 text-xs font-mono mb-4"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            Available for Projects
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            Crafting Digital Realms with <span className="text-primary italic">Precision</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-base-content/70 leading-relaxed"
          >
            Senior Full-stack Developer specializing in high-performance web applications and intuitive user experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-8"
          >
            <Link href="/portfolio" className="btn btn-primary rounded-full px-8">
              Explore Portfolio
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="btn btn-ghost rounded-full px-8">
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Summary View Placeholder */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        <motion.div
          whileHover={{ y: -5 }}
          className="card bg-base-200 shadow-xl overflow-hidden border border-base-content/5"
        >
          <div className="card-body">
            <h2 className="card-title text-primary"><Terminal className="w-5 h-5" /> Latest Log</h2>
            <p className="text-sm opacity-70 italic">"Exploring the boundaries of Next.js 16 Server Actions..."</p>
            <div className="card-actions justify-end mt-4">
              <Link href="/log" className="btn btn-sm btn-ghost gap-1">Read More <ArrowRight className="w-3 h-3" /></Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="card bg-base-200 shadow-xl overflow-hidden border border-base-content/5"
        >
          <div className="card-body">
            <h2 className="card-title text-secondary"><Github className="w-5 h-5" /> Recent Work</h2>
            <p className="text-sm opacity-70 italic">"Personal Digital Realm - Portfolio & Blog CMS Integration"</p>
            <div className="card-actions justify-end mt-4">
              <Link href="/portfolio" className="btn btn-sm btn-ghost gap-1">View Project <ArrowRight className="w-3 h-3" /></Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
