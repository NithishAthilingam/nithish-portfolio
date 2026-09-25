import React from 'react';
import { ArrowRight, Mail, Sparkles, Cloud, ShieldCheck } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { portfolioData } from '../data/portfolioData';

export default function Hero() {
  const { personal, socials } = portfolioData;

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background glowing ambient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-blue-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Availability Badge */}
        {personal.availableForHire && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium mb-6 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Available for new opportunities
          </div>
        )}

        {/* Hero Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
          Hi, I'm{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            {personal.name}
          </span>
        </h1>

        <p className="text-lg sm:text-2xl font-semibold text-slate-300 mb-4 max-w-2xl mx-auto">
          {personal.title}
        </p>

        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
          {personal.tagline}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
          >
            View Projects
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-all hover:scale-105"
          >
            <Mail className="w-4 h-4 text-blue-400" />
            Contact Me
          </a>
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-5 text-slate-400">
          <a
            href={socials.github}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-slate-800/60 hover:text-white hover:bg-slate-800 border border-slate-800 transition-all hover:-translate-y-1"
            aria-label="GitHub"
          >
            <GithubIcon className="w-5 h-5" />
          </a>
          <a
            href={socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-slate-800/60 hover:text-blue-400 hover:bg-slate-800 border border-slate-800 transition-all hover:-translate-y-1"
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="w-5 h-5" />
          </a>
          <a
            href={`mailto:${personal.email}`}
            className="p-2.5 rounded-xl bg-slate-800/60 hover:text-cyan-400 hover:bg-slate-800 border border-slate-800 transition-all hover:-translate-y-1"
            aria-label="Email"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>

        {/* Cloud Badge */}
        <div className="mt-14 inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
          <Cloud className="w-4 h-4 text-blue-400" />
          <span>Hosted on AWS CloudFront & S3</span>
          <span className="text-slate-600">•</span>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>SSL Secured via ACM</span>
        </div>
      </div>
    </section>
  );
}
