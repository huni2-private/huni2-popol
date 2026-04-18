'use client';

import { motion } from 'framer-motion';
import { Mail, Download, Send } from 'lucide-react';
import { Github, Linkedin, Twitter } from '@/components/icons/SocialIcons';
import { useI18n } from '@/lib/i18n';
import { useState } from 'react';

interface ContactInfo {
  email?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  resume_pdf?: string;
  greeting_ko?: string;
  greeting_en?: string;
}

export default function ContactClient({ info }: { info: ContactInfo }) {
  const { lang, t } = useI18n();
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');

  const greeting = lang === 'ko' ? info.greeting_ko : info.greeting_en;

  const socials = [
    info.github   && { name: 'Github',   icon: Github,   href: info.github },
    info.linkedin && { name: 'LinkedIn', icon: Linkedin, href: info.linkedin },
    info.twitter  && { name: 'Twitter',  icon: Twitter,  href: info.twitter },
  ].filter(Boolean) as { name: string; icon: React.ElementType; href: string }[];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold italic">
          {t.contact.page_title.split(' ').map((w, i) =>
            i === t.contact.page_title.split(' ').length - 1
              ? <span key={i} className="text-primary underline"> {w}</span>
              : <span key={i}>{w} </span>
          )}
        </h1>
        <p className="text-base-content/70">{greeting ?? t.contact.page_desc}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          {info.email && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">{t.contact.details_title}</h2>
              <a
                href={`mailto:${info.email}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-base-content/5 bg-base-200 hover:border-primary/50 transition-all group"
              >
                <div className="p-3 rounded-lg bg-base-300 text-primary group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs opacity-50 uppercase font-bold tracking-widest">Email</p>
                  <p className="font-mono">{info.email}</p>
                </div>
              </a>
            </div>
          )}

          {socials.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">{t.contact.social_title}</h2>
              <div className="flex gap-4">
                {socials.map(s => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl border border-base-content/5 bg-base-200 hover:border-primary/50 hover:text-primary transition-all group"
                    aria-label={s.name}
                  >
                    <s.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {info.resume_pdf && (
            <a
              href={info.resume_pdf}
              target="_blank"
              className="btn btn-outline btn-primary rounded-full gap-2 px-8 inline-flex"
            >
              <Download className="w-4 h-4" />
              {t.contact.resume_btn}
            </a>
          )}
        </motion.div>

        {/* Message Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card bg-base-200 border border-base-content/5"
        >
          <div className="card-body gap-4">
            <h2 className="card-title">{t.contact.form_title}</h2>
            <div className="form-control">
              <label className="label"><span className="label-text">{lang === 'ko' ? '이름' : 'Name'}</span></label>
              <input type="text" placeholder={t.contact.name_placeholder} className="input input-bordered bg-base-100" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Email</span></label>
              <input type="email" placeholder={t.contact.email_placeholder} className="input input-bordered bg-base-100" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">{lang === 'ko' ? '메시지' : 'Message'}</span></label>
              <textarea placeholder={t.contact.message_placeholder} className="textarea textarea-bordered h-32 bg-base-100" value={message} onChange={e => setMessage(e.target.value)} />
            </div>
            <a
              href={info.email ? `mailto:${info.email}?subject=From Portfolio&body=${encodeURIComponent(`Name: ${name}\n\n${message}`)}` : '#'}
              className="btn btn-primary mt-4 gap-2"
            >
              <Send className="w-4 h-4" />
              {t.contact.send_btn}
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
