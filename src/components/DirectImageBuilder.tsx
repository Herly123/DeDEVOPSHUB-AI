import React, { useState } from 'react';
import { ScreenItem } from '../data/screensData';
import { ResilientImage } from './ResilientImage';
import { Link2, Plus, Copy, Check, ExternalLink } from 'lucide-react';

interface DirectImageBuilderProps {
  onAddCustomScreen: (newScreen: ScreenItem) => void;
  totalScreensCount: number;
}

const SAMPLE_PRESETS = [
  {
    label: 'Pabellón Brutalista (16:9)',
    url: '/src/assets/images/hero_architecture_atelier_1791326941711.jpg',
    title: 'Pabellón de Hormigón y Espejo de Agua',
    location: 'Basilea, CH',
    category: 'pabellon' as const,
  },
  {
    label: 'Villa Escandinava (4:3)',
    url: '/src/assets/images/card_nordic_residence_1791326952429.jpg',
    title: 'Pabellón Forestal de Cristal',
    location: 'Oslo, NO',
    category: 'residencial' as const,
  },
  {
    label: 'Galería Clásica (4:3)',
    url: '/src/assets/images/card_milan_gallery_1791326980322.jpg',
    title: 'Sala de Escultura en Piedra Serena',
    location: 'Florencia, IT',
    category: 'cultural' as const,
  },
];

