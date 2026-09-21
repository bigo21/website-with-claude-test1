import { useLayoutEffect, useRef, useState } from 'react';
import { projects } from '../data/content';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';
import { ArrowUpRight } from './icons';

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // La scène ne s'épingle qu'au-dessus de 900px : en dessous, les fiches
      // s'empilent et se révèlent normalement.
      mm.add(
        {
          pinned: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
          stacked: '(max-width: 899px), (prefers-reduced-motion: reduce)',
        },
        (context) => {
          if (!context.conditions?.pinned) {
            setActive(0);
            return;
          }

          ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: () => `+=${window.innerHeight * (projects.length - 0.35)}`,
            pin: stage,
            pinSpacing: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const index = Math.min(
                projects.length - 1,
                Math.floor(self.progress * projects.length),
              );
              setActive(index);
            },
          });
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const goTo = (index: number) => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    const start = section.offsetTop;
    const span = window.innerHeight * (projects.length - 0.35);
    window.scrollTo({
      top: start + (span * (index + 0.5)) / projects.length,
      behavior: 'smooth',
    });
  };

  return (
    <section className="section projects" id="projets" ref={sectionRef}>
      <div className="projects__stage" ref={stageRef}>
        <div className="shell projects__grid">
          <div className="projects__head">
            <div className="section-head">
              <span className="section-head__prompt" aria-hidden="true">
                $
              </span>
              <h2 className="section-head__title">ls ./projets</h2>
            </div>

            <ol className="projects__index">
              {projects.map((project, index) => (
                <li key={project.id}>
                  <button
                    type="button"
                    className={`projects__index-item${
                      index === active ? ' is-active' : ''
                    }`}
                    onClick={() => goTo(index)}
                    aria-current={index === active ? 'true' : undefined}
                  >
                    <span className="projects__index-mark" aria-hidden="true" />
                    <span className="projects__index-name">{project.name}</span>
                    <span className="projects__index-kind">{project.kind}</span>
                  </button>
                </li>
              ))}
            </ol>

            <p className="projects__progress tabular" aria-hidden="true">
              <span className="projects__progress-now">
                {String(active + 1).padStart(2, '0')}
              </span>
              <span className="projects__progress-rule" />
              {String(projects.length).padStart(2, '0')}
            </p>
          </div>

          <div className="projects__viewport">
            {projects.map((project, index) => (
              <article
                key={project.id}
                className={`fiche${index === active ? ' is-active' : ''}`}
                aria-hidden={index === active ? undefined : 'true'}
                {...(index === active ? {} : { inert: '' as unknown as boolean })}
              >
                <header className="fiche__head">
                  <span className="fiche__kind">{project.kind}</span>
                  <span className="fiche__dot" aria-hidden="true" />
                </header>

                <h3 className="fiche__name" data-text={project.name}>
                  <span>{project.name}</span>
                </h3>

                <p className="fiche__summary">{project.summary}</p>
                <p className="fiche__detail">{project.detail}</p>

                <ul className="fiche__stack">
                  {project.stack.map((tech) => (
                    <li key={tech} className="tag">
                      {tech}
                    </li>
                  ))}
                </ul>

                <footer className="fiche__foot" aria-hidden="true">
                  <ArrowUpRight className="fiche__foot-icon" />
                  <span className="fiche__path">
                    ~/projets/{project.id}
                  </span>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
