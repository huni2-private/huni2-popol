'use client';

import { useRef, useState, type PointerEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Layers, Code2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { projectStatusMeta } from '@/lib/projectStatus';
import styles from './HomeClient.module.css';

interface Bio { title_ko?: string; title_en?: string; desc_ko?: string; desc_en?: string; }
interface Project {
  id: string; title: string; project_key?: string; description?: string;
  resume_summary?: string; role_summary?: string; image_url?: string;
  tags?: string[]; type?: string; status?: string; featured?: boolean;
}
interface ImpactStat { id: string; project?: string; metric: string; title: string; context: string; log_slug?: string | null; }

const projectHref = (project: Project) => `/portfolio/${encodeURIComponent(project.project_key || project.id)}`;
const shortName = (project: Project) => project.project_key || project.title.split('(')[0].trim();
function excerpt(text = '', length = 180) {
  const plain = text.replace(/^#{1,6}\s.*$/gm, '').replace(/```[\s\S]*?```/g, '').replace(/[*_`>]/g, '').replace(/\s+/g, ' ').trim();
  return plain.length > length ? `${plain.slice(0, length).trim()}…` : plain;
}

function ProjectScreen({ project, hero = false }: { project: Project; hero?: boolean }) {
  const stage = useRef<HTMLDivElement>(null);
  const { lang } = useI18n();
  function tilt(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || !window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    stage.current?.style.setProperty('--tilt-x', `${-((event.clientY - rect.top) / rect.height - 0.5) * 5}deg`);
    stage.current?.style.setProperty('--tilt-y', `${((event.clientX - rect.left) / rect.width - 0.5) * 7}deg`);
  }
  function reset() {
    stage.current?.style.setProperty('--tilt-x', '0deg');
    stage.current?.style.setProperty('--tilt-y', '0deg');
  }
  return (
    <div ref={stage} className={`${styles.stage} ${hero ? styles.heroStage : ''}`} onPointerMove={tilt} onPointerLeave={reset}>
      <div className={styles.orbit} aria-hidden="true" />
      <div className={styles.backplate} aria-hidden="true" />
      <div className={styles.screen}>
        <div className={styles.browserBar} aria-hidden="true">
          <span className={styles.browserDots}><i /><i /><i /></span>
          <span>{shortName(project)}</span><ArrowUpRight size={13} />
        </div>
        <Link href={projectHref(project)} className={styles.screenImage} aria-label={`${project.title} ${lang === 'ko' ? '프로젝트 보기' : 'project details'}`}>
          {project.image_url ? (
            <Image src={project.image_url} alt={project.title} fill preload={hero} sizes="(max-width: 767px) 90vw, (max-width: 1023px) 75vw, 560px" className={styles.projectImage} />
          ) : (
            <div className={styles.imageFallback}><Layers size={48} /><strong>{shortName(project)}</strong><span>{project.tags?.slice(0, 3).join(' / ')}</span></div>
          )}
        </Link>
        <div className={styles.screenFooter}><span>{project.tags?.slice(0, 3).join(' / ')}</span><span>{lang === 'ko' ? '프로젝트 살펴보기 ↗' : 'Explore project ↗'}</span></div>
      </div>
      <div className={styles.floatingLabel} aria-hidden="true"><span className={styles.labelIcon}><Code2 size={20} /></span><div><span>{hero ? 'FEATURED WORK' : 'BUILT & SHIPPED'}</span><strong>{shortName(project)}</strong></div></div>
    </div>
  );
}

export default function HomeClient({ bio, projects, impactStats }: {
  bio: Bio; projects: Project[]; impactStats: ImpactStat[];
}) {
  const { lang } = useI18n();
  const ko = lang === 'ko';
  const featured = projects.filter(project => project.featured);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = featured[activeIndex] ?? featured[0];
  const activeKey = (active?.project_key || active?.title || '').toLowerCase();
  const stat = impactStats.find(item => item.project?.toLowerCase() === activeKey);
  const title = (ko ? bio.title_ko : bio.title_en) || (ko ? '측정하고, 개선하고, 배포하는 개발자' : 'Measure. Improve. Ship.');
  const description = (ko ? bio.desc_ko : bio.desc_en) || '';
  const intro = description.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() || excerpt(description, 150);
  const meta = active ? projectStatusMeta(active.status ?? 'archived', lang) : null;
  const goTo = (index: number) => setActiveIndex(index);

  return (
    <div className={styles.home}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}><strong>{ko ? '허창훈' : 'Changhun Heo'}</strong><span>{ko ? '백엔드 중심 풀스택 개발자' : 'Backend & Fullstack'}</span></div>
          <h1 id="home-title">{title}</h1>
          <p className={styles.intro}>{intro}</p>
          <div className={styles.actions}>
            <Link href="/portfolio" className={styles.primaryButton}>{ko ? '전체 프로젝트 보기' : 'Explore all projects'}<ArrowUpRight size={20} /></Link>
            <Link href="/resume" className={styles.secondaryButton}>{ko ? '이력서 보기' : 'View resume'}<ArrowRight size={17} /></Link>
          </div>
          <div className={styles.heroMeta}><span>Go · Kotlin · Spring Boot · MySQL · Redis</span><a href="https://github.com/huni2-private/huni2-popol" target="_blank" rel="noopener noreferrer">{ko ? '이 사이트 소스' : 'Site source'}<ArrowUpRight size={13} /></a></div>
        </div>
        {active && meta && <section id="featured-projects" className={styles.showcase} aria-label={ko ? '대표 프로젝트' : 'Featured projects'}>
          <div className={styles.showcaseHeading}><span>SELECTED WORK</span><span>{String(activeIndex + 1).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}</span></div>
          <div className={styles.projectNav} aria-label={ko ? '대표 프로젝트 선택' : 'Select a project'}>
            {featured.map((project, index) => <button key={project.id} type="button" aria-pressed={index === activeIndex} aria-controls="selected-project" onClick={() => goTo(index)}>{shortName(project)}</button>)}
          </div>
          <div id="selected-project">
            <ProjectScreen project={active} hero />
            <div className={styles.showcaseDetails}>
              <div className={styles.showcaseTitle}><h2>{active.title}</h2><span className={meta.badgeClass}>{meta.label}</span></div>
              <p className={styles.showcaseSummary}>{active.resume_summary || excerpt(active.description)}</p>
              {stat && <div className={styles.showcaseStat}><strong>{stat.metric}</strong><span>{stat.title}</span></div>}
              <Link href={projectHref(active)} className={styles.showcaseLink}>{ko ? '프로젝트 자세히 보기' : 'Read the case study'}<ArrowUpRight size={18} /></Link>
            </div>
          </div>
        </section>}
        <div className={styles.heroBottom}><span>PORTFOLIO / ENGINEERING</span><Link href="/portfolio">{ko ? `전체 ${projects.length}개 프로젝트` : `All ${projects.length} projects`}<ArrowRight size={14} /></Link></div>
      </section>

      {impactStats.length > 0 && <section className={styles.evidence} aria-label={ko ? '주요 성과' : 'Selected outcomes'}>
        {impactStats.slice(0, 3).map(item => <div key={item.id} className={styles.evidenceItem}>
          <span className={styles.statProject}>{item.project || (ko ? '주요 성과' : 'Outcome')}</span>
          <strong>{item.metric}</strong><p>{item.title}</p>
          {item.log_slug ? <Link href={`/log/${encodeURIComponent(item.log_slug)}`} className={styles.context}>{item.context}<ArrowUpRight size={14} /></Link> : <span className={styles.context}>{item.context}</span>}
        </div>)}
      </section>}

      <section className={styles.closing}>
        <div><span className={styles.kicker}>BEHIND THE WORK</span><h2>{ko ? '코드 너머의 이야기도 있습니다.' : 'There is a person behind the code.'}</h2><p>{ko ? '커리어와 기술, 문제를 마주하고 해결해 온 과정.' : 'My career, tools, and the way I approach problems.'}</p></div>
        <div className={styles.closingActions}><Link href="/about">{ko ? '어떤 개발자인지' : 'Get to know me'}<ArrowUpRight size={20} /></Link><Link href="/contact">{ko ? '함께 이야기하기' : 'Get in touch'}<ArrowUpRight size={20} /></Link></div>
      </section>
    </div>
  );
}
