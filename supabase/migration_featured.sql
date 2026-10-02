-- Supabase Dashboard > SQL Editor에서 실행
-- 홈 "대표 프로젝트" 캐러셀에 노출할 프로젝트를 admin에서 고를 수 있도록 컬럼 추가
-- (기존엔 components/home/HomeClient.tsx에 제목 3개가 하드코딩되어 있었음)
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false;

-- 지금까지 하드코딩돼 있던 대표 프로젝트 3개를 그대로 유지
UPDATE projects SET featured = true
WHERE title IN (
  'RoundWait(대규모 행사 대기열 관리)',
  'SalesPulse(VIP 세일즈 대시보드)',
  'TimeSlot(행사 예약 운영 플랫폼)'
);
