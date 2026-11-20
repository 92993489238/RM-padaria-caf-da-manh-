import { BakeryConfig, GalleryItem, MenuItem, TestimonialItem } from '../types/bakery';

export const DEFAULT_BAKERY_CONFIG: BakeryConfig = {
  businessName: 'Padaria Gosto da Manhã',
  cityLabel: 'Manaus, Amazonas, Brasil',
  neighborhood: '',
  streetAddress: '',
  openingHours: '',
  whatsappNumber: '559291138924',
  instagramHandle: '',
  logoUrl: '/assets/aistudio/WhatsApp_Image_2026-11-16_at_09.37.56_902d530f.jpeg',
  themeMode: 'dark',
  accentColor: '#D99B38',
  heroEyebrow: 'Manaus, Amazonas · Panificação Artesanal',
  heroHeadline: 'O aroma do pão quente que abre a sua manhã em Manaus.',
  heroSubheadline:
    'Fornadas artesanais, bolos regionais e café passado na hora com atendimento direto pelo WhatsApp para encomendas e retiradas.',
  heroImage: '/src/assets/images/hero_padaria_manaus_1794763144077.jpg',
  storyHeadline: 'Padaria certa e seu café da manhã no momento certo',
  storyDescription:
    'Cada receita nasce no preparo paciente antes do amanhecer, unindo farinhas selecionadas, fermentação cuidada e o carinho dos sabores amazônicos.',
  storyImage: '/src/assets/images/galeria_fornada_especial_1794763144836.jpg',
  promoTitle: 'Encomendas Matinais e Cestas Sob Medida',
  promoDescription:
    'Monte sua seleção de pães, bolos regionais e salgados para reuniões, cafés corporativos ou celebrações em família em Manaus. Condições e disponibilidade confirmadas diretamente no atendimento.',
  promoTerms: 'Valores e horários de entrega combinados diretamente pelo WhatsApp.',
  videoReelUrl: '',
};

