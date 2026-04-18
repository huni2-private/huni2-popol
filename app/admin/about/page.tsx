'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Save, Loader2, ChevronUp, ChevronDown } from 'lucide-react';

interface Bio {
  title_ko: string; title_en: string;
  desc_ko: string;  desc_en: string;
}

interface Career {
  year: string;
  title_ko: string; title_en: string;
  company: string;
  desc_ko: string;  desc_en: string;
}

interface Stack {
  name_ko: string; name_en: string;
  icon: string;
  items: string[];
}

const ICON_OPTIONS = ['Layout', 'Server', 'Database', 'Code', 'Briefcase', 'Globe', 'Cpu', 'GitBranch'];

const defaultCareer = (): Career => ({ year: '', title_ko: '', title_en: '', company: '', desc_ko: '', desc_en: '' });
const defaultStack  = (): Stack  => ({ name_ko: '', name_en: '', icon: 'Code', items: [] });

export default function AdminAboutPage() {
  const router  = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState('');

  const [bio,    setBio]    = useState<Bio>({ title_ko: '', title_en: '', desc_ko: '', desc_en: '' });
  const [career, setCareer] = useState<Career[]>([]);
  const [stack,  setStack]  = useState<Stack[]>([]);
  const [newItem, setNewItem] = useState('');
  const [activeStack, setActiveStack] = useState<number | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/admin/login'); return; }

      const [{ data: bioData }, { data: careerData }, { data: stackData }] = await Promise.all([
        supabase.from('site_settings').select('value').eq('key', 'about_bio').single(),
        supabase.from('site_settings').select('value').eq('key', 'career_timeline').single(),
        supabase.from('site_settings').select('value').eq('key', 'tech_stack').single(),
      ]);

      if (bioData?.value)    setBio(bioData.value);
      if (careerData?.value) setCareer(careerData.value);
      if (stackData?.value)  setStack(stackData.value);
      setLoading(false);
    };
    init();
  }, []); // eslint-disable-line

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const save = async () => {
    setSaving(true);
    const ops = [
      supabase.from('site_settings').upsert({ key: 'about_bio',       value: bio }),
      supabase.from('site_settings').upsert({ key: 'career_timeline', value: career }),
      supabase.from('site_settings').upsert({ key: 'tech_stack',      value: stack }),
    ];
    const results = await Promise.all(ops);
    setSaving(false);
    if (results.some(r => r.error)) { showToast('저장 실패'); return; }
    showToast('저장됨');
  };

  const updateCareer = (i: number, field: keyof Career, val: string) =>
    setCareer(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c));

  const removeCareer = (i: number) => setCareer(prev => prev.filter((_, idx) => idx !== i));
  const moveCareer   = (i: number, dir: -1 | 1) => {
    const arr = [...career];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setCareer(arr);
  };

  const updateStack = (i: number, field: keyof Stack, val: any) =>
    setStack(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const removeStack = (i: number) => setStack(prev => prev.filter((_, idx) => idx !== i));

  const addStackItem = (si: number) => {
    if (!newItem.trim()) return;
    updateStack(si, 'items', [...stack[si].items, newItem.trim()]);
    setNewItem('');
  };

  const removeStackItem = (si: number, item: string) =>
    updateStack(si, 'items', stack[si].items.filter(x => x !== item));

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {toast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success font-bold shadow-lg">{toast}</div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="btn btn-ghost btn-sm rounded-full"><ArrowLeft className="w-4 h-4" /></Link>
          <h1 className="text-2xl font-black">About 관리</h1>
        </div>
        <button onClick={save} disabled={saving} className="btn btn-primary rounded-2xl gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          저장
        </button>
      </div>

      {/* Bio */}
      <section className="card bg-base-200 border border-base-content/5">
        <div className="card-body gap-4">
          <h2 className="card-title text-lg">소개 문구</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text">타이틀 (한국어)</span></label>
              <input className="input input-bordered bg-base-100" value={bio.title_ko} onChange={e => setBio(p => ({ ...p, title_ko: e.target.value }))} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Title (English)</span></label>
              <input className="input input-bordered bg-base-100" value={bio.title_en} onChange={e => setBio(p => ({ ...p, title_en: e.target.value }))} />
            </div>
            <div className="form-control md:col-span-2">
              <label className="label"><span className="label-text">소개 (한국어)</span></label>
              <textarea className="textarea textarea-bordered h-24 bg-base-100" value={bio.desc_ko} onChange={e => setBio(p => ({ ...p, desc_ko: e.target.value }))} />
            </div>
            <div className="form-control md:col-span-2">
              <label className="label"><span className="label-text">Description (English)</span></label>
              <textarea className="textarea textarea-bordered h-24 bg-base-100" value={bio.desc_en} onChange={e => setBio(p => ({ ...p, desc_en: e.target.value }))} />
            </div>
          </div>
        </div>
      </section>

      {/* Career Timeline */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-bold">커리어 타임라인</h2>
          <button onClick={() => setCareer(p => [...p, defaultCareer()])} className="btn btn-sm btn-outline rounded-full gap-1">
            <Plus className="w-4 h-4" /> 추가
          </button>
        </div>

        {career.map((c, i) => (
          <div key={i} className="card bg-base-200 border border-base-content/5">
            <div className="card-body gap-4 p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-primary opacity-60">#{i + 1}</span>
                <div className="flex gap-1">
                  <button onClick={() => moveCareer(i, -1)} className="btn btn-ghost btn-xs"><ChevronUp className="w-3 h-3" /></button>
                  <button onClick={() => moveCareer(i, 1)}  className="btn btn-ghost btn-xs"><ChevronDown className="w-3 h-3" /></button>
                  <button onClick={() => removeCareer(i)} className="btn btn-ghost btn-xs text-error"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label"><span className="label-text">기간</span></label>
                  <input placeholder="2024 - Present" className="input input-bordered input-sm bg-base-100" value={c.year} onChange={e => updateCareer(i, 'year', e.target.value)} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">회사</span></label>
                  <input placeholder="Company Name" className="input input-bordered input-sm bg-base-100" value={c.company} onChange={e => updateCareer(i, 'company', e.target.value)} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">직책 (한국어)</span></label>
                  <input className="input input-bordered input-sm bg-base-100" value={c.title_ko} onChange={e => updateCareer(i, 'title_ko', e.target.value)} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Title (English)</span></label>
                  <input className="input input-bordered input-sm bg-base-100" value={c.title_en} onChange={e => updateCareer(i, 'title_en', e.target.value)} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">설명 (한국어)</span></label>
                  <textarea className="textarea textarea-bordered textarea-sm h-16 bg-base-100" value={c.desc_ko} onChange={e => updateCareer(i, 'desc_ko', e.target.value)} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Description (English)</span></label>
                  <textarea className="textarea textarea-bordered textarea-sm h-16 bg-base-100" value={c.desc_en} onChange={e => updateCareer(i, 'desc_en', e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        ))}

        {career.length === 0 && (
          <div className="card bg-base-200 border-2 border-dashed border-base-content/10">
            <div className="card-body items-center py-10 text-center gap-2">
              <p className="text-sm opacity-40">커리어 항목이 없습니다.</p>
            </div>
          </div>
        )}
      </section>

      {/* Tech Stack */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-bold">기술 스택</h2>
          <button onClick={() => setStack(p => [...p, defaultStack()])} className="btn btn-sm btn-outline rounded-full gap-1">
            <Plus className="w-4 h-4" /> 카테고리 추가
          </button>
        </div>

        {stack.map((s, si) => (
          <div key={si} className="card bg-base-200 border border-base-content/5">
            <div className="card-body gap-4 p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-secondary opacity-60">#{si + 1}</span>
                <button onClick={() => removeStack(si)} className="btn btn-ghost btn-xs text-error"><Trash2 className="w-3 h-3" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="form-control">
                  <label className="label"><span className="label-text">카테고리명 (한국어)</span></label>
                  <input className="input input-bordered input-sm bg-base-100" value={s.name_ko} onChange={e => updateStack(si, 'name_ko', e.target.value)} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Name (English)</span></label>
                  <input className="input input-bordered input-sm bg-base-100" value={s.name_en} onChange={e => updateStack(si, 'name_en', e.target.value)} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">아이콘</span></label>
                  <select className="select select-bordered select-sm bg-base-100" value={s.icon} onChange={e => updateStack(si, 'icon', e.target.value)}>
                    {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="label"><span className="label-text text-sm">기술 목록</span></label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {s.items.map(item => (
                    <span key={item} className="badge badge-ghost border-base-content/10 gap-1 py-3">
                      {item}
                      <button onClick={() => removeStackItem(si, item)} className="opacity-50 hover:opacity-100 hover:text-error transition-colors">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    placeholder="React, TypeScript..."
                    className="input input-bordered input-sm bg-base-100 flex-1"
                    value={activeStack === si ? newItem : ''}
                    onFocus={() => setActiveStack(si)}
                    onChange={e => setNewItem(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addStackItem(si); } }}
                  />
                  <button onClick={() => addStackItem(si)} className="btn btn-sm btn-outline rounded-xl gap-1">
                    <Plus className="w-3 h-3" /> 추가
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {stack.length === 0 && (
          <div className="card bg-base-200 border-2 border-dashed border-base-content/10">
            <div className="card-body items-center py-10 text-center gap-2">
              <p className="text-sm opacity-40">기술 스택 카테고리가 없습니다.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
