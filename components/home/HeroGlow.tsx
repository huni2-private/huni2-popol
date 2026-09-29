'use client';

// 히어로 카드 배경 — Originkit Ribbon Glow(WebGL)를 브랜드 인디고·바이올렛 톤으로 적용.
// 라이트/다크 테마의 실제 카드 배경색(bg-base-200)을 읽어와 넘겨주면 셰이더가
// 알아서 "어두운 판"과 "밝은 종이" 톤 사이를 보간하므로, 라이트 모드에서도
// 카드가 따로 노는 검은 박스로 보이지 않는다.
import { useEffect, useLayoutEffect, useState } from 'react';
import RibbonGlow from '@/components/originkit/ui/ribbon-glow';

// SSR에서는 useLayoutEffect가 경고를 내므로 클라이언트에서만 레이아웃 이펙트를 쓴다.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// 테마는 'light'/'dark' 두 가지뿐이라 한 번 계산한 값은 테마별로 캐시해
// 토글할 때마다 DOM probe + 캔버스 래스터화를 반복하지 않는다.
const backgroundCache = new Map<string, string>();

function resolveCardBackground(): string {
  if (typeof document === 'undefined') return '#0c0a1a';
  const theme = document.documentElement.getAttribute('data-theme') || 'light';
  const cached = backgroundCache.get(theme);
  if (cached) return cached;

  const probe = document.createElement('div');
  probe.className = 'bg-base-200';
  probe.style.position = 'fixed';
  probe.style.visibility = 'hidden';
  probe.style.pointerEvents = 'none';
  document.body.appendChild(probe);
  const raw = getComputedStyle(probe).backgroundColor;
  document.body.removeChild(probe);

  // DaisyUI 토큰은 oklch로 정의돼 있고 getComputedStyle은 lab()/oklch() 같은
  // 광색역 표기로 돌려줄 수 있어 RibbonGlow의 파서(hex/rgb/hsl만 지원)가
  // 못 읽는다. 캔버스에 실제로 래스터화해 sRGB 픽셀값을 뽑아내 rgb()로 정규화한다.
  let resolved = raw || '#0c0a1a';
  try {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = raw;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      resolved = `rgb(${r}, ${g}, ${b})`;
    }
  } catch {
    // raw 폴백 유지
  }

  backgroundCache.set(theme, resolved);
  return resolved;
}

export default function HeroGlow() {
  const [background, setBackground] = useState('#0c0a1a');

  useIsoLayoutEffect(() => {
    // 브라우저가 첫 프레임을 그리기 전에 테마에 맞는 배경으로 동기화해
    // 항상 어두운 기본값(#0c0a1a)으로 잠깐 그려지는 깜빡임을 막는다.
    const sync = () => setBackground(resolveCardBackground());
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl [z-index:0]"
    >
      <RibbonGlow
        background={background}
        color1="#8b5cf6"
        color2="#c026d3"
        speed={35}
        style={{ minWidth: 0, minHeight: 0, width: '100%', height: '100%' }}
      />
      {/* 텍스트·버튼이 놓이는 하단 영역은 리본이 아무리 밝게 지나가도
          항상 읽히도록 카드 배경색으로 스크림을 깔아준다 */}
      <div
        className="absolute inset-x-0 bottom-0 h-[78%]"
        style={{ background: 'linear-gradient(to top, var(--color-base-200) 0%, color-mix(in srgb, var(--color-base-200) 55%, transparent) 55%, transparent 100%)' }}
      />
    </div>
  );
}
