'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Github, Linkedin, Twitter } from '@/components/icons/SocialIcons';
import { useI18n } from '@/lib/i18n';

interface ContactInfo {
  email?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
}

export default function Footer({ contact }: { contact: ContactInfo }) {
  const { lang } = useI18n();
  const year = new Date().getFullYear();

  const links = [
    contact.github && { name: 'GitHub', icon: Github, href: contact.github },
    contact.linkedin && { name: 'LinkedIn', icon: Linkedin, href: contact.linkedin },
    contact.twitter && { name: 'Twitter', icon: Twitter, href: contact.twitter },
  ].filter((l): l is { name: string; icon: typeof Github; href: string } => Boolean(l));

  return (
    <footer className="border-t border-base-content/5 mt-12">
      <div className="container mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-base-content/40">
        <p>
          © {year} 허창훈.{' '}
          {lang === 'ko' ? 'Next.js와 Supabase로 직접 만들었습니다.' : 'Built with Next.js & Supabase.'}
        </p>
        <div className="flex items-center gap-4">
          <Link href="/contact" className="flex items-center gap-1 font-bold text-primary hover:opacity-70 transition-opacity">
            {lang === 'ko' ? '연락하기' : 'Get in touch'} <ArrowRight className="w-3 h-3" />
          </Link>
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="font-mono hover:text-primary transition-colors">
              {contact.email}
            </a>
          )}
          {links.length > 0 && (
            <div className="flex items-center gap-3">
              {links.map(({ name, icon: Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="hover:text-primary transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
