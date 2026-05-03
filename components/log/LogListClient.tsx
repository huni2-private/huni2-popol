'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronRight, Search } from 'lucide-react';
import Link from 'next/link';

interface Log {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  created_at: string;
  readingMinutes: number;
  tags?: string[];
}

export default function LogListClient({ initialLogs }: { initialLogs: Log[] }) {
  const [search, setSearch] = useState('');

  const filteredLogs = initialLogs.filter(log =>
    log.title.toLowerCase().includes(search.toLowerCase()) ||
    log.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="relative group max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30 group-focus-within:text-primary transition-colors" />
        <input 
          type="text" 
          placeholder="Search logs..." 
          className="input input-bordered pl-10 bg-base-200 rounded-full w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-8">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log, index) => (
            <motion.article
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <Link href={`/log/${log.slug}`} className="block">
                <div className="card bg-base-200 border border-base-content/5 hover:border-primary/20 transition-all overflow-hidden">
                  <div className="card-body p-6 md:p-8">
                    <div className="flex flex-wrap gap-4 text-xs font-mono text-base-content/50 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(log.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {log.readingMinutes}분 읽기
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-bold group-hover:text-primary transition-colors mb-2">
                      {log.title}
                    </h2>
                    <p className="text-base-content/70 line-clamp-2 mb-6">
                      {log.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {log.tags?.map(tag => (
                          <span key={tag} className="badge badge-ghost text-[10px] font-bold uppercase tracking-wider">{tag}</span>
                        ))}
                      </div>
                      <span className="flex items-center gap-1 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        Read Article <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))
        ) : (
          <div className="text-center py-20 opacity-50 italic">
            No logs found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
