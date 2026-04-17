'use client';

import { motion } from 'framer-motion';
import { ExternalLink, FileText } from 'lucide-react';
import { Github } from '@/components/icons/SocialIcons';
import { useState, useTransition } from 'react';

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

export default function PortfolioClient({ initialProjects }: { initialProjects: Project[] }) {
  const [filter, setFilter] = useState<'all' | 'personal' | 'company'>('all');
  const [isPending, startTransition] = useTransition();

  const filteredProjects = initialProjects.filter(p => filter === 'all' || p.type === filter);

  const handleFilterChange = (newFilter: typeof filter) => {
    startTransition(() => {
      setFilter(newFilter);
    });
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-center gap-2">
        {(['all', 'personal', 'company'] as const).map((f) => (
          <button
            key={f}
            onClick={() => handleFilterChange(f)}
            className={`btn btn-sm rounded-full px-6 transition-all ${
              filter === f ? 'btn-primary' : 'btn-ghost bg-base-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
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
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-20">No Image</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-base-300/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div className="flex gap-2">
                  {project.project_url && (
                    <a href={project.project_url} target="_blank" className="btn btn-circle btn-sm btn-primary" title="Live Site">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {project.type === 'personal' && project.github_url && (
                    <a href={project.github_url} target="_blank" className="btn btn-circle btn-sm btn-secondary" title="GitHub">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.pdf_url && (
                    <a href={project.pdf_url} target="_blank" className="btn btn-circle btn-sm btn-accent" title="PDF">
                      <FileText className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
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
              <div className="flex flex-wrap gap-2 mt-4">
                {project.tags?.map(tag => (
                  <span key={tag} className="badge badge-ghost text-[10px] py-3">{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
