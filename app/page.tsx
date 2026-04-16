"use client";

import Link from "next/link";
import { Briefcase, ChevronRight, Sparkles, Zap, Shield, Globe, ArrowDown, Terminal, Command, Code2, Cpu } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="space-y-32 md:space-y-48 py-12 md:py-24 animate-in fade-in duration-1000">
      
      {/* Brand Focus Hero */}
      <section className="relative flex flex-col items-center text-center space-y-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-indigo-500/10 dark:bg-indigo-600/5 rounded-full blur-[140px] -z-10"></div>
        
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition-all duration-1000"></div>
          <div className="relative w-28 h-28 md:w-36 md:h-36 bg-white dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
            <span className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-tr from-indigo-600 to-violet-600">H²</span>
          </div>
        </div>

        <div className="space-y-6 max-w-4xl px-4">
          <div className="inline-flex items-center px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl text-[10px] md:text-xs font-black tracking-[0.3em] uppercase border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
            <Sparkles className="w-3 h-3 mr-2" /> Digital Experience Creator
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black tracking-tight text-slate-900 dark:text-white leading-[0.9]">
            {t.home.hero_title1} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-400 bg-[length:200%_auto] animate-gradient">
              {t.home.hero_title2}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            {t.home.hero_desc}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4 w-full max-w-md px-6">
          <Link href="/portfolio" className="group relative px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-lg transition-all flex items-center justify-center shadow-2xl active:scale-95 overflow-hidden">
            <span className="relative z-10 flex items-center">
              {t.home.btn_portfolio} <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </Link>
        </div>
      </section>

      {/* Bento Grid: Identity Cards */}
      <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <BentoCard 
          icon={<Cpu className="w-6 h-6 text-indigo-600" />}
          title={t.home.feature_fast}
          desc={t.home.feature_fast_desc}
          className="md:col-span-1"
        />
        <BentoCard 
          icon={<Shield className="w-6 h-6 text-violet-600" />}
          title={t.home.feature_secure}
          desc={t.home.feature_secure_desc}
          className="md:col-span-1"
        />
        <BentoCard 
          icon={<Globe className="w-6 h-6 text-emerald-600" />}
          title={t.home.feature_multi}
          desc={t.home.feature_multi_desc}
          className="md:col-span-1"
        />
        
        {/* Large Bento Card */}
        <div className="md:col-span-3 group relative bg-slate-900 dark:bg-white rounded-[3rem] p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] -z-0"></div>
          <div className="relative z-10 space-y-6 max-w-lg">
            <h2 className="text-4xl md:text-5xl font-black text-white dark:text-slate-900 tracking-tighter">
              {t.home.split_p_title}
            </h2>
            <p className="text-slate-400 dark:text-slate-500 text-lg font-medium">
              {t.home.split_p_desc}
            </p>
            <Link href="/portfolio" className="inline-flex items-center px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl font-black text-sm active:scale-95 transition-all">
              {t.home.split_p_btn} <ChevronRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          <div className="relative mt-12 md:mt-0">
            <div className="w-48 h-48 md:w-64 md:h-64 bg-indigo-600 rounded-[3rem] rotate-12 flex items-center justify-center shadow-2xl group-hover:rotate-0 transition-all duration-700">
              <Command className="w-24 h-24 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="text-center py-32 border-t border-slate-100 dark:border-white/5 max-w-4xl mx-auto">
        <p className="text-xs font-black uppercase tracking-[0.5em] text-slate-300 dark:text-slate-700 mb-12">The Philosophy</p>
        <h3 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-slate-200 italic leading-tight px-4">
          "{t.home.quote}"
        </h3>
      </section>
    </div>
  );
}

function BentoCard({ icon, title, desc, className }: any) {
  return (
    <div className={`bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/5 hover:shadow-2xl transition-all duration-500 group ${className}`}>
      <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-sm">
        {icon}
      </div>
      <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{title}</h4>
      <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
