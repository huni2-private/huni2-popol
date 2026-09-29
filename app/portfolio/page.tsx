import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import PortfolioClient from '@/components/portfolio/PortfolioClient';

export const metadata: Metadata = {
  title: 'Portfolio | HUNI²',
  description: '직접 만들고 운영한 실무·사이드 프로젝트 모음.',
};

export default async function PortfolioPage() {
  const supabase = await createClient();
  
  const [{ data: projects }, { data: impactData }, { data: logRows }] = await Promise.all([
    supabase.from('projects').select('*').order('display_order', { ascending: true }),
    supabase.from('site_settings').select('value').eq('key', 'impact_stats').single(),
    supabase.from('logs').select('title, slug, project, created_at').eq('published', true).order('created_at', { ascending: false }),
  ]);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <PortfolioClient
        initialProjects={projects ?? []}
        impactStats={Array.isArray(impactData?.value) ? impactData.value : []}
        logs={logRows ?? []}
      />
    </div>
  );
}
