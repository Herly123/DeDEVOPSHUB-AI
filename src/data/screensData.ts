export interface ScreenItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  category: 'residencial' | 'cultural' | 'interiorismo' | 'pabellon';
  categoryLabel: string;
  location: string;
  year: string;
  aspectRatio: '16:9' | '4:3';
  imageUrl: string;
  resolution: string;
  cameraExif: {
    camera: string;
    lens: string;
    aperture: string;
    iso: string;
    shutter: string;
  };
  palette: {
    primary: string;
    secondary: string;
    surface: string;
  };
  description: string;
  architect: string;
  surfaceArea: string;
  featuredSpan?: boolean;
  screenLayoutType: 'hero-cover' | 'split-editorial' | 'card-grid' | 'immersive-detail';
}

export const INITIAL_SCREENS: ScreenItem[] = [
  {
    id: 'pabellon-travertino',
    index: '01',
    title: 'Pabellón de Travertino y Agua',
    subtitle: 'Luz direccional sobre monolitos de hormigón y piedra natural en estanque reflectante',
    category: 'pabellon',
    categoryLabel: 'Pabellón Efímero',
    location: 'Ciudad de México, MX',
    year: '2026',
    aspectRatio: '16:9',
    imageUrl: '/src/assets/images/hero_architecture_atelier_1791326941711.jpg',
    resolution: '3840 × 2160 px',
    cameraExif: {
      camera: 'Hasselblad X2D 100C',
      lens: 'XCD 28P f/4',
      aperture: 'f/8.0',
      iso: 'ISO 64',
      shutter: '1/250s',
    },
    palette: {
      primary: '#C8A98E',
      secondary: '#4A5559',
      surface: '#1D1B18',
    },
    description:
      'Concepción espacial donde planos horizontales de hormigón armado dialogan con bloques de travertino sin pulir. El espejo de agua duplica la geometría acústica y visual durante el crepúsculo.',
    architect: 'Estudio Mateo & Vane',
    surfaceArea: '1,420 m²',
    featuredSpan: true,
    screenLayoutType: 'hero-cover',
  },
  {
    id: 'residencia-nordica',
    index: '02',
    title: 'Residencia Boreal de Pino y Vidrio',
    subtitle: 'Envolvente térmica transparente integrada en bosque de coníferas escandinavo',
    category: 'residencial',
    categoryLabel: 'Arquitectura Residencial',
    location: 'Lillehammer, NO',
    year: '2026',
    aspectRatio: '4:3',
    imageUrl: '/src/assets/images/card_nordic_residence_1791326952429.jpg',
    resolution: '2880 × 2160 px',
    cameraExif: {
      camera: 'Leica SL2-S',
      lens: 'APO-Summicron-SL 35mm',
      aperture: 'f/5.6',
      iso: 'ISO 160',
      shutter: '1/60s',
    },
    palette: {
      primary: '#D99B52',
      secondary: '#2B3A3A',
      surface: '#161F1E',
    },
    description:
      'Vivienda unifamiliar elevada sobre pilotes de acero galvanizado para preservar el musgo natural del terreno. Estructura íntegra en madera contralaminada con triple acristalamiento de piso a techo.',
    architect: 'Lindqvist Arkitekter',
    surfaceArea: '480 m²',
    screenLayoutType: 'split-editorial',
  },
  {
    id: 'monolito-desierto',
    index: '03',
    title: 'Monolito de Tierra Compactada',
    subtitle: 'Muros de tapial pigmentado y terraza infinita sobre el cañón árido',
    category: 'residencial',
    categoryLabel: 'Arquitectura Residencial',
    location: 'Todos Santos, Baja California',
    year: '2025',
    aspectRatio: '4:3',
    imageUrl: '/src/assets/images/card_desert_monolith_1791326961507.jpg',
    resolution: '2880 × 2160 px',
    cameraExif: {
      camera: 'Phase One XF IQ4',
      lens: 'Schneider 45mm LS',
      aperture: 'f/11',
      iso: 'ISO 50',
      shutter: '1/125s',
    },
    palette: {
      primary: '#C97A53',
      secondary: '#8C6249',
      surface: '#2A1D17',
    },
    description:
      'Construida con áridos extraídos de la propia excavación, esta residencia bioclimática regula la temperatura del desierto mediante muros de 60 cm de espesor y ventilación cruzada subterránea.',
    architect: 'Taller Desierto Sur',
    surfaceArea: '690 m²',
    screenLayoutType: 'immersive-detail',
  },
  {
    id: 'santuario-tokio',
    index: '04',
    title: 'Santuario Hinoki en Minato-ku',
    subtitle: 'Penumbra calibrada, carpintería japonesa sin herrajes y hormigón visto encofrado',
    category: 'interiorismo',
    categoryLabel: 'Interiorismo Espacial',
    location: 'Tokio, JP',
    year: '2026',
    aspectRatio: '4:3',
    imageUrl: '/src/assets/images/card_tokyo_sanctuary_1791326971412.jpg',
    resolution: '2880 × 2160 px',
    cameraExif: {
      camera: 'Sony Alpha 1',
      lens: 'FE 24mm f/1.4 GM',
      aperture: 'f/4.0',
      iso: 'ISO 100',
      shutter: '1/80s',
    },
    palette: {
      primary: '#C2A378',
      secondary: '#7D7B76',
      surface: '#232220',
    },
    description:
      'Ático de contemplación acústica donde la luz cenital atraviesa paneles de papel washi artesanal. El mobiliario bajo en ciprés japonés establece una proporción horizontal serena.',
    architect: 'Kenji Takahashi Studio',
    surfaceArea: '310 m²',
    screenLayoutType: 'card-grid',
  },
  {
    id: 'galeria-milan',
    index: '05',
    title: 'Fundación de Arte Contemporáneo Brera',
    subtitle: 'Bóvedas históricas restauradas con plintos monolíticos e iluminación cenital museográfica',
    category: 'cultural',
    categoryLabel: 'Espacio Cultural',
    location: 'Milán, IT',
    year: '2025',
    aspectRatio: '4:3',
    imageUrl: '/src/assets/images/card_milan_gallery_1791326980322.jpg',
    resolution: '2880 × 2160 px',
    cameraExif: {
      camera: 'Leica M11 Monochrom',
      lens: 'Summilux-M 35mm f/1.4',
      aperture: 'f/8.0',
      iso: 'ISO 125',
      shutter: '1/180s',
    },
    palette: {
      primary: '#D4CFC7',
      secondary: '#6E6A64',
      surface: '#191817',
    },
    description:
      'Intervención museográfica que preserva la pátina original del siglo XVIII e introduce volúmenes puros de travertino romano para exhibir escultura minimalista de gran formato.',
    architect: 'Studio Contarini Milano',
    surfaceArea: '2,150 m²',
    screenLayoutType: 'split-editorial',
  },
];
