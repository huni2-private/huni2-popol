'use client';

// 자기소개서 섹션 편집 어드민
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Plus, Trash2, ArrowUp, ArrowDown, Save, FileText, ExternalLink } from 'lucide-react';

interface Section { id: string; title: string; content: string; }
interface CoverLetter { company: string; position: string; sections: Section[]; }

const empty = (): CoverLetter => ({ company: '', position: '', sections: [] });
const newSection = (): Section => ({ id: crypto.randomUUID(), title: '', content: '' });

export default function AdminCoverPage() {
  const [loading, setSaving2]  = useState(true);
  const [saving,  setSaving]   = useState(false);
  const [data,    setData]     = useState<CoverLetter>(empty());
  const [toast,   setToast]    = useState('');
  const router   = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/admin/login'); return; }
      const { data: row } = await supabase.from('site_settings').select('value').eq('key', 'cover_letter').single();
      if (row?.value) setData(row.value as CoverLetter);
      setSaving2(false);
    };
    init();
  }, [router, supabase]); // eslint-disable-line

  const save = async () => {
    setSaving(true);
    await supabase.from('site_settings').upsert({ key: 'cover_letter', value: data }, { onConflict: 'key' });
    setSaving(false);
    setToast('저장됐습니다.');
    setTimeout(() => setToast(''), 2000);
  };

  const addSection    = () => setData(d => ({ ...d, sections: [...d.sections, newSection()] }));
  const removeSection = (id: string) => setData(d => ({ ...d, sections: d.sections.filter(s => s.id !== id) }));
  const updateSection = (id: string, field: 'title' | 'content', val: string) =>
    setData(d => ({ ...d, sections: d.sections.map(s => s.id === id ? { ...s, [field]: val } : s) }));
  const moveSection = (idx: number, dir: -1 | 1) => {
    const next = [...data.sections];
    const t = idx + dir;
    if (t < 0 || t >= next.length) return;
    [next[idx], next[t]] = [next[t], next[idx]];
    setData(d => ({ ...d, sections: next }));
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      {toast && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-success text-sm">{toast}</div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" /> 자기소개서 관리
        </h1>
        <div className="flex gap-2">
          <a href="/resume/cover" target="_blank" rel="noopener noreferrer"
            className="btn btn-ghost btn-sm gap-1 rounded-full">
            <ExternalLink className="w-4 h-4" /> 미리보기
          </a>
          <button onClick={save} disabled={saving} className="btn btn-primary btn-sm rounded-full gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            저장
          </button>
        </div>
      </div>

      {/* 지원 정보 */}
      <div className="card bg-base-200 border border-base-content/5">
        <div className="card-body gap-4">
          <h2 className="font-bold text-sm opacity-50 uppercase tracking-widest">지원 정보</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label"><span className="label-text text-xs font-bold">회사명</span></label>
              <input className="input input-bordered w-full" value={data.company}
                onChange={e => setData(d => ({ ...d, company: e.target.value }))}
                placeholder="토스뱅크" />
            </div>
            <div>
              <label className="label"><span className="label-text text-xs font-bold">포지션</span></label>
              <input className="input input-bordered w-full" value={data.position}
                onChange={e => setData(d => ({ ...d, position: e.target.value }))}
                placeholder="Server Developer 인턴십" />
            </div>
          </div>
        </div>
      </div>

      {/* 섹션 목록 */}
      <div className="space-y-4">
        {data.sections.map((s, i) => (
          <div key={s.id} className="card bg-base-200 border border-base-content/5">
            <div className="card-body gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-primary/60 w-5 shrink-0">{i + 1}.</span>
                <input
                  className="input input-bordered input-sm flex-1 font-bold"
                  value={s.title}
                  onChange={e => updateSection(s.id, 'title', e.target.value)}
                  placeholder="섹션 제목 (예: 지원 동기)"
                />
                <button onClick={() => moveSection(i, -1)} disabled={i === 0}
                  className="btn btn-ghost btn-xs btn-square"><ArrowUp className="w-3 h-3" /></button>
                <button onClick={() => moveSection(i, 1)} disabled={i === data.sections.length - 1}
                  className="btn btn-ghost btn-xs btn-square"><ArrowDown className="w-3 h-3" /></button>
                <button onClick={() => removeSection(s.id)}
                  className="btn btn-ghost btn-xs btn-square text-error"><Trash2 className="w-3 h-3" /></button>
              </div>
              <textarea
                className="textarea textarea-bordered w-full text-sm leading-relaxed"
                rows={8}
                value={s.content}
                onChange={e => updateSection(s.id, 'content', e.target.value)}
                placeholder="내용을 입력하세요. 줄바꿈이 그대로 적용됩니다."
              />
            </div>
          </div>
        ))}
        <button onClick={addSection}
          className="btn btn-ghost btn-block border border-dashed border-base-content/10 rounded-2xl gap-2">
          <Plus className="w-4 h-4" /> 섹션 추가
        </button>
      </div>
    </div>
  );
}
