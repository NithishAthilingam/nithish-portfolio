import React from 'react';
import { Briefcase, GraduationCap, HeartHandshake, Calendar, MapPin, ExternalLink, FileText } from 'lucide-react';
import { NorthropGrummanLogo, BattelleLogo, AdVonLogo, OhioStateLogo, FirstAllianceLogo } from './CompanyLogos';
import hipMentorshipImg from '../assets/hip_mentorship.jpg';
import churchThumb from '../assets/church_linkedin_thumb.png';
import firstAllianceSymbol from '../assets/first_alliance_symbol.png';
import { portfolioData } from '../data/portfolioData';

export default function Experience() {
  const { experience, education, volunteering } = portfolioData;

  const getCompanyLogo = (company) => {
    if (company.toLowerCase().includes('northrop')) return <NorthropGrummanLogo className="w-5 h-5 rounded-md" />;
    if (company.toLowerCase().includes('battelle')) return <BattelleLogo className="w-5 h-5 rounded-md" />;
    if (company.toLowerCase().includes('advon')) return <AdVonLogo className="w-5 h-5 rounded-md" />;
    return <Briefcase className="w-5 h-5 text-blue-400" />;
  };

  const getOrgLogo = (org) => {
    if (org.toLowerCase().includes('northrop')) return <NorthropGrummanLogo className="w-5 h-5 rounded-md" />;
    if (org.toLowerCase().includes('first alliance') || org.toLowerCase().includes('church')) return <FirstAllianceLogo className="w-5 h-5 rounded-md" />;
    return <HeartHandshake className="w-5 h-5 text-emerald-400" />;
  };

  return (
    <section id="experience" className="py-24 border-t border-slate-800/60 bg-slate-950/40 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-3">
            Career Journey
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            Experience, Education & Volunteering
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

        {/* Volunteering & Community Leadership */}
        {volunteering && volunteering.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Volunteering & Community</h3>
            </div>

            <div className="space-y-6">
              {volunteering.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {item.role}
                    </h4>
                    <span className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.period}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400 mb-3">
                    <a
                      href={item.organizationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-slate-200 hover:text-emerald-400 font-semibold transition-colors group/org"
                    >
                      {getOrgLogo(item.organization)}
                      <span>{item.organization}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover/org:text-emerald-400" />
                    </a>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {item.cause}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Resource & Image Link Card */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 border-t border-slate-800/80">
                    <a
                      href={item.organizationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900 transition-all group/link flex-1 min-w-0"
                    >
                      <div className="w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden shrink-0 bg-slate-900 border border-slate-800 flex items-center justify-center">
                        <img
                          src={item.imageType === 'hip' ? hipMentorshipImg : churchThumb}
                          alt={item.linkTitle}
                          className="w-full h-full object-cover group-hover/link:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-slate-200 group-hover/link:text-emerald-400 transition-colors flex items-center gap-1.5">
                          <span className="truncate">{item.linkTitle}</span>
                          <ExternalLink className="w-3 h-3 text-slate-500 group-hover/link:text-emerald-400 shrink-0" />
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {item.organizationUrl.replace('https://www.', '').replace('https://', '')}
                        </div>
                      </div>
                    </a>

                    {item.brochureUrl && (
                      <a
                        href={item.brochureUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-850 hover:bg-slate-800 border border-slate-700/60 hover:text-white transition-all shrink-0"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span>HIP Brochure (PDF)</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
