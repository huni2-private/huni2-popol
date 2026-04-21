'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Upload, X, ExternalLink } from 'lucide-react';

interface SiteMeta {
  title: string;
  description: string;
  og_title: string;
  og_description: string;
  og_image: string;
}

const DEFAULT: SiteMeta = {
  title: 'HUNI² | Portfolio & Log',
  description: '작은 개선 하나하나를 의미있게 만드는 성장형 프론트엔드 개발자 허창훈의 포트폴리오',
  og_title: '',
  og_description: '',
  og_image: '',
};

export default function AdminSeoPage() {
  const router   = useRouter();
  const supabase = createClient();
  const fileRef  = useRef<HTMLInputElement>(null);

  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [toast,      setToast]      = useState('');
  const [meta,       setMeta]       = useState<SiteMeta>(DEFAULT);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/admin/login'); return; }

      const { data } = await supabase.from('site_settings').select('value').eq('key', 'site_meta').single();
      if (data?.value) setMeta({ ...DEFAULT, ...data.value });
      setLoading(false);
    };
    init();
  }, []); // eslint-disable-line

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from('site_settings').upsert({ key: 'site_meta', value: meta });
    setSaving(false);
    showToast(error ? '저장 실패' : '저장됨 — 다음 배포 시 반영됩니다');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `og-image.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('portfolio').upload(path, file, { upsert: true });
    if (error) { showToast('업로드 실패: ' + error.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(path);
    setMeta(p => ({ ...p, og_image: publicUrl }));
    setUploading(false);
    showToast('이미지 업로드 완료');
  };

  const set = (field: keyof SiteMeta) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setMeta(p => ({ ...p, [field]: e.target.value }));

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      {toast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success font-bold shadow-lg text-sm">{toast}</div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="btn btn-ghost btn-sm rounded-full"><ArrowLeft className="w-4 h-4" /></Link>
          <h1 className="text-2xl font-black">SEO / OG 관리</h1>
        </div>
        <button onClick={save} disabled={saving} className="btn btn-primary rounded-2xl gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          저장
        </button>
      </div>

      {/* Basic Meta */}
      <section className="card bg-base-200 border border-base-content/5">
        <div className="card-body gap-4">
          <h2 className="card-title text-lg">기본 메타태그</h2>
          <p className="text-xs opacity-40">브라우저 탭 제목과 구글 검색 결과에 표시됩니다.</p>

          <div className="form-control">
            <label className="label">
              <span className="label-text">페이지 타이틀</span>
              <span className="label-text-alt opacity-40">{meta.title.length}/60</span>
            </label>
            <input className="input input-bordered bg-base-100" value={meta.title} onChange={set('title')} maxLength={60} />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">메타 설명</span>
              <span className="label-text-alt opacity-40">{meta.description.length}/160</span>
            </label>
            <textarea className="textarea textarea-bordered bg-base-100 h-20" value={meta.description} onChange={set('description')} maxLength={160} />
          </div>
        </div>
      </section>

      {/* OG Image */}
      <section className="card bg-base-200 border border-base-content/5">
        <div className="card-body gap-4">
          <h2 className="card-title text-lg">OG 이미지</h2>
          <p className="text-xs opacity-40">카카오톡·슬랙·트위터 등 SNS 공유 시 미리보기 이미지. 권장 크기: 1200×630px</p>

          {meta.og_image && (
            <div className="relative rounded-xl overflow-hidden border border-base-content/10">
              <img src={meta.og_image} alt="OG Preview" className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-base-100/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <a href={meta.og_image} target="_blank" className="btn btn-sm btn-ghost gap-1">
                  <ExternalLink className="w-3 h-3" /> 원본
                </a>
                <button onClick={() => setMeta(p => ({ ...p, og_image: '' }))} className="btn btn-sm btn-error gap-1">
                  <X className="w-3 h-3" /> 제거
                </button>
              </div>
            </div>
          )}

          <label className={`flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-base-content/20 hover:border-primary/50 cursor-pointer transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {uploading ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : <Upload className="w-5 h-5 text-base-content/40" />}
            <span className="text-sm text-base-content/50">
              {uploading ? '업로드 중...' : '클릭해서 OG 이미지 업로드 (jpg, png)'}
            </span>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>

          <div className="form-control">
            <label className="label"><span className="label-text text-xs opacity-50">또는 URL 직접 입력</span></label>
            <input type="url" placeholder="https://..." className="input input-bordered input-sm bg-base-100" value={meta.og_image} onChange={set('og_image')} />
          </div>
        </div>
      </section>

      {/* OG Text */}
      <section className="card bg-base-200 border border-base-content/5">
        <div className="card-body gap-4">
          <h2 className="card-title text-lg">SNS 공유 텍스트</h2>
          <p className="text-xs opacity-40">비워두면 기본 타이틀·설명을 사용합니다.</p>

          <div className="form-control">
            <label className="label"><span className="label-text">OG 타이틀</span></label>
            <input placeholder={meta.title} className="input input-bordered bg-base-100" value={meta.og_title} onChange={set('og_title')} />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">OG 설명</span></label>
            <textarea placeholder={meta.description} className="textarea textarea-bordered bg-base-100 h-20" value={meta.og_description} onChange={set('og_description')} />
          </div>
        </div>
      </section>

      {/* Preview card */}
      <section className="card bg-base-200 border border-base-content/5">
        <div className="card-body gap-3">
          <h2 className="card-title text-lg">미리보기</h2>
          <div className="rounded-xl border border-base-content/10 overflow-hidden text-sm">
            {meta.og_image && <div className="h-32 bg-base-300"><img src={meta.og_image} className="w-full h-full object-cover" alt="" /></div>}
            <div className="p-3 space-y-1">
              <p className="text-xs opacity-40 uppercase">huni2-popol.vercel.app</p>
              <p className="font-bold">{meta.og_title || meta.title}</p>
              <p className="text-xs opacity-60 line-clamp-2">{meta.og_description || meta.description}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
