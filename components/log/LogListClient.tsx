'use client';

// 로그 목록 클라이언트 — 검색 필터링, 태그 링크, 빈 상태 처리
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronRight, Search, Tag } from 'lucide-react';
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
  activeTag,
}: {
  initialLogs: Log[];
  activeTag?: string;
}) {
  const [search, setSearch] = useState('');

  const filteredLogs = initialLogs.filter(log =>
    log.title.toLowerCase().includes(search.toLowerCase()) ||
    (log.excerpt ?? '').toLowerCase().includes(search.toLowerCase())
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
                      {/* 태그 — 클릭 시 해당 태그로 필터링 */}
                      <div className="flex flex-wrap gap-2" onClick={e => e.preventDefault()}>
                        {log.tags?.map(tag => (
                          <Link
                            key={tag}
                            href={`/log?tag=${encodeURIComponent(tag)}`}
                            className={`badge text-[10px] font-bold uppercase tracking-wider gap-1 hover:badge-primary transition-colors ${
                              tag === activeTag ? 'badge-primary' : 'badge-ghost'
                            }`}
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                          </Link>
                        ))}
                      </div>
                      <span className="flex items-center gap-1 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 shrink-0">
                        Read Article <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))
        ) : (
          <div className="text-center py-20 space-y-3">
            <p className="opacity-50 italic">
              {activeTag
                ? `'${activeTag}' 태그의 글이 없습니다.`
                : 'No logs found matching your search.'}
            </p>
            {activeTag && (
              <Link href="/log" className="btn btn-ghost btn-sm rounded-full">
                전체 글 보기
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
