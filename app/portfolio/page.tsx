import { createClient } from '@/lib/supabase/server';
import PortfolioClient from '@/components/portfolio/PortfolioClient';

export default async function PortfolioPage() {
  const supabase = await createClient();
  
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold italic">Curated <span className="text-primary underline">Works</span></h1>
        <p className="text-base-content/70">A showcase of projects ranging from personal experiments to enterprise solutions.</p>
      </div>

      <PortfolioClient initialProjects={projects || []} />
    </div>
  );
}
