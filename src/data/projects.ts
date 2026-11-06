/** Données non traduisibles des projets. Les textes sont dans src/i18n (projects.items). */
export type FeaturedId = 'armp' | 'clientelia' | 'rice' | 'air' | 'ecommerce' | 'rezerveo';
export type GalleryId = 'chatbot' | 'gymgest' | 'aktifitifitra' | 'portfolio';

export interface FeaturedProject {
  id: FeaturedId;
  name: string;
  /** Capture réelle du projet, si elle existe (jamais de capture inventée). */
  image?: string;
  stack: string[];
  github?: string;
  demo?: string;
  ongoing?: boolean;
  /** Variante graphique de l'affiche quand il n'y a pas de capture. */
  poster: 'sun' | 'grid' | 'waves' | 'rings';
}

export interface GalleryProject {
  id: GalleryId;
  image?: string;
  stack: string[];
  github?: string;
}

export const featured: FeaturedProject[] = [
  {
    id: 'armp',
    name: 'Assistant IA de réglementation ARMP',
    stack: ['Python', 'RAG', 'LLM', 'NLP'],
    ongoing: true,
    poster: 'rings',
  },
  {
    id: 'clientelia',
    name: 'Clientelia',
    image: '/projects/clientelia.webp',
    stack: ['React', 'Django REST Framework', 'MySQL', 'JWT'],
    github: 'https://github.com/M1rad0-rkt/CLIENTELIA',
    poster: 'grid',
  },
  {
    id: 'rice',
    name: 'Rice Disease Detection',
    image: '/projects/rice.webp',
    stack: ['PyTorch', 'Deep Learning', 'Computer Vision', 'Gradio'],
    github: 'https://github.com/AndyFaneva/RNAProject',
    poster: 'waves',
  },
  {
    id: 'air',
    name: 'Air Quality Analysis',
    image: '/projects/air-quality.webp',
    stack: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Streamlit'],
    github: 'https://github.com/M1rad0-rkt/Tera-project',
    poster: 'sun',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    image: '/projects/ecommerce.webp',
    stack: ['React', 'FastAPI', 'PostgreSQL', 'Tailwind', 'JWT'],
    github: 'https://github.com/M1rad0-rkt/e-commerce',
    poster: 'grid',
  },
  {
    id: 'rezerveo',
    name: 'Rezerveo',
    image: '/projects/rezerveo.webp',
    stack: ['PHP', 'MySQL', 'Bootstrap'],
    github: 'https://github.com/M1rad0-rkt/REZERVEO',
    poster: 'waves',
  },
];

export const gallery: GalleryProject[] = [
  { id: 'chatbot', stack: ['Python', 'TensorFlow', 'NLP'] },
  {
    id: 'gymgest',
    image: '/projects/gymgest.webp',
    stack: ['Python', 'Inno Setup'],
    github: 'https://github.com/M1rad0-rkt/Gym_gest',
  },
  {
    id: 'aktifitifitra',
    image: '/projects/aktifitifitra.webp',
    stack: ['Python', 'SQLite'],
    github: 'https://github.com/M1rad0-rkt/AKTIFITIFITRA',
  },
  {
    id: 'portfolio',
    image: '/projects/portfolio-v1.webp',
    stack: ['React', 'Tailwind', 'Vite'],
    github: 'https://github.com/M1rad0-rkt/PORTFOLIO',
  },
];
