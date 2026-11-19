import React from 'react';
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
  return (
    <section
      id="ofertas"
      className="py-16 sm:py-20 border-b border-stone-200 dark:border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#181614] p-8 sm:p-12 lg:p-14 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
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
            <button
              type="button"
              onClick={onInquiryPromo}
              style={{ backgroundColor: config.accentColor }}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 min-h-[48px] rounded-md text-sm sm:text-base font-semibold text-[#11100F] hover:brightness-110 transition-all whitespace-nowrap cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              Consultar Oferta no WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
