'use client';

// 자기소개서 인쇄 전용 클라이언트 — 어드민용, 회사 선택 + window.print()
import { Printer, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Section     { id: string; title: string; content: string; }
interface CoverLetter { id: string; company: string; position: string; sections: Section[]; isGeneral?: boolean; }

interface Props {
  letters: CoverLetter[];
  initialActive: CoverLetter | null;
}

export default function CoverPrintClient({ letters, initialActive }: Props) {
  const [active, setActive] = useState<CoverLetter | null>(initialActive);

  const [scale, setScale] = useState(1);
  useEffect(() => {
    const update = () => setScale(Math.min(1, (window.innerWidth - 32) / 904));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          header, #ck-chatbot-root { display: none !important; }
          *, *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-family: "Malgun Gothic", "맑은 고딕", "Apple SD Gothic Neo", sans-serif !important;
          }
          body, html { background: #fff !important; }
          @page { size: A4; margin: 20mm 22mm; }
          .cover-root { width: 100% !important; padding: 0 !important; max-width: none !important; margin: 0 !important; }
          .avoid-break { break-inside: avoid; page-break-inside: avoid; }
          .cover-scale { zoom: 1 !important; transform: none !important; }
        }
      `}</style>

      {/* 툴바 */}
      <div className="no-print sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400 font-mono hidden sm:block">자기소개서 미리보기</span>
          {/* 회사 선택 드롭다운 */}
          {letters.length > 1 && (
            <div className="relative">
              <select
                className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-sm font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={active?.id ?? ''}
                onChange={e => setActive(letters.find(l => l.id === e.target.value) ?? null)}
              >
                {letters.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.isGeneral ? '범용' : l.company}{l.position ? ` · ${l.position}` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          )}
          {letters.length === 1 && active && (
            <span className="text-sm font-bold text-slate-600">
              {active.isGeneral ? '범용' : active.company}{active.position ? ` · ${active.position}` : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <a href="/resume" className="btn btn-ghost btn-sm rounded-full text-slate-400">이력서</a>
          <a href="/admin/cover" className="btn btn-ghost btn-sm rounded-full text-slate-400">편집</a>
          <button onClick={() => window.print()}
            className="btn btn-primary btn-sm rounded-full gap-2">
            <Printer className="w-4 h-4" /> PDF로 저장
          </button>
        </div>
      </div>

      {/* 빈 상태 */}
      {!active || active.sections.length === 0 ? (
        <div className="no-print flex flex-col items-center justify-center py-32 text-slate-300">
          <p className="text-lg mb-2">
            {letters.length === 0 ? '작성된 자기소개서가 없습니다.' : '선택한 자기소개서에 내용이 없습니다.'}
          </p>
          <a href="/admin/cover" className="text-blue-500 underline text-sm">
            어드민에서 작성하기 →
          </a>
        </div>
      ) : (
        /* 본문 */
        <div className="cover-scale overflow-x-hidden" style={{ zoom: scale }}>
          <div className="cover-root w-[780px] mx-auto px-12 py-12 text-slate-800">

            {/* 헤더 */}
            <header className="avoid-break border-b-2 border-slate-900 pb-6 mb-10">
              <div className="flex items-end justify-between">
                <div>
                  <h1 className="text-[34px] font-black tracking-tight leading-none text-slate-900">자기소개서</h1>
                  {(active.isGeneral || active.company || active.position) && (
                    <p className="text-[14px] text-blue-700 font-semibold mt-2">
                      {active.isGeneral ? '범용' : [active.company, active.position].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
                <div className="text-right text-[12px] text-slate-400 font-mono space-y-0.5">
                  <p className="font-bold text-slate-700">허창훈</p>
                </div>
              </div>
            </header>

            {/* 섹션들 */}
            <div className="space-y-9">
              {active.sections.map((s, i) => (
                <div key={s.id} className="avoid-break">
                  <h2 className="text-[10px] font-black uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-1.5 mb-3 flex items-center gap-2">
                    <span className="font-mono text-slate-300">{String(i + 1).padStart(2, '0')}</span>
                    {s.title}
                  </h2>
                  <p className="text-[13px] leading-[1.95] text-slate-600 whitespace-pre-wrap">{s.content}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
