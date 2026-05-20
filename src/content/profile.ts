import type { Localized } from '@/lib/useLang';

export type Identity = {
  user: string;
  host: string;
  path: string;
  branch: string;
  version: string;
};

export type Skill = { name: string; level: number; group: string };

export type Experience = {
  company: string;
  role: string;
  range: string;
  summary: Localized;
};

export type Project = {
  title: string;
  blurb: Localized;
  stack: string[];
  href: string;
};

export type Contact = {
  channel: string;
  value: string;
  href: string;
  key: string;
};

export type MetaItem = {
  label: Localized;
  value: Localized;
};

export const identity: Identity = {
  user: 'mauro',
  host: 'portfolio',
  path: '~',
  branch: 'main',
  version: 'v1.0.0',
};

export const bio = {
  name: 'Mauricio',
  short: 'Mauro',
  greeting: {
    en: "Hi 👋 I'm Mauricio...",
    es: 'Hola 👋 soy Mauricio...',
  } satisfies Localized,
  subgreeting: {
    en: 'but you can call me Mauro',
    es: 'pero puedes decirme Mauro',
  } satisfies Localized,
  paragraph: {
    en: "Frontend Developer with 8 years of full-stack experience, focused on building dynamic and engaging web applications. Comfortable across React, TypeScript, and Node.js — I like turning fuzzy ideas into shipped product.",
    es: 'Desarrollador Frontend con 8 años de experiencia full-stack, enfocado en construir aplicaciones web dinámicas y atractivas. Cómodo con React, TypeScript y Node.js — me gusta convertir ideas difusas en producto enviado.',
  } satisfies Localized,
  meta: [
    {
      label: { en: 'role', es: 'rol' },
      value: { en: 'Software Engineer', es: 'Ingeniero de Software' },
    },
    {
      label: { en: 'years', es: 'años' },
      value: { en: '8 yrs', es: '8 años' },
    },
    {
      label: { en: 'stack', es: 'stack' },
      value: { en: 'react · ts · node', es: 'react · ts · node' },
    },
    {
      label: { en: 'status', es: 'estado' },
      value: { en: 'available', es: 'disponible' },
    },
  ] satisfies MetaItem[],
  taglines: {
    en: [
      'building things on the web since 2017',
      'react · typescript · node · astro',
      'design-systems · perf · DX',
      'shipping > shipping perfectly',
    ],
    es: [
      'construyendo en la web desde 2017',
      'react · typescript · node · astro',
      'design-systems · perf · DX',
      'enviar > enviar perfecto',
    ],
  } satisfies { en: string[]; es: string[] },
};

export const skills: Skill[] = [
  { name: 'React', level: 0.95, group: 'frontend' },
  { name: 'TypeScript', level: 0.92, group: 'frontend' },
  { name: 'JavaScript', level: 0.95, group: 'frontend' },
  { name: 'Next.js', level: 0.85, group: 'frontend' },
  { name: 'Astro', level: 0.7, group: 'frontend' },
  { name: 'CSS / Tailwind', level: 0.9, group: 'frontend' },
  { name: 'Node.js', level: 0.82, group: 'backend' },
  { name: 'GraphQL', level: 0.7, group: 'backend' },
  { name: 'PostgreSQL', level: 0.65, group: 'backend' },
  { name: 'Testing', level: 0.78, group: 'quality' },
];

export const experience: Experience[] = [
  {
    company: 'Platzi',
    role: 'Frontend Developer',
    range: '2022 — present',
    summary: {
      en: 'Building learning experiences at scale. React, Next.js, design systems, perf.',
      es: 'Construyendo experiencias de aprendizaje a escala. React, Next.js, design systems, performance.',
    },
  },
  {
    company: 'Freelance',
    role: 'Fullstack Developer',
    range: '2019 — 2022',
    summary: {
      en: 'Shipped product for startups across LATAM. React + Node, end-to-end ownership.',
      es: 'Envié producto para startups en LATAM. React + Node, ownership end-to-end.',
    },
  },
  {
    company: 'Early career',
    role: 'Web Developer',
    range: '2017 — 2019',
    summary: {
      en: 'Cut my teeth on agency work. Lots of HTML/CSS/JS, learning what good code feels like.',
      es: 'Me forjé en agencias. Mucho HTML/CSS/JS, aprendiendo cómo se siente el buen código.',
    },
  },
];

export const projects: Project[] = [
  {
    title: 'portfolio.tui',
    blurb: {
      en: 'This site — a TUI-flavored portfolio in Astro + React.',
      es: 'Este sitio — un portfolio con sabor TUI en Astro + React.',
    },
    stack: ['astro', 'react', 'tailwind'],
    href: 'https://github.com/mamv2137',
  },
  {
    title: 'design-system',
    blurb: {
      en: 'Component library and tokens for internal product surfaces.',
      es: 'Librería de componentes y tokens para superficies internas de producto.',
    },
    stack: ['react', 'ts', 'storybook'],
    href: 'https://github.com/mamv2137',
  },
  {
    title: 'side-quests',
    blurb: {
      en: 'CLI tools and experiments — keep the curiosity warm.',
      es: 'Herramientas CLI y experimentos — mantener la curiosidad encendida.',
    },
    stack: ['node', 'ts'],
    href: 'https://github.com/mamv2137',
  },
];

export const contacts: Contact[] = [
  { channel: 'email', value: 'qiubitlabs@gmail.com', href: 'mailto:qiubitlabs@gmail.com', key: 'm' },
  { channel: 'github', value: '@mamv2137', href: 'https://github.com/mamv2137', key: 'g' },
  { channel: 'linkedin', value: '/in/mamv', href: 'https://linkedin.com/in/mamv', key: 'l' },
];
