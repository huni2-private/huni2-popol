import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, ArrowRight, ExternalLink, FileText, BookOpen, Calendar } from 'lucide-react';
import { Github } from '@/components/icons/SocialIcons';
import ProjectThumbnail from '@/components/portfolio/ProjectThumbnail';

interface ImpactStat {
  id: string;
  project?: string;
  metric: string;
  title: string;
  before?: string;
  after?: string;
  context: string;
  log_slug?: string | null;
}

export default async function PortfolioDetail({ params }: { params: Promise<{ key: string }> }) {
  const { key: rawKey } = await params;
  const key = decodeURIComponent(rawKey);
  const supabase = await createClient();

  // project_key로 먼저 찾고(짧은 코드네임 URL), 없으면 예전 id 링크도 계속 동작하도록 폴백
  let { data: project } = await supabase.from('projects').select('*').eq('project_key', key).maybeSingle();
  if (!project) {
    ({ data: project } = await supabase.from('projects').select('*').eq('id', key).maybeSingle());
  }

  if (!project) notFound();

  const { data: impactData } = await supabase.from('site_settings').select('value').eq('key', 'impact_stats').single();

  // logs.project / impact_stats[].project는 projects.title(정식 이름)이 아니라
  // 짧은 코드네임을 쓰므로 project_key로 매칭 (없으면 title로 폴백)
  const matchKey = project.project_key || project.title;

  const { data: logs } = await supabase
    .from('logs')
    .select('title, slug, created_at')
    .ilike('project', matchKey)
    .eq('published', true)
    .order('created_at', { ascending: false });

  const impactStats: ImpactStat[] = Array.isArray(impactData?.value) ? impactData.value : [];
  const projectImpact = impactStats.filter(s => s.project?.toLowerCase() === matchKey.toLowerCase());

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <Link href="/portfolio" className="btn btn-ghost btn-sm gap-2">
        <ArrowLeft className="w-4 h-4" /> 목록으로
      </Link>

      {/* 커버 이미지 */}
      <div className="relative h-64 rounded-3xl overflow-hidden">
        {project.image_url ? (
          <Image src={project.image_url} alt={project.title} fill className="object-cover" sizes="768px" priority />
        ) : (
          <ProjectThumbnail title={project.title} type={project.type} />
        )}
      </div>

      {/* 헤더 */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
            project.type === 'personal' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
          }`}>{project.type}</span>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
            project.status === 'live' ? 'bg-success/10 text-success' :
            project.status === 'wip' ? 'bg-warning/10 text-warning' : 'bg-base-content/10 text-base-content/40'
          }`}>{project.status}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black leading-tight">{project.title}</h1>
      </div>

      {/* 설명 — 마크다운 렌더링 */}
      {project.description && (
        <div className="prose prose-sm max-w-none text-base-content/70
          prose-headings:text-base-content prose-headings:font-bold
          prose-code:bg-base-200 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-primary prose-code:text-xs prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-base-200 prose-pre:rounded-xl
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:text-base-content
          prose-li:marker:text-primary">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {project.description}
          </ReactMarkdown>
        </div>
      )}

      {/* 임팩트 수치 */}
      {projectImpact.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-base-content/30">Impact</p>
          <div className="grid grid-cols-2 gap-3">
            {projectImpact.map(stat => (
              <div key={stat.id} className="bg-base-200 rounded-2xl p-4 space-y-1">
                <p className="text-3xl font-black font-mono text-primary leading-none">{stat.metric}</p>
                <p className="text-xs font-bold">{stat.title}</p>
                {stat.context && <p className="text-[11px] text-base-content/40 font-mono">{stat.context}</p>}
                {stat.log_slug && (
                  <Link href={`/log/${stat.log_slug}`}
                    className="inline-flex items-center gap-1 text-[11px] text-primary font-bold hover:underline">
                    로그 보기 <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 기술 스택 */}
      {project.tags?.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-base-content/30">Tech Stack</p>
          <div className="flex flex-wrap gap-2">
            {[...new Set(project.tags)].map((tag) => (
              <span key={tag as string} className="badge badge-ghost py-3 text-xs">{tag as string}</span>
            ))}
          </div>
        </div>
      )}

      {/* 관련 Dev 로그 */}
      {logs && logs.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-base-content/30">Dev Log</p>
          <div className="space-y-1">
            {logs.map(log => (
              <Link key={log.slug} href={`/log/${log.slug}`}
                className="flex items-center justify-between gap-2 p-3 rounded-xl bg-base-200 hover:bg-base-300 transition-colors group/log">
                <div className="flex items-center gap-2 min-w-0">
                  <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="text-sm font-medium truncate group-hover/log:text-primary transition-colors">{log.title}</span>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] text-base-content/30 shrink-0">
                  <Calendar className="w-3 h-3" />
                  {new Date(log.created_at).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 링크 버튼 */}
      {(project.project_url || project.github_url || project.pdf_url) && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-base-content/5">
          {project.project_url && (
            <a href={project.project_url} target="_blank" rel="noopener noreferrer"
              className="btn btn-primary btn-sm rounded-full gap-2">
              <ExternalLink className="w-3.5 h-3.5" /> Live 보기
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer"
              className="btn btn-outline btn-sm rounded-full gap-2">
              <Github className="w-3.5 h-3.5" /> GitHub
            </a>
          )}
          {project.pdf_url && (
            <a href={project.pdf_url} target="_blank" rel="noopener noreferrer"
              className="btn btn-ghost btn-sm rounded-full gap-2">
              <FileText className="w-3.5 h-3.5" /> PDF
            </a>
          )}
        </div>
      )}
    </div>
  );
}
