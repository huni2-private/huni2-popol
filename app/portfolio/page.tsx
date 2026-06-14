import { createClient } from '@/lib/supabase/server';
import PortfolioClient from '@/components/portfolio/PortfolioClient';

export default async function PortfolioPage() {
  const supabase = await createClient();
  
  const [{ data: projects }, { data: impactData }] = await Promise.all([
    supabase.from('projects').select('*').order('created_at', { ascending: false }),
    supabase.from('site_settings').select('value').eq('key', 'impact_stats').single(),
  ]);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold italic">직접 만들고 <span className="text-primary underline">운영한 것들</span></h1>
        <p className="text-base-content/70">실무와 사이드 프로젝트, 지금도 살아있는 프로덕트들.</p>
      </div>

      <PortfolioClient
        initialProjects={projects ?? []}
        impactStats={Array.isArray(impactData?.value) ? impactData.value : []}
      />
    </div>
  );
}
