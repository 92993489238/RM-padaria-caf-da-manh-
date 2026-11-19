import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, Expand, Pause, Play, X } from 'lucide-react';
import { BakeryConfig, GalleryItem } from '../types/bakery';
import { ResilientImage } from './ResilientImage';

interface CinematicGallerySectionProps {
  config: BakeryConfig;
  items: GalleryItem[];
}

function toSafeEmbedUrl(rawUrl: string): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (parsed.hostname === 'youtu.be') {
      const id = parsed.pathname.replace('/', '');
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (trimmed.endsWith('.mp4') || trimmed.endsWith('.webm')) {
      return trimmed;
    }
  } catch {
    return null;
  }
  return null;
}

export const CinematicGallerySection: React.FC<CinematicGallerySectionProps> = ({
  config,
  items,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [reelIndex, setReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [failedVideoIds, setFailedVideoIds] = useState<Record<string, boolean>>({});

  const embedUrl = toSafeEmbedUrl(config.videoReelUrl);
  const isDirectVideo = Boolean(
    embedUrl && (embedUrl.endsWith('.mp4') || embedUrl.endsWith('.webm')),
  );

  useEffect(() => {
    if (!isPlaying || embedUrl || items.length <= 1) return;
    const timer = window.setInterval(() => {
      setReelIndex((prev) => (prev + 1) % items.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [isPlaying, embedUrl, items.length]);

  const currentReel = items[reelIndex] ?? items[0];

  return (
    <section
      id="galeria"
      className="py-16 sm:py-24 border-b border-stone-200 dark:border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p
              className="text-xs font-semibold tracking-wide mb-2"
              style={{ color: config.accentColor }}
            >
              Galeria & Vídeo da Fornada
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-900 dark:text-[#F5F2EB] text-balance">
              Bastidores do Forno e Confeitaria
            </h2>
          </div>

          {!embedUrl && items.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-md text-xs font-medium border border-stone-300 dark:border-white/15 text-stone-800 dark:text-[#F5F2EB] hover:bg-stone-200/60 dark:hover:bg-white/5 cursor-pointer whitespace-nowrap"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    Pausar Cena
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    Reproduzir Cena
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Cinematic Reel + Asymmetric Editorial Photo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Primary Cinematic Player / Reel */}
          <div className="lg:col-span-7 relative rounded-xl overflow-hidden border border-stone-200 dark:border-white/10 bg-[#141210] aspect-[16/10]">
            {embedUrl ? (
              isDirectVideo ? (
                <video
                  src={embedUrl}
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <iframe
                  title={`Vídeo de ${config.businessName}`}
                  src={embedUrl}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )
            ) : (
              currentReel && (
                <>
                  {currentReel.videoEmbedUrl && !failedVideoIds[currentReel.id] ? (
                    <video
                      key={currentReel.id}
                      src={currentReel.videoEmbedUrl}
                      poster={currentReel.image}
                      autoPlay={!prefersReducedMotion}
                      loop
                      muted
                      playsInline
                      preload="auto"
                      onError={() =>
                        setFailedVideoIds((prev) => ({
                          ...prev,
                          [currentReel.id]: true,
                        }))
                      }
                      aria-label={currentReel.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ResilientImage
                      key={currentReel.id}
                      src={currentReel.image}
                      alt={currentReel.title}
                      className={`w-full h-full object-cover ${
                        isPlaying ? 'animate-ken-burns' : ''
                      }`}
                      fallbackTitle={currentReel.title}
                    />
                  )}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                  />
                  <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs text-[#E7E5E4]/80 mb-1">
                        Cena {String(reelIndex + 1).padStart(2, '0')} de{' '}
                        {String(items.length).padStart(2, '0')}
                      </p>
                      <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#F5F2EB] mb-1">
                        {currentReel.title}
                      </h3>
                      <p className="text-sm text-[#E7E5E4]/85 max-w-[46ch]">
                        {currentReel.caption}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        aria-label="Cena anterior"
                        onClick={() =>
                          setReelIndex(
                            (prev) => (prev - 1 + items.length) % items.length,
                          )
                        }
                        className="w-10 h-10 rounded-md bg-black/50 border border-white/15 text-white flex items-center justify-center hover:bg-black/75 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Próxima cena"
                        onClick={() =>
                          setReelIndex((prev) => (prev + 1) % items.length)
                        }
                        className="w-10 h-10 rounded-md bg-black/50 border border-white/15 text-white flex items-center justify-center hover:bg-black/75 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )
            )}
          </div>

          {/* 2x2 Interactive Photo Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {items.map((item, idx) => {
              const isSelected = idx === reelIndex && !embedUrl;
              return (
                <div
                  key={item.id}
                  className={`group relative rounded-xl overflow-hidden border bg-[#141210] aspect-[4/3] ${
                    isSelected
                      ? 'border-[#D99B38]'
                      : 'border-stone-200 dark:border-white/10'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setReelIndex(idx);
                      setLightboxIndex(idx);
                    }}
                    className="w-full h-full block text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D99B38]"
                    aria-label={`Ampliar mídia: ${item.title}`}
                  >
                    {item.videoEmbedUrl && !failedVideoIds[item.id] ? (
                      <video
                        src={item.videoEmbedUrl}
                        poster={item.image}
                        autoPlay={!prefersReducedMotion}
                        loop
                        muted
                        playsInline
                        preload="auto"
                        onError={() =>
                          setFailedVideoIds((prev) => ({
                            ...prev,
                            [item.id]: true,
                          }))
                        }
                        aria-label={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <ResilientImage
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        fallbackTitle={item.title}
                      />
                    )}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"
                    />
                    <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-md bg-black/50 text-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Expand className="w-3.5 h-3.5" />
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-3">
                      <p className="text-xs font-medium text-[#F5F2EB] truncate">
                        {item.title}
                      </p>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && items[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={items[lightboxIndex].title}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-xl overflow-hidden bg-[#181614] border border-white/15"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Fechar ampliação"
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-md bg-black/60 text-white flex items-center justify-center hover:bg-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/10] w-full bg-black">
              {items[lightboxIndex].videoEmbedUrl &&
              !failedVideoIds[items[lightboxIndex].id] ? (
                <video
                  src={items[lightboxIndex].videoEmbedUrl}
                  poster={items[lightboxIndex].image}
                  autoPlay
                  controls
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <ResilientImage
                  src={items[lightboxIndex].image}
                  alt={items[lightboxIndex].title}
                  className="w-full h-full object-cover"
                  fallbackTitle={items[lightboxIndex].title}
                />
              )}
            </div>

            <div className="p-5 sm:p-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-semibold text-[#F5F2EB]">
                  {items[lightboxIndex].title}
                </h3>
                <p className="text-sm text-[#A8A29E]">
                  {items[lightboxIndex].caption}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex(
                      (lightboxIndex - 1 + items.length) % items.length,
                    )
                  }
                  aria-label="Imagem anterior"
                  className="w-10 h-10 rounded-md border border-white/15 text-white flex items-center justify-center hover:bg-white/10 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((lightboxIndex + 1) % items.length)
                  }
                  aria-label="Próxima imagem"
                  className="w-10 h-10 rounded-md border border-white/15 text-white flex items-center justify-center hover:bg-white/10 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
