import React from 'react';
import { ArrowUp, Cloud, Heart } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <div className="text-center sm:text-left space-y-1">
            <p className="text-sm font-semibold text-white">
              {portfolioData.personal.name}
            </p>
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>

          {/* Hosting Shoutout */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            <Cloud className="w-3.5 h-3.5 text-blue-400" />
            <span>Serverless AWS: S3 + CloudFront + Route 53</span>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