export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: 'pao-frances-crocante',
    name: 'Bom dia, meu cliente! Fique à vontade e faça seu pedido',
    category: 'Pães',
    subtitle: 'Casca fina e dourada · Miolo leve',
    description:
      'Produto bem embalado, seu gosto preservado.',
    price: '',
    unitLabel: 'Unidade / Cento',
    image: '/assets/aistudio/__Cozy_Coffee_Date_cadc07f6.jpg',
    videoUrl: '/assets/aistudio/People_buying_products_at_bakery_96cd6861_509b78a7.mp4',
    featured: true,
  },
  {
    id: 'pao-fermentacao-natural',
    name: 'Pão de queijo e cafezinho aqui na padaria RM cantinho da manhã',
    category: 'Pães',
    subtitle: 'Fermentação natural · Corte artesanal',
    description:
      'Massa de longa maturação com casca caramelizada e textura aerada, ideal para acompanhar manteiga, queijos ou geleias.',
    price: '',
    unitLabel: 'Unidade',
    image: '/src/assets/images/hero_padaria_manaus_1794763144077.jpg',
    videoUrl:
      '/assets/aistudio/Coffee_and_cheese_bread_breakfast_95964518_f5962f54.mp4',
  },
  {
    id: 'bolo-macaxeira-regional',
    name: 'Bolo de Macaxeira Cremoso',
    category: 'Bolos & Folhados',
    subtitle: 'Receita regional · Textura cremosa',
    description:
      'O preparo ideal da macaxeira fresca e o toque dourado de forno, trazendo o sabor tradicional das manhãs do bairro de São Jorge e de todo o Amazonas.',
    price: '',
    unitLabel: 'Fatia ou Inteiro',
    image: '/src/assets/images/menu_bolo_macaxeira_1794763144078.jpg',
    videoUrl:
      '/assets/aistudio/Prepara__o_de_bolo_de_macaxeira_cf663695_40dc33a9.mp4',
    muteAudio: true,
    featured: true,
  },
  {
    id: 'croissant-manteiga',
    name: 'Diversificações variadas para seu café da manhã',
    category: 'Bolos & Folhados',
    subtitle: 'Massa laminada · Camadas crocantes',
    description:
      'Folhado delicado com dobras precisas, crosta leve e interior macio para acompanhar cafés especiais ou recheios salgados.',
    price: '',
    unitLabel: 'Unidade',
    image: '/src/assets/images/menu_bolo_macaxeira_1794763144078.jpg',
    videoUrl:
      '/assets/aistudio/Customers_reading_bakery_breakfa__54a92513_2e81d10b.mp4',
  },
  {
    id: 'combo-cafe-tapioca',
    name: 'Variados sucos e salgados para sua merenda deliciosa',
    category: 'Café Regional',
    subtitle: 'Preparado na hora · Sabor de Manaus',
    description:
      'Café encorpado servido quente ao lado de pães de queijo assados na hora e tapioca fresca com preparo artesanal.',
    price: 'R$ 15,00',
    unitLabel: '',
    image:
      '/assets/aistudio/Baking_Brazilian_p_o_de_queijo_dbeb2f67_2K_155e9e5f.png',
    videoUrl: '/assets/aistudio/RM_PADARIA_CONFEITARIA_bfdcb155_5d8a1812.mp4',
    featured: true,
  },
  {
    id: 'cesta-cafe-encomenda',
    name: 'Cesta Especial Gosto da Manhã',
    category: 'Encomendas',
    subtitle: 'Sob encomenda · Montagem personalizada',
    description:
      'Seleção sob medida com pães artesanais, fatias de bolo regional, pães de queijo e itens escolhidos por você pelo WhatsApp.',
    price: '',
    unitLabel: 'Sob encomenda',
    image: '/src/assets/images/galeria_fornada_especial_1794763144836.jpg',
    videoUrl: '/assets/aistudio/_ULTRAREALISTIC__CINEMATIC_MASTE__2815c769_981c9768.mp4',
  },
];

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Variados salgados para seu café',
    caption: 'Salgados frescos e quentinhos na estufa para acompanhar o seu café.',
    image: '/assets/aistudio/download__7__10b89bb7.jpg',
    mediaType: 'cinema-reel',
    videoEmbedUrl:
      '/assets/aistudio/Baker_frying_traditional_pastry_b39ca653_aa8710a9.mp4',
  },
  {
    id: 'gal-2',
    title: 'Conservação na embalagem certa para viagem',
    caption: 'Porções embaladas com higiene e frescor para você levar com praticidade.',
    image: '/src/assets/images/galeria_fornada_especial_1794763144836.jpg',
    mediaType: 'cinema-reel',
    videoEmbedUrl:
      '/assets/aistudio/People_buying_bakery_products_69966f5e_t2-9_50543b89.mp4',
  },
  {
    id: 'gal-3',
    title: 'PUDIM cremoso da padaria do vizinho',
    caption: 'Preparo artesanal com calda de caramelo dourada e textura cremosa.',
    image: '/src/assets/images/menu_bolo_macaxeira_1794763144078.jpg',
    mediaType: 'cinema-reel',
    videoEmbedUrl:
      '/assets/aistudio/Preparo_de_pudim_de_padaria_3cca392d_cb9b5a2e.mp4',
  },
  {
    id: 'gal-4',
    title: 'Os salgados mais crocantes para sua merenda completa',
    caption:
      'Folhados e salgados artesanais assados na hora para a sua merenda.',
    image: '/src/assets/images/galeria_fornada_especial_1794763144836.jpg',
    mediaType: 'cinema-reel',
    videoEmbedUrl:
      '/assets/aistudio/Bakery_video_production_and_mani__9b6a21b1_8c2682b7.mp4',
  },
];

/** Intentionally empty by default: never invent fake client reviews. */
export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [];
