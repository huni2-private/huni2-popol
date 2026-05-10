'use client';

// 로그 목록 클라이언트 — 검색 필터링, 태그 클라우드, 빈 상태 처리
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ChevronRight, Search, Tag, X } from 'lucide-react';
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

export default function LogListClient({
  initialLogs,
  activeTag: initialActiveTag,
}: {
  initialLogs: Log[];
  activeTag?: string;
}) {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(initialActiveTag || null);

  // 모든 태그 추출 및 빈도수 계산
  const allTags = useMemo(() => {
    const counts: Record<string, number> = {};
    initialLogs.forEach(log => {
      log.tags?.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [initialLogs]);

  // 검색 및 태그 필터링 로직
  const filteredLogs = useMemo(() => {
    return initialLogs.filter(log => {
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        log.title.toLowerCase().includes(searchLower) ||
        (log.excerpt ?? '').toLowerCase().includes(searchLower) ||
        log.tags?.some(tag => tag.toLowerCase().includes(searchLower));
      
      const matchesTag = !selectedTag || log.tags?.includes(selectedTag);
      
      return matchesSearch && matchesTag;
    });
  }, [initialLogs, search, selectedTag]);

  return (
    <div className="space-y-8">
      {/* 상단 필터 영역 */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        {/* 검색바 */}
        <div className="relative group w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search by title, content, or tags..."
            className="input input-bordered pl-12 bg-base-200 rounded-2xl w-full h-12 focus:ring-2 focus:ring-primary/20 border-base-content/10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-base-300 rounded-full transition-colors"
            >
              <X className="w-3 h-3 opacity-50" />
            </button>
          )}
        </div>

        {/* 선택된 태그 표시 (모바일/데스크톱 공통) */}
        {selectedTag && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
            <span className="text-xs font-bold uppercase tracking-widest text-base-content/30">Active Filter</span>
            <button
              onClick={() => setSelectedTag(null)}
              className="badge badge-primary badge-lg gap-2 py-4 px-4 font-bold cursor-pointer hover:badge-ghost transition-all"
            >
              <Tag className="w-3.5 h-3.5" />
              {selectedTag}
              <X className="w-3.5 h-3.5 ml-1 opacity-70" />
            </button>
          </div>
        )}
      </div>

      {/* 태그 클라우드 */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-base-content/5">
        <button
          onClick={() => setSelectedTag(null)}
          className={`btn btn-sm rounded-xl px-4 normal-case font-bold ${
            selectedTag === null ? 'btn-primary' : 'btn-ghost bg-base-200'
          }`}
        >
          All
        </button>
        {allTags.map(([tag, count]) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
            className={`btn btn-sm rounded-xl px-4 normal-case font-bold gap-2 ${
              tag === selectedTag ? 'btn-primary' : 'btn-ghost bg-base-200'
            }`}
          >
            <span className="opacity-50">#</span>
            {tag}
            <span className="badge badge-xs opacity-50 ml-1">{count}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log, index) => (
              <motion.article
                key={log.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="group relative"
              >
                <Link href={`/log/${log.slug}`} className="block">
                  <div className="card bg-base-200 border border-base-content/5 hover:border-primary/30 hover:bg-base-100 transition-all overflow-hidden shadow-sm hover:shadow-md">
                    <div className="card-body p-6 md:p-8">
                      <div className="flex flex-wrap gap-4 text-xs font-mono text-base-content/50 mb-4">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(log.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {log.readingMinutes}분 읽기
                        </span>
                      </div>

                      <h2 className="text-xl md:text-2xl font-bold group-hover:text-primary transition-colors mb-3">
                        {log.title}
                      </h2>
                      <p className="text-base-content/60 line-clamp-2 mb-6 leading-relaxed">
                        {log.excerpt}
                      </p>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-wrap gap-2" onClick={e => e.stopPropagation()}>
                          {log.tags?.map(tag => (
                            <button
                              key={tag}
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedTag(tag);
                              }}
                              className={`badge badge-sm py-3 px-3 font-bold uppercase tracking-wider gap-1.5 transition-all ${
                                tag === selectedTag ? 'badge-primary' : 'badge-ghost hover:badge-primary'
                              }`}
                            >
                              <Tag className="w-2.5 h-2.5" />
                              {tag}
                            </button>
                          ))}
                        </div>
                        <span className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 shrink-0">
                          Read Now <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 space-y-4 bg-base-200/50 rounded-3xl border border-dashed border-base-content/10"
            >
              <div className="bg-base-300 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 opacity-20" />
              </div>
              <p className="text-lg font-bold opacity-40">
                {selectedTag
                  ? `'${selectedTag}' 태그와 일치하는 검색 결과가 없습니다.`
                  : 'No logs found matching your search.'}
              </p>
              {(search || selectedTag) && (
                <button 
                  onClick={() => { setSearch(''); setSelectedTag(null); }}
                  className="btn btn-outline btn-sm rounded-xl px-6"
                >
                  Clear all filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

