import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Smooth scroll à inertie. Lenis pilote la position, GSAP lit cette même
 * position : un seul ticker, pas deux boucles concurrentes.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Les ancres passent par Lenis pour conserver l'inertie.
    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!anchor) return;
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -24, duration: 1.4 });
    };

    document.addEventListener('click', onAnchorClick);

    return () => {
      document.removeEventListener('click', onAnchorClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
}

/**
 * Révélation au scroll. `mask` découvre le contenu par clip-path (titres,
 * cartes) ; `rise` est la montée discrète réservée au texte courant.
 */
export function useReveal<T extends HTMLElement>(
  kind: 'mask' | 'rise' = 'rise',
  options: { stagger?: number; selector?: string; start?: string } = {},
) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const { stagger = 0.08, selector, start = 'top 82%' } = options;

    const ctx = gsap.context(() => {
      const targets = selector
        ? gsap.utils.toArray<HTMLElement>(selector)
        : [el];

      if (kind === 'mask') {
        gsap.from(targets, {
          clipPath: 'inset(0 0 100% 0)',
          y: 24,
          duration: 1,
          ease: 'expo.out',
          stagger,
          scrollTrigger: { trigger: el, start },
        });
      } else {
        gsap.from(targets, {
          opacity: 0,
          y: 20,
          duration: 0.75,
          ease: 'expo.out',
          stagger,
          scrollTrigger: { trigger: el, start },
        });
      }
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

/** Parallaxe : couches décoratives uniquement, jamais le texte courant. */
export function useParallax<T extends HTMLElement>(yPercent = -10) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      });
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
