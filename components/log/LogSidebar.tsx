import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';

interface SidebarLog {
  id: string;
  slug: string;
  title: string;
  created_at: string;
  tags?: string[];
  readingMinutes: number;
}

export default function LogSidebar({
  logs,
  currentTags,
}: {
  logs: SidebarLog[];
  currentTags: string[];
}) {
  const sorted = [...logs].sort((a, b) => {
    const aOverlap = (a.tags ?? []).filter(t => currentTags.includes(t)).length;
    const bOverlap = (b.tags ?? []).filter(t => currentTags.includes(t)).length;
    return bOverlap - aOverlap;
  });

  return (
    <aside className="hidden lg:block w-[280px] shrink-0">
      <div className="sticky top-24 space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-base-content/40 pb-2">
          다른 글
        </p>
        {sorted.map(log => (
          <Link key={log.id} href={`/log/${log.slug}`} className="block group">
            <div className="card bg-base-200 border border-base-content/5 hover:border-primary/30 transition-all p-4">
              <h3 className="text-sm font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-2">
                {log.title}
              </h3>
              <div className="flex items-center gap-3 text-[10px] font-mono text-base-content/40">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(log.created_at).toLocaleDateString('ko-KR', {
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {log.readingMinutes}분
                </span>
              </div>
              {(log.tags ?? []).length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {log.tags!.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className={`badge badge-xs font-bold ${
                        currentTags.includes(tag) ? 'badge-primary' : 'badge-ghost'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
        <Link
          href="/log"
          className="btn btn-ghost btn-sm w-full rounded-xl text-xs text-base-content/40 hover:text-base-content mt-2"
        >
          모든 글 보기 →
        </Link>
      </div>
    </aside>
  );
}
