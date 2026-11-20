import React from 'react';
import { BakeryConfig } from '../types/bakery';

interface FooterProps {
  config: BakeryConfig;
}

export const Footer: React.FC<FooterProps> = ({ config }) => {
  return (
    <footer className="relative z-10 border-t border-stone-200 dark:border-white/10 bg-[#F8F6F1]/75 dark:bg-[#0F0E0D]/55 backdrop-blur-sm py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs sm:text-sm text-stone-600 dark:text-[#D6D1C7]">
        <div>
          <p className="font-display text-xl font-semibold text-stone-900 dark:text-[#F5F2EB]">
            {config.businessName}
          </p>
          <p className="mt-1">
            {config.cityLabel}
            {config.neighborhood ? ` · ${config.neighborhood}` : ''}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <a href="#cardapio" className="hover:text-stone-900 dark:hover:text-white">
            Cardápio
          </a>
          <a href="#galeria" className="hover:text-stone-900 dark:hover:text-white">
            Galeria
          </a>
          <a href="#localizacao" className="hover:text-stone-900 dark:hover:text-white">
            Localização
          </a>
        </div>
      </div>
    </footer>
  );
};
