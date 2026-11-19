export type MenuCategory =
  | 'Todos'
  | 'Pães'
  | 'Bolos & Folhados'
  | 'Café Regional'
  | 'Encomendas';

export interface MenuItem {
  id: string;
  name: string;
  category: Exclude<MenuCategory, 'Todos'>;
  subtitle: string;
  description: string;
  /** Keep empty ("") until the owner configures real pricing. Never fabricate prices. */
  price: string;
  unitLabel: string;
  image: string;
  videoUrl?: string;
  featured?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  image: string;
  mediaType: 'photo' | 'cinema-reel';
  videoEmbedUrl?: string;
}

export interface TestimonialItem {
  id: string;
  author: string;
  neighborhood: string;
  text: string;
  createdAt: string;
}

export interface CartEntry {
  item: MenuItem;
  quantity: number;
}

export interface BakeryConfig {
  businessName: string;
  cityLabel: string;
  neighborhood: string;
  streetAddress: string;
  openingHours: string;
  /** Format: 5592999999999 (country + DDD + number). Empty by default so no fake phone is invented. */
  whatsappNumber: string;
  instagramHandle: string;
  logoUrl: string;
  themeMode: 'dark' | 'light';
  accentColor: string;
  heroEyebrow: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImage: string;
  storyHeadline: string;
  storyDescription: string;
  storyImage: string;
  promoTitle: string;
  promoDescription: string;
  promoTerms: string;
  videoReelUrl: string;
}
