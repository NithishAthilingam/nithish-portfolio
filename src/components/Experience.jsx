import React from 'react';
import { Briefcase, GraduationCap, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { NorthropGrummanLogo, BattelleLogo, AdVonLogo, OhioStateLogo } from './CompanyLogos';
import { portfolioData } from '../data/portfolioData';

export default function Experience() {
  const { experience, education } = portfolioData;

  const getCompanyLogo = (company) => {
    if (company.toLowerCase().includes('northrop')) return <NorthropGrummanLogo className="w-5 h-5 rounded-md" />;
    if (company.toLowerCase().includes('battelle')) return <BattelleLogo className="w-5 h-5 rounded-md" />;
    if (company.toLowerCase().includes('advon')) return <AdVonLogo className="w-5 h-5 rounded-md" />;
    return <Briefcase className="w-5 h-5 text-blue-400" />;
  };

  return (
    <section id="experience" className="py-24 border-t border-slate-800/60 bg-slate-950/40 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-3">
            Career Journey
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            Work Experience & Education
          </p>
        </div>

        {/* Work Experience */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Work History</h3>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
            {experience.map((item, idx) => (
              <div key={idx} className="relative pl-10 group">
                {/* Timeline node */}
                <span className="absolute left-2.5 top-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-slate-950 group-hover:scale-125 transition-transform" />

                <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {item.role}
                    </h4>
                    <span className="text-xs font-medium text-blue-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.period}
                    </span>
                  </div>

                  {/* Company link and logo */}
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400 mb-4">
                    <a
                      href={item.companyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-slate-200 hover:text-blue-400 font-semibold transition-colors group/company"
                    >
                      {getCompanyLogo(item.company)}
                      <span>{item.company}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover/company:text-blue-400" />
                    </a>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {item.location}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-400 mb-3 font-medium">
                      {item.description}
                    </p>
                  )}

                  {/* Bullet achievements */}
                  {item.achievements && item.achievements.length > 0 && (
                    <ul className="space-y-2 mb-5">
                      {item.achievements.map((ach, aIdx) => (
                        <li key={aIdx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2.5 leading-relaxed">
                          <span className="text-blue-400 font-bold shrink-0 mt-0.5">•</span>
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
                    {item.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Education</h3>
          </div>

          <div className="space-y-6">
            {education.map((edu, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <h4 className="text-base font-bold text-white">
                    {edu.degree}
                  </h4>
                  <span className="text-xs font-medium text-slate-400">
                    {edu.year}
                  </span>
                </div>

                <a
                  href={edu.schoolUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-300 mb-2 group/school"
                >
                  <OhioStateLogo className="w-5 h-5 rounded-sm" />
                  <span>{edu.school}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover/school:text-red-300" />
                </a>

                <p className="text-xs text-slate-400 mt-1">
                  {edu.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
