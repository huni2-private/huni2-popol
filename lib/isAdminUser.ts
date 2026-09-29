// 관리자 판별 — 로그인 여부만으로는 부족하다(누구든 회원가입에 성공하면 관리자로 취급되던 버그).
// 허용된 관리자 이메일(NEXT_PUBLIC_ADMIN_EMAIL)과 정확히 일치할 때만 관리자로 본다.
export function isAdminUser(email: string | null | undefined): boolean {
  const allowed = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (!allowed || !email) return false;
  return email.toLowerCase() === allowed.toLowerCase();
}
