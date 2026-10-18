'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Briefcase, Building2, ChevronDown, Code, ExternalLink, GraduationCap, Layout, Server, Database } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const ICON_MAP: Record<string, React.ElementType> = {
  Layout, Server, Database, Code, Briefcase,
};

interface Bio {
  title_ko?: string; title_en?: string; desc_ko?: string; desc_en?: string; photo_url?: string;
}
interface Career {
  year: string;
  title_ko?: string; title_en?: string;
  company: string; department?: string; logo_url?: string;
  company_desc_ko?: string; company_desc_en?: string;
  desc_ko?: string; desc_en?: string;
  status_ko?: string; status_en?: string;
  project_keys?: string[];
}
interface Stack  { name_ko?: string; name_en?: string; icon?: string; items: string[] }
interface Education { year: string; institution: string; title: string; desc?: string; project_desc?: string; project_keys?: string[]; }
interface Project { id: string; title: string; project_key?: string }

function toLines(text = '') {
  return text.split('\n').map(line => line.replace(/^[▎\-•\s]+/, '').trim()).filter(Boolean);
}

export default function AboutClient({
  bio, career, stack, education, projects,
}: {
  bio: Bio;
  career: Career[];
  stack: Stack[];
  education: Education[];
  projects: Project[];
}) {
  const { lang, t } = useI18n();
  const ko = lang === 'ko';
  const reduceMotion = useReducedMotion();
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set(career.map((_, i) => i)));
  const [bioExpanded, setBioExpanded] = useState(false);

  const toggleCareer = (i: number) => setExpanded(prev => {
    const next = new Set(prev);
    if (next.has(i)) next.delete(i); else next.add(i);
    return next;
  });

  const title = (ko ? bio.title_ko : bio.title_en) || (ko ? 'AI로 실서비스를 만드는 개발자' : 'AI-augmented developer shipping real products on the Web');
  const desc = (ko ? bio.desc_ko : bio.desc_en) ?? '';

  const fadeIn = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

  return (
    <div className="max-w-4xl mx-auto space-y-16 pt-4">
      {/* Bio — 모바일에서도 경력까지 빠르게 도달하도록 간결하게 */}
      <section className="flex items-start gap-4 sm:gap-6">
        {bio.photo_url && (
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
            className="relative w-20 h-20 sm:w-32 sm:h-32 shrink-0 rounded-2xl overflow-hidden ring-1 ring-base-content/10 shadow-lg shadow-primary/10"
          >
            <Image
              src={bio.photo_url}
              alt=""
              fill
              sizes="(max-width: 640px) 80px, 128px"
              className="object-cover object-top"
            />
          </motion.div>
        )}
        <div className="min-w-0 flex-1 space-y-2 pt-1">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
            <span>{ko ? '허창훈' : 'Changhun Heo'}</span>
            <span className="h-3 w-px bg-base-content/20" aria-hidden="true" />
            <span className="text-base-content/55 font-medium">{ko ? '백엔드 중심 풀스택 개발자' : 'Backend & Fullstack'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-snug [word-break:keep-all] text-balance">
            {title}
          </h1>
          {desc && (
            <div className="text-sm sm:text-base text-base-content/70 leading-relaxed [word-break:keep-all]">
              <p className={bioExpanded ? '' : 'line-clamp-2'}>{desc}</p>
              <button
                type="button"
                onClick={() => setBioExpanded(v => !v)}
                className="mt-1 text-xs font-bold text-primary"
              >
                {bioExpanded ? (ko ? '접기' : 'Show less') : (ko ? '더 보기' : 'Read more')}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Career Timeline */}
      {career.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" /> {t.about.career_title}
          </h2>
          <div className="space-y-4">
            {career.map((item, i) => {
              const isOpen = expanded.has(i);
              const roleTitle = lang === 'ko' ? item.title_ko : item.title_en;
              const roleLines = toLines(lang === 'ko' ? item.desc_ko : item.desc_en);
              const companyDesc = lang === 'ko' ? item.company_desc_ko : item.company_desc_en;
              const status = lang === 'ko' ? item.status_ko : item.status_en;
              const linkedProjects = (item.project_keys ?? [])
                .map(key => projects.find(p => (p.project_key || p.title) === key))
                .filter((p): p is Project => !!p);
              return (
                <motion.div
                  key={i}
                  {...fadeIn}
                  transition={reduceMotion ? undefined : { delay: i * 0.08 }}
                  className="rounded-2xl border border-base-content/10 bg-base-200/40 overflow-hidden motion-safe:transition-colors hover:border-primary/20"
                >
                  <button type="button" onClick={() => toggleCareer(i)} className="w-full text-left p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
                    {item.logo_url ? (
                      <Image src={item.logo_url} alt="" width={40} height={40} className="w-10 h-10 rounded-lg object-contain bg-base-100 border border-base-content/10 shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-base-300 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 opacity-40" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <h3 className="font-bold [word-break:keep-all]">{item.company}</h3>
                        <time className="text-xs font-mono text-primary/80">{item.year}</time>
                        {status && <span className="text-[10px] font-bold uppercase tracking-wide text-base-content/40">{status}</span>}
                      </div>
                      {(item.department || roleTitle) && (
                        <p className="text-sm text-base-content/60 [word-break:keep-all]">
                          {[item.department, roleTitle].filter(Boolean).join(' · ')}
                        </p>
                      )}
                      {companyDesc && (
                        <p className="text-xs text-base-content/40 [word-break:keep-all]">{companyDesc}</p>
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 opacity-40 shrink-0 mt-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (roleLines.length > 0 || linkedProjects.length > 0) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 sm:px-5 pb-4 sm:pb-5 sm:pl-[68px] space-y-3">
                          {roleLines.length > 0 && (
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wide text-primary/70 mb-2">{t.about.role_contribution}</p>
                              <ul className="space-y-1.5 text-sm text-base-content/80 leading-relaxed">
                                {roleLines.map((line, li) => (
                                  <li key={li} className="relative pl-4 [word-break:keep-all] before:absolute before:left-0 before:top-[0.65em] before:h-1 before:w-1 before:rounded-full before:bg-primary/60">
                                    {line}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {linkedProjects.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {linkedProjects.map(p => (
                                <Link
                                  key={p.id}
                                  href={`/portfolio/${encodeURIComponent(p.project_key || p.id)}`}
                                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 px-3 py-1.5 text-xs font-bold text-primary leading-snug whitespace-normal hover:bg-primary hover:text-primary-content transition-colors"
                                >
                                  <ExternalLink className="w-3 h-3 shrink-0" /> {p.title}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-secondary" /> {lang === 'ko' ? '학력 / 교육' : 'Education'}
          </h2>
          <div className="space-y-4">
            {education.map((edu, i) => {
              const projectDescLines = toLines(edu.project_desc);
              const linkedProjects = (edu.project_keys ?? [])
                .map(key => projects.find(p => (p.project_key || p.title) === key))
                .filter((p): p is Project => !!p);
              return (
                <motion.div
                  key={i}
                  {...fadeIn}
                  transition={reduceMotion ? undefined : { delay: i * 0.05 }}
                  className="flex gap-4 sm:gap-6 items-start"
                >
                  <time className="text-xs font-mono text-primary/80 w-20 sm:w-28 shrink-0 pt-1">{edu.year}</time>
                  <div className="flex-1 min-w-0 pb-4 border-b border-base-content/5 last:border-0 space-y-1">
                    <p className="font-bold [word-break:keep-all]">{edu.institution}</p>
                    <p className="text-sm text-base-content/70 [word-break:keep-all]">{edu.title}</p>
                    {edu.desc && <p className="text-xs text-base-content/40 [word-break:keep-all]">{edu.desc}</p>}
                    {projectDescLines.length > 0 && (
                      <ul className="space-y-1.5 text-sm text-base-content/80 leading-relaxed pt-2">
                        {projectDescLines.map((line, li) => (
                          <li key={li} className="relative pl-4 [word-break:keep-all] before:absolute before:left-0 before:top-[0.65em] before:h-1 before:w-1 before:rounded-full before:bg-primary/60">
                            {line}
                          </li>
                        ))}
                      </ul>
                    )}
                    {linkedProjects.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {linkedProjects.map(p => (
                          <Link
                            key={p.id}
                            href={`/portfolio/${encodeURIComponent(p.project_key || p.id)}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 px-3 py-1.5 text-xs font-bold text-primary leading-snug whitespace-normal hover:bg-primary hover:text-primary-content transition-colors"
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" /> {p.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Tech Stack */}
      {stack.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Code className="w-5 h-5 text-secondary" /> {t.about.stack_title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {stack.map((s, i) => {
              const Icon = ICON_MAP[s.icon ?? 'Code'] ?? Code;
              return (
                <motion.div
                  key={i}
                  {...fadeIn}
                  transition={reduceMotion ? undefined : { delay: i * 0.08 }}
                  className="rounded-2xl border border-base-content/10 bg-base-200/40 p-5 sm:p-6"
                >
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
                </motion.div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
