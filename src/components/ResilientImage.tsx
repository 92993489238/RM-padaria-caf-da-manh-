import React, { useState } from 'react';
import { Croissant } from 'lucide-react';

interface ResilientImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        role="img"
        aria-label={alt || fallbackTitle || 'Imagem da padaria'}
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#231F1B] via-[#181512] to-[#110F0D] text-[#D99B38]/80 p-6 text-center ${className}`}
      >
        <Croissant className="w-8 h-8 opacity-80" strokeWidth={1.5} />
        <span className="text-xs font-medium text-[#A8A29E] max-w-[22ch]">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      {...rest}
    />
  );
};
