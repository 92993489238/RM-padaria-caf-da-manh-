import React, { useEffect, useId, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import {
  AlertCircle,
  Loader2,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ResilientImage } from './ResilientImage';

interface CulinaryVideoPlayerProps {
  src: string;
  poster?: string;
  title: string;
  accentColor?: string;
  autoPlay?: boolean;
  initialUnmuted?: boolean;
  controlsPosition?: 'top' | 'bottom';
  videoClassName?: string;
  disableAudio?: boolean;
  hideControls?: boolean;
  customAudioText?: string;
  customAudioVoice?: string;
  onMediaError?: () => void;
  onUnmute?: () => void;
}

const UNMUTE_EVENT = 'culinary-video:unmute';

interface ExtendedVideoElement extends HTMLVideoElement {
  audioTracks?: { length: number };
  mozHasAudio?: boolean;
  webkitAudioDecodedByteCount?: number;
}

export const CulinaryVideoPlayer: React.FC<CulinaryVideoPlayerProps> = ({
  src,
  poster,
  title,
  accentColor = '#D99B38',
  autoPlay,
  initialUnmuted = false,
  controlsPosition = 'bottom',
  videoClassName = 'w-full h-full object-cover',
  disableAudio = false,
  hideControls = false,
  customAudioText,
  customAudioVoice = 'Kore',
  onMediaError,
  onUnmute,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const playerId = useId();
  const videoRef = useRef<ExtendedVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const lastVideoTimeRef = useRef(0);

  const hasCustomAudio = Boolean(customAudioText?.trim()) && !disableAudio;
  const customAudioUrl = hasCustomAudio
    ? `/api/tts?text=${encodeURIComponent(customAudioText!.trim())}&voice=${encodeURIComponent(customAudioVoice)}`
    : null;

  const shouldAutoPlay = autoPlay ?? !prefersReducedMotion;
  const [isPlaying, setIsPlaying] = useState(shouldAutoPlay);
  const [isMuted, setIsMuted] = useState(disableAudio ? true : !initialUnmuted);
  const [volume, setVolume] = useState(0.85);
  const [isLoading, setIsLoading] = useState(true);
  const [mediaError, setMediaError] = useState(false);
  const [audioUnavailable, setAudioUnavailable] = useState(false);
  const [audioErrorMsg, setAudioErrorMsg] = useState<string | null>(null);

  // Sync muted & volume properties directly to DOM elements
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.volume = disableAudio || hasCustomAudio ? 0 : volume;
      video.muted = disableAudio || hasCustomAudio ? true : isMuted;
    }
    const audio = audioRef.current;
    if (audio && hasCustomAudio) {
      audio.volume = volume;
      audio.muted = isMuted;
    }
  }, [disableAudio, hasCustomAudio, isMuted, volume]);

  // Coordinate single active voice track across players
  useEffect(() => {
    const handleOtherUnmute = (event: Event) => {
      const custom = event as CustomEvent<{ id: string }>;
      if (custom.detail?.id !== playerId) {
        setIsMuted(true);
        if (videoRef.current) {
          videoRef.current.muted = true;
        }
        if (audioRef.current) {
          audioRef.current.muted = true;
          audioRef.current.pause();
        }
      }
    };
    window.addEventListener(UNMUTE_EVENT, handleOtherUnmute);
    return () => window.removeEventListener(UNMUTE_EVENT, handleOtherUnmute);
  }, [playerId]);

  // Handle autoplay cleanly respecting browser audio policies
  useEffect(() => {
    const video = videoRef.current;
    if (!video || mediaError) return;

    setIsLoading(true);
    setAudioUnavailable(false);
    setAudioErrorMsg(null);
    lastVideoTimeRef.current = 0;

    if (initialUnmuted && !disableAudio) {
      window.dispatchEvent(
        new CustomEvent(UNMUTE_EVENT, { detail: { id: playerId } }),
      );
      if (hasCustomAudio) {
        video.muted = true;
        video.play().catch(() => setIsPlaying(false));
        const audio = audioRef.current;
        if (audio) {
          audio.muted = false;
          audio.volume = volume;
          audio.currentTime = 0;
          setIsMuted(false);
          audio.play().catch(() => {
            audio.muted = true;
            setIsMuted(true);
          });
        }
      } else {
        video.muted = false;
        video.volume = volume;
        setIsMuted(false);
        video.play().catch(() => {
          // Fallback to muted autoplay if browser blocks unmuted start
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => setIsPlaying(false));
        });
      }
    } else if (shouldAutoPlay) {
      video.defaultMuted = true;
      video.muted = true;
      setIsMuted(true);
      video.play().catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [
    src,
    shouldAutoPlay,
    initialUnmuted,
    disableAudio,
    hasCustomAudio,
    mediaError,
    playerId,
  ]);

  const checkAudioAvailability = () => {
    const video = videoRef.current;
    if (!video || hasCustomAudio) return;
    if (video.audioTracks && video.audioTracks.length === 0) {
      setAudioUnavailable(true);
      return;
    }
    if (typeof video.mozHasAudio === 'boolean' && video.mozHasAudio === false) {
      setAudioUnavailable(true);
      return;
    }
    // Check decoded audio bytes only when actively playing unmuted
    if (
      !video.paused &&
      !video.muted &&
      video.currentTime > 0.8 &&
      typeof video.webkitAudioDecodedByteCount === 'number' &&
      video.webkitAudioDecodedByteCount === 0
    ) {
      setAudioUnavailable(true);
    }
  };

  const handleVideoTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    if (hasCustomAudio) {
      const prevTime = lastVideoTimeRef.current;
      const currTime = video.currentTime;
      lastVideoTimeRef.current = currTime;

      if (currTime < prevTime - 1 && !isMuted && !video.paused && !audioUnavailable) {
        const audio = audioRef.current;
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        }
      }
      return;
    }

    checkAudioAvailability();
  };

  const togglePlay = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || mediaError) return;

    if (video.paused) {
      if (hasCustomAudio) {
        video.muted = true;
        video
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
        if (audio && !isMuted && !audioUnavailable) {
          audio.muted = false;
          audio.volume = volume;
          audio.play().catch(() => {});
        }
      } else {
        video.muted = isMuted;
        video.volume = volume;
        video
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    } else {
      video.pause();
      if (audio) {
        audio.pause();
      }
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || mediaError || audioUnavailable) return;

    const nextMuted = !isMuted;
    if (!nextMuted) {
      window.dispatchEvent(
        new CustomEvent(UNMUTE_EVENT, { detail: { id: playerId } }),
      );
      const nextVol = volume === 0 ? 0.85 : volume;
      setVolume(nextVol);
      setIsMuted(false);
      onUnmute?.();

      if (hasCustomAudio) {
        video.muted = true;
        if (video.paused) {
          video
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }
        if (audio) {
          audio.volume = nextVol;
          audio.muted = false;
          audio.currentTime = 0;
          audio.play().catch(() => {
            setAudioUnavailable(true);
            setAudioErrorMsg('Não foi possível reproduzir o áudio.');
          });
        }
      } else {
        video.volume = nextVol;
        video.muted = false;
        if (video.paused) {
          video
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }
      }
    } else {
      video.muted = true;
      if (audio) {
        audio.muted = true;
        audio.pause();
      }
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const nextVolume = Number(e.target.value);
    const video = videoRef.current;
    const audio = audioRef.current;
    setVolume(nextVolume);

    if (!video || mediaError || audioUnavailable) return;

    if (nextVolume === 0) {
      if (hasCustomAudio) {
        video.muted = true;
        if (audio) {
          audio.volume = 0;
          audio.muted = true;
          audio.pause();
        }
      } else {
        video.volume = 0;
        video.muted = true;
      }
      setIsMuted(true);
    } else {
      window.dispatchEvent(
        new CustomEvent(UNMUTE_EVENT, { detail: { id: playerId } }),
      );
      setIsMuted(false);
      onUnmute?.();

      if (hasCustomAudio) {
        video.muted = true;
        if (video.paused) {
          video
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }
        if (audio) {
          audio.volume = nextVolume;
          audio.muted = false;
          if (audio.paused) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
          }
        }
      } else {
        video.volume = nextVolume;
        video.muted = false;
        if (video.paused) {
          video
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }
      }
    }
  };

  if (mediaError) {
    return (
      <div className="relative w-full h-full">
        <ResilientImage
          src={poster || ''}
          alt={title}
          className={videoClassName}
          fallbackTitle={title}
        />
        <div className="absolute bottom-2.5 inset-x-2.5 z-20 flex items-center gap-2 px-3 py-2 rounded-lg bg-black/80 backdrop-blur-md border border-red-400/30 text-xs text-red-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
          <span>Áudio e vídeo indisponíveis no momento.</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop
        playsInline
        preload="auto"
        onLoadStart={() => setIsLoading(true)}
        onWaiting={() => setIsLoading(true)}
        onLoadedMetadata={checkAudioAvailability}
        onLoadedData={() => {
          setIsLoading(false);
          checkAudioAvailability();
        }}
        onCanPlay={() => setIsLoading(false)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
        onPause={() => {
          setIsPlaying(false);
          if (audioRef.current) {
            audioRef.current.pause();
          }
        }}
        onTimeUpdate={handleVideoTimeUpdate}
        onError={() => {
          setIsLoading(false);
          setMediaError(true);
          onMediaError?.();
        }}
        onClick={() => {
          if (!hideControls || disableAudio) return;
          const video = videoRef.current;
          if (!video) return;
          if (video.muted || video.paused) {
            window.dispatchEvent(
              new CustomEvent(UNMUTE_EVENT, { detail: { id: playerId } }),
            );
            video.volume = volume || 0.85;
            video.muted = false;
            setIsMuted(false);
            onUnmute?.();
            video.play().then(() => setIsPlaying(true)).catch(() => {});
          } else {
            video.muted = true;
            setIsMuted(true);
          }
        }}
        aria-label={title}
        className={`${videoClassName}${hideControls && !disableAudio ? ' cursor-pointer' : ''}`}
      />

      {hasCustomAudio && customAudioUrl && (
        <audio
          ref={audioRef}
          src={customAudioUrl}
          preload="auto"
          onError={async () => {
            setAudioUnavailable(true);
            setIsMuted(true);
            try {
              const resp = await fetch(customAudioUrl);
              if (!resp.ok) {
                const payload = (await resp.json().catch(() => null)) as {
                  error?: string;
                } | null;
                setAudioErrorMsg(
                  payload?.error || 'Áudio indisponível neste vídeo.',
                );
              } else {
                setAudioErrorMsg('Áudio indisponível neste vídeo.');
              }
            } catch {
              setAudioErrorMsg('Áudio indisponível neste vídeo.');
            }
          }}
        />
      )}

      {/* Indicador de carregamento */}
      {!disableAudio && !hideControls && isLoading && (
        <div
          aria-live="polite"
          className="pointer-events-none absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-medium text-[#F5F2EB]"
        >
          <Loader2 className="w-3 h-3 animate-spin text-[#D99B38]" />
          <span>Carregando...</span>
        </div>
      )}

      {/* Barra de controles de reprodução e áudio */}
      {!disableAudio && !hideControls && (
        <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute ${
          controlsPosition === 'top' ? 'top-3' : 'bottom-2.5'
        } inset-x-2.5 sm:inset-x-3 z-20 flex flex-wrap items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 text-[#F5F2EB] shadow-lg`}
      >
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? `Pausar vídeo: ${title}` : `Reproduzir vídeo: ${title}`}
            title={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-white/10 hover:bg-white/20 text-[#F5F2EB] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D99B38]"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5 translate-x-[0.5px]" />
            )}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            disabled={audioUnavailable}
            aria-label={
              audioUnavailable
                ? 'Áudio indisponível'
                : isMuted
                  ? `Ativar áudio de ${title}`
                  : `Desativar áudio de ${title}`
            }
            title={
              audioUnavailable
                ? 'Áudio indisponível'
                : isMuted
                  ? 'Ativar som'
                  : 'Silenciar som'
            }
            style={
              !isMuted && !audioUnavailable
                ? { backgroundColor: accentColor, color: '#11100F' }
                : undefined
            }
            className={`inline-flex items-center gap-1.5 px-2.5 h-8 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap ${
              audioUnavailable
                ? 'bg-white/5 text-stone-400 cursor-not-allowed'
                : isMuted
                  ? 'bg-white/12 hover:bg-white/22 text-[#F5F2EB] cursor-pointer'
                  : 'hover:brightness-110 cursor-pointer'
            } focus-visible:outline-2 focus-visible:outline-[#D99B38]`}
          >
            {isMuted || audioUnavailable ? (
              <VolumeX className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 shrink-0" />
            )}
            <span>
              {audioUnavailable
                ? 'Sem áudio'
                : isMuted
                  ? 'Ativar som'
                  : 'Som ativo'}
            </span>
          </button>
        </div>

        {audioUnavailable ? (
          <span className="inline-flex items-center gap-1 text-[11px] text-amber-300">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {audioErrorMsg || 'Áudio indisponível neste vídeo'}
          </span>
        ) : (
          <label className="flex items-center gap-1.5 text-[11px] text-stone-300 pr-1">
            <span className="sr-only">Volume</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Volume de ${title}`}
              style={{ accentColor }}
              className="w-16 sm:w-20 h-1.5 rounded-lg cursor-pointer"
            />
          </label>
        )}
      </div>
      )}
    </>
  );
};
