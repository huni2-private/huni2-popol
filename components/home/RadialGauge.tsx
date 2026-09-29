'use client';

// 히어로 Status Board용 원형 게이지 — 성공률 같은 퍼센트 지표를 대시보드 스타일로 보여준다
import { useId } from 'react';

export default function RadialGauge({
  value,
  size = 96,
  strokeWidth = 8,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
}) {
  const gradientId = useId();
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);
  const center = size / 2;

  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={center} cy={center} r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-base-content/10"
        />
        <circle
          cx={center} cy={center} r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#c026d3" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono font-black tabular-nums" style={{ fontSize: size * 0.18 }}>
          {clamped}%
        </span>
      </div>
    </div>
  );
}
