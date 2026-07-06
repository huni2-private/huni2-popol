import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-6">
      <div className="space-y-2">
        <p className="text-8xl font-black font-mono text-primary leading-none">404</p>
        <p className="text-xl font-bold">페이지를 찾을 수 없습니다.</p>
        <p className="text-base-content/50 text-sm">주소가 잘못됐거나 삭제된 페이지입니다.</p>
      </div>
      <Link href="/" className="btn btn-primary rounded-full">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
