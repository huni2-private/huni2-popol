// 홈 og:image — 빌드 시 정적 생성, Admin 커스텀 이미지로 오버라이드 가능
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '허창훈 · Frontend Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const METRICS = [
  { metric: '80%',    label: '로딩 단축' },
  { metric: '3,000명', label: '대기열 처리' },
  { metric: '40%',    label: '챗봇 전환율' },
];

const TAGS = ['Next.js', 'TypeScript', 'Go', 'Vue 3', 'Firebase'];

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0d0d1a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 80px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* glow top-left */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            left: -80,
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,106,248,0.35) 0%, transparent 70%)',
          }}
        />
        {/* glow bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            right: -60,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)',
          }}
        />

        {/* ── header ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              fontSize: 30,
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.03em',
            }}
          >
            HUNI²
          </div>
          <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.2)' }} />
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#9d8df8',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}
          >
            Frontend Developer · 허창훈
          </div>
        </div>

        {/* ── main ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div
              style={{
                fontSize: 48,
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}
            >
              서비스 4개 설계·배포.
            </div>
            <div
              style={{
                fontSize: 38,
                fontWeight: 900,
                color: 'rgba(255,255,255,0.55)',
                letterSpacing: '-0.025em',
                lineHeight: 1.2,
              }}
            >
              SK하이닉스 23만 건 로딩 5s→1s(80%) 단축.
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: '#9d8df8',
                letterSpacing: '-0.01em',
                marginTop: 8,
              }}
            >
              코드보다 결과로 말하는 프론트엔드 개발자
            </div>
          </div>

          {/* metrics row */}
          <div style={{ display: 'flex', gap: 48, marginTop: 8 }}>
            {METRICS.map(({ metric, label }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span
                  style={{
                    fontSize: 38,
                    fontWeight: 900,
                    color: '#7c6af8',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {metric}
                </span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── footer ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            {TAGS.map((tech) => (
              <div
                key={tech}
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.15)',
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.55)',
                  letterSpacing: '0.01em',
                }}
              >
                {tech}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.02em' }}>
            huni2-popol.vercel.app
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
