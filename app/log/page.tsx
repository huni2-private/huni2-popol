import { createClient } from '@/lib/supabase/server';
import LogListClient from '@/components/log/LogListClient';

export default async function LogPage() {
  const supabase = await createClient();
  
  // DB에서 데이터 가져오기 (작성일 기준 내림차순)
  const { data: logs } = await supabase
    .from('logs')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold italic">Tech <span className="text-primary underline">Logs</span></h1>
        <p className="text-base-content/70">Insights, tutorials, and troubleshooting notes.</p>
      </div>
      
      <LogListClient initialLogs={logs || []} />
    </div>
  );
}
