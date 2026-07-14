import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import NextTopLoader from "nextjs-toploader";
import { LanguageProvider } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import ChatbotScript from "@/components/layout/ChatbotScript";
import PageViewTracker from "@/components/layout/PageViewTracker";
import { Analytics } from "@vercel/analytics/react";

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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = !!user;

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t='light';try{t=localStorage.getItem('pref-theme')||'light';}catch(e){}document.documentElement.setAttribute('data-theme',t);var l='ko';try{l=localStorage.getItem('pref-lang')||'ko';}catch(e){}document.documentElement.setAttribute('lang',l);})()`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-base-100 font-sans`}>
        <LanguageProvider>
          <NextTopLoader color="#7c6af8" showSpinner={false} />
          <Header />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </LanguageProvider>
        <ChatbotScript />
        {!isAdmin && <PageViewTracker />}
        {!isAdmin && <Analytics />}
      </body>
    </html>
  );
}
