import React from 'react';

interface KryptonodeLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  lightMode?: boolean;
}

export const KryptonodeLogo: React.FC<KryptonodeLogoProps> = ({ size = 'md', lightMode = false }) => {
  const dimensions = {
    sm: { textMain: 'text-xl', textSub: 'text-[10px]', iconSize: 42 },
    md: { textMain: 'text-2xl sm:text-[26px]', textSub: 'text-[10.5px] sm:text-[11.5px]', iconSize: 52 },
    lg: { textMain: 'text-3xl sm:text-4xl', textSub: 'text-xs', iconSize: 64 },
    hero: { textMain: 'text-4xl sm:text-5xl', textSub: 'text-sm', iconSize: 84 },
  }[size];

  return (
    <div className="flex items-center gap-3.5 inline-flex select-none group">
      {/* Official KTS Orbital Logo Image */}
      <div className="relative flex items-center justify-center shrink-0 p-0.5 rounded-full bg-forest-950/10 border-2 border-emerald/40 shadow-forest-subtle group-hover:border-emerald group-hover:shadow-forest-glow transition-all duration-300">
        <img
          src="/kts-logo.png"
          alt="Kryptonode Logo"
          style={{ width: dimensions.iconSize, height: dimensions.iconSize }}
          className="object-contain rounded-full"
        />
      </div>

      {/* Kryptonode Company Name Text */}
      <div className="flex flex-col text-left">
        <div className={`${dimensions.textMain} font-black tracking-tight font-sans leading-none flex items-center`}>
          <span className={lightMode ? 'text-white' : 'text-forest-950'}>Kryptonode</span>
        </div>
        <span className={`${dimensions.textSub} font-mono tracking-[0.16em] uppercase mt-1 font-bold ${
          lightMode ? 'text-emerald-light' : 'text-emerald-700'
        }`}>
          Tech Solutions Pvt Ltd
        </span>
      </div>
    </div>
  );
};
