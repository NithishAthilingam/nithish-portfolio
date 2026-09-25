import React from 'react';
import { Layout, Server, Cloud, Wrench } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function Skills() {
  const { skills } = portfolioData;

  const categoryIcons = {
    'Frontend Development': <Layout className="w-5 h-5 text-blue-400" />,
    'Backend & APIs': <Server className="w-5 h-5 text-indigo-400" />,
    'Cloud & DevOps (AWS)': <Cloud className="w-5 h-5 text-amber-400" />,
    'Tools & Methodologies': <Wrench className="w-5 h-5 text-emerald-400" />,
  };

  return (
    <section id="skills" className="py-24 border-t border-slate-800/60 bg-slate-950/40 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-3">
            Technical Proficiency
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            Skills & Technologies
          </p>
          <p className="text-sm text-slate-400 mt-3">
            A comprehensive look at my technical toolkit across the full stack and cloud ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((group, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all hover:shadow-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  {categoryIcons[group.category] || <Wrench className="w-5 h-5 text-blue-400" />}
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {group.category}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {group.items.map((skill, sIdx) => {
                  const isAws = skill.toLowerCase().includes('aws') || skill.toLowerCase().includes('s3') || skill.toLowerCase().includes('cloudfront') || skill.toLowerCase().includes('route 53') || skill.toLowerCase().includes('dynamodb');
                  return (
                    <span
                      key={sIdx}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        isAws
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
