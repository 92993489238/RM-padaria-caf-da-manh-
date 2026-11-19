import React, { useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { Menu, MessageCircle, X } from 'lucide-react';
import { BakeryConfig } from '../types/bakery';

interface NavbarProps {
  config: BakeryConfig;
  cartCount: number;
  onOpenOrderDrawer: () => void;
}

const NAV_LINKS = [
  { href: '#cardapio', label: 'Cardápio' },
  { href: '#galeria', label: 'Galeria' },
  { href: '#ofertas', label: 'Ofertas' },
  { href: '#localizacao', label: 'Localização' },
];

export const Navbar: React.FC<NavbarProps> = ({
  config,
  cartCount,
  onOpenOrderDrawer,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoVideoError, setLogoVideoError] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 dark:border-white/10 bg-[#F8F6F1]/90 dark:bg-[#0F0E0D]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#inicio"
          className="flex items-center gap-3 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D99B38] rounded"
        >
          <span
            style={{ borderColor: config.accentColor }}
            className="relative w-16 h-10 rounded-md p-[2px] border bg-[#141210] shadow-sm overflow-hidden shrink-0 flex items-center justify-center"
          >
            {!logoVideoError ? (
              <video
                src="/assets/aistudio/_CHROMEREVEAL_591083d8_3495663c.mp4"
                poster={config.logoUrl || undefined}
                autoPlay={!prefersReducedMotion}
                loop
                muted
                playsInline
                preload="auto"
                onError={() => setLogoVideoError(true)}
                aria-label={`Logotipo em vídeo de ${config.businessName}`}
                className="w-full h-full object-cover rounded-[3px]"
              />
            ) : config.logoUrl ? (
              <img
                src={config.logoUrl}
                alt={config.businessName}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-[3px] bg-white object-contain"
              />
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 32 32"
                className="w-6 h-6 shrink-0"
                fill="none"
              >
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke={config.accentColor}
                  strokeWidth="1.5"
                />
                <path
                  d="M10 20C10 15.5 12.8 11.5 16 10C19.2 11.5 22 15.5 22 20H10Z"
                  stroke={config.accentColor}
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 14.5L16 17.5M18 14.5L16 17.5"
                  stroke={config.accentColor}
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </span>
          <span className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 dark:text-[#F5F2EB] whitespace-nowrap shrink-0">
            {config.businessName}
          </span>
        </a>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600 dark:text-[#A8A29E]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap shrink-0 py-1 hover:text-stone-950 dark:hover:text-[#F5F2EB] border-b border-transparent hover:border-current transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D99B38]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenOrderDrawer}
            title={
              config.whatsappNumber
                ? `Pedir no WhatsApp (${config.whatsappNumber})`
                : 'Pedir no WhatsApp'
            }
            aria-label={
              config.whatsappNumber
                ? `Pedir no WhatsApp ${config.whatsappNumber}`
                : 'Pedir no WhatsApp'
            }
            style={{ backgroundColor: config.accentColor }}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[40px] rounded-md text-xs sm:text-sm font-semibold text-[#11100F] hover:brightness-110 transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D99B38]"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Pedir no WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
            {cartCount > 0 && (
              <span className="font-mono-tabular text-xs font-bold px-1.5 py-0.5 rounded bg-[#11100F]/15 text-[#11100F]">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-md border border-stone-300 dark:border-white/15 text-stone-800 dark:text-[#F5F2EB] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <nav
          aria-label="Menu móvel"
          className="md:hidden border-t border-stone-200 dark:border-white/10 bg-[#F8F6F1] dark:bg-[#141210] px-4 py-4 flex flex-col gap-2"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-md text-sm font-medium text-stone-800 dark:text-[#F5F2EB] hover:bg-stone-200/60 dark:hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};
