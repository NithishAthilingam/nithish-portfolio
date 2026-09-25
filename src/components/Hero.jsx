import React from 'react';
import { ArrowRight, Mail, Sparkles, Cloud, MapPin, Phone, Building2 } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { NorthropGrummanLogo, OhioStateLogo } from './CompanyLogos';
import { portfolioData } from '../data/portfolioData';
import headshotImg from '../assets/AthilingamNithish-HeadShotShouldersUp.jpg';

export default function Hero() {
  const { personal, socials } = portfolioData;

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Background glowing ambient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Headshot with glowing halo */}
        <div className="relative mb-6 group">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 opacity-75 blur-md group-hover:opacity-100 transition duration-500" />
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-900">
            <img
              src={headshotImg}
              alt={personal.name}
              className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
            />
          </div>
          <span className="absolute bottom-1 right-2 w-5 h-5 rounded-full bg-emerald-500 border-4 border-slate-950 shadow" title="Active" />
        </div>

        {/* Company & Education Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
          <a
            href="https://www.northropgrumman.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-blue-500/30 text-blue-300 text-xs sm:text-sm font-semibold hover:border-blue-400 transition-all hover:scale-105 shadow-sm"
          >
            <NorthropGrummanLogo className="w-4 h-4 rounded-sm" />
            <span>Northrop Grumman</span>
          </a>

          <a
            href="https://www.osu.edu/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-red-500/30 text-red-300 text-xs sm:text-sm font-semibold hover:border-red-400 transition-all hover:scale-105 shadow-sm"
          >
            <OhioStateLogo className="w-4 h-4 rounded-sm" />
            <span>The Ohio State University</span>
          </a>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs sm:text-sm font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Columbus, OH • US Citizen</span>
          </div>
        </div>

        {/* Hero Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-4">
          Hi, I'm{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            {personal.name}
          </span>
        </h1>

        <p className="text-xl sm:text-2xl font-bold text-slate-200 mb-3 max-w-2xl">
          {personal.title}
        </p>

        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
          {personal.tagline}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
          >
            View Projects
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#experience"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all hover:scale-105"
          >
            Experience
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all hover:scale-105"
          >
            <Mail className="w-4 h-4 text-blue-400" />
            Contact
          </a>
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-4 text-slate-400 mb-12">
          <a
            href={socials.github}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-slate-900/80 hover:text-white hover:bg-slate-800 border border-slate-800 transition-all hover:-translate-y-1 shadow-sm"
            aria-label="GitHub"
          >
            <GithubIcon className="w-5 h-5" />
          </a>
          <a
            href={socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-slate-900/80 hover:text-blue-400 hover:bg-slate-800 border border-slate-800 transition-all hover:-translate-y-1 shadow-sm"
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="w-5 h-5" />
          </a>
          <a
            href={`mailto:${personal.email}`}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:text-cyan-400 hover:bg-slate-800 border border-slate-800 transition-all hover:-translate-y-1 shadow-sm"
            aria-label="Email"
          >
            <Mail className="w-5 h-5" />
          </a>
          <a
            href={socials.phone}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:text-emerald-400 hover:bg-slate-800 border border-slate-800 transition-all hover:-translate-y-1 shadow-sm"
            aria-label="Phone"
          >
            <Phone className="w-5 h-5" />
          </a>
        </div>

        {/* Deployment Badge */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 shadow-sm">
          <Cloud className="w-4 h-4 text-blue-400" />
          <span>Deployed on AWS CloudFront & S3</span>
          <span className="text-slate-600">•</span>
          <span className="font-semibold text-slate-300">nithish.org</span>
        </div>
      </div>
    </section>
  );
}
