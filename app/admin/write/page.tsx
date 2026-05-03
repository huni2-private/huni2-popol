'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Save, ArrowLeft, Loader2, Image as ImageIcon, Type, Tag, Eye, EyeOff, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const Editor = dynamic(() => import('@/components/admin/Editor'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full bg-base-300 animate-pulse rounded-lg flex items-center justify-center text-base-content/40">
      에디터 로딩 중...
    </div>
  ),
});

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function extractExcerpt(markdown: string, maxLen = 150) {
  return markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#*`>\-_\[\]!]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

function AdminWriteInner() {
  const [title, setTitle]       = useState('');
  const [content, setContent]   = useState('');
  const [category, setCategory] = useState<'log' | 'project' | 'note'>('log');
  const [tags, setTags]         = useState('');
  const [published, setPublished] = useState(false);
  const [createdAt, setCreatedAt] = useState(() => new Date().toISOString().slice(0, 16));
  const [loading, setLoading]   = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const supabase = createClient();

  // Load existing log when editing
  useEffect(() => {
    if (!editId) return;
    (async () => {
      setInitialLoad(true);
      const { data } = await supabase
        .from('logs')
        .select('*')
        .eq('id', editId)
        .single();
      if (data) {
        setTitle(data.title);
        setContent(data.content);
        setCategory(data.category);
        setTags((data.tags ?? []).join(', '));
        setPublished(data.published);
        setCreatedAt(new Date(data.created_at).toISOString().slice(0, 16));
      }
      setInitialLoad(false);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    setLoading(true);

    const slug    = slugify(title) || `post-${Date.now()}`;
    const excerpt = extractExcerpt(content);
    const tagArr  = tags.split(',').map(t => t.trim()).filter(Boolean);

    const created_at = new Date(createdAt).toISOString();

    if (editId) {
      const { error } = await supabase
        .from('logs')
        .update({ title, slug, excerpt, content, category, tags: tagArr, published, created_at })
        .eq('id', editId);

      if (error) { alert(`저장 실패: ${error.message}`); setLoading(false); return; }
    } else {
      const { error } = await supabase
        .from('logs')
        .insert({ title, slug, excerpt, content, category, tags: tagArr, published, created_at });

      if (error) { alert(`저장 실패: ${error.message}`); setLoading(false); return; }
    }

    router.push('/admin/logs');
    router.refresh();
  };

  if (initialLoad) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-base-content/10 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/logs" className="btn btn-ghost btn-circle">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{editId ? '포스트 편집' : '새 포스트 작성'}</h1>
            <p className="text-xs opacity-50 font-mono uppercase tracking-widest">
              {editId ? 'Edit Archive' : 'Create New Archive'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPublished(p => !p)}
            className={`btn btn-sm rounded-full gap-2 ${published ? 'btn-success' : 'btn-ghost bg-base-200'}`}
          >
            {published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {published ? '공개' : '비공개'}
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn btn-primary px-8 rounded-full shadow-lg hover:shadow-primary/20 transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            저장
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Editor */}
        <div className="lg:col-span-3 space-y-6">
          <input
            type="text"
            placeholder="포스트 제목을 입력하세요"
            className="input input-bordered w-full text-2xl font-bold h-16 bg-base-200 border-none focus:ring-2 focus:ring-primary/20"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <Editor onChange={setContent} initialValue={editId ? content : ''} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card bg-base-200 border border-base-content/5">
            <div className="card-body gap-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Type className="w-4 h-4" /> 설정
              </h2>

              <div className="form-control gap-1">
                <label className="label py-0"><span className="label-text font-bold text-xs uppercase tracking-widest opacity-50">카테고리</span></label>
                {(['log', 'project', 'note'] as const).map(c => (
                  <label key={c} className="label cursor-pointer justify-start gap-4 p-0 py-1.5">
                    <input
                      type="radio"
                      name="category"
                      className="radio radio-primary radio-sm"
                      checked={category === c}
                      onChange={() => setCategory(c)}
                    />
                    <span className="label-text capitalize">{c}</span>
                  </label>
                ))}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-bold">태그</span></label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                  <input
                    type="text"
                    placeholder="Next.js, React, ..."
                    className="input input-bordered input-sm w-full pl-9 bg-base-100"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                  />
                </div>
                <label className="label"><span className="label-text-alt opacity-40">쉼표로 구분</span></label>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-bold flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> 작성일</span></label>
                <input
                  type="datetime-local"
                  className="input input-bordered input-sm w-full bg-base-100"
                  value={createdAt}
                  onChange={e => setCreatedAt(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-between">
                  <span className="label-text font-bold">발행 상태</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary toggle-sm"
                    checked={published}
                    onChange={e => setPublished(e.target.checked)}
                  />
                </label>
                <span className="text-xs opacity-40 px-1">{published ? '공개 — 누구나 열람 가능' : '비공개 — 나만 볼 수 있음'}</span>
              </div>
            </div>
          </div>

          <div className="card bg-base-200 border border-base-content/5">
            <div className="card-body gap-3">
              <h2 className="text-sm font-bold flex items-center gap-2 opacity-50">
                <ImageIcon className="w-4 h-4" /> 대표 이미지
              </h2>
              <p className="text-xs opacity-40">에디터 내 이미지 첨부는 툴바의 이미지 버튼을 사용하세요.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminWrite() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <AdminWriteInner />
    </Suspense>
  );
}
