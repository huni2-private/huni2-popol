'use client';

import { useEffect, useState } from "react";
import {
  LogOut, Plus, Settings, FileText, BarChart3,
  Sparkles, Loader2, Package, PenTool, Eye, Clock
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface RecentLog {
  id: string;
  title: string;
  category: string;
  published: boolean;
  created_at: string;
}

interface Stats {
  projects: number;
  logs: number;
  published: number;
  drafts: number;
}

export default function AdminPage() {
  const [loading, setLoading]           = useState(true);
  const [user, setUser]                 = useState<any>(null);
  const [recentLogs, setRecentLogs]     = useState<RecentLog[]>([]);
  const [stats, setStats]               = useState<Stats>({ projects: 0, logs: 0, published: 0, drafts: 0 });
  const router  = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/admin/login'); return; }
      setUser(user);

      const [{ data: projects }, { data: logs }] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: false }),
        supabase.from('logs').select('id, title, category, published, created_at').order('created_at', { ascending: false }),
      ]);

      const allLogs = logs ?? [];
      setRecentLogs(allLogs.slice(0, 5));
      setStats({
        projects: projects?.length ?? 0,
        logs: allLogs.length,
        published: allLogs.filter(l => l.published).length,
        drafts: allLogs.filter(l => !l.published).length,
      });
      setLoading(false);
    };
    init();
  }, [router, supabase]); // eslint-disable-line

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const CATEGORY_BADGE: Record<string, string> = {
    log:     'badge-primary',
    project: 'badge-secondary',
    note:    'badge-accent',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-base-200 p-10 rounded-[2.5rem] border border-base-content/5 shadow-xl">
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3 h-3 mr-1" /> Administrator Mode
            </div>
            <h1 className="text-5xl font-black tracking-tight leading-tight">
              Welcome back,<br />
              <span className="text-primary">{user?.email?.split('@')[0]}</span>
            </h1>
            <p className="text-base-content/50 font-medium flex items-center">
              <span className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              시스템이 정상 작동 중입니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="btn btn-ghost bg-base-100 rounded-2xl border-base-content/10 shadow-sm">
              <Eye className="w-4 h-4 mr-2" /> Live Site
            </Link>
            <Link href="/admin/write" className="btn btn-primary rounded-2xl shadow-lg shadow-primary/20">
              <PenTool className="w-4 h-4 mr-2" /> New Post
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Projects', value: stats.projects, icon: Package,   color: 'text-primary' },
          { label: 'Total Logs', value: stats.logs,   icon: FileText,  color: 'text-secondary' },
          { label: 'Published',  value: stats.published, icon: Eye,    color: 'text-success' },
          { label: 'Drafts',     value: stats.drafts, icon: Clock,     color: 'text-warning' },
        ].map(s => (
          <div key={s.label} className="card bg-base-200 border border-base-content/5">
            <div className="card-body p-5 gap-1">
              <s.icon className={`w-5 h-5 ${s.color} opacity-70`} />
              <p className="text-3xl font-black">{s.value}</p>
              <p className="text-xs opacity-40 uppercase tracking-widest font-bold">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Recent Logs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> 최근 포스트
            </h2>
            <Link href="/admin/logs" className="btn btn-ghost btn-sm rounded-full">전체 보기</Link>
          </div>

          {recentLogs.length === 0 ? (
            <div className="card bg-base-200 border-2 border-dashed border-base-content/10">
              <div className="card-body items-center py-12 gap-3 text-center">
                <FileText className="w-10 h-10 opacity-20" />
                <p className="text-sm opacity-40 italic">아직 작성된 포스트가 없습니다.</p>
                <Link href="/admin/write" className="btn btn-primary btn-sm rounded-full gap-1">
                  <Plus className="w-4 h-4" /> 첫 포스트 작성
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {recentLogs.map(log => (
                <div
                  key={log.id}
                  className={`card bg-base-200 border hover:border-primary/20 transition-all group ${
                    log.published ? 'border-base-content/5' : 'border-dashed border-base-content/10 opacity-60'
                  }`}
                >
                  <div className="card-body p-4 flex-row items-center gap-3">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${log.published ? 'bg-success' : 'bg-base-content/20'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`badge badge-xs font-bold ${CATEGORY_BADGE[log.category] ?? 'badge-ghost'}`}>
                          {log.category}
                        </span>
                      </div>
                      <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                        {log.title}
                      </p>
                      <p className="text-[10px] font-mono opacity-40 mt-0.5">
                        {new Date(log.created_at).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    <Link
                      href={`/admin/write?id=${log.id}`}
                      className="btn btn-ghost btn-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      편집
                    </Link>
                  </div>
                </div>
              ))}
              <Link href="/admin/write" className="btn btn-ghost btn-block rounded-2xl border border-dashed border-base-content/10 gap-2 mt-2">
                <Plus className="w-4 h-4" /> 새 포스트 작성
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Nav */}
          <div className="card bg-base-200 border border-base-content/5 rounded-[2rem]">
            <div className="card-body p-6 gap-3">
              <h3 className="font-bold text-sm opacity-50 uppercase tracking-widest">관리 메뉴</h3>
              {[
                { href: '/admin/portfolio', label: 'Portfolio 관리', icon: Package,  desc: '프로젝트 추가·편집' },
                { href: '/admin/logs',      label: 'Logs 관리',      icon: FileText, desc: '포스트 목록·편집' },
                { href: '/admin/write',     label: '새 포스트 작성',  icon: PenTool,  desc: '마크다운 에디터' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-base-300 transition-all group"
                >
                  <div className="w-9 h-9 bg-base-100 rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <item.icon className="w-4 h-4 opacity-60 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{item.label}</p>
                    <p className="text-[10px] opacity-40">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* System */}
          <div className="card bg-base-200 border border-base-content/5 rounded-[2rem]">
            <div className="card-body p-6 gap-4">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Settings className="w-4 h-4 opacity-30" /> System
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="opacity-50">Auth</span>
                  <span className="badge badge-success badge-sm font-bold">SUPABASE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-50">Database</span>
                  <span className="badge badge-success badge-sm font-bold">ACTIVE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-50">{user?.email}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-ghost btn-sm btn-block text-error rounded-2xl mt-2"
              >
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
