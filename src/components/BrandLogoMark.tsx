import React from 'react';

interface BrandLogoMarkProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  glowIntensity?: 'subtle' | 'medium' | 'high';
}

export const BrandLogoMark: React.FC<BrandLogoMarkProps> = ({
  size = 'md',
  className = '',
  glowIntensity = 'subtle',
}) => {
  // Dimension mapping
  const sizeMap = {
    sm: {
      box: 'w-9 h-9',
      svgSize: 52,
      textSize: 'text-base',
      rounded: 'rounded-xl',
      insetPad: 'p-1',
    },
    md: {
      box: 'w-10 h-10',
      svgSize: 60,
      textSize: 'text-lg',
      rounded: 'rounded-xl',
      insetPad: 'p-1.5',
    },
    lg: {
      box: 'w-12 h-12',
      svgSize: 72,
      textSize: 'text-xl',
      rounded: 'rounded-2xl',
      insetPad: 'p-2',
    },
    xl: {
      box: 'w-16 h-16',
      svgSize: 96,
      textSize: 'text-2xl',
      rounded: 'rounded-2xl',
      insetPad: 'p-2.5',
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 select-none group ${className}`}
      style={{ isolation: 'isolate' }}
    >
      {/* 1. LUZ TENUE / AMBIENT SOFT GLOW (Atmospheric Backing) */}
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-600/40 via-indigo-500/30 to-sky-400/20 blur-md pointer-events-none transform-gpu animate-pulse"
        style={{
          animationDuration: '3.5s',
          transform: 'scale(1.15)',
        }}
      />
      
      {/* Halo secundario de luz suave */}
      <div 
        className="absolute -inset-1 rounded-2xl bg-blue-500/20 blur-lg pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity duration-500 transform-gpu"
      />

      {/* 2. LAZO AZUL VECTORIAL FLUIDO (SVG Glowing Ribbon & Loop) */}
      <svg
        className="absolute pointer-events-none transform-gpu overflow-visible"
        width={currentSize.svgSize}
        height={currentSize.svgSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ zIndex: 1 }}
      >
        <defs>
          {/* Gradiente principal del lazo azul */}
          <linearGradient id="ribbonBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#2563EB" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.4" />
          </linearGradient>

          {/* Gradiente de destello del lazo */}
          <linearGradient id="ribbonBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#60A5FA" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>

          {/* Filtro de resplandor suave */}
          <filter id="subtleRibbonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Lazo azul base con resplandor */}
        <path
          d="M 12,50 C 12,22 24,12 50,12 C 78,12 88,24 88,50 C 88,78 76,88 50,88 C 22,88 10,72 10,50"
          stroke="url(#ribbonBlueGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#subtleRibbonGlow)"
          className="opacity-75"
        />

        {/* Haz de luz animado continuo que viaja por el lazo (Zero-latency CSS) */}
        <path
          d="M 12,50 C 12,22 24,12 50,12 C 78,12 88,24 88,50 C 88,78 76,88 50,88 C 22,88 10,72 10,50"
          stroke="url(#ribbonBeamGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="60 220"
          className="brand-ribbon-stream"
        />

        {/* Lazo de cola estilizada que emerge de la esquina inferior del logo */}
        <path
          d="M 28,78 C 16,86 4,78 2,64 C 0,48 10,38 18,36"
          stroke="url(#ribbonBlueGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="30 80"
          className="brand-ribbon-tail opacity-70"
        />

        {/* Micro-partícula brillante orbitante en el lazo */}
        <circle
          r="2.5"
          fill="#E0F2FE"
          filter="drop-shadow(0 0 4px #38BDF8)"
          className="brand-orbital-dot"
        >
          <animateMotion
            path="M 12,50 C 12,22 24,12 50,12 C 78,12 88,24 88,50 C 88,78 76,88 50,88 C 22,88 10,72 10,50"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      {/* 3. CUADRADO DEL LOGO (Con luz tenue perimetral y gradiente premium) */}
      <div
        className={`relative ${currentSize.box} ${currentSize.rounded} bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-700 flex items-center justify-center font-bold text-white shadow-lg border border-indigo-400/40 transform-gpu transition-all duration-300 group-hover:scale-105 group-hover:border-indigo-300/60`}
        style={{
          boxShadow:
            glowIntensity === 'high'
              ? '0 0 25px rgba(99, 102, 241, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.4)'
              : '0 4px 18px rgba(79, 70, 229, 0.38), 0 0 12px rgba(59, 130, 246, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
          zIndex: 2,
        }}
      >
        {/* Reflejo de cristal superior (Luz sutil de borde) */}
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/25 via-transparent to-black/10 pointer-events-none" />

        {/* 4. LA 'H' CON ANIMACIÓN PREMIUM SIN LATENCIA */}
        <span
          className={`relative z-10 font-extrabold ${currentSize.textSize} tracking-normal text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] transform-gpu transition-transform duration-300 group-hover:scale-110 will-change-transform flex items-center justify-center`}
          style={{
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          {/* Brillo suave interno en la H */}
          <span className="brand-h-glow">H</span>
        </span>
      </div>
    </div>
  );
};
