'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Building2, ChevronDown, Code, ExternalLink, Layout, Server, Database } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const ICON_MAP: Record<string, React.ElementType> = {
  Layout, Server, Database, Code, Briefcase,
};

interface Bio {
  title_ko?: string; title_en?: string; desc_ko?: string; desc_en?: string;
}
interface Career {
  year: string;
  title_ko?: string; title_en?: string;
  company: string; department?: string; logo_url?: string;
  company_desc_ko?: string; company_desc_en?: string;
  desc_ko?: string; desc_en?: string;
  project_keys?: string[];
}
interface Stack  { name_ko?: string; name_en?: string; icon?: string; items: string[] }
interface Project { title: string; project_key?: string }

export default function AboutClient({
  bio, career, stack, projects,
}: {
  bio: Bio;
  career: Career[];
  stack: Stack[];
  projects: Project[];
}) {
  const { lang, t } = useI18n();
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggleCareer = (i: number) => setExpanded(prev => {
    const next = new Set(prev);
    if (next.has(i)) next.delete(i); else next.add(i);
    return next;
  });

  const desc = lang === 'ko' ? bio.desc_ko : bio.desc_en;

  return (
    <div className="max-w-4xl mx-auto space-y-20">
      {/* Bio */}
      <section className="space-y-6">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold"
        >
          {lang === 'ko' ? (
            <>
              {bio.title_ko ?? 'AI로 실서비스를 만드는'}{' '}
              <span className="text-primary italic">개발자</span>
            </>
          ) : (
            <>
              {bio.title_en ?? 'AI-augmented developer shipping real products on the'}{' '}
              <span className="text-primary italic">Web</span>
            </>
          )}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-base-content/70 leading-relaxed"
        >
          {desc}
        </motion.p>
      </section>

      {/* Career Timeline */}
      {career.length > 0 && (
        <section className="space-y-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" /> {t.about.career_title}
          </h2>
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-base-content/10 before:to-transparent">
            {career.map((item, i) => {
              const isOpen = expanded.has(i);
              const role = lang === 'ko' ? item.desc_ko : item.desc_en;
              const companyDesc = lang === 'ko' ? item.company_desc_ko : item.company_desc_en;
              const linkedProjects = (item.project_keys ?? [])
                .map(key => projects.find(p => (p.project_key || p.title) === key))
                .filter((p): p is Project => !!p);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative flex items-start gap-4 md:grid md:grid-cols-[1fr_2.5rem_1fr] md:items-start md:gap-x-6 group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-base-content/10 bg-base-100 group-hover:border-primary group-hover:text-primary transition-colors shrink-0 mt-4 md:col-start-2 md:justify-self-center">
                    <Code className="w-5 h-5" />
                  </div>
                  <div
                    className={`flex-1 min-w-0 rounded-xl border border-base-content/5 bg-base-200/50 backdrop-blur-sm group-hover:border-primary/20 transition-colors overflow-hidden ${i % 2 === 0 ? 'md:col-start-1' : 'md:col-start-3'}`}
                  >
                    <button type="button" onClick={() => toggleCareer(i)} className="w-full text-left p-4">
                      <div className="flex items-start gap-3">
                        {item.logo_url ? (
                          <img src={item.logo_url} alt={item.company} className="w-10 h-10 rounded-lg object-contain bg-base-100 border border-base-content/10 shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-base-300 flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5 opacity-40" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <time className="text-xs font-mono text-primary">{item.year}</time>
                          <h3 className="font-bold mt-0.5 truncate">{item.company}</h3>
                          <span className="text-sm opacity-60">
                            {[item.department, lang === 'ko' ? item.title_ko : item.title_en].filter(Boolean).join(' · ')}
                          </span>
                        </div>
                        <ChevronDown className={`w-4 h-4 opacity-40 shrink-0 mt-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                      {companyDesc && (
                        <p className="text-xs text-base-content/50 mt-2">{companyDesc}</p>
                      )}
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (role || linkedProjects.length > 0) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4">
                            {role && (
                              <>
                                <p className="text-xs font-semibold text-primary/70 mb-1">{t.about.role_contribution}</p>
                                <p className="text-sm text-base-content/70 whitespace-pre-line">{role}</p>
                              </>
                            )}
                            {linkedProjects.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {linkedProjects.map(p => (
                                  <Link
                                    key={p.project_key || p.title}
                                    href={`/portfolio/${encodeURIComponent(p.project_key || p.title)}`}
                                    className="badge badge-outline badge-primary gap-1 py-3 hover:bg-primary hover:text-primary-content transition-colors"
                                  >
                                    <ExternalLink className="w-3 h-3" /> {p.title}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Tech Stack */}
      {stack.length > 0 && (
        <section className="space-y-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Code className="w-6 h-6 text-secondary" /> {t.about.stack_title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stack.map((s, i) => {
              const Icon = ICON_MAP[s.icon ?? 'Code'] ?? Code;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card bg-base-200 border border-base-content/5"
                >
                  <div className="card-body p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-base-300 text-secondary">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold">{lang === 'ko' ? s.name_ko : s.name_en}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {s.items.map(item => (
                        <span key={item} className="badge badge-ghost border-base-content/10 text-xs py-3">{item}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
