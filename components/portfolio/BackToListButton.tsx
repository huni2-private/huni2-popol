'use client';

// 상세 → 목록 복귀 — 항상 /portfolio로 이동한다(어디서 들어왔든 "목록으로").
// PortfolioClient가 sessionStorage에 저장해 둔 마지막 검색·필터 URL이 있으면
// 그걸로 복원하고, 없으면(홈 등 다른 경로로 바로 들어온 경우) 빈 목록으로 간다.
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function BackToListButton() {
  const [href, setHref] = useState('/portfolio');

  useEffect(() => {
    const stored = sessionStorage.getItem('portfolio-list-url');
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 하이드레이션 이후 1회만 sessionStorage에서 복원
    if (stored) setHref(stored);
  }, []);

  return (
    <Link href={href} className="btn btn-ghost btn-sm gap-2">
      <ArrowLeft className="w-4 h-4" /> 목록으로
    </Link>
  );
}
