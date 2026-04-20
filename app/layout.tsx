import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import BottomTabNav from "@/components/layout/BottomTabNav";
import { LanguageProvider } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HUNI² | Portfolio & Log",
  description: "Junior Full-stack Developer Portfolio & Log",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'light';
                document.documentElement.setAttribute('data-theme', theme);
                const lang = localStorage.getItem('pref-lang') || 'ko';
                document.documentElement.setAttribute('lang', lang);
              })()
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-base-100 pb-20 md:pb-0 font-sans`}
      >
        <LanguageProvider>
          <Header />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <BottomTabNav />
        </LanguageProvider>
      </body>
    </html>
  );
}
