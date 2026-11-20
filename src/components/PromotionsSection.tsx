import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { BakeryConfig } from '../types/bakery';

interface PromotionsSectionProps {
  config: BakeryConfig;
  onInquiryPromo: () => void;
}

export const PromotionsSection: React.FC<PromotionsSectionProps> = ({
  config,
  onInquiryPromo,
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="ofertas"
      className="relative z-10 py-16 sm:py-20 border-b border-stone-200 dark:border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-stone-200 dark:border-white/12 bg-white/92 dark:bg-[#141210]/80 backdrop-blur-md p-8 sm:p-12 lg:p-14 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-xl">
          <div className="max-w-2xl">
            <p
              className="text-xs font-semibold tracking-wide mb-3"
              style={{ color: config.accentColor }}
            >
              Ofertas & Encomendas Especiais
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-[#F5F2EB] text-balance mb-4">
              {config.promoTitle}
            </h2>
            <p className="text-base text-stone-600 dark:text-[#A8A29E] leading-relaxed mb-4">
              {config.promoDescription}
            </p>
            <p className="text-xs text-stone-500 dark:text-[#A8A29E]/80">
              {config.promoTerms}
            </p>
          </div>

          <div className="shrink-0">
            <motion.button
              type="button"
              onClick={onInquiryPromo}
              style={{ backgroundColor: config.accentColor }}
              animate={prefersReducedMotion ? undefined : { y: [0, -4, 0] }}
              transition={
                prefersReducedMotion
                  ? undefined
                  : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
              }
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : { y: -6, scale: 1.03, transition: { duration: 0.2, ease: 'easeOut' } }
              }
              whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 min-h-[48px] rounded-full text-sm sm:text-base font-semibold text-[#11100F] ring-1 ring-white/25 shadow-[0_12px_28px_-6px_rgba(217,155,56,0.55),0_6px_14px_rgba(0,0,0,0.3)] hover:brightness-110 hover:shadow-[0_16px_32px_-6px_rgba(217,155,56,0.7),0_8px_18px_rgba(0,0,0,0.35)] transition-[filter,box-shadow] duration-200 whitespace-nowrap cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              Consultar Oferta no WhatsApp
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};
