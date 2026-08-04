'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Save, Loader2, ChevronUp, ChevronDown, Upload } from 'lucide-react';
import { AdminToast, useAdminToast } from '@/components/admin/AdminToast';

interface Bio {
  title_ko: string; title_en: string;
  desc_ko: string;  desc_en: string;
  photo_url: string;
}

interface Career {
  year: string;
  title_ko: string; title_en: string;
  company: string; department: string; logo_url: string;
  company_desc_ko: string; company_desc_en: string;
  desc_ko: string;  desc_en: string;
  status_ko: string; status_en: string;
  project_keys: string[];
}

interface Stack {
  name_ko: string; name_en: string;
  icon: string;
  items: string[];
}

const ICON_OPTIONS = ['Layout', 'Server', 'Database', 'Code', 'Briefcase', 'Globe', 'Cpu', 'GitBranch'];

const defaultCareer = (): Career => ({
  year: '', title_ko: '', title_en: '',
  company: '', department: '', logo_url: '',
  company_desc_ko: '', company_desc_en: '',
  desc_ko: '', desc_en: '',
  status_ko: '', status_en: '',
  project_keys: [],
});
const defaultStack  = (): Stack  => ({ name_ko: '', name_en: '', icon: 'Code', items: [] });

interface Education {
  year: string;
  institution: string;
  title: string;
  desc?: string;
}
const defaultEducation = (): Education => ({ year: '', institution: '', title: '', desc: '' });

