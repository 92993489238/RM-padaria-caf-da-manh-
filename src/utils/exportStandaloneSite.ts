import { BakeryConfig, MenuItem, TestimonialItem } from '../types/bakery';

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function generateStandaloneHtml(
  config: BakeryConfig,
  menuItems: MenuItem[],
  testimonials: TestimonialItem[],
): string {
  const isDark = config.themeMode === 'dark';
  const bg = isDark ? '#0F0E0D' : '#F8F6F1';
  const surface = isDark ? '#181614' : '#FFFFFF';
  const ink = isDark ? '#F5F2EB' : '#181614';
  const muted = isDark ? '#A8A29E' : '#57534E';
  const border = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(24,22,20,0.1)';
  const accent = config.accentColor || '#D99B38';

  const cleanWa = config.whatsappNumber.replace(/\D/g, '');
  const waBase = cleanWa ? `https://wa.me/${cleanWa}` : 'https://wa.me/';
  const fullLocation = [config.streetAddress, config.neighborhood, config.cityLabel]
    .filter(Boolean)
    .join(', ');
  const mapQuery = encodeURIComponent(fullLocation || 'Manaus, Amazonas, Brasil');

  const menuCardsHtml = menuItems
    .map(
      (item) => `
      <article class="card">
        <div class="card-media">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy" />
        </div>
        <div class="card-body">
          <p class="meta">${escapeHtml(item.category)} · ${escapeHtml(item.unitLabel)}</p>
          <h3>${escapeHtml(item.name)}</h3>
          <p class="desc">${escapeHtml(item.description)}</p>
          <div class="card-foot">
            <span class="price">${item.price ? escapeHtml(item.price) : 'Consultar valor'}</span>
            <button type="button" class="btn-outline" onclick="orderItem('${escapeHtml(item.name)}')">Pedir no WhatsApp</button>
          </div>
        </div>
      </article>
    `,
    )
    .join('\n');

  const testimonialsHtml = testimonials.length
    ? testimonials
        .map(
          (t) => `
        <blockquote class="card card-pad">
          <p class="quote">"${escapeHtml(t.text)}"</p>
          <footer class="meta">${escapeHtml(t.author)}${t.neighborhood ? ` · ${escapeHtml(t.neighborhood)}` : ''}</footer>
        </blockquote>
      `,
        )
        .join('\n')
    : `<p class="muted">Espaço pronto para exibir avaliações reais dos clientes de ${escapeHtml(config.businessName)}.</p>`;

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(config.businessName)} – ${escapeHtml(config.cityLabel)}</title>
  <meta name="description" content="${escapeHtml(config.heroSubheadline)}" />
  <meta name="geo.region" content="BR-AM" />
  <meta name="geo.placename" content="Manaus" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
  <script type="application/ld+json">
  ${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    name: config.businessName,
    description: config.heroSubheadline,
    address: {
      '@type': 'PostalAddress',
      streetAddress: config.streetAddress || undefined,
      addressLocality: 'Manaus',
      addressRegion: 'AM',
      addressCountry: 'BR',
    },
  })}
  </script>
  <style>
    :root { --bg: ${bg}; --surface: ${surface}; --ink: ${ink}; --muted: ${muted}; --border: ${border}; --accent: ${accent}; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg); color: var(--ink); font-family: 'Plus Jakarta Sans', system-ui, sans-serif; line-height: 1.6; }
    .container { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
    header { position: sticky; top: 0; z-index: 40; background: ${isDark ? 'rgba(15,14,13,0.9)' : 'rgba(248,246,241,0.92)'}; backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); }
    .nav-row { display: flex; align-items: center; justify-content: space-between; gap: 32px; height: 72px; }
    .brand { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 700; color: var(--ink); text-decoration: none; white-space: nowrap; }
    nav { display: flex; gap: 24px; }
    nav a { color: var(--muted); text-decoration: none; font-size: 0.9rem; font-weight: 500; white-space: nowrap; }
    nav a:hover { color: var(--ink); }
    .btn-primary { background: var(--accent); color: #11100F; border: none; padding: 12px 22px; border-radius: 6px; font-weight: 600; font-size: 0.9rem; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; white-space: nowrap; }
    .btn-outline { background: transparent; color: var(--ink); border: 1px solid var(--border); padding: 9px 16px; border-radius: 6px; font-weight: 500; font-size: 0.85rem; cursor: pointer; text-decoration: none; }
    .hero { padding: 72px 0; display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 48px; align-items: center; }
    h1, h2, h3 { font-family: 'Cormorant Garamond', serif; line-height: 1.12; }
    h1 { font-size: clamp(2.4rem, 4vw, 3.8rem); margin: 14px 0 18px; }
    h2 { font-size: clamp(1.9rem, 3vw, 2.7rem); margin-bottom: 14px; }
    .eyebrow { color: var(--accent); font-size: 0.85rem; font-weight: 600; letter-spacing: 0.04em; }
    .sub { color: var(--muted); font-size: 1.05rem; margin-bottom: 28px; max-width: 56ch; }
    .hero-img { width: 100%; aspect-ratio: 16/10; object-fit: cover; border-radius: 10px; border: 1px solid var(--border); }
    section { padding: 72px 0; border-top: 1px solid var(--border); }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 24px; margin-top: 32px; }
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
    .card-pad { padding: 24px; }
    .card-media img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
    .card-body { padding: 20px; }
    .card-body h3 { font-size: 1.45rem; margin: 6px 0 8px; }
    .meta { font-size: 0.8rem; color: var(--muted); }
    .desc { font-size: 0.92rem; color: var(--muted); margin-bottom: 18px; }
    .card-foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 12px; border-top: 1px solid var(--border); }
    .price { font-weight: 600; font-size: 0.95rem; }
    .quote { font-size: 1rem; margin-bottom: 12px; }
    .muted { color: var(--muted); }
    iframe { width: 100%; height: 340px; border: 1px solid var(--border); border-radius: 10px; margin-top: 20px; }
    footer { padding: 36px 0; border-top: 1px solid var(--border); color: var(--muted); font-size: 0.88rem; }
    @media (max-width: 860px) { .hero { grid-template-columns: 1fr; } nav { display: none; } }
  </style>
