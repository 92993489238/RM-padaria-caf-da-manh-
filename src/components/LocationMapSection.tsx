import React from 'react';
import { Clock, ExternalLink, MapPin, MessageCircle } from 'lucide-react';
import { BakeryConfig } from '../types/bakery';

interface LocationMapSectionProps {
  config: BakeryConfig;
  onOpenOrderDrawer: () => void;
  onOpenCustomizer: () => void;
}

export const LocationMapSection: React.FC<LocationMapSectionProps> = ({
  config,
  onOpenOrderDrawer,
  onOpenCustomizer,
}) => {
  const locationParts = [
    config.streetAddress,
    config.neighborhood,
    config.cityLabel,
  ].filter(Boolean);
  const fullLocation = locationParts.join(', ');
  const mapQuery = encodeURIComponent(fullLocation || 'Manaus, Amazonas, Brasil');

  return (
    <section id="localizacao" className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Contact & Location Details */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <p
              className="text-xs font-semibold tracking-wide mb-2"
              style={{ color: config.accentColor }}
            >
              Localização & Contato
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-[#F5F2EB] text-balance mb-6">
              Atendimento em {config.cityLabel}
            </h2>

            <div className="space-y-5 border-y border-stone-200 dark:border-white/10 py-6 mb-8">
              <div className="flex items-start gap-3">
                <MapPin
                  className="w-5 h-5 mt-0.5 shrink-0"
                  style={{ color: config.accentColor }}
                />
                <div>
                  <p className="text-xs font-medium text-stone-500 dark:text-[#A8A29E] mb-0.5">
                    Endereço
                  </p>
                  <p className="text-sm sm:text-base text-stone-900 dark:text-[#F5F2EB]">
                    {config.streetAddress || config.neighborhood
                      ? fullLocation
                      : `${config.cityLabel} — Endereço exato a definir no painel`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock
                  className="w-5 h-5 mt-0.5 shrink-0"
                  style={{ color: config.accentColor }}
                />
                <div>
                  <p className="text-xs font-medium text-stone-500 dark:text-[#A8A29E] mb-0.5">
                    Horário de Funcionamento
                  </p>
                  <p className="text-sm sm:text-base text-stone-900 dark:text-[#F5F2EB]">
                    {config.openingHours ||
                      'Horário de atendimento confirmado pelo WhatsApp'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenOrderDrawer}
                style={{ backgroundColor: config.accentColor }}
                className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-md text-sm font-semibold text-[#11100F] hover:brightness-110 transition-all whitespace-nowrap cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                Chamar no WhatsApp
              </button>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 min-h-[44px] rounded-md text-sm font-medium border border-stone-300 dark:border-white/15 text-stone-800 dark:text-[#F5F2EB] hover:bg-stone-200/60 dark:hover:bg-white/5 transition-colors whitespace-nowrap"
              >
                Abrir no Google Maps
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {!config.streetAddress && (
              <button
                type="button"
                onClick={onOpenCustomizer}
                className="mt-5 self-start text-xs text-stone-500 dark:text-[#A8A29E] underline underline-offset-4 hover:text-stone-900 dark:hover:text-[#F5F2EB] cursor-pointer"
              >
                Configurar endereço e horário exatos da loja
              </button>
            )}
          </div>

          {/* Google Maps Embed */}
          <div className="lg:col-span-7 min-h-[340px] lg:min-h-[420px] rounded-xl overflow-hidden border border-stone-200 dark:border-white/10 bg-[#181614]">
            <iframe
              title={`Mapa de localização de ${config.businessName} em ${config.cityLabel}`}
              src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full min-h-[340px] border-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
