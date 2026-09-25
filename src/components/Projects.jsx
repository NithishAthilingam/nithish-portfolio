import React, { useState } from 'react';
import { ExternalLink, Layers, ArrowUpRight, BookOpen, Lock } from 'lucide-react';
import { GithubIcon } from './Icons';
import { portfolioData } from '../data/portfolioData';

export default function Projects() {
  const { projects } = portfolioData;
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(projects.map((p) => p.category))];

  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-24 border-t border-slate-800/60 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-3">
            Featured Work
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            Projects & Architecture
          </p>
          <p className="text-sm text-slate-400 mt-3">
            A selection of projects across mission-critical defense systems, real-time controls, AI research, and cloud architectures.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === category
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden hover:border-slate-750 hover:shadow-2xl transition-all group"
            >
              {/* Project Image */}
              <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-800">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-900/80 backdrop-blur-md text-blue-300 border border-slate-700/80">
                  {project.category}
                </span>
                {project.period && (
                  <span className="absolute bottom-3 left-4 text-[11px] font-medium text-slate-300 bg-slate-900/70 backdrop-blur-md px-2.5 py-0.5 rounded">
                    {project.period}
                  </span>
                )}
              </div>

              {/* Project Content */}
              <div className="p-6 sm:p-7 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>

                <p className="text-sm text-slate-400 mb-6 leading-relaxed flex-1">
                  {project.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links / Project status */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-800/80">
                  {project.demoUrl ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {project.demoUrl.includes('medium.com') ? (
                        <>
                          <BookOpen className="w-4 h-4" />
                          Read Publication
                        </>
                      ) : (
                        <>
                          <ArrowUpRight className="w-4 h-4" />
                          Live Demo / Site
                        </>
                      )}
                    </a>
                  ) : null}

                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                    >
                      <GithubIcon className="w-4 h-4" />
                      Source Code
                    </a>
                  ) : null}

                  {!project.demoUrl && !project.githubUrl && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 italic">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      Proprietary / Internal System
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
