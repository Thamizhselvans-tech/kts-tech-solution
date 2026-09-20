import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PROJECTS, Project } from '../data/portfolioData';
import { ArrowRight, FolderGit2, Github, ExternalLink, CheckCircle2, Sparkles, Code2, FlaskConical } from 'lucide-react';

interface WorkProps {
  onOpenProjectEnquiry: () => void;
}

export const Work: React.FC<WorkProps> = ({ onOpenProjectEnquiry }) => {
  const [activeGroup, setActiveGroup] = useState<'All' | 'Products / Engineering' | 'Research / Innovation'>('All');
  const [activeProject, setActiveProject] = useState<Project>(PROJECTS[0]);

  const filteredProjects = activeGroup === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.group === activeGroup);

  return (
    <section id="projects" className="py-14 sm:py-16 bg-transparent relative overflow-hidden border-t border-forest-900/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Tag */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald uppercase tracking-widest mb-2 font-bold">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>AUTHENTIC KRYPTONODE PROJECTS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal tracking-tight font-sans">
              Products, engineering &{' '}
              <span className="text-gradient-forest underline decoration-emerald/30 underline-offset-4">
                research innovations.
              </span>
            </h2>
          </div>
          <p className="mt-2 md:mt-0 text-xs sm:text-sm text-charcoal/80 max-w-md font-sans leading-relaxed">
            Real projects built with practical technology, clean user interfaces, and robust backend workflows.
          </p>
        </div>

        {/* Group Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {[
            { id: 'All', label: 'All Projects (10)', icon: FolderGit2 },
            { id: 'Products / Engineering', label: 'Products / Engineering (6)', icon: Code2 },
            { id: 'Research / Innovation', label: 'Research / Innovation (4)', icon: FlaskConical },
          ].map((grp) => {
            const isSelected = activeGroup === grp.id;
            const Icon = grp.icon;
            return (
              <button
                key={grp.id}
                onClick={() => {
                  setActiveGroup(grp.id as any);
                  const firstMatching = PROJECTS.find((p) => grp.id === 'All' || p.group === grp.id);
                  if (firstMatching) setActiveProject(firstMatching);
                }}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-forest-900 text-white shadow-forest-subtle'
                    : 'bg-ivory-50 text-charcoal hover:bg-emerald-soft border border-forest-900/10'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-light' : 'text-emerald'}`} />
                <span>{grp.label}</span>
              </button>
            );
          })}
        </div>

        {/* Structured Compact 3-Column Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 mb-8 sm:mb-10">
          {filteredProjects.map((project) => {
            const isSelected = project.id === activeProject.id;
            return (
              <button
                key={project.id}
                onClick={() => setActiveProject(project)}
                className={`px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border transition-all duration-200 text-left flex items-center justify-between min-h-[52px] sm:min-h-[56px] w-full ${
                  isSelected
                    ? 'bg-forest-900 text-white border-forest-900 shadow-sm ring-2 ring-emerald-light/40'
                    : 'bg-ivory-50 text-charcoal border-forest-900/10 hover:border-emerald/40 hover:bg-emerald-soft'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span className={`font-mono text-xs font-extrabold shrink-0 ${isSelected ? 'text-emerald-light' : 'text-emerald'}`}>
                    {project.number}
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold font-sans truncate tracking-tight">
                    {project.name}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-mono font-bold shrink-0 ${
                  isSelected ? 'bg-white/15 text-emerald-light' : 'bg-forest-900/5 text-emerald-muted'
                }`}>
                  {project.category.split('/')[0].trim()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detailed Project Showcase Box */}
        <div className="card-ivory p-4 sm:p-5 rounded-2xl relative overflow-hidden shadow-forest-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            
            {/* Left Content Details */}
            <div className="lg:col-span-6 space-y-3">
              
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2 py-0.5 bg-emerald-soft text-forest-900 font-mono text-[9px] sm:text-[10px] font-bold rounded border border-forest-900/10 uppercase">
                  {activeProject.group}
                </span>

                <span className="px-2 py-0.5 bg-ivory-200 text-charcoal font-mono text-[9px] sm:text-[10px] font-semibold rounded border border-forest-900/10">
                  {activeProject.category}
                </span>

                <span className="px-2 py-0.5 bg-forest-900 text-white font-mono text-[9px] sm:text-[10px] font-bold rounded">
                  Status: {activeProject.projectStatus}
                </span>

                {activeProject.isInternal && (
                  <span className="px-2 py-0.5 bg-emerald-light text-white font-mono text-[9px] sm:text-[10px] font-bold rounded">
                    Kryptonode Internal Product
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-charcoal font-sans tracking-tight mb-1">
                  {activeProject.name}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-forest-900 leading-relaxed font-sans">
                  {activeProject.description}
                </p>
              </div>

              {/* Problem & Solution Breakdown */}
              <div className="space-y-2 pt-0.5">
                <div className="p-2.5 sm:p-3 rounded-lg bg-ivory-50 border border-forest-900/10">
                  <h4 className="text-[10px] font-mono font-bold text-forest-900 uppercase tracking-wider mb-0.5">
                    Problem Statement
                  </h4>
                  <p className="text-[11px] sm:text-xs text-charcoal/80 leading-relaxed font-sans">
                    {activeProject.problem}
                  </p>
                </div>

                <div className="p-2.5 sm:p-3 rounded-lg bg-emerald-soft border border-forest-900/10">
                  <h4 className="text-[10px] font-mono font-bold text-forest-900 uppercase tracking-wider mb-0.5">
                    Engineered Solution
                  </h4>
                  <p className="text-[11px] sm:text-xs text-charcoal/80 leading-relaxed font-sans">
                    {activeProject.solution}
                  </p>
                </div>
              </div>

              {/* Key Features */}
              <div>
                <h4 className="text-[10px] font-mono font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Key Capabilities
                </h4>
                <div className="space-y-1">
                  {activeProject.keyFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] sm:text-xs text-charcoal font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technology Stack */}
              <div>
                <h4 className="text-[10px] font-mono font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Technology Stack
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeProject.technology.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-ivory-50 text-forest-900 text-[10px] sm:text-[11px] font-mono font-bold rounded border border-forest-900/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Live Links & GitHub Code Links */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                {activeProject.liveDemoUrl && (
                  <a
                    href={activeProject.liveDemoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-3.5 py-2 bg-forest-900 hover:bg-emerald text-white font-mono text-[11px] sm:text-xs font-bold rounded-md transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-[0.98]"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-light" />
                    <span>Launch Live Application</span>
                  </a>
                )}

                {activeProject.githubUrl && (
                  <a
                    href={activeProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-3.5 py-2 bg-ivory-200 hover:bg-forest-900 hover:text-white text-charcoal font-mono text-[11px] sm:text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 border border-forest-900/10 active:scale-[0.98]"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>View Repository</span>
                  </a>
                )}
              </div>

            </div>

            {/* Right Project Preview Image & Conversion Box */}
            <div className="lg:col-span-6 space-y-3">
              <div className="relative aspect-[16/9.5] rounded-lg overflow-hidden border border-forest-900/10 shadow-sm">
                <img
                  src={activeProject.image}
                  alt={activeProject.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 p-2.5 rounded-md bg-ivory-100/90 backdrop-blur-md border border-forest-900/10 text-[11px] font-mono text-charcoal">
                  <div className="font-bold text-forest-900">{activeProject.name} Architecture Preview</div>
                  <div className="text-[10px] text-emerald-muted">Kryptonode Codebase — {activeProject.group}</div>
                </div>
              </div>

              {/* Project Conversion Prompt */}
              <div className="p-3.5 sm:p-4 rounded-lg bg-forest-900 text-white border border-forest-800 space-y-2.5">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold font-sans">
                    Want something similar for your business?
                  </h4>
                  <p className="text-[11px] text-gray-300 font-sans mt-0.5 leading-relaxed">
                    Tell us about your product requirements. We'll help build it into a structured, production-ready solution.
                  </p>
                </div>

                <button
                  onClick={() => onOpenProjectEnquiry()}
                  className="w-full py-2 bg-emerald-light hover:bg-emerald text-white text-xs font-bold rounded-md uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all font-mono"
                >
                  <span>Discuss Your Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
