import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { ResilientImage } from './ResilientImage';

interface GlobalVideoBackgroundProps {
  posterImage: string;
  businessName: string;
  themeMode: 'dark' | 'light';
}

const GLOBAL_BG_VIDEO_SRC =
  '/assets/aistudio/Coffee_and_cheese_bread_commercial_d71928b8_34e80119.mp4';

export const GlobalVideoBackground: React.FC<GlobalVideoBackgroundProps> = ({
  posterImage,
  businessName,
  themeMode,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion || videoError) return;
    video.defaultMuted = true;
    video.muted = true;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Autoplay fallback is handled safely by muted + poster
      });
    }
  }, [prefersReducedMotion, videoError]);

  const showStaticFallback = Boolean(prefersReducedMotion) || videoError;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-[100vw] h-[100vh] z-0 pointer-events-none overflow-hidden bg-[#0F0E0D]"
    >
      {!showStaticFallback ? (
        <video
          ref={videoRef}
          src={GLOBAL_BG_VIDEO_SRC}
          poster={posterImage}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={() => setVideoError(true)}
          className="w-full h-full object-cover object-[46%_center] md:object-center pointer-events-none select-none"
        />
      ) : (
        <ResilientImage
          src={posterImage}
          alt=""
          className="w-full h-full object-cover object-[46%_center] md:object-center pointer-events-none select-none"
          fallbackTitle={businessName}
        />
      )}

      {/* Camada de proteção visual: gradiente escuro elegante entre 45% e 65% */}
      <div
        className={`absolute inset-0 pointer-events-none transition-colors duration-300 ${
          themeMode === 'dark'
            ? 'bg-gradient-to-b from-black/62 via-black/48 to-black/65'
            : 'bg-gradient-to-b from-[#F8F6F1]/82 via-[#F8F6F1]/72 to-[#F8F6F1]/86'
        }`}
      />

      {/* Vinheta suave nas bordas para contraste de textos brancos e dourados */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            themeMode === 'dark'
              ? 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 38%, rgba(0, 0, 0, 0.58) 100%)'
              : 'radial-gradient(ellipse at center, rgba(248, 246, 241, 0) 45%, rgba(28, 25, 23, 0.22) 100%)',
        }}
      />
    </div>
  );
};
