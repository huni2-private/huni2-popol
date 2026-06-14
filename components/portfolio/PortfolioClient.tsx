'use client';

// 포트폴리오 프로젝트 목록 — 필터링, 카드 렌더링, 링크 노출 담당
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExternalLink, FileText, Tag, ArrowRight } from 'lucide-react';
import { Github } from '@/components/icons/SocialIcons';
import { useState } from 'react';

interface Project {
  id: number;
  title: string;
  type: 'personal' | 'company';
  status: 'live' | 'wip' | 'archived';
  description: string;
  tags: string[];
  image_url: string;
  project_url?: string;
  github_url?: string;
  pdf_url?: string;
}

interface ImpactStat {
  id: string;
  metric: string;
  title: string;
  context: string;
  log_slug?: string | null;
}

export default function PortfolioClient({
  initialProjects,
  impactStats,
}: {
  initialProjects: Project[];
  impactStats: ImpactStat[];
}) {
  const [view, setView] = useState<'projects' | 'impact'>('projects');
  const [filter, setFilter] = useState<'all' | 'personal' | 'company'>('all');

  const filteredProjects = initialProjects.filter(p => filter === 'all' || p.type === filter);

  return (
    <div className="space-y-8">
      {/* ── 최상위 탭: Projects | Impact ── */}
      <div className="flex justify-center gap-2">
        {(['projects', 'impact'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`btn btn-sm rounded-full px-6 transition-all ${
              view === v ? 'btn-primary' : 'btn-ghost bg-base-200'
            }`}
          >
            {v === 'projects' ? 'Projects' : 'Impact'}
          </button>
        ))}
      </div>

      {/* ── Projects 탭 ── */}
      {view === 'projects' && (
        <div className="space-y-8">
          <div className="flex justify-center gap-2">
            {(['all', 'personal', 'company'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`btn btn-sm rounded-full px-6 transition-all ${
                  filter === f ? 'btn-primary' : 'btn-ghost bg-base-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="card bg-base-200 border border-base-content/5 overflow-hidden group"
              >
                <figure className="relative h-48 overflow-hidden bg-base-300">
                  {project.image_url ? (
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">No Image</div>
                  )}
                </figure>

                <div className="card-body p-6">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                      project.type === 'personal' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                    }`}>
                      {project.type}
                    </span>
                    {project.status && project.status !== 'live' && (
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                        project.status === 'wip' ? 'bg-warning/10 text-warning' : 'bg-base-content/10 text-base-content/40'
                      }`}>
                        {project.status}
                      </span>
                    )}
                  </div>

                  <h2 className="card-title text-lg">{project.title}</h2>
                  <p className="text-sm text-base-content/70">{project.description}</p>

                  {/* 태그 — 클릭 시 해당 태그로 Log 필터링 */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags?.map(tag => (
                      <Link
                        key={tag}
                        href={`/log?tag=${encodeURIComponent(tag)}`}
                        className="badge badge-ghost text-[10px] py-3 gap-1 hover:badge-primary transition-colors"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </Link>
                    ))}
                  </div>

                  {/* 링크 버튼 — 모바일 포함 항상 노출 */}
                  {(project.project_url || project.github_url || project.pdf_url) && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-base-content/5">
                      {project.project_url && (
                        <a
                          href={project.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-primary rounded-full gap-1 flex-1"
                        >
                          <ExternalLink className="w-3 h-3" /> Live
                        </a>
                      )}
                      {project.type === 'personal' && project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-ghost rounded-full gap-1 flex-1"
                        >
                          <Github className="w-3 h-3" /> GitHub
                        </a>
                      )}
                      {project.pdf_url && (
                        <a
                          href={project.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-ghost rounded-full gap-1"
                        >
                          <FileText className="w-3 h-3" /> PDF
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── Impact 탭 ── */}
      {view === 'impact' && (
        <div className="space-y-6">
          <p className="text-center text-base-content/50 text-sm font-mono">
            숫자로 남긴 것들. 실제로 측정하거나 직접 확인한 수치만 적었다.
          </p>
          {impactStats.length === 0 ? (
            <p className="text-base-content/40 italic py-8 text-center">등록된 수치가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {impactStats.map((stat, i) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="card bg-base-200 border border-base-content/5 hover:border-primary/30 transition-colors"
                >
                  <div className="card-body p-8 gap-3">
                    <p className="text-7xl font-black font-mono text-primary leading-none">
                      {stat.metric}
                    </p>
                    <p className="text-xl font-bold">{stat.title}</p>
                    {stat.context && (
                      <p className="text-sm text-base-content/50 font-mono leading-relaxed">
                        {stat.context}
                      </p>
                    )}
                    {stat.log_slug && (
                      <Link
                        href={`/log/${stat.log_slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mt-1 w-fit"
                      >
                        관련 개발 로그 <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
