export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 animate-pulse">
      {/* 뒤로가기 버튼 */}
      <div className="h-8 w-24 bg-base-300 rounded-xl" />

      {/* 커버 이미지 */}
      <div className="h-64 rounded-3xl bg-base-300" />

      {/* 헤더 */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-base-300 rounded-md" />
          <div className="h-5 w-12 bg-base-300 rounded-md" />
        </div>
        <div className="h-10 w-2/3 bg-base-300 rounded-xl" />
      </div>

      {/* 태그 + 링크 */}
      <div className="flex gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-6 w-20 bg-base-300 rounded-full" />
        ))}
      </div>

      {/* 본문 */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-4 bg-base-300 rounded-lg" style={{ width: `${90 - i * 8}%` }} />
        ))}
      </div>

      {/* 임팩트 카드 */}
      <div className="grid grid-cols-2 gap-4">
        {[1, 2].map(i => (
          <div key={i} className="h-24 bg-base-300 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
