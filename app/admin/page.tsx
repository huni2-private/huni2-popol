"use client";

import { useState } from "react";
import { 
  BookPlus, LayoutDashboard, LogOut, PlusCircle, Settings, 
  FileText, BarChart3, Palette, Share2, Eye, PenTool, Sparkles
} from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  // Local test: Assume admin session is always active
  const [isAdmin] = useState(true);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Dynamic Header with Glassmorphism */}
      <div className="relative overflow-hidden bg-white/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/40 shadow-2xl shadow-slate-200/50 group">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3 h-3 mr-1" /> Administrator Mode
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Design your <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Digital Realm</span>
            </h1>
            <p className="text-slate-500 font-medium flex items-center max-w-md">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              현재 로컬 테스트 모드입니다. 모든 관리 기능을 즉시 사용 가능합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/" className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center shadow-sm active:scale-95">
              <Eye className="w-4 h-4 mr-2" /> Live Site
            </Link>
            <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center shadow-lg active:scale-95">
              <Share2 className="w-4 h-4 mr-2" /> Deploy All
            </button>
          </div>
        </div>
      </div>

      {/* Main Administrative Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Content Management Group */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
          <AdminCard 
            icon={<PenTool className="w-6 h-6" />}
            title="소설 업로드"
            desc="새로운 세계관을 구축하고 회차별로 원고를 업로드하여 관리합니다."
            color="bg-indigo-600"
            link="/admin/novels/new"
          />
          <AdminCard 
            icon={<PlusCircle className="w-6 h-6" />}
            title="포트폴리오 전시"
            desc="나의 전문성을 증명하는 프로젝트들을 한눈에 보기 좋게 추가합니다."
            color="bg-emerald-600"
            link="/admin/portfolio/new"
          />
          <AdminCard 
            icon={<FileText className="w-6 h-6" />}
            title="콘텐츠 매니저"
            desc="전체 소설과 프로젝트 리스트를 통합 관리하고 빠르게 수정합니다."
            color="bg-blue-600"
            link="/admin/contents"
          />
          <AdminCard 
            icon={<BarChart3 className="w-6 h-6" />}
            title="인사이트 통계"
            desc="방문자 수, 독서 패턴, 프로젝트 조회수 등을 시각화하여 분석합니다."
            color="bg-amber-600"
            link="/admin/stats"
          />
        </div>

        {/* Sidebar: Customization & System Status */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2rem] p-8 text-white shadow-2xl overflow-hidden relative group">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all"></div>
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <Palette className="w-6 h-6 mr-3 text-indigo-400" /> 커스터마이징
            </h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              메인 테마 컬러, 사이트 폰트, 상단 메뉴 구성을 <br />본인의 취향에 맞게 실시간으로 조정합니다.
            </p>
            <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all border border-white/10 backdrop-blur-sm active:scale-95">
              테마 편집기 열기
            </button>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center text-slate-900">
              <Settings className="w-5 h-5 mr-3 text-slate-400" /> 시스템 엔진
            </h3>
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">배포 서버</span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg font-black text-[10px] uppercase tracking-tighter">Connected</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>DB STORAGE</span>
                  <span>2% USED</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full w-[2%] rounded-full"></div>
                </div>
              </div>
              <button className="w-full py-3 text-slate-400 text-sm font-bold hover:text-red-500 transition-colors flex items-center justify-center">
                <LogOut className="w-4 h-4 mr-2" /> 로그아웃 (종료)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminCard({ icon, title, desc, color, link }: any) {
  return (
    <Link href={link} className="group bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-transparent hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-start text-left">
      <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-2xl shadow-${color.split('-')[1]}-500/40 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
        {icon}
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
    </Link>
  );
}
