'use client';

// 전역 배경 — 인디고·바이올렛 그라디언트 메시. 홈은 불투명한 카드(bg-base-200)들이
// 배경 위에 올라앉는 구조라 잘 어울리지만, 다른 페이지는 텍스트 위주라 배경이 그대로
// 드러나 보이고 이력서 페이지에서는 인쇄 미리보기 위에 떠서 싸구려 느낌을 줬다.
// 그래서 홈에서만 보여준다.
import { usePathname } from 'next/navigation';

export default function AmbientBackground() {
  const pathname = usePathname();
  if (pathname !== '/') return null;

  return (
    <div aria-hidden className="ambient-bg fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="ambient-blob ambient-blob--a" />
      <div className="ambient-blob ambient-blob--b" />
      <div className="ambient-blob ambient-blob--c" />
    </div>
  );
}
