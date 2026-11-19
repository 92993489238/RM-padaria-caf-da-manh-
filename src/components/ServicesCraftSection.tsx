import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { BakeryConfig } from '../types/bakery';
import { ResilientImage } from './ResilientImage';

interface ServicesCraftSectionProps {
  config: BakeryConfig;
}

const CRAFT_PILLARS = [
  {
    index: '01.',
    title: 'Fornadas Diárias e Fermentação Cuidada',
    description:
      'Pães assados em ritmo contínuo para garantir casca crocante, miolo macio e frescor real do balcão à sua mesa.',
  },
  {
    index: '02.',
    title: 'Sabores Regionais de Manaus',
    description:
      'Receitas tradicionais que valorizam o paladar amazônico, como bolo de macaxeira, tapioca preparada na hora e café fresco.',
  },
  {
    index: '03.',
    title: 'Encomendas Diretas pelo WhatsApp',
    description:
      'Atendimento ágil para pedidos do dia a dia, cestas de café da manhã, lanches em família e eventos corporativos.',
  },
];

export const ServicesCraftSection: React.FC<ServicesCraftSectionProps> = ({ config }) => {
  const prefersReducedMotion = useReducedMotion();
  const [videoError, setVideoError] = useState(false);

  return (
    <section className="py-16 sm:py-24 border-b border-stone-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Editorial Storytelling Media */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex"
          >
            <div className="relative w-full min-h-[320px] lg:h-full rounded-xl overflow-hidden border border-stone-200 dark:border-white/10 bg-[#181614]">
              {!videoError ? (
                <video
                  src="/assets/aistudio/Drone_flying_to_storefront_6e2cf2f0_af445927.mp4"
                  poster={config.storyImage}
                  autoPlay={!prefersReducedMotion}
                  loop
                  muted
                  playsInline
                  controls={Boolean(prefersReducedMotion)}
                  preload="auto"
                  onError={() => setVideoError(true)}
                  aria-label="Chegada aérea à Panificadora e Confeitaria RM"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <ResilientImage
                  src={config.storyImage}
                  alt="Mestre padeiro preparando massa artesanal"
                  className="absolute inset-0 w-full h-full object-cover"
                  fallbackTitle={config.storyHeadline}
                />
              )}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent"
              />
              <div className="absolute bottom-0 inset-x-0 p-6">
                <p className="text-xs text-[#E7E5E4]/80 mb-1">Ofício de Padaria</p>
                <p className="font-display text-2xl font-semibold text-[#F5F2EB]">
                  {config.storyHeadline}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Editorial Numbered Services List */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p
              className="text-xs font-semibold tracking-wide mb-3"
              style={{ color: config.accentColor }}
            >
              Essência & Serviços
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-[#F5F2EB] text-balance mb-4">
              Tradição saborosa da melhor padaria do São Jorge, Amazonas, Brasil.
            </h2>
            <p className="text-base text-stone-600 dark:text-[#A8A29E] leading-relaxed mb-10 max-w-[60ch]">
              {config.storyDescription}
            </p>

            <div className="divide-y divide-stone-200 dark:divide-white/10 border-y border-stone-200 dark:border-white/10">
              {CRAFT_PILLARS.map((pillar, idx) => (
                <motion.div
                  key={pillar.index}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.45,
                    delay: idx * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="py-5 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-baseline"
                >
                  <span
                    className="sm:col-span-2 font-mono-tabular text-sm font-medium"
                    style={{ color: config.accentColor }}
                  >
                    {pillar.index}
                  </span>
                  <div className="sm:col-span-10">
                    <h3 className="font-display text-2xl font-semibold text-stone-900 dark:text-[#F5F2EB] mb-1.5">
                      {pillar.title}
                    </h3>
                    <p className="text-sm sm:text-base text-stone-600 dark:text-[#A8A29E] leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