export default function AdminAboutPage() {
  const router  = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const { toast, showToast } = useAdminToast();

  const [bio,    setBio]    = useState<Bio>({ title_ko: '', title_en: '', desc_ko: '', desc_en: '', photo_url: '' });
  const [career, setCareer] = useState<Career[]>([]);
  const [stack,  setStack]  = useState<Stack[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [newItem, setNewItem] = useState('');
  const [activeStack, setActiveStack] = useState<number | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState<number | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [projectKeys, setProjectKeys] = useState<string[]>([]);
  const [newProjectKey, setNewProjectKey] = useState('');
  const [activeCareerProject, setActiveCareerProject] = useState<number | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/admin/login'); return; }

      const [{ data: bioData }, { data: careerData }, { data: stackData }, { data: educationData }, { data: projectsData }] = await Promise.all([
        supabase.from('site_settings').select('value').eq('key', 'about_bio').single(),
        supabase.from('site_settings').select('value').eq('key', 'career_timeline').single(),
        supabase.from('site_settings').select('value').eq('key', 'tech_stack').single(),
        supabase.from('site_settings').select('value').eq('key', 'education').single(),
        supabase.from('projects').select('title, project_key'),
      ]);

      setProjectKeys((projectsData ?? []).map(p => p.project_key || p.title).filter(Boolean));
      if (bioData?.value)       setBio(p => ({ ...p, ...bioData.value }));
      if (careerData?.value)    setCareer((careerData.value as Career[]).map(c => ({ ...defaultCareer(), ...c })));
      if (stackData?.value)     setStack(stackData.value);
      if (educationData?.value) setEducation(educationData.value);
      setLoading(false);
    };
    init();
  }, []); // eslint-disable-line

  const save = async () => {
    setSaving(true);
    const ops = [
      supabase.from('site_settings').upsert({ key: 'about_bio',       value: bio }),
      supabase.from('site_settings').upsert({ key: 'career_timeline', value: career }),
      supabase.from('site_settings').upsert({ key: 'tech_stack',      value: stack }),
      supabase.from('site_settings').upsert({ key: 'education',       value: education }),
    ];
    const results = await Promise.all(ops);
    setSaving(false);
    if (results.some(r => r.error)) { showToast('저장 실패', 'error'); return; }
    showToast('저장됨');
  };

  const updateCareer = (i: number, field: keyof Career, val: string) =>
    setCareer(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c));

  const handleLogoUpload = async (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(i);
    const ext  = file.name.split('.').pop();
    const path = `career/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from('portfolio').upload(path, file, { upsert: true });
    if (error) { showToast('업로드 실패: ' + error.message, 'error'); setUploadingLogo(null); return; }

    const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(path);
    updateCareer(i, 'logo_url', publicUrl);
    setUploadingLogo(null);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    const ext  = file.name.split('.').pop();
    const path = `profile/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from('portfolio').upload(path, file, { upsert: true });
    if (error) { showToast('업로드 실패: ' + error.message, 'error'); setUploadingPhoto(false); return; }

    const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(path);
    setBio(p => ({ ...p, photo_url: publicUrl }));
    setUploadingPhoto(false);
  };

  const addCareerProject = (i: number) => {
    const key = newProjectKey.trim();
    if (!key || career[i].project_keys.includes(key)) return;
    setCareer(prev => prev.map((c, idx) => idx === i ? { ...c, project_keys: [...c.project_keys, key] } : c));
    setNewProjectKey('');
  };

  const removeCareerProject = (i: number, key: string) =>
    setCareer(prev => prev.map((c, idx) => idx === i ? { ...c, project_keys: c.project_keys.filter(k => k !== key) } : c));

  const removeCareer = (i: number) => setCareer(prev => prev.filter((_, idx) => idx !== i));
  const moveCareer   = (i: number, dir: -1 | 1) => {
    const arr = [...career];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setCareer(arr);
  };

  const updateStack = (i: number, field: keyof Stack, val: Stack[keyof Stack]) =>
    setStack(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const removeStack = (i: number) => setStack(prev => prev.filter((_, idx) => idx !== i));

  const addStackItem = (si: number) => {
    if (!newItem.trim()) return;
    updateStack(si, 'items', [...stack[si].items, newItem.trim()]);
    setNewItem('');
  };

  const removeStackItem = (si: number, item: string) =>
    updateStack(si, 'items', stack[si].items.filter(x => x !== item));

  const updateEducation = (i: number, field: keyof Education, val: string) =>
    setEducation(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: val } : e));

  const removeEducation = (i: number) => setEducation(prev => prev.filter((_, idx) => idx !== i));
  const moveEducation   = (i: number, dir: -1 | 1) => {
    const arr = [...education];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setEducation(arr);
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <AdminToast toast={toast} />

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
          <div className="flex items-center gap-3">
            {bio.photo_url
              ? <img src={bio.photo_url} alt="" className="w-16 h-16 rounded-xl object-cover border border-base-content/10" />
              : <div className="w-16 h-16 rounded-xl bg-base-300 shrink-0" />}
            <label className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed border-base-content/20 hover:border-primary/50 cursor-pointer transition-all text-sm ${uploadingPhoto ? 'opacity-50 pointer-events-none' : ''}`}>
              {uploadingPhoto ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-base-content/40" />}
              {uploadingPhoto ? '업로드 중...' : '프로필 사진 업로드'}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </div>
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
              <div className="flex items-center gap-3">
                {c.logo_url
                  ? <img src={c.logo_url} alt="" className="w-12 h-12 rounded-lg object-contain bg-base-100 border border-base-content/10" />
                  : <div className="w-12 h-12 rounded-lg bg-base-300 shrink-0" />}
                <label className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed border-base-content/20 hover:border-primary/50 cursor-pointer transition-all text-sm ${uploadingLogo === i ? 'opacity-50 pointer-events-none' : ''}`}>
                  {uploadingLogo === i ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-base-content/40" />}
                  {uploadingLogo === i ? '업로드 중...' : '기업 로고 업로드'}
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleLogoUpload(i, e)} />
                </label>
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
                  <label className="label"><span className="label-text">부서명</span></label>
                  <input placeholder="개발팀" className="input input-bordered input-sm bg-base-100" value={c.department} onChange={e => updateCareer(i, 'department', e.target.value)} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">직책</span></label>
                  <input className="input input-bordered input-sm bg-base-100" value={c.title_ko} onChange={e => updateCareer(i, 'title_ko', e.target.value)} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Title (English)</span></label>
                  <input className="input input-bordered input-sm bg-base-100" value={c.title_en} onChange={e => updateCareer(i, 'title_en', e.target.value)} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">상태 배지 (한국어, 선택)</span></label>
                  <input placeholder="재직중, 팀 개발 등" className="input input-bordered input-sm bg-base-100" value={c.status_ko} onChange={e => updateCareer(i, 'status_ko', e.target.value)} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Status Badge (English, optional)</span></label>
                  <input className="input input-bordered input-sm bg-base-100" value={c.status_en} onChange={e => updateCareer(i, 'status_en', e.target.value)} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">회사 소개 (한국어)</span></label>
                  <textarea placeholder="어떤 회사인지 간단히" className="textarea textarea-bordered textarea-sm h-16 bg-base-100" value={c.company_desc_ko} onChange={e => updateCareer(i, 'company_desc_ko', e.target.value)} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Company Description (English)</span></label>
                  <textarea className="textarea textarea-bordered textarea-sm h-16 bg-base-100" value={c.company_desc_en} onChange={e => updateCareer(i, 'company_desc_en', e.target.value)} />
                </div>
                <div className="form-control md:col-span-2">
                  <label className="label"><span className="label-text">역할 및 기여 (한국어)</span></label>
                  <textarea placeholder="맡은 프로젝트와 구체적으로 기여한 부분" className="textarea textarea-bordered textarea-sm h-24 bg-base-100" value={c.desc_ko} onChange={e => updateCareer(i, 'desc_ko', e.target.value)} />
                </div>
                <div className="form-control md:col-span-2">
                  <label className="label"><span className="label-text">Role & Contribution (English)</span></label>
                  <textarea className="textarea textarea-bordered textarea-sm h-24 bg-base-100" value={c.desc_en} onChange={e => updateCareer(i, 'desc_en', e.target.value)} />
                </div>
              </div>

              <div>
                <label className="label"><span className="label-text text-sm">연동 포트폴리오 프로젝트</span></label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {c.project_keys.map(key => (
                    <span key={key} className="badge badge-ghost border-base-content/10 gap-1 py-3">
                      {key}
                      <button onClick={() => removeCareerProject(i, key)} className="opacity-50 hover:opacity-100 hover:text-error transition-colors">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    list="career-project-keys"
                    placeholder="포트폴리오에 등록된 프로젝트명"
                    className="input input-bordered input-sm bg-base-100 flex-1"
                    value={activeCareerProject === i ? newProjectKey : ''}
                    onFocus={() => setActiveCareerProject(i)}
                    onChange={e => setNewProjectKey(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCareerProject(i); } }}
                  />
                  <button onClick={() => addCareerProject(i)} className="btn btn-sm btn-outline rounded-xl gap-1">
                    <Plus className="w-3 h-3" /> 연결
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <datalist id="career-project-keys">
          {projectKeys.map(p => <option key={p} value={p} />)}
        </datalist>

        {career.length === 0 && (
          <div className="card bg-base-200 border-2 border-dashed border-base-content/10">
            <div className="card-body items-center py-10 text-center gap-2">
              <p className="text-sm opacity-40">커리어 항목이 없습니다.</p>
            </div>
          </div>
        )}
      </section>

      {/* Education */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-bold">학력 / 교육</h2>
          <button onClick={() => setEducation(p => [...p, defaultEducation()])} className="btn btn-sm btn-outline rounded-full gap-1">
            <Plus className="w-4 h-4" /> 추가
          </button>
        </div>

        {education.map((edu, i) => (
          <div key={i} className="card bg-base-200 border border-base-content/5">
            <div className="card-body gap-4 p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-primary opacity-60">#{i + 1}</span>
                <div className="flex gap-1">
                  <button onClick={() => moveEducation(i, -1)} className="btn btn-ghost btn-xs"><ChevronUp className="w-3 h-3" /></button>
                  <button onClick={() => moveEducation(i, 1)}  className="btn btn-ghost btn-xs"><ChevronDown className="w-3 h-3" /></button>
                  <button onClick={() => removeEducation(i)} className="btn btn-ghost btn-xs text-error"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label"><span className="label-text">기간</span></label>
                  <input placeholder="2016 - 2020" className="input input-bordered input-sm bg-base-100" value={edu.year} onChange={e => updateEducation(i, 'year', e.target.value)} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">기관명</span></label>
                  <input placeholder="한국대학교" className="input input-bordered input-sm bg-base-100" value={edu.institution} onChange={e => updateEducation(i, 'institution', e.target.value)} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">학위 / 과정</span></label>
                  <input placeholder="컴퓨터공학과 학사" className="input input-bordered input-sm bg-base-100" value={edu.title} onChange={e => updateEducation(i, 'title', e.target.value)} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">비고 (선택)</span></label>
                  <input placeholder="GPA, 수상 등" className="input input-bordered input-sm bg-base-100" value={edu.desc ?? ''} onChange={e => updateEducation(i, 'desc', e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        ))}

        {education.length === 0 && (
          <div className="card bg-base-200 border-2 border-dashed border-base-content/10">
            <div className="card-body items-center py-10 text-center gap-2">
              <p className="text-sm opacity-40">학력/교육 항목이 없습니다.</p>
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
