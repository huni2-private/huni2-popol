"use client";

import { ExternalLink, ArrowUpRight, FileDown, Image as ImageIcon, Layers } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const PROJECTS = [
  {
    id: 1,
    title: "Novel Archive Engine",
    description: "본 웹사이트의 핵심 모듈로, 대용량 텍스트 분석 및 맞춤형 독서 환경을 제공하는 엔진입니다. 다크모드, 세피아 테마, 폰트 조절 기능을 포함합니다.",
    tags: ["Next.js 15", "Supabase", "UX Engineering", "Text Parsing"],
    link: "/novels", // 내부 프로젝트 링크
    github: "https://github.com",
    pdfUrl: "#", // 실제 PDF 파일 경로 (public/files/...)
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=1200",
    color: "from-indigo-600 to-violet-600",
    isInternal: true
  },
  {
    id: 2,
    title: "AI Semantic Search",
    description: "벡터 데이터베이스와 LLM을 결합하여 문서의 의미를 파악하고 정확한 정보를 찾아주는 검색 시스템 프로젝트입니다.",
    tags: ["Python", "OpenAI", "Pinecone", "FastAPI"],
    link: "https://demo.vercel.app", // 외부 라이브 데모
    github: "https://github.com",
    pdfUrl: "#",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
    color: "from-emerald-600 to-teal-600",
    isInternal: false
  },
];

export default function PortfolioPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-24 py-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Refined Header */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center px-4 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black tracking-[0.2em] uppercase border border-indigo-100">
          Professional Archive
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight">
          Crafting <span className="text-indigo-600">Solutions.</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium leading-relaxed">
          아이디어를 코드로 실현하고, 그 과정을 기록합니다. <br />
          모든 프로젝트의 소스코드와 기술 백서를 확인하실 수 있습니다.
        </p>
      </div>

      {/* Advanced Projects List */}
      <div className="grid gap-24">
        {PROJECTS.map((project) => (
          <div key={project.id} className="group flex flex-col lg:flex-row bg-white rounded-[3rem] border border-slate-200 overflow-hidden hover:shadow-[0_32px_64px_rgba(0,0,0,0.08)] transition-all duration-700">
            {/* Project Image & Visuals */}
            <div className="lg:w-1/2 h-80 lg:h-auto relative overflow-hidden bg-slate-100">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-10 group-hover:opacity-0 transition-opacity`}></div>
              
              {/* Internal Project Badge */}
              {project.isInternal && (
                <div className="absolute top-8 left-8">
                  <span className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center">
                    <Sparkles className="w-3 h-3 mr-2" /> Main Project
                  </span>
                </div>
              )}
            </div>

            {/* Project Details & Actions */}
            <div className="p-10 lg:p-16 lg:w-1/2 space-y-8 flex flex-col justify-center text-left">
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black rounded-lg border border-slate-100 uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                  {project.title}
                </h2>
                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Action Buttons: Unified Experience */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <a 
                  href={project.link}
                  className="flex items-center justify-center px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                  {project.isInternal ? "Open App" : "Live Demo"} <ExternalLink className="w-4 h-4 ml-2" />
                </a>
                <a 
                  href={project.github}
                  target="_blank"
                  className="flex items-center justify-center px-6 py-4 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-50 active:scale-95"
                >
                  Source Code <ArrowUpRight className="w-4 h-4 ml-2" />
                </a>
                <a 
                  href={project.pdfUrl}
                  download
                  className="col-span-2 flex items-center justify-center px-6 py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-sm hover:bg-indigo-100 transition-all active:scale-95 border border-indigo-100"
                >
                  Download Documentation (PDF) <FileDown className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Vision Section */}
      <div className="bg-slate-950 rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="relative z-10 space-y-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-indigo-500/40">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Building the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Next Frontier.</span>
          </h3>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            단순한 코딩을 넘어 가치 있는 사용자 경험을 설계합니다. <br />
            협업이나 프로젝트 문의는 언제든 환영합니다.
          </p>
          <div className="pt-8">
            <button className="px-12 py-5 bg-white text-slate-900 rounded-[2rem] font-black text-lg hover:bg-indigo-50 transition-all shadow-2xl active:scale-95">
              Contact Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sparkles(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
