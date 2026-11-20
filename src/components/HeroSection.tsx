import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, MapPin, MessageCircle } from 'lucide-react';
import { BakeryConfig } from '../types/bakery';

interface HeroSectionProps {
  config: BakeryConfig;
  onOpenOrderDrawer: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  config,
  onOpenOrderDrawer,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const displayLocation = [config.neighborhood, config.cityLabel]
    .filter(Boolean)
    .join(' · ');

  return (
    <section
      id="inicio"
      className="relative z-10 overflow-hidden border-b border-stone-200 dark:border-white/10"
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
            className="lg:col-span-7 flex flex-col justify-center"
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

            <p className="text-base sm:text-lg text-stone-700 dark:text-[#D6D1C7] leading-relaxed max-w-[54ch] mb-8">
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
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 min-h-[48px] rounded-md text-sm sm:text-base font-medium border border-stone-300 dark:border-white/20 bg-white/40 dark:bg-black/25 backdrop-blur-sm text-stone-900 dark:text-[#F5F2EB] hover:bg-stone-200/60 dark:hover:bg-white/10 transition-colors duration-150 whitespace-nowrap"
              >
                Explorar Cardápio
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>
            </div>

            {/* Quiet Location */}
            <div className="pt-6 border-t border-stone-200 dark:border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-stone-600 dark:text-[#D6D1C7]">
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
        </div>
      </div>
    </section>
  );
};
