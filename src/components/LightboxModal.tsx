import React, { useEffect, useState } from 'react';
import { ScreenItem } from '../data/screensData';
import { ResilientImage } from './ResilientImage';
import { X, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxModalProps {
  screen: ScreenItem | null;
  screens: ScreenItem[];
  onClose: () => void;
  onSelectScreen: (screen: ScreenItem) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  screen,
  screens,
  onClose,
  onSelectScreen,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    if (!screen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        const idx = screens.findIndex((s) => s.id === screen.id);
        onSelectScreen(screens[(idx + 1) % screens.length]);
      }
      if (e.key === 'ArrowLeft') {
        const idx = screens.findIndex((s) => s.id === screen.id);
        onSelectScreen(screens[(idx - 1 + screens.length) % screens.length]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, screens, onClose, onSelectScreen]);

  if (!screen) return null;

  const currentIndex = screens.findIndex((s) => s.id === screen.id);
  const prevScreen = screens[(currentIndex - 1 + screens.length) % screens.length];
  const nextScreen = screens[(currentIndex + 1) % screens.length];

  const fullDirectUrl =
    typeof window !== 'undefined' && screen.imageUrl.startsWith('/')
      ? `${window.location.origin}${screen.imageUrl}`
      : screen.imageUrl;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(fullDirectUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={screen.title}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4 text-white">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono text-xs text-blue-400 tabular-nums">
            {screen.index} / {String(screens.length).padStart(2, '0')}
          </span>
          <h3 className="font-display text-lg font-bold truncate">{screen.title}</h3>
          <span className="hidden sm:inline text-xs text-neutral-400">
            · {screen.location} · {screen.resolution}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyUrl}
            className="min-h-[40px] px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
          >
            {copiedUrl ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>URL Directa Copiada</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar URL de Imagen</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] rounded-lg bg-white text-neutral-950 hover:bg-neutral-200 flex items-center justify-center transition-colors cursor-pointer"
            title="Cerrar (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center High-Resolution Image */}
      <div className="my-auto py-6 flex items-center justify-center relative max-w-6xl mx-auto w-full">
        <button
          type="button"
          onClick={() => onSelectScreen(prevScreen)}
          className="hidden md:flex min-h-[48px] min-w-[48px] rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center mr-4 transition-colors cursor-pointer shrink-0"
          title="Anterior (Flecha Izquierda)"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="w-full max-h-[72vh] rounded-2xl overflow-hidden border border-white/15 bg-neutral-950">
          <ResilientImage
            src={screen.imageUrl}
            alt={screen.title}
            aspectRatioClass="max-h-[72vh]"
            className="max-h-[72vh] w-full !object-contain"
            fallbackTitle={screen.title}
          />
        </div>

        <button
          type="button"
          onClick={() => onSelectScreen(nextScreen)}
          className="hidden md:flex min-h-[48px] min-w-[48px] rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center ml-4 transition-colors cursor-pointer shrink-0"
          title="Siguiente (Flecha Derecha)"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom EXIF & Direct HTML Info Bar */}
      <div className="border-t border-white/15 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-neutral-300">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-white font-medium">{screen.architect}</span>
          <span aria-hidden="true">·</span>
          <span>{screen.cameraExif.camera}</span>
          <span aria-hidden="true">·</span>
          <span>{screen.cameraExif.lens}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">
            {screen.cameraExif.aperture} · {screen.cameraExif.shutter} · {screen.cameraExif.iso}
          </span>
        </div>

        <div className="font-mono text-[11px] text-neutral-400 truncate max-w-md">
          src="{screen.imageUrl}"
        </div>
      </div>
    </div>
  );
};
