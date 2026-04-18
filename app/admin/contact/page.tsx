'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface ContactInfo {
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  resume_pdf: string;
  greeting_ko: string;
  greeting_en: string;
}

const defaultInfo: ContactInfo = {
  email: '', github: '', linkedin: '', twitter: '',
  resume_pdf: '', greeting_ko: '', greeting_en: '',
};

export default function AdminContactPage() {
  const router   = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState('');
  const [info,    setInfo]    = useState<ContactInfo>(defaultInfo);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/admin/login'); return; }

      const { data } = await supabase.from('site_settings').select('value').eq('key', 'contact_info').single();
      if (data?.value) setInfo({ ...defaultInfo, ...data.value });
      setLoading(false);
    };
    init();
  }, []); // eslint-disable-line

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from('site_settings').upsert({ key: 'contact_info', value: info });
    setSaving(false);
    showToast(error ? '저장 실패' : '저장됨');
  };

  const set = (field: keyof ContactInfo) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setInfo(p => ({ ...p, [field]: e.target.value }));

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      {toast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success font-bold shadow-lg">{toast}</div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="btn btn-ghost btn-sm rounded-full"><ArrowLeft className="w-4 h-4" /></Link>
          <h1 className="text-2xl font-black">Contact 관리</h1>
        </div>
        <button onClick={save} disabled={saving} className="btn btn-primary rounded-2xl gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          저장
        </button>
      </div>

      {/* Contact Details */}
      <section className="card bg-base-200 border border-base-content/5">
        <div className="card-body gap-4">
          <h2 className="card-title text-lg">연락처</h2>

          <div className="form-control">
            <label className="label"><span className="label-text">이메일</span></label>
            <input type="email" placeholder="contact@example.com" className="input input-bordered bg-base-100" value={info.email} onChange={set('email')} />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">GitHub URL</span></label>
            <input type="url" placeholder="https://github.com/username" className="input input-bordered bg-base-100" value={info.github} onChange={set('github')} />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">LinkedIn URL</span></label>
            <input type="url" placeholder="https://linkedin.com/in/username" className="input input-bordered bg-base-100" value={info.linkedin} onChange={set('linkedin')} />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Twitter / X URL</span></label>
            <input type="url" placeholder="https://x.com/username" className="input input-bordered bg-base-100" value={info.twitter} onChange={set('twitter')} />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">이력서 PDF URL</span>
              <span className="label-text-alt opacity-50">비워두면 버튼 숨김</span>
            </label>
            <input type="url" placeholder="https://..." className="input input-bordered bg-base-100" value={info.resume_pdf} onChange={set('resume_pdf')} />
          </div>
        </div>
      </section>

      {/* Greeting */}
      <section className="card bg-base-200 border border-base-content/5">
        <div className="card-body gap-4">
          <h2 className="card-title text-lg">인사말</h2>

          <div className="form-control">
            <label className="label"><span className="label-text">인사말 (한국어)</span></label>
            <textarea placeholder="새로운 기회에 항상 열려 있습니다." className="textarea textarea-bordered h-20 bg-base-100" value={info.greeting_ko} onChange={set('greeting_ko')} />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Greeting (English)</span></label>
            <textarea placeholder="I'm always open to new opportunities." className="textarea textarea-bordered h-20 bg-base-100" value={info.greeting_en} onChange={set('greeting_en')} />
          </div>
        </div>
      </section>

      {/* Preview hint */}
      <div className="text-center">
        <Link href="/contact" target="_blank" className="btn btn-ghost btn-sm rounded-full opacity-50 hover:opacity-100">
          Contact 페이지 미리보기 →
        </Link>
      </div>
    </div>
  );
}