export const DirectImageBuilder: React.FC<DirectImageBuilderProps> = ({
  onAddCustomScreen,
  totalScreensCount,
}) => {
  const [imageUrl, setImageUrl] = useState<string>(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Mies_van_der_Rohe_photo_Barcelona_Pavilion_2006.jpg/1280px-Mies_van_der_Rohe_photo_Barcelona_Pavilion_2006.jpg'
  );
  const [title, setTitle] = useState<string>('Pabellón Alemán de Barcelona');
  const [subtitle, setSubtitle] = useState<string>(
    'Composición fluida de travertino, ónice dorado, vidrio templado y espejo de agua exterior'
  );
  const [location, setLocation] = useState<string>('Barcelona, ES');
  const [architect, setArchitect] = useState<string>('Mies van der Rohe & Lilly Reich');
  const [category, setCategory] = useState<ScreenItem['category']>('pabellon');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3'>('16:9');
  const [copiedTag, setCopiedTag] = useState<boolean>(false);
  const [addedNotification, setAddedNotification] = useState<boolean>(false);

  const categoryLabels: Record<ScreenItem['category'], string> = {
    residencial: 'Arquitectura Residencial',
    cultural: 'Espacio Cultural',
    interiorismo: 'Interiorismo Espacial',
    pabellon: 'Pabellón Efímero',
  };

  const generatedImgTag = `<img
  src="${imageUrl.trim()}"
  alt="${title.trim()} — ${location.trim()}"
  referrerpolicy="no-referrer"
  loading="lazy"
  class="w-full aspect-${aspectRatio === '16:9' ? 'video' : '[4/3]'} object-cover rounded-2xl"
/>`;

  const handleCopyImgTag = () => {
    navigator.clipboard.writeText(generatedImgTag);
    setCopiedTag(true);
    setTimeout(() => setCopiedTag(false), 1800);
  };

  const handleCreateScreen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim() || !title.trim()) return;

    const nextIndex = String(totalScreensCount + 1).padStart(2, '0');
    const newScreen: ScreenItem = {
      id: `custom-${Date.now()}`,
      index: nextIndex,
      title: title.trim(),
      subtitle: subtitle.trim() || 'Pantalla generada mediante enlace directo HTML',
      category,
      categoryLabel: categoryLabels[category],
      location: location.trim() || 'Ubicación Editorial',
      year: '2026',
      aspectRatio,
      imageUrl: imageUrl.trim(),
      resolution: aspectRatio === '16:9' ? '3840 × 2160 px' : '2880 × 2160 px',
      cameraExif: {
        camera: 'Enlace HTML Directo',
        lens: '35mm Editorial',
        aperture: 'f/8.0',
        iso: 'ISO 100',
        shutter: '1/160s',
      },
      palette: {
        primary: '#2563EB',
        secondary: '#52525B',
        surface: '#18181B',
      },
      description:
        subtitle.trim() ||
        'Pantalla incorporada dinámicamente a través de una URL de imagen directa desde el marcado HTML.',
      architect: architect.trim() || 'Estudio Invitado',
      surfaceArea: '850 m²',
      screenLayoutType: 'split-editorial',
    };

    onAddCustomScreen(newScreen);
    setAddedNotification(true);
    setTimeout(() => setAddedNotification(false), 2500);
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <form onSubmit={handleCreateScreen} className="lg:col-span-6 space-y-5">
          <div>
            <p className="text-xs text-neutral-500">
              Constructor de Pantallas · Enlaces Directos HTML (`&lt;img src="..."&gt;`)
            </p>
            <h3 className="font-display text-2xl font-bold text-neutral-950 mt-1">
              Incrustar Enlace Directo de Imagen
            </h3>
            <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
              Pega cualquier URL directa a una imagen (`.jpg`, `.png`, `.webp`, `.svg`) para previsualizar la pantalla en tiempo real, obtener su etiqueta HTML limpia y añadirla a la galería.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <span className="text-xs text-neutral-500 block">
              Probar con enlaces verificados:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setImageUrl(preset.url);
                    setTitle(preset.title);
                    setLocation(preset.location);
                    setCategory(preset.category);
                  }}
                  className="px-3 py-1.5 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="direct-image-url"
                className="block text-xs font-semibold text-neutral-800 mb-1.5"
              >
                URL Directa de la Imagen (`src`)
              </label>
              <div className="relative flex items-center">
                <Link2 className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
                <input
                  id="direct-image-url"
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://ejemplo.com/imagen-arquitectura.jpg"
                  className="w-full min-h-[42px] pl-10 pr-4 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white font-mono text-xs text-neutral-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="screen-title"
                  className="block text-xs font-semibold text-neutral-800 mb-1.5"
                >
                  Título de la Pantalla (`alt` / Titular)
                </label>
                <input
                  id="screen-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Casa en el Acantilado"
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white text-neutral-900"
                />
              </div>

              <div>
                <label
                  htmlFor="screen-location"
                  className="block text-xs font-semibold text-neutral-800 mb-1.5"
                >
                  Ubicación · Ciudad
                </label>
                <input
                  id="screen-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ej. Madrid, ES"
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white text-neutral-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="screen-category"
                  className="block text-xs font-semibold text-neutral-800 mb-1.5"
                >
                  Categoría Editorial
                </label>
                <select
                  id="screen-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ScreenItem['category'])}
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white text-neutral-900"
                >
                  <option value="pabellon">Pabellón Efímero</option>
                  <option value="residencial">Arquitectura Residencial</option>
                  <option value="interiorismo">Interiorismo Espacial</option>
                  <option value="cultural">Espacio Cultural</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  Proporción de Pantalla
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('16:9')}
                    className={`min-h-[42px] px-3 py-2 rounded-xl text-xs font-mono font-medium border transition-colors cursor-pointer ${
                      aspectRatio === '16:9'
                        ? 'bg-neutral-950 text-white border-neutral-950'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                    }`}
                  >
                    16:9 Panorámica
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio('4:3')}
                    className={`min-h-[42px] px-3 py-2 rounded-xl text-xs font-mono font-medium border transition-colors cursor-pointer ${
                      aspectRatio === '4:3'
                        ? 'bg-neutral-950 text-white border-neutral-950'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                    }`}
                  >
                    4:3 Editorial
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="screen-subtitle"
                className="block text-xs font-semibold text-neutral-800 mb-1.5"
              >
                Descripción Breve / Pie de Foto
              </label>
              <input
                id="screen-subtitle"
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full min-h-[42px] px-3.5 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white text-neutral-900"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Pantalla a la Galería</span>
            </button>

            <button
              type="button"
              onClick={handleCopyImgTag}
              className="min-h-[44px] px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-sm font-medium rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
            >
              {copiedTag ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Etiqueta &lt;img&gt; copiada</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar &lt;img&gt; HTML</span>
                </>
              )}
            </button>

            {addedNotification && (
              <span className="text-xs font-medium text-emerald-700">
                ✓ Pantalla añadida al catálogo y al simulador
              </span>
            )}
          </div>
        </form>

        {/* Live Card & HTML Output Preview Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">
              Vista previa en vivo desde enlace directo
            </span>
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>Abrir URL original</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Live Rendered Screen Card */}
          <div className="relative rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-200 shadow-md">
            <ResilientImage
              src={imageUrl}
              alt={title}
              aspectRatioClass={aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[4/3]'}
              fallbackTitle={title}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-6 pt-16 text-white">
              <div className="flex items-center gap-2 text-xs text-neutral-300 mb-1">
                <span>{categoryLabels[category]}</span>
                <span aria-hidden="true">·</span>
                <span>{location || 'Ubicación'}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{aspectRatio}</span>
              </div>
              <h4 className="font-display text-xl font-bold text-white leading-snug">
                {title || 'Título de la pantalla'}
              </h4>
              <p className="text-xs text-neutral-200 mt-1 line-clamp-2">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Generated HTML img tag preview */}
          <div className="bg-neutral-950 text-neutral-200 rounded-xl p-4 border border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[11px] text-neutral-400">
                Marcado HTML generado en tiempo real:
              </span>
              <span className="font-mono text-[11px] text-blue-400">
                referrerpolicy="no-referrer"
              </span>
            </div>
            <pre className="font-mono text-xs text-neutral-200 overflow-x-auto leading-relaxed">
              <code>{generatedImgTag}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
