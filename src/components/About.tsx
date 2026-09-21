import { useLayoutEffect, useRef } from 'react';
import { about, identity } from '../data/content';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { Terminal } from './icons';

/**
 * La section « à propos » s'exécute comme une commande : la ligne de
 * commande apparaît, puis sa sortie se déroule ligne à ligne. C'est le
 * seul endroit de la page où la métaphore terminal est jouée jusqu'au
 * bout — la répéter partout la viderait de son sens.
 */
export default function About() {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 68%' },
      });

      tl.from('.run__cmd', { opacity: 0, duration: 0.3 })
        .from(
          '.run__out > *',
          {
            opacity: 0,
            y: 10,
            duration: 0.55,
            ease: 'expo.out',
            stagger: 0.14,
          },
          '+=0.35',
        )
        .from('.run__status', { opacity: 0, duration: 0.4 }, '-=0.2');
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section about" id="a-propos" ref={ref}>
      <div className="shell">
        <div className="section-head">
          <span className="section-head__prompt" aria-hidden="true">
            $
          </span>
          <h2 className="section-head__title">whoami</h2>
        </div>

        <div className="run">
          <div className="run__bar">
            <Terminal className="run__bar-icon" />
            <span className="run__bar-path">~/a-propos.md</span>
            <span className="run__bar-meta">{identity.location}</span>
          </div>

          <div className="run__body">
            <p className="run__cmd">
              <span className="run__caret" aria-hidden="true">
                $
              </span>
              <span>cat a-propos.md</span>
            </p>

            <div className="run__out">
              <p className="prose run__para">{about.body}</p>
              <p className="prose run__para run__para--accent">
                {about.closing}
              </p>
            </div>

            <p className="run__status" aria-hidden="true">
              <span className="run__status-ok">exit 0</span>
              <span className="caret" />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
