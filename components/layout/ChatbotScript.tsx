'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

export default function ChatbotScript() {
  const pathname = usePathname();
  if (pathname === '/resume') return null;
  return (
    <Script
      src="https://huni-chatbot.vercel.app/widget.js"
      data-site-id="huni2-popol"
      strategy="afterInteractive"
    />
  );
}
