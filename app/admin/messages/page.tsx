'use client';

import { useEffect, useState } from 'react';
import { Mail, ArrowLeft, Circle } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/admin/login'); return; }

      const { data } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      setMessages(data ?? []);
      setLoading(false);
    };
    init();
  }, [router, supabase]); // eslint-disable-line

  const markRead = async (msg: Message) => {
    setSelected(msg);
    if (!msg.read) {
      await supabase.from('contact_messages').update({ read: true }).eq('id', msg.id);
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
    }
  };

  const unread = messages.filter(m => !m.read).length;

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="btn btn-ghost btn-sm rounded-full gap-1">
          <ArrowLeft className="w-4 h-4" /> 대시보드
        </Link>
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-bold">메시지</h1>
          {unread > 0 && (
            <span className="badge badge-primary badge-sm font-bold">{unread} 미확인</span>
          )}
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="card bg-base-200 border-2 border-dashed border-base-content/10">
          <div className="card-body items-center py-16 gap-3 text-center">
            <Mail className="w-10 h-10 opacity-20" />
            <p className="text-sm opacity-40 italic">아직 받은 메시지가 없습니다.</p>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 items-start">
          {/* 목록 */}
          <div className="space-y-2">
            {messages.map(msg => (
              <button
                key={msg.id}
                onClick={() => markRead(msg)}
                className={`w-full text-left card border transition-all hover:border-primary/30 ${
                  selected?.id === msg.id
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-base-content/5 bg-base-200'
                }`}
              >
                <div className="card-body p-4 gap-1">
                  <div className="flex items-center gap-2">
                    {!msg.read && <Circle className="w-2 h-2 fill-primary text-primary shrink-0" />}
                    <p className={`font-bold text-sm truncate ${!msg.read ? '' : 'opacity-60'}`}>{msg.name}</p>
                    <span className="text-[10px] font-mono opacity-30 ml-auto shrink-0">
                      {new Date(msg.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs font-mono opacity-40 truncate">{msg.email}</p>
                  <p className="text-xs opacity-50 truncate mt-0.5">{msg.message}</p>
                </div>
              </button>
            ))}
          </div>

          {/* 상세 */}
          <div className="card bg-base-200 border border-base-content/5 sticky top-4">
            {selected ? (
              <div className="card-body p-6 gap-4">
                <div className="space-y-1">
                  <p className="text-xl font-bold">{selected.name}</p>
                  <a href={`mailto:${selected.email}`} className="text-sm font-mono text-primary hover:underline">
                    {selected.email}
                  </a>
                  <p className="text-[10px] font-mono opacity-40">
                    {new Date(selected.created_at).toLocaleString('ko-KR')}
                  </p>
                </div>
                <div className="divider my-0" />
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                <a
                  href={`mailto:${selected.email}?subject=Re: 포트폴리오 문의`}
                  className="btn btn-primary btn-sm rounded-full gap-1 w-fit"
                >
                  <Mail className="w-3.5 h-3.5" /> 이메일로 답장
                </a>
              </div>
            ) : (
              <div className="card-body items-center py-12 opacity-30">
                <Mail className="w-8 h-8" />
                <p className="text-sm">메시지를 선택하세요</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
