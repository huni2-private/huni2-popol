'use client';

import { motion } from 'framer-motion';
import { Briefcase, Code, Layout, Server, Database } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const ICON_MAP: Record<string, React.ElementType> = {
  Layout, Server, Database, Code, Briefcase,
};

interface Bio     { title_ko?: string; title_en?: string; desc_ko?: string; desc_en?: string }
interface Career  { year: string; title_ko?: string; title_en?: string; company: string; desc_ko?: string; desc_en?: string }
interface Stack   { name_ko?: string; name_en?: string; icon?: string; items: string[] }

export default function AboutClient({
  bio, career, stack,
}: {
  bio: Bio;
  career: Career[];
  stack: Stack[];
}) {
  const { lang, t } = useI18n();

  const title = lang === 'ko' ? bio.title_ko : bio.title_en;
  const desc  = lang === 'ko' ? bio.desc_ko  : bio.desc_en;

  return (
    <div className="max-w-4xl mx-auto space-y-20">
      {/* Bio */}
      <section className="space-y-6">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold"
        >
          {title ?? 'Building for the'}{' '}
          <span className="text-primary italic">Web</span>
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
            {career.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-base-content/10 bg-base-100 group-hover:border-primary group-hover:text-primary transition-colors shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <Code className="w-5 h-5" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[45%] p-4 rounded-xl border border-base-content/5 bg-base-200/50 backdrop-blur-sm group-hover:border-primary/20 transition-colors">
                  <time className="text-xs font-mono text-primary">{item.year}</time>
                  <h3 className="font-bold mt-0.5">
                    {lang === 'ko' ? item.title_ko : item.title_en}
                  </h3>
                  <span className="text-sm opacity-60">{item.company}</span>
                  <p className="text-sm text-base-content/70 mt-2">
                    {lang === 'ko' ? item.desc_ko : item.desc_en}
                  </p>
                </div>
              </motion.div>
            ))}
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
