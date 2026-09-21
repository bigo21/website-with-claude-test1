import { useLayoutEffect, useRef } from 'react';
import { skills } from '../data/content';
import { gsap, prefersReducedMotion } from '../lib/motion';

export default function Skills() {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.stack-row').forEach((row) => {
        gsap.from(row.querySelectorAll('.tag'), {
          opacity: 0,
          y: 12,
          scale: 0.96,
          duration: 0.5,
          ease: 'expo.out',
          stagger: 0.035,
          scrollTrigger: { trigger: row, start: 'top 88%' },
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const total = skills.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <section className="section skills" id="competences" ref={ref}>
      <div className="shell">
        <div className="section-head">
          <span className="section-head__prompt" aria-hidden="true">
            $
          </span>
          <h2 className="section-head__title">stack --list</h2>
          <span className="section-head__meta tabular">{total} entrées</span>
        </div>

        <dl className="stack">
          {skills.map((group) => (
            <div className="stack-row" key={group.label}>
              <dt className="stack-row__label">{group.label}</dt>
              <dd className="stack-row__items">
                <ul>
                  {group.items.map((item) => (
                    <li className="tag tag--live" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
