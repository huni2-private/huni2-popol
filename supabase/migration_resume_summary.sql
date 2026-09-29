-- Supabase Dashboard > SQL Editor에서 실행
-- projects 테이블에 이력서 전용 요약 컬럼 추가
-- description에서 자동으로 첫 문장을 잘라 쓰던 방식은 URL·괄호가 섞인 문장에서
-- 부자연스럽게 끊기는 문제가 있어, 이력서에서만 쓸 한 줄 요약을 따로 관리한다.
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS resume_summary TEXT;
