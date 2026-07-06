'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-6">
      <div className="space-y-2">
        <p className="text-8xl font-black font-mono text-primary leading-none">500</p>
        <p className="text-xl font-bold">문제가 발생했습니다.</p>
        <p className="text-base-content/50 text-sm">잠시 후 다시 시도해 주세요.</p>
      </div>
      <div className="flex gap-3">
        <button onClick={reset} className="btn btn-primary rounded-full gap-2">
          <RefreshCw className="w-4 h-4" /> 다시 시도
        </button>
        <Link href="/" className="btn btn-outline rounded-full">
          홈으로
        </Link>
      </div>
    </div>
  );
}
