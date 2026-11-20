import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Plus, Search, ShoppingBag } from 'lucide-react';
import { BakeryConfig, MenuCategory, MenuItem } from '../types/bakery';
import { CulinaryVideoPlayer } from './CulinaryVideoPlayer';
import { ResilientImage } from './ResilientImage';

interface MenuCatalogSectionProps {
  config: BakeryConfig;
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  onQuickWhatsAppItem: (item: MenuItem) => void;
}

const CATEGORIES: MenuCategory[] = [
  'Todos',
  'Pães',
  'Bolos & Folhados',
  'Café Regional',
  'Encomendas',
];

export const MenuCatalogSection: React.FC<MenuCatalogSectionProps> = ({
  config,
  items,
  onAddToCart,
  onQuickWhatsAppItem,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'Todos' || item.category === selectedCategory;
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [items, selectedCategory, searchQuery]);

  const handleAdd = (item: MenuItem) => {
    onAddToCart(item);
    setJustAddedId(item.id);
    window.setTimeout(() => {
      setJustAddedId((curr) => (curr === item.id ? null : curr));
    }, 1200);
  };

  return (
    <section
      id="cardapio"
      className="relative z-10 py-16 sm:py-24 border-b border-stone-200 dark:border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Search */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p
              className="text-xs font-semibold tracking-wide mb-2"
              style={{ color: config.accentColor }}
            >
              Catálogo & Cardápio
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-900 dark:text-[#F5F2EB] text-balance">
              Seleção da Casa
            </h2>
          </div>

          <div className="w-full lg:w-80 relative">
            <label htmlFor="menu-search" className="sr-only">
              Buscar no cardápio
            </label>
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="menu-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar pães, bolos, café..."
              className="w-full pl-10 pr-4 py-2.5 min-h-[44px] rounded-md text-sm bg-white dark:bg-[#181614] border border-stone-300 dark:border-white/10 text-stone-900 dark:text-[#F5F2EB] placeholder:text-stone-400 focus:outline-none focus:border-[#D99B38]"
            />
          </div>
        </div>

        {/* Interactive Category Segmented Filter Tabs */}
        <div
          role="tablist"
          aria-label="Categorias do cardápio"
          className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-10"
        >
          {CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setSelectedCategory(category)}
                style={
                  active
                    ? { backgroundColor: config.accentColor, color: '#11100F' }
                    : undefined
                }
                className={`px-4 py-2 min-h-[40px] rounded-md text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer ${
                  active
                    ? 'font-semibold shadow-sm'
                    : 'bg-stone-200/70 dark:bg-[#1A1816] text-stone-700 dark:text-[#A8A29E] hover:text-stone-950 dark:hover:text-[#F5F2EB] border border-stone-300/60 dark:border-white/10'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {filteredItems.length === 0 ? (
          <div className="rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#181614] p-12 text-center">
            <p className="font-display text-2xl text-stone-900 dark:text-[#F5F2EB] mb-2">
              Nenhum item encontrado
            </p>
            <p className="text-sm text-stone-500 dark:text-[#A8A29E] mb-6">
              Tente limpar a busca ou selecionar outra categoria do cardápio.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Todos');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-md text-sm font-medium border border-stone-300 dark:border-white/15 text-stone-800 dark:text-[#F5F2EB] cursor-pointer"
            >
              Ver todo o cardápio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => {
              const isJustAdded = justAddedId === item.id;
              const showVideo = Boolean(item.videoUrl);
              return (
                <motion.article
                  key={`${selectedCategory}-${item.id}`}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={
                    prefersReducedMotion
                      ? undefined
                      : { y: -2, transition: { duration: 0.2, ease: 'easeOut' } }
                  }
                  viewport={{ once: true, amount: 0.18 }}
                  transition={{
                    duration: 0.65,
                    delay: prefersReducedMotion ? 0 : (idx % 3) * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group flex flex-col rounded-xl overflow-hidden bg-white/92 dark:bg-[#141210]/80 backdrop-blur-md border border-stone-200 dark:border-white/12 shadow-lg"
                >
                  {/* 4:3 Uniform Imagery / Video */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#141210]">
                    {showVideo && item.videoUrl ? (
                      <CulinaryVideoPlayer
                        src={item.videoUrl}
                        poster={item.image}
                        title={item.name}
                        accentColor={config.accentColor}
                        controlsPosition="bottom"
                        disableAudio={Boolean(item.muteAudio)}
                        customAudioText={item.customAudioText}
                        customAudioVoice={item.customAudioVoice}
                        videoClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <ResilientImage
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        fallbackTitle={item.name}
                      />
                    )}
                  </div>

                  {/* Card Body with Identical Field Order */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Zero-pill quiet metadata */}
                    <p className="text-xs text-stone-500 dark:text-[#A8A29E] mb-2">
                      <span>{item.category}</span>
                      {item.unitLabel && (
                        <>
                          <span aria-hidden="true" className="mx-1.5">
                            ·
                          </span>
                          <span>{item.unitLabel}</span>
                        </>
                      )}
                    </p>

                    <h3 className="font-display text-2xl font-semibold text-stone-900 dark:text-[#F5F2EB] mb-2">
                      {item.name}
                    </h3>

                    <p className="text-sm text-stone-600 dark:text-[#A8A29E] leading-relaxed mb-6 flex-1">
                      {item.description}
                    </p>

                    {/* Tabular Price & Actions */}
                    <div className="pt-4 border-t border-stone-200 dark:border-white/10 flex items-center justify-between gap-3">
                      <span className="font-mono-tabular text-sm font-semibold text-stone-900 dark:text-[#F5F2EB]">
                        {item.price ? item.price : 'Consultar valor'}
                      </span>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleAdd(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-md text-xs font-medium border border-stone-300 dark:border-white/15 text-stone-800 dark:text-[#F5F2EB] hover:bg-stone-100 dark:hover:bg-white/5 transition-colors whitespace-nowrap cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          {isJustAdded ? 'Adicionado' : 'Adicionar'}
                        </button>

                        <button
                          type="button"
                          onClick={() => onQuickWhatsAppItem(item)}
                          style={{ backgroundColor: config.accentColor }}
                          className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-md text-xs font-semibold text-[#11100F] hover:brightness-110 transition-all whitespace-nowrap cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          Pedir
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
