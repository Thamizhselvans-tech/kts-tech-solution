import React, { useState } from 'react';
import { TECHNOLOGIES } from '../data/portfolioData';
import { Cpu, Terminal, Layers, Database, Shield, Atom, Globe, Code, FileCode, Palette, Server, Coffee, Flame, HardDrive, Zap, Bot, Activity, GitBranch, Github, Figma, Laptop, Cloud } from 'lucide-react';

export const TechnologySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'AI', 'Tools'];

  const getTechIcon = (iconName: string) => {
    switch (iconName) {
      case 'Atom': return <Atom className="w-4 h-4 text-emerald" />;
      case 'Globe': return <Globe className="w-4 h-4 text-emerald" />;
      case 'Code': return <Code className="w-4 h-4 text-emerald" />;
      case 'FileCode': return <FileCode className="w-4 h-4 text-emerald" />;
      case 'Palette': return <Palette className="w-4 h-4 text-emerald" />;
      case 'Server': return <Server className="w-4 h-4 text-emerald" />;
      case 'Cpu': return <Cpu className="w-4 h-4 text-emerald" />;
      case 'Coffee': return <Coffee className="w-4 h-4 text-emerald" />;
      case 'Database': return <Database className="w-4 h-4 text-emerald" />;
      case 'Flame': return <Flame className="w-4 h-4 text-emerald" />;
      case 'HardDrive': return <HardDrive className="w-4 h-4 text-emerald" />;
      case 'Terminal': return <Terminal className="w-4 h-4 text-emerald" />;
      case 'Zap': return <Zap className="w-4 h-4 text-emerald" />;
      case 'Bot': return <Bot className="w-4 h-4 text-emerald" />;
      case 'Activity': return <Activity className="w-4 h-4 text-emerald" />;
      case 'GitBranch': return <GitBranch className="w-4 h-4 text-emerald" />;
      case 'Github': return <Github className="w-4 h-4 text-emerald" />;
      case 'Figma': return <Figma className="w-4 h-4 text-emerald" />;
      case 'Laptop': return <Laptop className="w-4 h-4 text-emerald" />;
      case 'Cloud': return <Cloud className="w-4 h-4 text-emerald" />;
      default: return <Cpu className="w-4 h-4 text-emerald" />;
    }
  };

  const filteredTech = activeCategory === 'All'
    ? TECHNOLOGIES
    : TECHNOLOGIES.filter((t) => t.category === activeCategory);

  // Double the list for infinite seamless marquee loop
  const tickerItems = [...TECHNOLOGIES, ...TECHNOLOGIES];

  return (
    <section id="technology" className="py-14 sm:py-20 bg-transparent relative overflow-hidden border-t border-forest-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Tag */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald uppercase tracking-widest mb-2 font-bold">
              <Cpu className="w-4 h-4" />
              <span>TECHNOLOGY STACK</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-charcoal tracking-tight font-sans">
              "Technologies We{' '}
              <span className="text-gradient-forest underline decoration-emerald/30 underline-offset-4">
                Work With"
              </span>
            </h2>
          </div>
          <div className="mt-4 md:mt-0 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-soft border border-forest-900/10 font-mono text-xs text-forest-900 font-semibold max-w-md">
            "We choose the technology based on the product — not the other way around."
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-6 sm:mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-mono font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-forest-900 text-white shadow-forest-subtle'
                  : 'bg-ivory-50 text-charcoal hover:bg-emerald-soft border border-forest-900/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Infinite Horizontal Ticker Showcase with Gradient Masks */}
        <div className="relative overflow-hidden py-3 sm:py-4 border-y border-forest-900/10 bg-ivory-50 rounded-2xl before:absolute before:left-0 before:top-0 before:bottom-0 before:w-8 sm:before:w-16 before:bg-gradient-to-r before:from-ivory-50 before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-8 sm:after:w-16 after:bg-gradient-to-l after:from-ivory-50 after:to-transparent after:z-10">
          <div className="animate-infinite-scroll flex items-center gap-3 sm:gap-4">
            {tickerItems.map((tech, idx) => (
              <div
                key={`${tech.name}-${idx}`}
                className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-ivory-100 border border-forest-900/10 flex items-center gap-2.5 sm:gap-3 shrink-0 hover:border-emerald/40 transition-colors shadow-forest-subtle"
              >
                {getTechIcon(tech.icon)}
                <span className="text-xs font-bold text-charcoal font-sans">{tech.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-soft text-emerald-muted">
                  {tech.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Filtered Grid View */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3 mt-6 sm:mt-8">
          {filteredTech.map((tech) => (
            <div
              key={tech.name}
              className="p-3.5 rounded-xl bg-ivory-50 border border-forest-900/10 flex items-center justify-between hover:bg-emerald-soft transition-colors"
            >
              <div className="flex items-center gap-2.5">
                {getTechIcon(tech.icon)}
                <span className="text-xs font-bold text-charcoal font-sans">{tech.name}</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-muted uppercase">{tech.category}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
