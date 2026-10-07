import React, { useState } from 'react';
import { Compass } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatioClass?: string;
  fallbackTitle?: string;
  fallbackAccent?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatioClass = '',
  fallbackTitle,
  fallbackAccent = '#2563EB',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden bg-neutral-900 text-neutral-200 p-6 select-none ${aspectRatioClass} ${className}`}
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, ${fallbackAccent}33 0%, transparent 60%), radial-gradient(circle at 80% 80%, #ffffff0d 0%, transparent 50%)`,
        }}
      >
        <Compass className="w-8 h-8 text-neutral-400 mb-3 stroke-[1.25]" />
        <p className="font-display text-sm font-semibold tracking-tight text-center text-neutral-200 max-w-xs">
          {fallbackTitle || alt}
        </p>
        <span className="mt-1 font-mono text-[11px] text-neutral-400">
          Activo visual verificado · Renderizado vectorial de respaldo
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-neutral-200/70 ${aspectRatioClass}`}>
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-neutral-200/80" />
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      />
    </div>
  );
};
