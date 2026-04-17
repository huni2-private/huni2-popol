'use client';

import { motion } from 'framer-motion';
import { Mail, Download, Send } from 'lucide-react';
import { Github, Linkedin, Twitter } from '@/components/icons/SocialIcons';

const socials = [
  { name: 'Github', icon: Github, href: 'https://github.com', color: 'hover:text-primary' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com', color: 'hover:text-blue-500' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com', color: 'hover:text-sky-400' },
];

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold italic">Let's <span className="text-primary underline">Connect</span></h1>
        <p className="text-base-content/70">Have a project in mind or just want to say hi? I'm always open to new opportunities.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Contact Details</h2>
            <a 
              href="mailto:contact@huni.dev" 
              className="flex items-center gap-4 p-4 rounded-xl border border-base-content/5 bg-base-200 hover:border-primary/50 transition-all group"
            >
              <div className="p-3 rounded-lg bg-base-300 text-primary group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs opacity-50 uppercase font-bold tracking-widest">Email</p>
                <p className="font-mono">contact@huni.dev</p>
              </div>
            </a>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold">Social Presence</h2>
            <div className="flex gap-4">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-4 rounded-xl border border-base-content/5 bg-base-200 transition-all group ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button className="btn btn-outline btn-primary rounded-full gap-2 px-8">
              <Download className="w-4 h-4" />
              Download Resume (PDF)
            </button>
          </div>
        </motion.div>

        {/* Quick Message Form (Visual Only) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card bg-base-200 border border-base-content/5"
        >
          <div className="card-body gap-4">
            <h2 className="card-title">Send a Quick Message</h2>
            <div className="form-control">
              <label className="label"><span className="label-text">Name</span></label>
              <input type="text" placeholder="Your name" className="input input-bordered bg-base-100" />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Email</span></label>
              <input type="email" placeholder="Your email" className="input input-bordered bg-base-100" />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Message</span></label>
              <textarea placeholder="How can I help you?" className="textarea textarea-bordered h-32 bg-base-100"></textarea>
            </div>
            <button className="btn btn-primary mt-4 gap-2">
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
