// /resume 전용 레이아웃 — 헤더·네비 제외, 인쇄 최적화
export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-base-100">{children}</div>;
}
