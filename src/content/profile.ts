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
  summary: string;
};

export type Project = {
  title: string;
  blurb: string;
  stack: string[];
  href: string;
};

export type Contact = {
  channel: string;
  value: string;
  href: string;
  key: string;
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
  greeting: "Hi 👋 I'm Mauricio...",
  subgreeting: 'but you can call me Mauro',
  paragraph:
    "Frontend Developer with 8 years of full-stack experience, focused on building dynamic and engaging web applications. Comfortable across React, TypeScript, and Node.js — I like turning fuzzy ideas into shipped product.",
  meta: [
    { label: 'role', value: 'Frontend Developer' },
    { label: 'years', value: '8 yrs' },
    { label: 'stack', value: 'react · ts · node' },
    { label: 'status', value: 'available' },
  ],
  taglines: [
    'building things on the web since 2017',
    'react · typescript · node · astro',
    'design-systems · perf · DX',
    'shipping > shipping perfectly',
  ],
  avatar: 'https://avatar.iran.liara.run/public/boy',
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
    summary:
      'Building learning experiences at scale. React, Next.js, design systems, perf.',
  },
  {
    company: 'Freelance',
    role: 'Fullstack Developer',
    range: '2019 — 2022',
    summary:
      'Shipped product for startups across LATAM. React + Node, end-to-end ownership.',
  },
  {
    company: 'Early career',
    role: 'Web Developer',
    range: '2017 — 2019',
    summary:
      'Cut my teeth on agency work. Lots of HTML/CSS/JS, learning what good code feels like.',
  },
];

export const projects: Project[] = [
  {
    title: 'portfolio.tui',
    blurb: 'This site — a TUI-flavored portfolio in Astro + React.',
    stack: ['astro', 'react', 'tailwind'],
    href: 'https://github.com/mauricio',
  },
  {
    title: 'design-system',
    blurb: 'Component library and tokens for internal product surfaces.',
    stack: ['react', 'ts', 'storybook'],
    href: 'https://github.com/mauricio',
  },
  {
    title: 'side-quests',
    blurb: 'CLI tools and experiments — keep the curiosity warm.',
    stack: ['node', 'ts'],
    href: 'https://github.com/mauricio',
  },
];

export const contacts: Contact[] = [
  { channel: 'email', value: 'mauro@platzi.com', href: 'mailto:mauro@platzi.com', key: 'm' },
  { channel: 'github', value: '@mauricio', href: 'https://github.com/mauricio', key: 'g' },
  { channel: 'linkedin', value: '/in/mauricio', href: 'https://linkedin.com/in/mauricio', key: 'l' },
];
