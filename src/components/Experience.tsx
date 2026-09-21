import { useLayoutEffect, useRef } from 'react';
import { experience, education } from '../data/content';
import { gsap, prefersReducedMotion } from '../lib/motion';

/**
 * Le parcours se lit comme un historique de commits : la branche se trace
 * au scroll, les entrées les plus récentes en tête, les postes en cours
 * marqués comme HEAD.
 */
export default function Experience() {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // La branche se dessine de haut en bas, calée sur le scroll.
      gsap.fromTo(
        '.commit-line__draw',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.commits',
            start: 'top 72%',
            end: 'bottom 72%',
            scrub: 0.5,
          },
        },
      );

      gsap.from('.commit', {
        opacity: 0,
        x: -18,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.09,
        scrollTrigger: { trigger: '.commits', start: 'top 78%' },
      });

      gsap.from('.diploma', {
        opacity: 0,
        y: 18,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.diplomas', start: 'top 85%' },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section parcours" id="parcours" ref={ref}>
      <div className="shell">
        <div className="section-head">
          <span className="section-head__prompt" aria-hidden="true">
            $
          </span>
          <h2 className="section-head__title">git log --parcours</h2>
          <span className="section-head__meta">
            {experience.length} entrées
          </span>
        </div>

        <ol className="commits">
          <span className="commit-line" aria-hidden="true">
            <span className="commit-line__draw" />
          </span>

          {experience.map((role) => (
            <li
              key={`${role.start}-${role.title}`}
              className={`commit${role.current ? ' commit--head' : ''}`}
            >
              <span className="commit__node" aria-hidden="true" />

              <time className="commit__period" dateTime={role.start}>
                {role.period}
              </time>

              <div className="commit__body">
                <h3 className="commit__title">{role.title}</h3>
                {role.org && <p className="commit__org">{role.org}</p>}
              </div>

              {role.current && (
                <span className="commit__head-tag" aria-label="Poste en cours">
                  HEAD
                </span>
              )}
            </li>
          ))}
        </ol>

        <div className="diplomas">
          <h3 className="diplomas__title">Formation</h3>
          <ul>
            {education.map((item) => (
              <li className="diploma" key={item.year}>
                <span className="diploma__year tabular">{item.year}</span>
                <span className="diploma__body">
                  <span className="diploma__name">{item.title}</span>
                  <span className="diploma__org">
                    {item.org}
                    {item.note && (
                      <>
                        <span className="diploma__sep" aria-hidden="true">
                          ·
                        </span>
                        <span className="diploma__note">{item.note}</span>
                      </>
                    )}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
