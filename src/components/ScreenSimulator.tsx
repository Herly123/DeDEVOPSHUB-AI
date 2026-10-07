import React, { useState } from 'react';
import { ScreenItem } from '../data/screensData';
import { ResilientImage } from './ResilientImage';
import {
  Smartphone,
  Tablet,
  Monitor,
  Copy,
  Check,
  ArrowLeft,
  Bookmark,
  Share2,
  SlidersHorizontal,
  Maximize2,
  Code2,
  Eye,
} from 'lucide-react';

interface ScreenSimulatorProps {
  screens: ScreenItem[];
  activeScreen: ScreenItem;
  onSelectScreen: (screen: ScreenItem) => void;
  onOpenLightbox: (screen: ScreenItem) => void;
}

type DeviceFrame = 'mobile' | 'tablet' | 'desktop';
type MobileTab = 'explorar' | 'pantallas' | 'codigo' | 'guardados';

export const ScreenSimulator: React.FC<ScreenSimulatorProps> = ({
  screens,
  activeScreen,
  onSelectScreen,
  onOpenLightbox,
}) => {
  const [device, setDevice] = useState<DeviceFrame>('mobile');
  const [mobileTab, setMobileTab] = useState<MobileTab>('explorar');
  const [savedIds, setSavedIds] = useState<string[]>([screens[0]?.id || '']);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [objectFitMode, setObjectFitMode] = useState<'cover' | 'contain'>('cover');
  const [scrimIntensity, setScrimIntensity] = useState<'alto' | 'medio' | 'sutil'>('alto');

  const toggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const fullOriginUrl =
    typeof window !== 'undefined' && activeScreen.imageUrl.startsWith('/')
      ? `${window.location.origin}${activeScreen.imageUrl}`
      : activeScreen.imageUrl;

  const htmlSnippet = `<!-- Pantalla: ${activeScreen.title} -->
<figure class="relative overflow-hidden rounded-2xl bg-neutral-950">
  <img
    src="${fullOriginUrl}"
    alt="${activeScreen.title} — ${activeScreen.location}"
    referrerpolicy="no-referrer"
    loading="lazy"
    class="w-full h-full object-${objectFitMode}"
  />
  <figcaption class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 text-white">
    <p class="text-xs opacity-80">${activeScreen.categoryLabel} · ${activeScreen.location}</p>
    <h3 class="text-xl font-semibold">${activeScreen.title}</h3>
  </figcaption>
</figure>`;

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(htmlSnippet);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 1800);
  };

  const currentIndex = screens.findIndex((s) => s.id === activeScreen.id);
  const nextScreen = screens[(currentIndex + 1) % screens.length];
  const prevScreen = screens[(currentIndex - 1 + screens.length) % screens.length];

  const scrimGradient =
    scrimIntensity === 'alto'
      ? 'from-black/90 via-black/50 to-transparent'
      : scrimIntensity === 'medio'
      ? 'from-black/75 via-black/35 to-transparent'
      : 'from-black/55 via-black/20 to-transparent';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Controls & Screen Selector Column */}
      <div className="lg:col-span-5 space-y-6 bg-white border border-neutral-200/90 rounded-2xl p-6">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <div>
            <p className="text-xs text-neutral-500">
              Arquitectura de Interfaz · Simulador en Vivo
            </p>
            <h3 className="font-display text-xl font-bold text-neutral-950 mt-0.5">
              Secuencia de Pantallas
            </h3>
          </div>

          {/* Device Segmented Switcher */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
            <button
              type="button"
              onClick={() => setDevice('mobile')}
              className={`min-h-[38px] px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                device === 'mobile'
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
              title="Vista Móvil (390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Móvil</span>
            </button>
            <button
              type="button"
              onClick={() => setDevice('tablet')}
              className={`min-h-[38px] px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                device === 'tablet'
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
              title="Vista Tablet"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setDevice('desktop')}
              className={`min-h-[38px] px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                device === 'desktop'
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
              title="Vista Web Panorámica"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Web</span>
            </button>
          </div>
        </div>

        {/* Interactive Screen List */}
        <div className="space-y-2">
          <p className="text-xs text-neutral-500">
            Selecciona una pantalla para previsualizar su estructura y su enlace HTML directo:
          </p>
          <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden">
            {screens.map((item) => {
              const isSelected = item.id === activeScreen.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectScreen(item)}
                  className={`w-full min-h-[60px] px-4 py-3 text-left flex items-center gap-3.5 transition-colors ${
                    isSelected
                      ? 'bg-neutral-950 text-white'
                      : 'bg-white text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  <span
                    className={`font-mono text-xs tabular-nums ${
                      isSelected ? 'text-blue-400' : 'text-neutral-400'
                    }`}
                  >
                    {item.index}.
                  </span>
                  <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-white/10">
                    <ResilientImage
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      aspectRatioClass="w-11 h-11"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{item.title}</p>
                    <p
                      className={`text-xs truncate ${
                        isSelected ? 'text-neutral-300' : 'text-neutral-500'
                      }`}
                    >
                      {item.categoryLabel} · {item.location}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Visual Framing & HTML Parameters */}
        <div className="space-y-4 pt-2 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-700 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
              Ajuste de imagen (`object-fit`)
            </span>
            <div className="flex items-center gap-1 p-0.5 bg-neutral-100 rounded-md">
              <button
                type="button"
                onClick={() => setObjectFitMode('cover')}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap ${
                  objectFitMode === 'cover'
                    ? 'bg-white text-neutral-900 shadow-2xs'
                    : 'text-neutral-600'
                }`}
              >
                cover
              </button>
              <button
                type="button"
                onClick={() => setObjectFitMode('contain')}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap ${
                  objectFitMode === 'contain'
                    ? 'bg-white text-neutral-900 shadow-2xs'
                    : 'text-neutral-600'
                }`}
              >
                contain
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-700">
              Contraste del velo inferior (Scrim WCAG)
            </span>
            <div className="flex items-center gap-1 p-0.5 bg-neutral-100 rounded-md">
              {(['alto', 'medio', 'sutil'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setScrimIntensity(level)}
                  className={`px-2.5 py-1 text-xs capitalize rounded transition-colors whitespace-nowrap ${
                    scrimIntensity === level
                      ? 'bg-white text-neutral-900 shadow-2xs font-medium'
                      : 'text-neutral-600'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Direct HTML Code Output Box */}
        <div className="bg-neutral-950 text-neutral-100 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-neutral-400">
              Código HTML con enlace directo (`&lt;img src="..."&gt;`)
            </span>
            <button
              type="button"
              onClick={handleCopySnippet}
              className="min-h-[36px] px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
            >
              {copiedHtml ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>HTML Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar HTML</span>
                </>
              )}
            </button>
          </div>
          <pre className="font-mono text-[11px] leading-relaxed text-neutral-300 overflow-x-auto p-3 bg-neutral-900/90 rounded-lg border border-neutral-800">
            <code>{htmlSnippet}</code>
          </pre>
        </div>
      </div>

      {/* Right Interactive Screen Frame Preview */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div
          className={`w-full transition-all duration-200 bg-neutral-950 text-white rounded-3xl border border-neutral-800 shadow-xl overflow-hidden flex flex-col ${
            device === 'mobile'
              ? 'max-w-[400px] min-h-[720px]'
              : device === 'tablet'
              ? 'max-w-[600px] min-h-[700px]'
              : 'max-w-full min-h-[640px]'
          }`}
        >
          {/* Mobile / App Top Bar inside Screen (Compact 52px) */}
          <div className="h-[52px] px-4 flex items-center justify-between border-b border-white/10 bg-neutral-950/90 backdrop-blur-md shrink-0">
            <button
              type="button"
              onClick={() => onSelectScreen(prevScreen)}
              className="min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="Pantalla anterior"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="text-center truncate px-2">
              <span className="text-xs font-medium tracking-tight text-neutral-200 truncate">
                {activeScreen.index}. {activeScreen.title}
              </span>
            </div>

            <div className="flex items-center">
              <button
                type="button"
                onClick={() => toggleSave(activeScreen.id)}
                className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="Guardar en colección"
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    savedIds.includes(activeScreen.id)
                      ? 'fill-blue-500 text-blue-500'
                      : ''
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Screen Body Content based on active tab inside the simulated app */}
          {mobileTab === 'explorar' && (
            <div className="flex-1 flex flex-col">
              {/* Hero Visual Container with Direct HTML Image */}
              <div className="relative flex-1 min-h-[340px] bg-neutral-900 overflow-hidden group">
                <ResilientImage
                  src={activeScreen.imageUrl}
                  alt={activeScreen.title}
                  aspectRatioClass="w-full h-full min-h-[340px]"
                  className={
                    objectFitMode === 'contain' ? '!object-contain bg-neutral-950' : 'object-cover'
                  }
                  fallbackTitle={activeScreen.title}
                  fallbackAccent={activeScreen.palette.primary}
                />

                {/* Top Right Lightbox Trigger */}
                <button
                  type="button"
                  onClick={() => onOpenLightbox(activeScreen)}
                  className="absolute top-3 right-3 min-h-[44px] min-w-[44px] rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer"
                  title="Expandir pantalla a resolución completa"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Measured Contrast Scrim for Text Legibility */}
                <div
                  className={`absolute inset-x-0 bottom-0 bg-gradient-to-t ${scrimGradient} p-6 pt-16 flex flex-col justify-end`}
                >
                  <div className="flex items-center gap-2 text-xs text-neutral-300 mb-1.5">
                    <span>{activeScreen.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeScreen.location}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{activeScreen.year}</span>
                  </div>

                  <h4 className="font-display text-2xl font-bold text-white leading-tight text-balance">
                    {activeScreen.title}
                  </h4>
                  <p className="text-xs text-neutral-200 mt-2 line-clamp-2 leading-relaxed">
                    {activeScreen.subtitle}
                  </p>
                </div>
              </div>

              {/* Technical & Architectural Metadata Panel inside Screen */}
              <div className="p-5 bg-neutral-950 space-y-4 border-t border-white/10">
                <div className="grid grid-cols-3 gap-3 py-2 border-b border-white/10 text-xs">
                  <div>
                    <span className="text-neutral-400 block">Estudio</span>
                    <span className="font-medium text-neutral-100 truncate block mt-0.5">
                      {activeScreen.architect}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block">Superficie</span>
                    <span className="font-mono tabular-nums text-neutral-100 block mt-0.5">
                      {activeScreen.surfaceArea}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block">Óptica EXIF</span>
                    <span className="font-mono tabular-nums text-neutral-100 block mt-0.5">
                      {activeScreen.cameraExif.aperture} · {activeScreen.cameraExif.iso}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  {activeScreen.description}
                </p>

                {/* Natural Thumb Zone Primary Action CTA */}
                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => onSelectScreen(nextScreen)}
                    className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Siguiente Pantalla ({nextScreen.index})
                  </button>
                  <button
                    type="button"
                    onClick={handleCopySnippet}
                    className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                    title="Copiar etiqueta HTML"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Enlace HTML</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {mobileTab === 'pantallas' && (
            <div className="flex-1 p-5 space-y-3 overflow-y-auto">
              <p className="text-xs text-neutral-400">
                Índice rápido de pantallas del proyecto ({screens.length} vistas):
              </p>
              {screens.map((scr) => (
                <button
                  key={scr.id}
                  type="button"
                  onClick={() => {
                    onSelectScreen(scr);
                    setMobileTab('explorar');
                  }}
                  className="w-full p-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-white/10 flex items-center gap-3 text-left transition-colors cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                    <ResilientImage
                      src={scr.imageUrl}
                      alt={scr.title}
                      aspectRatioClass="w-14 h-14"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-blue-400 font-mono">
                      Pantalla {scr.index} · {scr.aspectRatio}
                    </p>
                    <p className="text-sm font-semibold text-white truncate">
                      {scr.title}
                    </p>
                    <p className="text-xs text-neutral-400 truncate">
                      {scr.location} · {scr.surfaceArea}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {mobileTab === 'codigo' && (
            <div className="flex-1 p-5 space-y-4 overflow-y-auto">
              <div>
                <h4 className="font-display text-base font-bold text-white">
                  Inspector de Enlace Directo HTML
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  URL directa lista para incrustar en cualquier etiqueta `&lt;img&gt;` o fondo CSS:
                </p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 font-mono text-xs text-blue-300 break-all">
                {fullOriginUrl}
              </div>
              <div className="space-y-2">
                <span className="text-xs text-neutral-400 block">
                  Atributos recomendados de carga:
                </span>
                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 font-mono text-xs text-neutral-300 space-y-1">
                  <div>referrerpolicy="no-referrer"</div>
                  <div>loading="lazy"</div>
                  <div>decoding="async"</div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopySnippet}
                className="w-full min-h-[44px] rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedHtml ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedHtml ? 'Fragmento HTML copiado' : 'Copiar código HTML completo'}</span>
              </button>
            </div>
          )}

          {mobileTab === 'guardados' && (
            <div className="flex-1 p-5 space-y-3 overflow-y-auto">
              <p className="text-xs text-neutral-400">
                Pantallas guardadas en tu sesión ({savedIds.length}):
              </p>
              {savedIds.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <p className="text-sm text-neutral-300 font-medium">
                    No hay pantallas guardadas aún
                  </p>
                  <p className="text-xs text-neutral-500">
                    Pulsa el icono de marcador en la barra superior para guardar vistas.
                  </p>
                </div>
              ) : (
                screens
                  .filter((s) => savedIds.includes(s.id))
                  .map((scr) => (
                    <div
                      key={scr.id}
                      className="p-3 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-between gap-3"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onSelectScreen(scr);
                          setMobileTab('explorar');
                        }}
                        className="flex items-center gap-3 text-left min-w-0 flex-1 cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                          <ResilientImage
                            src={scr.imageUrl}
                            alt={scr.title}
                            aspectRatioClass="w-12 h-12"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {scr.title}
                          </p>
                          <p className="text-xs text-neutral-400 truncate">
                            {scr.location}
                          </p>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSave(scr.id)}
                        className="min-h-[40px] px-2.5 text-xs text-neutral-400 hover:text-white cursor-pointer"
                      >
                        Quitar
                      </button>
                    </div>
                  ))
              )}
            </div>
          )}

          {/* Fixed Bottom Navigation Tab Bar inside Screen Simulator (4-tab thumb zone) */}
          <div className="h-16 grid grid-cols-4 items-center bg-neutral-950/95 border-t border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setMobileTab('explorar')}
              className={`min-h-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
                mobileTab === 'explorar' ? 'text-blue-400' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="text-[10px] font-medium tracking-tight mt-1">
                Vista Activa
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab('pantallas')}
              className={`min-h-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
                mobileTab === 'pantallas' ? 'text-blue-400' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="text-[10px] font-medium tracking-tight mt-1">
                Pantallas
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab('codigo')}
              className={`min-h-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
                mobileTab === 'codigo' ? 'text-blue-400' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span className="text-[10px] font-medium tracking-tight mt-1">
                HTML Directo
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab('guardados')}
              className={`min-h-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
                mobileTab === 'guardados' ? 'text-blue-400' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span className="text-[10px] font-medium tracking-tight mt-1 tabular-nums">
                Guardados ({savedIds.length})
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
