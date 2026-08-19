'use client';

// 자기소개서 관리 어드민 — 다중 회사 편집 + 활성/비활성 설정
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Loader2, Plus, Trash2, ArrowUp, ArrowDown,
  Save, FileText, ExternalLink, CheckCircle2, Eye, EyeOff, Building2, Star
} from 'lucide-react';

interface Section     { id: string; title: string; content: string; }
interface CoverLetter { id: string; company: string; position: string; sections: Section[]; isGeneral?: boolean; }
interface CoverMeta   { active_id: string | null; enabled: boolean; }

const newLetter  = (): CoverLetter => ({ id: crypto.randomUUID(), company: '', position: '', sections: [], isGeneral: false });
const newSection = (): Section     => ({ id: crypto.randomUUID(), title: '', content: '' });

export default function AdminCoverPage() {
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [letters,    setLetters]    = useState<CoverLetter[]>([]);
  const [meta,       setMeta]       = useState<CoverMeta>({ active_id: null, enabled: false });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast,      setToast]      = useState('');
  const router   = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/admin/login'); return; }

      const [{ data: lData }, { data: mData }] = await Promise.all([
        supabase.from('site_settings').select('value').eq('key', 'cover_letters').single(),
        supabase.from('site_settings').select('value').eq('key', 'cover_letter_meta').single(),
      ]);

      const ls: CoverLetter[] = Array.isArray(lData?.value) ? lData.value : [];
      const m: CoverMeta  = (mData?.value as CoverMeta) ?? { active_id: null, enabled: false };
      setLetters(ls);
      setMeta(m);
      setSelectedId(ls[0]?.id ?? null);
      setLoading(false);
    };
    init();
  }, [router, supabase]); // eslint-disable-line

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const save = async () => {
    setSaving(true);
    await Promise.all([
      supabase.from('site_settings').upsert({ key: 'cover_letters',    value: letters }, { onConflict: 'key' }),
      supabase.from('site_settings').upsert({ key: 'cover_letter_meta', value: meta   }, { onConflict: 'key' }),
    ]);
    setSaving(false);
    showToast('저장됐습니다.');
  };

  /* ── 회사 조작 ── */
  const addLetter = () => {
    const l = newLetter();
    setLetters(ls => [...ls, l]);
    setSelectedId(l.id);
  };

  const deleteLetter = (id: string) => {
    setLetters(ls => {
      const next = ls.filter(l => l.id !== id);
      if (selectedId === id) setSelectedId(next[0]?.id ?? null);
      return next;
    });
    setMeta(m => ({ ...m, active_id: m.active_id === id ? null : m.active_id }));
  };

  const updateLetter = useCallback((id: string, field: 'company' | 'position', val: string) => {
    setLetters(ls => ls.map(l => l.id === id ? { ...l, [field]: val } : l));
  }, []);

  const setGeneral = (id: string) => {
    setLetters(ls => ls.map(l => ({ ...l, isGeneral: l.id === id ? !l.isGeneral : false })));
  };

  /* ── 섹션 조작 ── */
  const cur = letters.find(l => l.id === selectedId) ?? null;

  const updateCur = (fn: (l: CoverLetter) => CoverLetter) =>
    setLetters(ls => ls.map(l => l.id === selectedId ? fn(l) : l));

  const addSection    = () => updateCur(l => ({ ...l, sections: [...l.sections, newSection()] }));
  const removeSection = (sid: string) => updateCur(l => ({ ...l, sections: l.sections.filter(s => s.id !== sid) }));
  const updateSection = (sid: string, field: 'title' | 'content', val: string) =>
    updateCur(l => ({ ...l, sections: l.sections.map(s => s.id === sid ? { ...s, [field]: val } : s) }));
  const moveSection   = (idx: number, dir: -1 | 1) => updateCur(l => {
    const next = [...l.sections];
    const t = idx + dir;
    if (t < 0 || t >= next.length) return l;
    [next[idx], next[t]] = [next[t], next[idx]];
    return { ...l, sections: next };
  });

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {toast && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-success text-sm">{toast}</div>
        </div>
      )}

      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" /> 자기소개서 관리
        </h1>
        <div className="flex gap-2 items-center">
          {/* 공개 ON/OFF */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            {meta.enabled
              ? <Eye className="w-4 h-4 text-success" />
              : <EyeOff className="w-4 h-4 text-base-content/30" />}
            <span className="text-sm font-semibold">이력서에 표시</span>
            <input type="checkbox" className="toggle toggle-success toggle-sm"
              checked={meta.enabled}
              onChange={e => setMeta(m => ({ ...m, enabled: e.target.checked }))} />
          </label>
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

      <div className="grid grid-cols-[220px_1fr] gap-6 items-start">

        {/* 회사 목록 사이드바 */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest opacity-50 px-1">지원 회사 목록</h2>
          {letters.map(l => (
            <div
              key={l.id}
              className={`flex items-center gap-2 p-2.5 rounded-2xl cursor-pointer transition-all group ${
                selectedId === l.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-base-200'
              }`}
              onClick={() => setSelectedId(l.id)}
            >
              <Building2 className={`w-4 h-4 shrink-0 ${selectedId === l.id ? 'text-primary' : 'opacity-30'}`} />
              <span className="flex-1 text-sm font-semibold truncate">
                {l.company || <span className="opacity-30 italic">이름 없음</span>}
              </span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* 범용 자소서 지정 버튼 */}
                <button
                  title="항상 보여줄 범용 자기소개서로 지정"
                  onClick={e => { e.stopPropagation(); setGeneral(l.id); }}
                  className={`btn btn-ghost btn-xs btn-square ${l.isGeneral ? 'text-warning' : ''}`}
                >
                  <Star className="w-3.5 h-3.5" />
                </button>
                {/* 활성화 버튼 */}
                <button
                  title="이력서에 첨부할 자기소개서로 설정"
                  onClick={e => { e.stopPropagation(); setMeta(m => ({ ...m, active_id: l.id })); }}
                  className={`btn btn-ghost btn-xs btn-square ${meta.active_id === l.id ? 'text-success' : ''}`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); deleteLetter(l.id); }}
                  className="btn btn-ghost btn-xs btn-square text-error"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              {l.isGeneral && (
                <span className="badge badge-warning badge-xs font-bold shrink-0">범용</span>
              )}
              {meta.active_id === l.id && (
                <span className="badge badge-success badge-xs font-bold shrink-0">활성</span>
              )}
            </div>
          ))}
          <button onClick={addLetter}
            className="btn btn-ghost btn-sm btn-block border border-dashed border-base-content/10 rounded-2xl gap-1 mt-1">
            <Plus className="w-4 h-4" /> 회사 추가
          </button>
        </div>

        {/* 편집 영역 */}
        {cur ? (
          <div className="space-y-4">
            {/* 지원 정보 */}
            <div className="card bg-base-200 border border-base-content/5">
              <div className="card-body gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label pb-1"><span className="label-text text-xs font-bold">회사명</span></label>
                    <input className="input input-bordered w-full" value={cur.company}
                      onChange={e => updateLetter(cur.id, 'company', e.target.value)}
                      placeholder="토스뱅크" />
                  </div>
                  <div>
                    <label className="label pb-1"><span className="label-text text-xs font-bold">포지션</span></label>
                    <input className="input input-bordered w-full" value={cur.position}
                      onChange={e => updateLetter(cur.id, 'position', e.target.value)}
                      placeholder="Server Developer 인턴십" />
                  </div>
                </div>
              </div>
            </div>

            {/* 섹션 목록 */}
            {cur.sections.map((s, i) => (
              <div key={s.id} className="card bg-base-200 border border-base-content/5">
                <div className="card-body gap-3 py-4">
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
                    <button onClick={() => moveSection(i, 1)} disabled={i === cur.sections.length - 1}
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
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-base-content/30">
            <Building2 className="w-12 h-12 mb-4" />
            <p className="text-sm">왼쪽에서 회사를 선택하거나 추가하세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
