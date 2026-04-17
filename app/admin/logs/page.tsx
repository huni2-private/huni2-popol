'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Loader2,
  Calendar, FileText, Search
} from 'lucide-react';
import Link from 'next/link';

interface Log {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  category: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

const CATEGORY_BADGE: Record<string, string> = {
  log:     'badge-primary',
  project: 'badge-secondary',
  note:    'badge-accent',
};

export default function AdminLogs() {
  const [logs, setLogs]         = useState<Log[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const supabase = createClient();

  const fetchLogs = async () => {
    const { data } = await supabase
      .from('logs')
      .select('id, title, slug, excerpt, tags, category, published, created_at, updated_at')
      .order('created_at', { ascending: false });
    setLogs(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []); // eslint-disable-line

  const togglePublish = async (log: Log) => {
    setToggling(log.id);
    await supabase
      .from('logs')
      .update({ published: !log.published })
      .eq('id', log.id);
    setLogs(prev => prev.map(l => l.id === log.id ? { ...l, published: !l.published } : l));
    setToggling(null);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" 포스트를 삭제하시겠습니까?`)) return;
    setDeleting(id);
    await supabase.from('logs').delete().eq('id', id);
    setLogs(prev => prev.filter(l => l.id !== id));
    setDeleting(null);
  };

  const filtered = logs.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.excerpt?.toLowerCase().includes(search.toLowerCase())
  );

  const published = logs.filter(l => l.published).length;
  const drafts    = logs.filter(l => !l.published).length;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="w-7 h-7 text-primary" /> Logs
          </h1>
          <p className="text-sm opacity-50 mt-1">
            전체 {logs.length}개 &middot; 공개 {published}개 &middot; 초안 {drafts}개
          </p>
        </div>
        <Link href="/admin/write" className="btn btn-primary rounded-2xl gap-2 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> 새 포스트
        </Link>
      </div>

      {/* Search */}
      <div className="relative group max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          placeholder="포스트 검색..."
          className="input input-bordered pl-10 bg-base-200 rounded-full w-full"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="card bg-base-200 border-2 border-dashed border-base-content/10">
          <div className="card-body items-center text-center py-20 gap-4">
            <FileText className="w-12 h-12 opacity-20" />
            <p className="opacity-40 italic">
              {search ? '검색 결과가 없습니다.' : '아직 작성된 포스트가 없습니다.'}
            </p>
            {!search && (
              <Link href="/admin/write" className="btn btn-primary btn-sm rounded-full">
                <Plus className="w-4 h-4" /> 지금 작성
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(log => (
            <div
              key={log.id}
              className={`card bg-base-200 border transition-all hover:border-primary/20 ${
                log.published ? 'border-base-content/5' : 'border-dashed border-base-content/10 opacity-70'
              }`}
            >
              <div className="card-body p-5 flex-row items-center gap-4">
                {/* Status dot */}
                <div className={`w-2 h-2 rounded-full shrink-0 ${log.published ? 'bg-success' : 'bg-base-content/20'}`} />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`badge badge-xs font-bold ${CATEGORY_BADGE[log.category] ?? 'badge-ghost'}`}>
                      {log.category}
                    </span>
                    {!log.published && (
                      <span className="badge badge-xs badge-ghost opacity-50">초안</span>
                    )}
                  </div>
                  <h3 className="font-bold truncate">{log.title}</h3>
                  <p className="text-xs opacity-50 line-clamp-1 mt-0.5">{log.excerpt}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] font-mono opacity-40">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(log.created_at).toLocaleDateString('ko-KR')}
                    </span>
                    {log.tags?.length > 0 && (
                      <span>{log.tags.slice(0, 3).join(', ')}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Toggle publish */}
                  <button
                    onClick={() => togglePublish(log)}
                    disabled={toggling === log.id}
                    className={`btn btn-sm rounded-xl gap-1 ${
                      log.published ? 'btn-ghost text-success' : 'btn-ghost opacity-50'
                    }`}
                    title={log.published ? '비공개로 전환' : '공개로 전환'}
                  >
                    {toggling === log.id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : log.published
                        ? <Eye className="w-4 h-4" />
                        : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Edit */}
                  <Link
                    href={`/admin/write?id=${log.id}`}
                    className="btn btn-ghost btn-sm btn-square rounded-xl"
                    title="편집"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(log.id, log.title)}
                    disabled={deleting === log.id}
                    className="btn btn-ghost btn-sm btn-square rounded-xl text-error"
                    title="삭제"
                  >
                    {deleting === log.id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
