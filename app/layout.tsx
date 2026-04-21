import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import BottomTabNav from "@/components/layout/BottomTabNav";
import { LanguageProvider } from "@/lib/i18n";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'site_meta')
    .single();

  const meta = data?.value ?? {};
  const title       = meta.title       || 'HUNI² | Portfolio & Log';
  const description = meta.description || '작은 개선 하나하나를 의미있게 만드는 성장형 프론트엔드 개발자 허창훈의 포트폴리오';
  const ogImage     = meta.og_image    || null;
  const siteUrl     = 'https://huni2-popol.vercel.app';

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    openGraph: {
      title:       meta.og_title       || title,
      description: meta.og_description || description,
      url:         siteUrl,
      siteName:    'HUNI²',
      type:        'website',
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] }),
    },
    twitter: {
      card:        ogImage ? 'summary_large_image' : 'summary',
      title:       meta.og_title       || title,
      description: meta.og_description || description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){const t=localStorage.getItem('theme')||'light';document.documentElement.setAttribute('data-theme',t);const l=localStorage.getItem('pref-lang')||'ko';document.documentElement.setAttribute('lang',l);})()`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-base-100 pb-20 md:pb-0 font-sans`}>
        <LanguageProvider>
          <Header />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <BottomTabNav />
        </LanguageProvider>
        <Script src="https://chatbot.congkong.net/widget.js" data-site-id="acme" strategy="afterInteractive" />
      </body>
    </html>
  );
}
