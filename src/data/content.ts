/**
 * Source unique de vérité du contenu. Toutes les informations proviennent du
 * brief fourni : rien n'est inventé ici.
 */

export const identity = {
  lastName: 'ANGO ABONDO',
  firstName: 'Loïc Gaëtan',
  role: 'Ingénieur en Génie Numérique',
  specialty: 'Développeur FullStack & Mobile',
  pitch:
    'Formé en développement logiciel, réseaux/systèmes et IA, avec une expérience concrète en production.',
  location: 'Mbalmayo / Yaoundé, Cameroun',
  email: 'loicango11@gmail.com',
  phone: '(+237) 657 55 96 16',
  phoneHref: '+237657559616',
  github: 'https://github.com/bigo21',
  githubLabel: 'github.com/bigo21',
  linkedin: 'https://linkedin.com/in/gaetan-ango-779225246',
  linkedinLabel: 'linkedin.com/in/gaetan-ango-779225246',
} as const;

export const about = {
  body: `Ingénieur en Génie Numérique polyvalent, formé en informatique, électronique, systèmes embarqués et réseaux. Actuellement développeur web junior chez UMDENY SARL et partenaire-développeur sur le projet Fleuva (suite logicielle de gestion d’entreprise) chez Cover Sarl.`,
  closing: `Autonome, rigoureux, j’aime construire des produits numériques complets, du réseau jusqu’à l'interface.`,
} as const;

export type Project = {
  id: string;
  name: string;
  kind: string;
  summary: string;
  detail: string;
  stack: readonly string[];
};

export const projects: readonly Project[] = [
  {
    id: 'smart-scolar',
    name: 'Smart Scolar',
    kind: 'Écosystème desktop',
    summary: 'Écosystème de gestion scolaire desktop.',
    detail:
      'Gestion des élèves, des notes et des finances, assistance intelligente, synchronisation entre réseau local et serveurs distants.',
    stack: ['ElectronJS', 'React', 'Node.js', 'SQLite', 'PostgreSQL'],
  },
  {
    id: 'munya',
    name: 'MUNYA',
    kind: 'Application mobile',
    summary: 'Application de sécurité pour victimes de violences domestiques.',
    detail:
      'Mise en relation anonyme avec des professionnels certifiés, écran de camouflage et chiffrement des données.',
    stack: ['React Native', 'Supabase'],
  },
  {
    id: 'klar-gaz',
    name: 'KLAR GAZ',
    kind: 'Application mobile',
    summary: 'Application de livraison de gaz domestique.',
    detail:
      'Commande, suivi de livraison en temps réel et chat entre le client et le livreur.',
    stack: ['React Native', 'Socket.io'],
  },
  {
    id: 'otokton',
    name: 'Otokton',
    kind: 'Application web',
    summary: 'Application web, conception et intégration.',
    detail:
      'Conception UI/UX et intégration front-end/back-end de l’ensemble des écrans.',
    stack: ['React', 'TailwindCSS', 'Bootstrap'],
  },
  {
    id: 'fleuva',
    name: 'Fleuva',
    kind: 'Suite logicielle',
    summary: 'Suite logicielle de gestion d’entreprise.',
    detail:
      'Développement du module Assistance, en tant que partenaire-développeur.',
    stack: ['Angular', 'GraphQL', 'Laravel'],
  },
] as const;

export type Role = {
  period: string;
  start: string;
  title: string;
  org: string;
  current: boolean;
};

export const experience: readonly Role[] = [
  {
    period: 'Avril 2026 — Présent',
    start: '2026-04',
    title: 'Développeur Web Junior',
    org: 'UMDENY SARL',
    current: true,
  },
  {
    period: 'Novembre 2025 — Présent',
    start: '2025-11',
    title: 'Partenaire-Développeur, Projet Fleuva',
    org: 'COVER SARL',
    current: true,
  },
  {
    period: 'Octobre 2024 — Septembre 2025',
    start: '2024-10',
    title: 'Développeur FullStack, Projet Smart Scolar',
    org: '',
    current: false,
  },
  {
    period: 'Septembre 2022 — Septembre 2025',
    start: '2022-09',
    title: 'Informaticien Généraliste',
    org: 'COVER SARL',
    current: false,
  },
  {
    period: 'Janvier 2022 — Mai 2024',
    start: '2022-01',
    title: 'Technicien Réseau, Projet Metaconn’X',
    org: '',
    current: false,
  },
] as const;

export const skills = [
  {
    label: 'Langages',
    items: ['HTML', 'CSS', 'JavaScript', 'PHP', 'C', 'Java', 'Python'],
  },
  {
    label: 'Frameworks',
    items: [
      'React',
      'Next.js',
      'Angular',
      'Node.js',
      'Laravel',
      'React Native',
      'ElectronJS',
    ],
  },
  {
    label: 'Bases de données',
    items: ['MySQL', 'PostgreSQL', 'SQLite', 'MongoDB', 'Supabase'],
  },
  {
    label: 'Réseaux & sécurité',
    items: ['VLAN', 'Pare-feu', 'DMZ (pfSense)', 'Linux', 'Windows Server'],
  },
  {
    label: 'Outils',
    items: ['Git/GitHub', 'Docker', 'Figma', 'Claude Code'],
  },
] as const;

export const education = [
  {
    year: '2025',
    title: 'Master Professionnel en Ingénierie des Systèmes Numériques',
    org: 'ESIGN, Sangmélima',
    note: 'Mention Très Bien',
  },
  {
    year: '2019',
    title: 'Baccalauréat C',
    org: 'Collège Jean-Paul II, Mbalmayo',
    note: '',
  },
] as const;

export const sections = [
  { id: 'projets', label: 'Projets' },
  { id: 'parcours', label: 'Parcours' },
  { id: 'a-propos', label: 'À propos' },
  { id: 'competences', label: 'Compétences' },
  { id: 'contact', label: 'Contact' },
] as const;
