// 이미지 없는 프로젝트용 그라디언트 썸네일 — 리스트 카드와 상세 페이지에서 공유
const THUMB_PALETTES = [
  { grad: 'from-sky-500/55 to-indigo-600/30',    blob1: 'bg-sky-400',     blob2: 'bg-indigo-500'  },
  { grad: 'from-violet-500/55 to-fuchsia-600/30', blob1: 'bg-violet-400',  blob2: 'bg-fuchsia-500' },
  { grad: 'from-emerald-500/55 to-teal-600/30',   blob1: 'bg-emerald-400', blob2: 'bg-teal-500'    },
  { grad: 'from-amber-500/55 to-orange-600/30',   blob1: 'bg-amber-400',   blob2: 'bg-orange-500'  },
  { grad: 'from-rose-500/55 to-pink-600/30',      blob1: 'bg-rose-400',    blob2: 'bg-pink-500'    },
  { grad: 'from-cyan-500/55 to-blue-600/30',      blob1: 'bg-cyan-400',    blob2: 'bg-blue-500'    },
] as const;

function hashTitle(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % THUMB_PALETTES.length;
}

export default function ProjectThumbnail({ title, type }: { title: string; type: 'personal' | 'company' }) {
  const p = THUMB_PALETTES[hashTitle(title)];
  return (
    <div className="relative w-full h-full overflow-hidden bg-base-300">
      <div className={`absolute inset-0 bg-gradient-to-br ${p.grad}`} />
      <div className={`absolute -top-12 -right-12 w-56 h-56 rounded-full blur-3xl opacity-40 ${p.blob1}`} />
      <div className={`absolute -bottom-12 -left-12 w-40 h-40 rounded-full blur-3xl opacity-25 ${p.blob2}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/70 font-mono">{type}</p>
        <p className="text-base font-black leading-tight text-white truncate">{title}</p>
      </div>
    </div>
  );
}
