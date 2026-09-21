/**
 * Jeu d'icônes dessiné à la main : un seul système, trait de 1.5,
 * extrémités carrées, grille de 24. Aucun emoji, aucun glyphe Unicode
 * ne tient lieu d'icône dans la page.
 */

type Props = { className?: string };

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'square' as const,
  strokeLinejoin: 'miter' as const,
  'aria-hidden': true,
};

export const ArrowDown = ({ className }: Props) => (
  <svg {...base} className={className}>
    <path d="M12 4v16M6 14l6 6 6-6" />
  </svg>
);

export const ArrowUpRight = ({ className }: Props) => (
  <svg {...base} className={className}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const Mail = ({ className }: Props) => (
  <svg {...base} className={className}>
    <path d="M3 6h18v12H3z" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export const Phone = ({ className }: Props) => (
  <svg {...base} className={className}>
    <path d="M8 3H4v4c0 7.18 5.82 13 13 13h4v-4l-4.5-1.5-2 2.5a15 15 0 0 1-7.5-7.5l2.5-2z" />
  </svg>
);

export const Pin = ({ className }: Props) => (
  <svg {...base} className={className}>
    <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const Github = ({ className }: Props) => (
  <svg {...base} className={className}>
    <path d="M9 19c-4 1.3-4-2.2-6-2.7m12 5.3v-3.6a3.1 3.1 0 0 0-.9-2.4c2.9-.3 6-1.4 6-6.4a5 5 0 0 0-1.4-3.4 4.6 4.6 0 0 0-.1-3.5s-1.1-.3-3.6 1.4a12.4 12.4 0 0 0-6.6 0C5.9 1.9 4.8 2.2 4.8 2.2a4.6 4.6 0 0 0-.1 3.5A5 5 0 0 0 3.3 9.2c0 5 3.1 6.1 6 6.4a3.1 3.1 0 0 0-.9 2.4V22" />
  </svg>
);

export const Linkedin = ({ className }: Props) => (
  <svg {...base} className={className}>
    <path d="M4 9h3v11H4zM5.5 4.5A1.5 1.5 0 1 1 5.5 7a1.5 1.5 0 0 1 0-2.5zM11 20V9h3v1.6A3.8 3.8 0 0 1 17.2 9c2.5 0 3.8 1.6 3.8 4.6V20h-3v-5.8c0-1.6-.6-2.5-2-2.5s-2 .9-2 2.5V20z" />
  </svg>
);

export const Terminal = ({ className }: Props) => (
  <svg {...base} className={className}>
    <path d="M4 5h16v14H4z" />
    <path d="m8 10 2.5 2L8 14M13 14h3" />
  </svg>
);
