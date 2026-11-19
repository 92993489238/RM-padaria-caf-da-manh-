import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, MapPin, MessageCircle } from 'lucide-react';
import { BakeryConfig } from '../types/bakery';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  config: BakeryConfig;
  onOpenOrderDrawer: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  config,
  onOpenOrderDrawer,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const [videoError, setVideoError] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: Number((-y * 6).toFixed(2)),
      rotateY: Number((x * 6).toFixed(2)),
    });
  };

  const resetTilt = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const displayLocation = [config.neighborhood, config.cityLabel]
    .filter(Boolean)
    .join(' · ');

  return (
    <section
      id="inicio"
      className="relative overflow-hidden border-b border-stone-200 dark:border-white/10"
    >
      {/* Subtle radial oven warmth backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 w-[640px] h-[640px] rounded-full opacity-20 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${config.accentColor}44 0%, transparent 70%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Editorial Headline & Primary Conversion CTA */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <p
              className="text-xs sm:text-sm font-medium tracking-wide mb-4"
              style={{ color: config.accentColor }}
            >
              {config.heroEyebrow}
            </p>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.65rem] font-semibold tracking-tight leading-[1.08] text-stone-900 dark:text-[#F5F2EB] text-balance mb-6">
              {config.heroHeadline}
            </h1>

            <p className="text-base sm:text-lg text-stone-600 dark:text-[#A8A29E] leading-relaxed max-w-[54ch] mb-8">
              {config.heroSubheadline}
            </p>

            {/* Primary & Secondary Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                type="button"
                onClick={onOpenOrderDrawer}
                style={{ backgroundColor: config.accentColor }}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 min-h-[48px] rounded-md text-sm sm:text-base font-semibold text-[#11100F] hover:brightness-110 transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D99B38]"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                Fazer Pedido no WhatsApp
              </button>

              <a
                href="#cardapio"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 min-h-[48px] rounded-md text-sm sm:text-base font-medium border border-stone-300 dark:border-white/15 text-stone-800 dark:text-[#F5F2EB] hover:bg-stone-200/60 dark:hover:bg-white/5 transition-colors duration-150 whitespace-nowrap"
              >
                Explorar Cardápio
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>
            </div>

            {/* Quiet Location */}
            <div className="pt-6 border-t border-stone-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-stone-500 dark:text-[#A8A29E]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" style={{ color: config.accentColor }} />
                <span>{displayLocation}</span>
                {config.openingHours && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{config.openingHours}</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Cinematic 3D Depth Video Frame */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex"
          >
            <div
              ref={frameRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={resetTilt}
              style={{
                transform: prefersReducedMotion
                  ? undefined
                  : `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="relative w-full min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] lg:h-full rounded-xl overflow-hidden border border-stone-300/80 dark:border-white/10 bg-[#181614] shadow-2xl"
            >
              {!videoError ? (
                <video
                  src="/assets/aistudio/Coffee_and_cheese_bread_commercial_d71928b8_34e80119.mp4"
                  poster={config.heroImage}
                  autoPlay={!prefersReducedMotion}
                  loop
                  muted
                  playsInline
                  controls={Boolean(prefersReducedMotion)}
                  preload="auto"
                  onError={() => setVideoError(true)}
                  aria-label={`${config.businessName} em ${config.cityLabel} — café fresco e pão de queijo artesanal`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <ResilientImage
                  src={config.heroImage}
                  alt={`${config.businessName} em ${config.cityLabel}`}
                  className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
                  fallbackTitle={config.businessName}
                />
              )}

              {/* Measured Cinematic Contrast Scrim */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
              />

              {/* Subtle 3D Layered Caption */}
              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-xs text-[#E7E5E4]/80 mb-1">
                    Panificação e Confeitaria · {config.cityLabel}
                  </p>
                  <p className="font-display text-2xl sm:text-3xl font-semibold text-[#F5F2EB]">
                    {config.businessName}
                  </p>
                </div>
                <span className="text-xs font-medium text-[#E7E5E4]/90 whitespace-nowrap">
                  Fornadas frescas & Encomendas
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
