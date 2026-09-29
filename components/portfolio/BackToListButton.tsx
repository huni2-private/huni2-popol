'use client';

// 상세 → 목록 복귀 — router.back()으로 브라우저 히스토리를 타면 PortfolioClient의
// 필터·검색 상태가 그대로 복원된다. Link로 /portfolio에 새로 이동하면 상태가 초기화된다.
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackToListButton() {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className="btn btn-ghost btn-sm gap-2">
      <ArrowLeft className="w-4 h-4" /> 목록으로
    </button>
  );
}
