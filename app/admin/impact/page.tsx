'use client';

// 홈 화면 임팩트 수치 관리 — site_settings JSONB 기반 CRUD
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Pencil, Trash2, Save, X, Loader2, Zap } from 'lucide-react';

interface ImpactStat {
  id: string;
  metric: string;
  title: string;
  context: string;
}

const EMPTY: Omit<ImpactStat, 'id'> = { metric: '', title: '', context: '' };

export default function AdminImpactPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState<ImpactStat[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/admin/login'); return; }
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'impact_stats').single();
      setStats(Array.isArray(data?.value) ? data.value : []);
      setLoading(false);
    };
    init();
  }, []); // eslint-disable-line

  const persist = async (next: ImpactStat[]) => {
    setSaving(true);
    const { error } = await supabase.from('site_settings').upsert({ key: 'impact_stats', value: next });
    setSaving(false);
    if (error) { showToast('저장 실패: ' + error.message); return false; }
    setStats(next);
    showToast('저장됨');
    return true;
  };

  const handleSave = async () => {
    if (!form.metric.trim() || !form.title.trim()) { showToast('수치와 제목은 필수입니다.'); return; }
    const next = editId
      ? stats.map(s => s.id === editId ? { ...form, id: editId } : s)
      : [...stats, { ...form, id: Date.now().toString(36) }];
    if (await persist(next)) { setOpen(false); setForm({ ...EMPTY }); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return;
    await persist(stats.filter(s => s.id !== id));
  };

  const openCreate = () => { setEditId(null); setForm({ ...EMPTY }); setOpen(true); };
  const openEdit = (s: ImpactStat) => { setEditId(s.id); setForm({ metric: s.metric, title: s.title, context: s.context }); setOpen(true); };
  const field = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {toast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success font-bold shadow-lg text-sm">{toast}</div>
        </div>
      )}

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
                  <span className="text-4xl font-black font-mono text-warning leading-none">{stat.metric}</span>
                  <div className="flex gap-1 shrink-0 ml-2">
                    <button onClick={() => openEdit(stat)} className="btn btn-ghost btn-xs"><Pencil className="w-3 h-3" /></button>
                    <button onClick={() => handleDelete(stat.id)} className="btn btn-ghost btn-xs text-error"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
                <p className="font-bold text-sm">{stat.title}</p>
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
          <div className="modal-box max-w-md rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{editId ? '수치 편집' : '새 임팩트 수치'}</h3>
              <button onClick={() => setOpen(false)} className="btn btn-ghost btn-circle btn-sm"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">수치 *</span>
                  <span className="label-text-alt opacity-40">예: 80%, 5s→1s, 95+</span>
                </label>
                <input type="text" placeholder="80%" className="input input-bordered bg-base-200 font-mono font-bold text-xl" value={form.metric} onChange={field('metric')} />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-bold">제목 *</span></label>
                <input type="text" placeholder="로딩 속도 단축" className="input input-bordered bg-base-200" value={form.title} onChange={field('title')} />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">컨텍스트</span>
                  <span className="label-text-alt opacity-40">프로젝트명 · 상세 수치</span>
                </label>
                <input type="text" placeholder="SK-hynix MAPS 23만건 5s→1s" className="input input-bordered bg-base-200 font-mono text-sm" value={form.context} onChange={field('context')} />
              </div>

              <div className="bg-base-300 rounded-2xl p-4 space-y-1">
                <p className="text-xs text-base-content/40 mb-2">미리보기</p>
                <p className="text-3xl font-black font-mono text-warning">{form.metric || '–'}</p>
                <p className="font-bold text-sm">{form.title || '제목'}</p>
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
