'use client';

// 홈 화면 임팩트 수치 관리 — site_settings JSONB 기반 CRUD
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Pencil, Trash2, Save, X, Loader2, Zap } from 'lucide-react';
import { AdminToast, useAdminToast } from '@/components/admin/AdminToast';

interface ImpactStat {
  id: string;
  project?: string;
  metric: string;
  title: string;
  before?: string;
  after?: string;
  context: string;
  log_slug?: string;
}

const EMPTY: Omit<ImpactStat, 'id'> = { project: '', metric: '', title: '', before: '', after: '', context: '', log_slug: '' };

export default function AdminImpactPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState<ImpactStat[]>([]);
  const [projectKeys, setProjectKeys] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const { toast, showToast } = useAdminToast();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/admin/login'); return; }
      const [{ data }, { data: projects }] = await Promise.all([
        supabase.from('site_settings').select('value').eq('key', 'impact_stats').single(),
        supabase.from('projects').select('title, project_key'),
      ]);
      setStats(Array.isArray(data?.value) ? data.value : []);
      setProjectKeys((projects ?? []).map(p => p.project_key || p.title).filter(Boolean));
      setLoading(false);
    };
    init();
  }, []); // eslint-disable-line

  const persist = async (next: ImpactStat[]) => {
    setSaving(true);
    const { error } = await supabase.from('site_settings').upsert({ key: 'impact_stats', value: next });
    setSaving(false);
    if (error) { showToast('저장 실패: ' + error.message, 'error'); return false; }
    setStats(next);
    showToast('저장됨');
    return true;
  };

  const handleSave = async () => {
    if (!form.metric.trim() || !form.title.trim()) { showToast('수치와 제목은 필수입니다.', 'error'); return; }
    const next = editId
      ? stats.map(s => s.id === editId ? { ...form, id: editId } : s)
      : [...stats, { ...form, id: Date.now().toString(36) }];
    if (await persist(next)) { setOpen(false); setForm({ ...EMPTY }); }
  };

  const handleDelete = async (id: string) => {
    await persist(stats.filter(s => s.id !== id));
    showToast('삭제됨');
  };

  const openCreate = () => { setEditId(null); setForm({ ...EMPTY }); setOpen(true); };
  const openEdit = (s: ImpactStat) => {
    setEditId(s.id);
    setForm({ project: s.project ?? '', metric: s.metric, title: s.title, before: s.before ?? '', after: s.after ?? '', context: s.context, log_slug: s.log_slug ?? '' });
    setOpen(true);
  };
  const field = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <AdminToast toast={toast} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="btn btn-ghost btn-sm rounded-full"><ArrowLeft className="w-4 h-4" /></Link>
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Zap className="w-6 h-6 text-warning" /> Impact 수치 관리
            </h1>
            <p className="text-xs opacity-40 mt-0.5">홈 화면에 표시할 성과 지표를 관리합니다.</p>
          </div>
        </div>
        <button onClick={openCreate} className="btn btn-primary rounded-2xl gap-2">
          <Plus className="w-4 h-4" /> 추가
        </button>
      </div>

      {stats.length === 0 ? (
        <div className="card bg-base-200 border-2 border-dashed border-base-content/10">
          <div className="card-body items-center text-center py-20 gap-4">
            <Zap className="w-12 h-12 opacity-20" />
            <p className="opacity-40 italic text-sm">아직 등록된 임팩트 수치가 없습니다.</p>
            <button onClick={openCreate} className="btn btn-primary btn-sm rounded-full gap-1">
              <Plus className="w-4 h-4" /> 첫 항목 추가
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map(stat => (
            <div key={stat.id} className="card bg-base-200 border border-base-content/5 hover:border-primary/20 transition-all">
              <div className="card-body p-6 gap-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    {stat.project && (
                      <span className="badge badge-xs badge-outline font-bold mb-1">{stat.project}</span>
                    )}
                    <span className="block text-3xl font-black font-mono text-warning leading-none">{stat.metric}</span>
                  </div>
                  <div className="flex gap-1 shrink-0 ml-2">
                    <button onClick={() => openEdit(stat)} className="btn btn-ghost btn-xs"><Pencil className="w-3 h-3" /></button>
                    <button onClick={() => handleDelete(stat.id)} className="btn btn-ghost btn-xs text-error"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
                <p className="font-bold text-sm">{stat.title}</p>
                {(stat.before || stat.after) && (
                  <div className="flex items-center gap-1 text-xs font-mono">
                    {stat.before && <span className="opacity-40 line-through">{stat.before}</span>}
                    {stat.before && stat.after && <span className="opacity-30">→</span>}
                    {stat.after && <span className="text-success font-bold">{stat.after}</span>}
                  </div>
                )}
                {stat.context && <p className="text-xs text-base-content/40 font-mono">{stat.context}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 rounded-2xl bg-base-200/50 border border-base-content/5">
        <p className="text-xs text-base-content/40">
          홈 화면 Impact 카드에 첫 번째 항목이 표시됩니다. 카드 클릭 시 전체 목록이 인라인으로 펼쳐집니다.
        </p>
      </div>

      {/* Modal */}
      {open && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{editId ? '수치 편집' : '새 임팩트 수치'}</h3>
              <button onClick={() => setOpen(false)} className="btn btn-ghost btn-circle btn-sm"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">프로젝트</span>
                  <span className="label-text-alt opacity-40">없으면 비워두기</span>
                </label>
                <input
                  type="text"
                  list="projects-list"
                  placeholder="RoundWait, Timeslot, ..."
                  className="input input-bordered bg-base-200"
                  value={form.project}
                  onChange={field('project')}
                />
                <datalist id="projects-list">
                  {projectKeys.map(p => <option key={p} value={p} />)}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold">수치 *</span>
                    <span className="label-text-alt opacity-40">99.94%, 5×, 즉시</span>
                  </label>
                  <input type="text" placeholder="99.94%" className="input input-bordered bg-base-200 font-mono font-bold text-xl" value={form.metric} onChange={field('metric')} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">제목 *</span></label>
                  <input type="text" placeholder="예약 성공률" className="input input-bordered bg-base-200" value={form.title} onChange={field('title')} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold">Before</span>
                    <span className="label-text-alt opacity-40">변경 전</span>
                  </label>
                  <input type="text" placeholder="수동 전달 5~10분" className="input input-bordered input-sm bg-base-200" value={form.before} onChange={field('before')} />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold">After</span>
                    <span className="label-text-alt opacity-40">변경 후</span>
                  </label>
                  <input type="text" placeholder="자동 발송, 지연 0" className="input input-bordered input-sm bg-base-200 text-success" value={form.after} onChange={field('after')} />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">컨텍스트</span>
                  <span className="label-text-alt opacity-40">상세 배경</span>
                </label>
                <input type="text" placeholder="k6 Cloud Run 부하 테스트" className="input input-bordered bg-base-200 font-mono text-sm" value={form.context} onChange={field('context')} />
              </div>

              <div className="bg-base-300 rounded-2xl p-4 space-y-1.5">
                <p className="text-xs text-base-content/40 mb-1">미리보기</p>
                {form.project && <span className="badge badge-xs badge-outline">{form.project}</span>}
                <p className="text-3xl font-black font-mono text-warning">{form.metric || '–'}</p>
                <p className="font-bold text-sm">{form.title || '제목'}</p>
                {(form.before || form.after) && (
                  <div className="flex items-center gap-1 text-xs font-mono">
                    {form.before && <span className="opacity-40 line-through">{form.before}</span>}
                    {form.before && form.after && <span className="opacity-30">→</span>}
                    {form.after && <span className="text-success font-bold">{form.after}</span>}
                  </div>
                )}
                {form.context && <p className="text-xs text-base-content/40 font-mono">{form.context}</p>}
              </div>
            </div>

            <div className="modal-action mt-6">
              <button onClick={() => setOpen(false)} className="btn btn-ghost rounded-2xl">취소</button>
              <button onClick={handleSave} disabled={saving} className="btn btn-primary rounded-2xl px-8">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                저장
              </button>
            </div>
          </div>
          <div className="modal-backdrop bg-base-300/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