</head>
<body>
  <header>
    <div class="container nav-row">
      <a href="#inicio" class="brand">${escapeHtml(config.businessName)}</a>
      <nav>
        <a href="#cardapio">Cardápio</a>
        <a href="#ofertas">Ofertas</a>
        <a href="#depoimentos">Avaliações</a>
        <a href="#localizacao">Localização</a>
      </nav>
      <a class="btn-primary" href="${waBase}?text=${encodeURIComponent(`Olá, ${config.businessName}! Gostaria de fazer um pedido.`)}" target="_blank" rel="noopener noreferrer">Pedir no WhatsApp</a>
    </div>
  </header>

  <main>
    <div class="container hero" id="inicio">
      <div>
        <p class="eyebrow">${escapeHtml(config.heroEyebrow)}</p>
        <h1>${escapeHtml(config.heroHeadline)}</h1>
        <p class="sub">${escapeHtml(config.heroSubheadline)}</p>
        <a class="btn-primary" href="${waBase}?text=${encodeURIComponent(`Olá, ${config.businessName}! Gostaria de fazer um pedido.`)}" target="_blank" rel="noopener noreferrer">Fazer Pedido no WhatsApp</a>
      </div>
      <img class="hero-img" src="${escapeHtml(config.heroImage)}" alt="${escapeHtml(config.businessName)}" />
    </div>

    <section id="cardapio">
      <div class="container">
        <h2>Cardápio Artesanal</h2>
        <p class="muted">Escolha seus produtos favoritos e finalize o pedido diretamente no WhatsApp.</p>
        <div class="grid">${menuCardsHtml}</div>
      </div>
    </section>

    <section id="ofertas">
      <div class="container">
        <h2>${escapeHtml(config.promoTitle)}</h2>
        <p class="sub">${escapeHtml(config.promoDescription)}</p>
        <p class="meta">${escapeHtml(config.promoTerms)}</p>
      </div>
    </section>

    <section id="depoimentos">
      <div class="container">
        <h2>Avaliações de Clientes</h2>
        <div class="grid">${testimonialsHtml}</div>
      </div>
    </section>

    <section id="localizacao">
      <div class="container">
        <h2>Localização em ${escapeHtml(config.cityLabel)}</h2>
        <p class="muted">${escapeHtml(fullLocation || 'Manaus, Amazonas, Brasil · Endereço configurável')}${config.openingHours ? ` · Horário: ${escapeHtml(config.openingHours)}` : ''}</p>
        <iframe title="Mapa de ${escapeHtml(config.businessName)}" src="https://maps.google.com/maps?q=${mapQuery}&output=embed" loading="lazy"></iframe>
      </div>
    </section>
  </main>

  <footer>
    <div class="container">
      ${escapeHtml(config.businessName)} · ${escapeHtml(config.cityLabel)}
    </div>
  </footer>

  <script>
    function orderItem(name) {
      var msg = 'Olá, ${escapeHtml(config.businessName)}! Gostaria de saber disponibilidade e pedir: ' + name;
      window.open('${waBase}?text=' + encodeURIComponent(msg), '_blank', 'noopener,noreferrer');
    }
  </script>
</body>
</html>`;
}
