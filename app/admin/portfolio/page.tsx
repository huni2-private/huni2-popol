'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Plus, Pencil, Trash2, ExternalLink, GitFork, FileText,
  Loader2, X, GripVertical, Globe, Package, Upload, ImageIcon
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  type: 'personal' | 'company';
  status: 'live' | 'wip' | 'archived';
  tags: string[];
  image_url: string;
  project_url: string;
  github_url: string;
  pdf_url: string;
  display_order: number;
  created_at: string;
}

const EMPTY: Omit<Project, 'id' | 'created_at'> = {
  title: '', description: '', type: 'personal', status: 'live',
  tags: [], image_url: '', project_url: '', github_url: '', pdf_url: '', display_order: 0,
};

const STATUS_BADGE: Record<Project['status'], string> = {
  live:     'badge-success',
  wip:      'badge-warning',
  archived: 'badge-ghost',
};
const TYPE_BADGE: Record<Project['type'], string> = {
  personal: 'badge-primary',
  company:  'badge-secondary',
};

export default function AdminPortfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Modal state
  const [open, setOpen]         = useState(false);
  const [editId, setEditId]     = useState<string | null>(null);
  const [form, setForm]         = useState({ ...EMPTY, tags: '' as unknown as string });
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview]   = useState<string>('');

  const supabase = createClient();

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });
    setProjects(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []); // eslint-disable-line

  const openCreate = () => {
    setEditId(null);
    setForm({ ...EMPTY, tags: '' as unknown as string });
    setPreview('');
    setOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditId(p.id);
    setForm({ ...p, tags: (p.tags ?? []).join(', ') as unknown as string });
    setPreview(p.image_url || '');
    setOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext  = file.name.split('.').pop();
    const path = `${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from('portfolio').upload(path, file, { upsert: true });
    if (error) { alert('업로드 실패: ' + error.message); setUploading(false); return; }

    const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(path);
    field('image_url', publicUrl);
    setPreview(publicUrl);
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { alert('제목을 입력하세요.'); return; }
    setSaving(true);

    const payload = {
      ...form,
      tags: typeof form.tags === 'string'
        ? (form.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean)
        : form.tags,
    };

    if (editId) {
      const { error } = await supabase.from('projects').update(payload).eq('id', editId);
      if (error) { alert(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from('projects').insert(payload);
      if (error) { alert(error.message); setSaving(false); return; }
    }

    setSaving(false);
    setOpen(false);
    fetchProjects();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" 프로젝트를 삭제하시겠습니까?`)) return;
    setDeleting(id);
    await supabase.from('projects').delete().eq('id', id);
    setDeleting(null);
    fetchProjects();
  };

  const field = (key: keyof typeof form, value: string) =>
    setForm(f => ({ ...f, [key]: value }));

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Package className="w-7 h-7 text-primary" /> Portfolio
          </h1>
          <p className="text-sm opacity-50 mt-1">프로젝트 카드를 추가·편집·삭제하세요.</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary rounded-2xl gap-2 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> 프로젝트 추가
        </button>
      </div>

      {/* Project Grid */}
      {projects.length === 0 ? (
        <div className="card bg-base-200 border-2 border-dashed border-base-content/10">
          <div className="card-body items-center text-center py-20 gap-4">
            <Package className="w-12 h-12 opacity-20" />
            <p className="opacity-40 italic">아직 프로젝트가 없습니다. 첫 번째 프로젝트를 추가하세요.</p>
            <button onClick={openCreate} className="btn btn-primary btn-sm rounded-full">
              <Plus className="w-4 h-4" /> 지금 추가
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map(p => (
            <div
              key={p.id}
              className="card bg-base-200 border border-base-content/5 hover:border-primary/20 transition-all group overflow-hidden"
            >
              {/* Image */}
              <figure className="relative h-44 bg-base-300 overflow-hidden">
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-20">
                    <Globe className="w-12 h-12" />
                  </div>
                )}
                {/* Drag handle hint */}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-40 transition-opacity">
                  <GripVertical className="w-5 h-5" />
                </div>
              </figure>

              <div className="card-body p-5 gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`badge badge-sm font-bold ${TYPE_BADGE[p.type]}`}>{p.type}</span>
                  <span className={`badge badge-sm ${STATUS_BADGE[p.status]}`}>{p.status}</span>
                </div>

                <h2 className="font-bold text-lg leading-tight">{p.title}</h2>
                <p className="text-sm text-base-content/60 line-clamp-2">{p.description}</p>

                {p.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {p.tags.slice(0, 4).map(t => (
                      <span key={t} className="badge badge-ghost text-[10px]">{t}</span>
                    ))}
                    {p.tags.length > 4 && (
                      <span className="badge badge-ghost text-[10px]">+{p.tags.length - 4}</span>
                    )}
                  </div>
                )}

                {/* Links */}
                <div className="flex items-center gap-1 pt-1 border-t border-base-content/5">
                  {p.project_url && (
                    <a href={p.project_url} target="_blank" className="btn btn-ghost btn-xs gap-1" title="Live Site">
                      <ExternalLink className="w-3 h-3" /> Live
                    </a>
                  )}
                  {p.github_url && (
                    <a href={p.github_url} target="_blank" className="btn btn-ghost btn-xs gap-1" title="GitHub">
                      <GitFork className="w-3 h-3" /> Code
                    </a>
                  )}
                  {p.pdf_url && (
                    <a href={p.pdf_url} target="_blank" className="btn btn-ghost btn-xs gap-1" title="PDF">
                      <FileText className="w-3 h-3" /> PDF
                    </a>
                  )}
                  <div className="flex-1" />
                  <button onClick={() => openEdit(p)} className="btn btn-ghost btn-xs" title="편집">
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    disabled={deleting === p.id}
                    className="btn btn-ghost btn-xs text-error"
                    title="삭제"
                  >
                    {deleting === p.id
                      ? <Loader2 className="w-3 h-3 animate-spin" />
                      : <Trash2 className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal ─────────────────────────────────────────── */}
      {open && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl w-full rounded-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {editId ? '프로젝트 편집' : '새 프로젝트'}
              </h3>
              <button onClick={() => setOpen(false)} className="btn btn-ghost btn-circle btn-sm">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div className="form-control">
                <label className="label"><span className="label-text font-bold">제목 *</span></label>
                <input
                  type="text" placeholder="Project Title"
                  className="input input-bordered bg-base-200"
                  value={form.title}
                  onChange={e => field('title', e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="form-control">
                <label className="label"><span className="label-text font-bold">설명</span></label>
                <textarea
                  placeholder="프로젝트 한 줄 소개"
                  className="textarea textarea-bordered bg-base-200 resize-none h-24"
                  value={form.description}
                  onChange={e => field('description', e.target.value)}
                />
              </div>

              {/* Type + Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">유형</span></label>
                  <select
                    className="select select-bordered bg-base-200"
                    value={form.type}
                    onChange={e => field('type', e.target.value)}
                  >
                    <option value="personal">Personal</option>
                    <option value="company">Company</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">상태</span></label>
                  <select
                    className="select select-bordered bg-base-200"
                    value={form.status}
                    onChange={e => field('status', e.target.value)}
                  >
                    <option value="live">Live</option>
                    <option value="wip">WIP</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">태그</span>
                  <span className="label-text-alt opacity-40">쉼표로 구분</span>
                </label>
                <input
                  type="text" placeholder="Next.js, Supabase, TypeScript"
                  className="input input-bordered bg-base-200"
                  value={form.tags as unknown as string}
                  onChange={e => field('tags', e.target.value)}
                />
              </div>

              {/* Image Upload */}
              <div className="form-control">
                <label className="label"><span className="label-text font-bold">이미지</span></label>

                {/* Preview */}
                {preview && (
                  <div className="relative mb-3 rounded-xl overflow-hidden h-40 bg-base-300">
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setPreview(''); field('image_url', ''); }}
                      className="absolute top-2 right-2 btn btn-circle btn-xs bg-base-100/80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Upload button */}
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-base-content/20 hover:border-primary/50 cursor-pointer transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  {uploading
                    ? <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    : <Upload className="w-5 h-5 text-base-content/40" />}
                  <span className="text-sm text-base-content/50">
                    {uploading ? '업로드 중...' : '클릭해서 이미지 선택 (jpg, png, webp)'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>

                {/* OR direct URL */}
                <div className="divider text-xs opacity-30 my-2">또는 URL 직접 입력</div>
                <input
                  type="url" placeholder="https://..."
                  className="input input-bordered input-sm bg-base-200"
                  value={form.image_url}
                  onChange={e => { field('image_url', e.target.value); setPreview(e.target.value); }}
                />
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 gap-3">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Deploy URL
                    </span>
                  </label>
                  <input
                    type="url" placeholder="https://your-project.vercel.app"
                    className="input input-bordered input-sm bg-base-200"
                    value={form.project_url}
                    onChange={e => field('project_url', e.target.value)}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold flex items-center gap-1">
                      <GitFork className="w-3 h-3" /> GitHub URL
                    </span>
                  </label>
                  <input
                    type="url" placeholder="https://github.com/..."
                    className="input input-bordered input-sm bg-base-200"
                    value={form.github_url}
                    onChange={e => field('github_url', e.target.value)}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold flex items-center gap-1">
                      <FileText className="w-3 h-3" /> PDF URL
                    </span>
                  </label>
                  <input
                    type="url" placeholder="https://... 또는 /files/project.pdf"
                    className="input input-bordered input-sm bg-base-200"
                    value={form.pdf_url}
                    onChange={e => field('pdf_url', e.target.value)}
                  />
                </div>
              </div>

              {/* Order */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">표시 순서</span>
                  <span className="label-text-alt opacity-40">낮을수록 앞에 표시</span>
                </label>
                <input
                  type="number" min={0}
                  className="input input-bordered input-sm bg-base-200 w-24"
                  value={form.display_order}
                  onChange={e => field('display_order', e.target.value)}
                />
              </div>
            </div>

            <div className="modal-action mt-8">
              <button onClick={() => setOpen(false)} className="btn btn-ghost rounded-2xl">취소</button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary rounded-2xl px-8 shadow-lg shadow-primary/20"
              >
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

// Add missing Save import
function Save({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}
