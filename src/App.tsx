/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_BAKERY_CONFIG,
  DEFAULT_GALLERY_ITEMS,
  DEFAULT_MENU_ITEMS,
  DEFAULT_TESTIMONIALS,
} from './data/defaultBakeryData';
import {
  BakeryConfig,
  CartEntry,
  MenuItem,
  TestimonialItem,
} from './types/bakery';
import { Navbar } from './components/Navbar';
import { GlobalVideoBackground } from './components/GlobalVideoBackground';
import { HeroSection } from './components/HeroSection';
import { ServicesCraftSection } from './components/ServicesCraftSection';
import { MenuCatalogSection } from './components/MenuCatalogSection';
import { CinematicGallerySection } from './components/CinematicGallerySection';
import { PromotionsSection } from './components/PromotionsSection';
import { LocationMapSection } from './components/LocationMapSection';
import { Footer } from './components/Footer';
import { WhatsAppOrderDrawer } from './components/WhatsAppOrderDrawer';
import { SiteCustomizerDrawer } from './components/SiteCustomizerDrawer';

const STORAGE_KEYS = {
  config: 'mei_siteam_padaria_gosto_config_v1',
  menu: 'mei_siteam_padaria_gosto_menu_v1',
  testimonials: 'mei_siteam_padaria_gosto_reviews_v1',
};

