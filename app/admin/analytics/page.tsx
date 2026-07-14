import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { BarChart2, Globe, Eye, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const REF_LABELS: Record<string, string> = {
  't.co': 'Twitter / X',
  'twitter.com': 'Twitter / X',
  'x.com': 'Twitter / X',
  'l.kakao.com': 'KakaoTalk',
  'talk.kakao.com': 'KakaoTalk',
  'google.com': 'Google',
  'naver.com': 'Naver',
  'linkedin.com': 'LinkedIn',
  'github.com': 'GitHub',
};

const PATH_LABELS: Record<string, string> = {
  '/': '홈',
  '/about': 'About',
  '/portfolio': 'Portfolio',
  '/log': 'Dev Log',
  '/contact': 'Contact',
  '/resume': 'Resume',
};

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const now = new Date();
  const ts = (days: number) => new Date(now.getTime() - days * 86400000).toISOString();

  const { data: raw } = await supabase
    .from('page_views')
    .select('path, referrer, created_at')
    .order('created_at', { ascending: false })
    .limit(10000);

  const views = raw ?? [];
  const today = views.filter(v => v.created_at >= ts(1)).length;
  const week  = views.filter(v => v.created_at >= ts(7)).length;
  const month = views.filter(v => v.created_at >= ts(30)).length;
  const total = views.length;

  // 30일 기준 페이지별 집계
  const monthViews = views.filter(v => v.created_at >= ts(30));
  const pageCounts: Record<string, number> = {};
  monthViews.forEach(v => { pageCounts[v.path] = (pageCounts[v.path] || 0) + 1; });
  const topPages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxPage = Math.max(...topPages.map(([, c]) => c), 1);

  // 최근 7일 일별 데이터
  const dayBuckets: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dayBuckets[d.toISOString().slice(0, 10)] = 0;
  }
  views.filter(v => v.created_at >= ts(7)).forEach(v => {
    const k = v.created_at.slice(0, 10);
    if (k in dayBuckets) dayBuckets[k]++;
  });
  const dayData = Object.entries(dayBuckets);
  const maxDay = Math.max(...dayData.map(([, c]) => c), 1);

  // 유입 경로
  const refCounts: Record<string, number> = {};
  monthViews.filter(v => v.referrer).forEach(v => {
    try {
      const host = new URL(v.referrer!).hostname.replace(/^www\./, '');
      const label = REF_LABELS[host] || host;
      refCounts[label] = (refCounts[label] || 0) + 1;
    } catch { /* skip */ }
  });
  const topRefs = Object.entries(refCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxRef = Math.max(...topRefs.map(([, c]) => c), 1);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <BarChart2 className="w-7 h-7 text-primary" /> Analytics
          </h1>
          <p className="text-sm text-base-content/40 mt-1">방문자 통계 — admin 로그인 상태 제외</p>
        </div>
        <Link href="/admin" className="btn btn-ghost btn-sm rounded-xl">← 대시보드</Link>
      </div>

      {/* 요약 수치 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '오늘',    value: today, icon: Eye,        color: 'text-primary'   },
          { label: '이번 주', value: week,  icon: TrendingUp, color: 'text-secondary' },
          { label: '이번 달', value: month, icon: BarChart2,  color: 'text-accent'    },
          { label: '전체',    value: total, icon: Globe,      color: 'text-success'   },
        ].map(s => (
          <div key={s.label} className="card bg-base-200 border border-base-content/5">
            <div className="card-body p-5 gap-1">
              <s.icon className={`w-4 h-4 ${s.color} opacity-60`} />
              <p className="text-3xl font-black">{s.value.toLocaleString()}</p>
              <p className="text-xs opacity-40 uppercase tracking-widest font-bold">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 7일 바 차트 */}
      <div className="card bg-base-200 border border-base-content/5">
        <div className="card-body p-6">
          <h2 className="font-bold text-sm opacity-50 uppercase tracking-widest mb-6">최근 7일 방문</h2>
          <div className="flex items-end gap-2 h-36">
            {dayData.map(([date, count]) => {
              const pct = Math.max(Math.round((count / maxDay) * 100), count > 0 ? 4 : 1);
              const label = new Date(date + 'T00:00:00').toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
              return (
                <div key={date} className="flex flex-col items-center gap-1.5 flex-1">
                  <span className="text-[10px] font-bold opacity-50">{count || ''}</span>
                  <div
                    className="w-full rounded-t-md bg-primary/70 transition-all"
                    style={{ height: `${pct}%` }}
                  />
                  <span className="text-[9px] opacity-40 font-mono whitespace-nowrap">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 페이지별 조회수 */}
        <div className="card bg-base-200 border border-base-content/5">
          <div className="card-body p-6 gap-4">
            <h2 className="font-bold text-sm opacity-50 uppercase tracking-widest">페이지별 조회 (30일)</h2>
            {topPages.length === 0 ? (
              <p className="text-sm opacity-30 italic">아직 데이터가 없습니다.</p>
            ) : topPages.map(([path, count]) => (
              <div key={path} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-bold">{PATH_LABELS[path] || path}</span>
                  <span className="font-mono opacity-50">{count}</span>
                </div>
                <div className="w-full h-1.5 bg-base-300 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(count / maxPage) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 유입 경로 */}
        <div className="card bg-base-200 border border-base-content/5">
          <div className="card-body p-6 gap-4">
            <h2 className="font-bold text-sm opacity-50 uppercase tracking-widest">유입 경로 (30일)</h2>
            {topRefs.length === 0 ? (
              <p className="text-sm opacity-30 italic">직접 입력(주소창) 방문만 있거나 아직 데이터가 없습니다.</p>
            ) : topRefs.map(([ref, count]) => (
              <div key={ref} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-bold">{ref}</span>
                  <span className="font-mono opacity-50">{count}</span>
                </div>
                <div className="w-full h-1.5 bg-base-300 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: `${(count / maxRef) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
