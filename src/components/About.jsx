import React from 'react';
import { MapPin, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function About() {
  const { personal, stats } = portfolioData;

  const keyStrengths = [
    'Clean, maintainable React & modern JavaScript/TypeScript architectures',
    'Serverless and cloud-native solutions designed on AWS',
    'Responsive, mobile-first design with Tailwind CSS',
    'Automated CI/CD workflows and version control best practices',
  ];

  return (
    <section id="about" className="py-24 border-t border-slate-800/60 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-3">
            About Me
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            Engineering with passion, deploying with precision
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
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

            <div className="flex flex-wrap gap-6 pt-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>{personal.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                <span>{personal.email}</span>
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
                <div className="text-3xl sm:text-4xl font-extrabold text-white group-hover:text-blue-400 transition-colors">
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
