import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Activity, Layers, Code, Cpu, Rocket, CheckCircle2 } from 'lucide-react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glow: string;
  pulsePhase: number;
}

interface PulsePacket {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
}

export const TechNodeAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  const [floatingIndex, setFloatingIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const steps = [
    { step: '01', phase: 'IDEA', title: 'Problem Discovery & Feature Scope', icon: Layers },
    { step: '02', phase: 'DESIGN', title: 'User Flows & UI Wireframes', icon: Code },
    { step: '03', phase: 'BUILD', title: 'Full Stack Code & Integrations', icon: Cpu },
    { step: '04', phase: 'LAUNCH', title: 'Cloud Production & Growth', icon: Rocket },
  ];

  // Auto-cycle each card to float up to the top and go back down one by one
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setFloatingIndex((prev) => (prev + 1) % steps.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [isHovered, steps.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 480);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 460);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Color palette strictly aligned to Kryptonode theme
    const nodeColors = [
      { fill: '#2E8B57', glow: 'rgba(46, 139, 87, 0.6)' }, // Emerald light
      { fill: '#1B5E3F', glow: 'rgba(27, 94, 63, 0.7)' },  // Deep emerald
      { fill: '#4ade80', glow: 'rgba(74, 222, 128, 0.5)' }, // Bright mint accent
      { fill: '#5C6E63', glow: 'rgba(92, 110, 99, 0.4)' },  // Emerald muted
    ];

    const NODE_COUNT = Math.max(36, Math.floor((width * height) / 5500));
    const nodes: Node[] = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      const c = nodeColors[Math.floor(Math.random() * nodeColors.length)];
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2.2 + 1.8,
        color: c.fill,
        glow: c.glow,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    const packets: PulsePacket[] = [];
    const MAX_PACKETS = 6;
    const MAX_DIST = 115;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle digital grid lines
      ctx.strokeStyle = 'rgba(27, 94, 63, 0.09)';
      ctx.lineWidth = 1;
      const gridSize = 36;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;
        node.pulsePhase += 0.03;

        // Bounce on boundaries
        if (node.x < 10) { node.x = 10; node.vx *= -1; }
        if (node.x > width - 10) { node.x = width - 10; node.vx *= -1; }
        if (node.y < 10) { node.y = 10; node.vy *= -1; }
        if (node.y > height - 10) { node.y = height - 10; node.vy *= -1; }

        // Mouse interaction
        if (mouseRef.current.x !== null && mouseRef.current.y !== null) {
          const dx = mouseRef.current.x - node.x;
          const dy = mouseRef.current.y - node.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130 && dist > 0) {
            const force = (130 - dist) / 130;
            node.x -= (dx / dist) * force * 1.3;
            node.y -= (dy / dist) * force * 1.3;
          }
        }

        // Draw node glow aura
        const currentRadius = node.radius + Math.sin(node.pulsePhase) * 0.6;
        ctx.save();
        ctx.shadowColor = node.glow;
        ctx.shadowBlur = 10;
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3. Connect close nodes with emerald lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.45;
            ctx.strokeStyle = `rgba(46, 139, 87, ${alpha})`;
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();

            // Randomly spawn data packet pulses along valid connections
            if (packets.length < MAX_PACKETS && Math.random() < 0.0035) {
              packets.push({
                fromIndex: i,
                toIndex: j,
                progress: 0,
                speed: 0.02 + Math.random() * 0.015,
              });
            }
          }
        }

        // Connect nodes to mouse cursor if within range
        if (mouseRef.current.x !== null && mouseRef.current.y !== null) {
          const dx = nodes[i].x - mouseRef.current.x;
          const dy = nodes[i].y - mouseRef.current.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.65;
            ctx.strokeStyle = `rgba(74, 222, 128, ${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.stroke();
          }
        }
      }

      // 4. Render traveling data packets (pulsing energy along connections)
      for (let p = packets.length - 1; p >= 0; p--) {
        const pkt = packets[p];
        pkt.progress += pkt.speed;

        const fromNode = nodes[pkt.fromIndex];
        const toNode = nodes[pkt.toIndex];

        if (pkt.progress >= 1 || !fromNode || !toNode) {
          packets.splice(p, 1);
          continue;
        }

        const px = fromNode.x + (toNode.x - fromNode.x) * pkt.progress;
        const py = fromNode.y + (toNode.y - fromNode.y) * pkt.progress;

        ctx.save();
        ctx.shadowColor = '#4ade80';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseRef.current = { x: null, y: null };
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[500px] rounded-3xl overflow-hidden border border-forest-800/70 shadow-forest-card bg-gradient-to-br from-[#05140D] via-[#0A2E1F] to-[#04120A] flex flex-col justify-between p-5 sm:p-6 select-none group transition-shadow duration-500 hover:shadow-forest-glow"
    >
      {/* Background Radial Glow in Theme Emerald */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-light/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-forest-900/60 rounded-full blur-3xl pointer-events-none" />

      {/* The 60FPS Interactive HTML5 Canvas Animation Merged in Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Subtle Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-forest-950/30 pointer-events-none z-0" />

      {/* Top Header Overlay Bar */}
      <div className="relative z-10 flex items-center justify-between backdrop-blur-md bg-forest-950/60 px-4 py-2.5 rounded-2xl border border-white/10 shadow-sm mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-light opacity-80"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-light"></span>
          </span>
          <span className="text-xs font-mono font-bold text-white tracking-wider uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-light" />
            PRODUCT DEVELOPMENT SYSTEM
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold text-emerald-light bg-emerald/30 border border-emerald/40 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <Activity className="w-3 h-3 text-emerald-light animate-pulse" />
            Kryptonode Workflow
          </span>
        </div>
      </div>

      {/* All Four Steps Displayed - Each Floats to Top and Goes Back One by One */}
      <div className="relative z-10 space-y-3.5 mb-4">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          const isFloating = floatingIndex === idx;

          return (
            <motion.div
              key={item.step}
              onClick={() => setFloatingIndex(idx)}
              animate={{
                y: isFloating ? -6 : 0,
                scale: isFloating ? 1.028 : 1,
                zIndex: isFloating ? 25 : 10,
              }}
              whileHover={{ scale: 1.025, x: 2 }}
              transition={{ type: 'spring', stiffness: 360, damping: 26 }}
              className={`relative p-3.5 sm:p-4 rounded-2xl backdrop-blur-md transition-all duration-300 cursor-pointer flex items-center justify-between group ${
                isFloating
                  ? 'bg-gradient-to-r from-forest-900/95 via-[#0e442f]/95 to-forest-900/95 border border-emerald-light/75 shadow-[0_12px_28px_-4px_rgba(46,139,87,0.45),0_0_16px_rgba(74,222,128,0.25)] ring-1 ring-emerald-light/40'
                  : 'bg-forest-950/60 border border-white/10 hover:border-emerald-light/40 hover:bg-forest-950/80 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Step Icon Container with Emerald Theme */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 shrink-0 shadow-sm ${
                    isFloating
                      ? 'bg-emerald text-white shadow-[0_0_16px_rgba(74,222,128,0.6)] ring-2 ring-emerald-light/50 scale-105'
                      : 'bg-forest-900/90 border border-emerald-light/35 text-emerald-light group-hover:bg-emerald group-hover:text-white'
                  }`}
                >
                  <motion.div
                    animate={isFloating ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Icon className="w-4 h-4 text-white transition-colors" />
                  </motion.div>
                </div>

                {/* Step Details */}
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider transition-colors ${
                        isFloating ? 'text-emerald-light font-extrabold' : 'text-emerald-light'
                      }`}
                    >
                      {item.phase}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                      • Step {item.step}
                      {isFloating && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-light animate-ping" />
                      )}
                    </span>
                  </div>
                  <div
                    className={`text-xs font-sans transition-colors ${
                      isFloating ? 'font-extrabold text-white' : 'font-bold text-white/90 group-hover:text-emerald-soft'
                    }`}
                  >
                    {item.title}
                  </div>
                </div>
              </div>

              {/* Verified Checkmark & Floating Active Indicator */}
              <div className="flex items-center gap-2">
                {isFloating && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="hidden sm:inline-block text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-light bg-emerald/30 px-2 py-0.5 rounded-full border border-emerald-light/40 shadow-sm"
                  >
                    Active
                  </motion.span>
                )}
                <motion.div
                  animate={isFloating ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 transition-colors duration-300 ${
                      isFloating
                        ? 'text-emerald-light fill-emerald-light/25 scale-110 drop-shadow-[0_0_6px_rgba(74,222,128,0.5)]'
                        : 'text-emerald-light/80 group-hover:opacity-100 group-hover:scale-110'
                    }`}
                  />
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footnote Bar */}
      <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-gray-300 px-1">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-light animate-pulse" />
          Your Problem First. Technology Second.
        </span>
        <span className="text-emerald-light font-bold hidden sm:inline-block">
          Interactive • 60 FPS
        </span>
      </div>
    </div>
  );
};
