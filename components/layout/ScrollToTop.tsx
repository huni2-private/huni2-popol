'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // resume는 인쇄 전용이라 제외, 400px 미만은 숨김
  if (pathname === '/resume' || !visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 btn btn-circle btn-primary shadow-lg"
      aria-label="맨 위로"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
