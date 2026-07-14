'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

export default function ChatbotScript() {
  const pathname = usePathname();
  if (pathname === '/resume') return null;
  return (
    <Script
      src="https://chatbot.congkong.net/widget.js"
      data-site-id="acme"
      strategy="afterInteractive"
    />
  );
}