function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [config, setConfig] = useState<BakeryConfig>(() => {
    const stored = loadStored(STORAGE_KEYS.config, DEFAULT_BAKERY_CONFIG);
    const previousDefaultHeadlines = [
      'Da massa descansada ao calor do forno de pedra.',
      'A melhor culinária do café da manhã em Manaus',
    ];
    return {
      ...DEFAULT_BAKERY_CONFIG,
      ...stored,
      whatsappNumber: stored.whatsappNumber || DEFAULT_BAKERY_CONFIG.whatsappNumber,
      logoUrl: stored.logoUrl || DEFAULT_BAKERY_CONFIG.logoUrl,
      storyHeadline:
        !stored.storyHeadline ||
        previousDefaultHeadlines.includes(stored.storyHeadline)
          ? DEFAULT_BAKERY_CONFIG.storyHeadline
          : stored.storyHeadline,
    };
  });
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const stored = loadStored(STORAGE_KEYS.menu, DEFAULT_MENU_ITEMS);
    const oldFirstImage =
      '/src/assets/images/menu_paes_artesanais_1794763142635.jpg';
    const oldFirstName = 'Pão Francês na Chapa & Fornada';
    const oldFirstDesc =
      'Clássico pão de sal assado em fornadas contínuas para chegar crocante e macio à mesa do café da manhã.';
    return stored.map((item, index) => {
      if (index === 0) {
        return {
          ...item,
          image:
            item.image === oldFirstImage
              ? DEFAULT_MENU_ITEMS[0].image
              : item.image,
          name:
            item.name === oldFirstName
              ? DEFAULT_MENU_ITEMS[0].name
              : item.name,
          description:
            item.description === oldFirstDesc
              ? DEFAULT_MENU_ITEMS[0].description
              : item.description,
          videoUrl: item.videoUrl || DEFAULT_MENU_ITEMS[0].videoUrl,
        };
      }
      if (item.id === 'pao-fermentacao-natural') {
        const defaultRustic = DEFAULT_MENU_ITEMS.find(
          (d) => d.id === 'pao-fermentacao-natural',
        );
        return {
          ...item,
          name:
            item.name === 'Pão Rústico de Fermentação Lenta' && defaultRustic
              ? defaultRustic.name
              : item.name,
          videoUrl: item.videoUrl || defaultRustic?.videoUrl,
        };
      }
      if (item.id === 'bolo-macaxeira-regional') {
        const defaultMacaxeira = DEFAULT_MENU_ITEMS.find(
          (d) => d.id === 'bolo-macaxeira-regional',
        );
        const oldMacaxeiraDesc =
          'Preparado com macaxeira fresca e toque dourado de forno, trazendo o sabor tradicional das manhãs do Amazonas.';
        return {
          ...item,
          name:
            item.name === 'Bolo de Macaxeira Caramelizado' && defaultMacaxeira
              ? defaultMacaxeira.name
              : item.name,
          description:
            item.description === oldMacaxeiraDesc && defaultMacaxeira
              ? defaultMacaxeira.description
              : item.description,
          videoUrl: item.videoUrl || defaultMacaxeira?.videoUrl,
          muteAudio: item.muteAudio ?? defaultMacaxeira?.muteAudio,
        };
      }
      if (item.id === 'croissant-manteiga') {
        const defaultItem = DEFAULT_MENU_ITEMS.find(
          (d) => d.id === 'croissant-manteiga',
        );
        const oldMagazineVideo =
          '/assets/aistudio/Pessoas_foliando_revista_na_padaria_d43627a9_55c74e80.mp4';
        const isOldVideo = !item.videoUrl || item.videoUrl === oldMagazineVideo;
        const oldTitles = [
          'Croissant Folhado na Manteiga',
          'Tapioca mais saborosa do São Jorge só aqui na RM Padaria',
        ];
        return {
          ...item,
          name:
            oldTitles.includes(item.name) && defaultItem
              ? defaultItem.name
              : item.name,
          videoUrl: isOldVideo ? defaultItem?.videoUrl : item.videoUrl,
          customAudioText: isOldVideo ? undefined : item.customAudioText,
          customAudioVoice: isOldVideo ? undefined : item.customAudioVoice,
        };
      }
      if (item.id === 'combo-cafe-tapioca') {
        const defaultCombo = DEFAULT_MENU_ITEMS.find(
          (d) => d.id === 'combo-cafe-tapioca',
        );
        const oldComboImage =
          '/src/assets/images/menu_cafe_tapioca_1794763143931.jpg';
        return {
          ...item,
          name:
            item.name === 'Café Regional com Pão de Queijo e Tapioca' &&
            defaultCombo
              ? defaultCombo.name
              : item.name,
          price: item.price || defaultCombo?.price || 'R$ 15,00',
          unitLabel:
            item.unitLabel === 'Combo Individual' ? '' : item.unitLabel,
          image:
            (!item.image || item.image === oldComboImage) && defaultCombo
              ? defaultCombo.image
              : item.image,
          videoUrl: item.videoUrl || defaultCombo?.videoUrl,
        };
      }
      if (item.id === 'cesta-cafe-encomenda' && !item.videoUrl) {
        const fallbackBasket = DEFAULT_MENU_ITEMS.find(
          (d) => d.id === 'cesta-cafe-encomenda',
        );
        return fallbackBasket?.videoUrl
          ? { ...item, videoUrl: fallbackBasket.videoUrl }
          : item;
      }
      return item;
    });
  });
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() =>
    loadStored(STORAGE_KEYS.testimonials, DEFAULT_TESTIMONIALS),
  );

  const [cart, setCart] = useState<CartEntry[]>([]);
  const [orderDrawerOpen, setOrderDrawerOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [orderNote, setOrderNote] = useState('');

  // Sync Tailwind v4 dark class & CSS accent token with config
  useEffect(() => {
    const root = document.documentElement;
    if (config.themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.style.setProperty('--brand-accent', config.accentColor);
    document.title = `${config.businessName} – ${config.cityLabel}`;
  }, [config.themeMode, config.accentColor, config.businessName, config.cityLabel]);

  // Persist customizations locally
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(config));
    } catch {
      // Ignore storage quota issues
    }
  }, [config]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.menu, JSON.stringify(menuItems));
    } catch {
      // Ignore storage quota issues
    }
  }, [menuItems]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.testimonials,
        JSON.stringify(testimonials),
      );
    } catch {
      // Ignore storage quota issues
    }
  }, [testimonials]);

  const totalCartItems = useMemo(
    () => cart.reduce((acc, entry) => acc + entry.quantity, 0),
    [cart],
  );

  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((entry) => entry.item.id === item.id);
      if (existing) {
        return prev.map((entry) =>
          entry.item.id === item.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry,
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleQuickWhatsAppItem = (item: MenuItem) => {
    handleAddToCart(item);
    setOrderNote('');
    setOrderDrawerOpen(true);
  };

  const handleUpdateQty = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((entry) =>
          entry.item.id === itemId
            ? { ...entry, quantity: entry.quantity + delta }
            : entry,
        )
        .filter((entry) => entry.quantity > 0),
    );
  };

  const handleInquiryPromo = () => {
    setOrderNote(`Gostaria de consultar informações sobre: ${config.promoTitle}.`);
    setOrderDrawerOpen(true);
  };

  const handleResetDefaults = () => {
    setConfig(DEFAULT_BAKERY_CONFIG);
    setMenuItems(DEFAULT_MENU_ITEMS);
    try {
      window.localStorage.removeItem(STORAGE_KEYS.config);
      window.localStorage.removeItem(STORAGE_KEYS.menu);
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent text-stone-900 dark:text-[#F5F2EB] transition-colors duration-200">
      <GlobalVideoBackground
        posterImage={config.heroImage}
        businessName={config.businessName}
        themeMode={config.themeMode}
      />
      <Navbar
        config={config}
        cartCount={totalCartItems}
        onOpenOrderDrawer={() => {
          setOrderNote('');
          setOrderDrawerOpen(true);
        }}
      />

      <main>
        <HeroSection
          config={config}
          onOpenOrderDrawer={() => {
            setOrderNote('');
            setOrderDrawerOpen(true);
          }}
        />

        <ServicesCraftSection config={config} />

        <MenuCatalogSection
          config={config}
          items={menuItems}
          onAddToCart={handleAddToCart}
          onQuickWhatsAppItem={handleQuickWhatsAppItem}
        />

        <CinematicGallerySection config={config} items={DEFAULT_GALLERY_ITEMS} />

        <PromotionsSection config={config} onInquiryPromo={handleInquiryPromo} />

        <LocationMapSection
          config={config}
          onOpenOrderDrawer={() => {
            setOrderNote('');
            setOrderDrawerOpen(true);
          }}
          onOpenCustomizer={() => setCustomizerOpen(true)}
        />
      </main>

      <Footer config={config} />

      <WhatsAppOrderDrawer
        isOpen={orderDrawerOpen}
        onClose={() => setOrderDrawerOpen(false)}
        config={config}
        cart={cart}
        initialNote={orderNote}
        onUpdateQty={handleUpdateQty}
        onClearCart={() => setCart([])}
        onSaveWhatsappNumber={(num) =>
          setConfig((prev) => ({ ...prev, whatsappNumber: num }))
        }
      />

      <SiteCustomizerDrawer
        isOpen={customizerOpen}
        onClose={() => setCustomizerOpen(false)}
        config={config}
        menuItems={menuItems}
        testimonials={testimonials}
        onChangeConfig={setConfig}
        onChangeMenuItems={setMenuItems}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
