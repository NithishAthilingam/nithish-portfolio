import React from 'react';
import { MapPin, Mail, Award, CheckCircle2, ExternalLink } from 'lucide-react';
import { MicrosoftLogo, BloombergLogo, OhioStateLogo } from './CompanyLogos';
import { portfolioData } from '../data/portfolioData';

export default function About() {
  const { personal, stats, certifications } = portfolioData;

  const keyStrengths = [
    'Systems & Architecture: C++, low-level network socket protocols, TPM 2.0 hardware security controls',
    'Simulation & Real-Time: High-frame-rate B-52 defense simulations (C#, .NET, UE4) and embedded gimbal hardware emulation',
    'Full-Stack & Cloud: Reactive React web applications, WebSockets (≤10 ms refresh rate), and serverless AWS architectures',
    'Rigorous Engineering: IBM DOORS requirements engineering, GTest suites with 90%+ coverage, and Jenkins CI/CD',
  ];

  const getCertLogo = (issuer) => {
    if (issuer.toLowerCase().includes('microsoft')) return <MicrosoftLogo className="w-4 h-4 shrink-0" />;
    if (issuer.toLowerCase().includes('bloomberg')) return <BloombergLogo className="w-4 h-4 shrink-0" />;
    return <Award className="w-4 h-4 text-blue-400 shrink-0" />;
  };

  return (
    <section id="about" className="py-24 border-t border-slate-800/60 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-3">
            About Me
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            Engineering with Precision & High-Reliability Standards
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Bio Column */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              {personal.bio}
            </p>

            <div className="space-y-3 pt-2">
              {keyStrengths.map((strength, index) => (
                <div key={index} className="flex items-start gap-3 text-slate-300 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span>{strength}</span>
                </div>
              ))}
            </div>

            {/* Interactive Certifications */}
            {certifications && certifications.length > 0 && (
              <div className="pt-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Verified Certifications</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {certifications.map((cert, cIdx) => (
                    <a
                      key={cIdx}
                      href={cert.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {getCertLogo(cert.issuer)}
                        <div className="truncate">
                          <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition-colors truncate">
                            {cert.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {cert.issuer} • {cert.year}
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-6 pt-4 text-sm text-slate-400 border-t border-slate-800/60">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>{personal.location} ({personal.citizenship})</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                <a href={`mailto:${personal.email}`} className="hover:text-blue-400 transition-colors">
                  {personal.email}
                </a>
              </div>
            </div>
          </div>

          {/* Stats Grid Column */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all text-center group"
              >
                <div className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-blue-400 transition-colors">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-400 mt-2 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
