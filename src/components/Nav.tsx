import { useEffect, useState } from 'react';
import { sections, identity } from '../data/content';

export default function Nav() {
  const [lifted, setLifted] = useState(false);
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observed = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5] },
    );

    observed.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header className={`nav${lifted ? ' nav--lifted' : ''}`}>
      <div className="nav__inner shell">
        <a className="nav__mark" href="#top">
          <span className="nav__mark-prompt">~/</span>
          {identity.lastName.toLowerCase().replace(/\s+/g, '-')}
        </a>

        <nav aria-label="Sections du site">
          <ul className="nav__list">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  className={`nav__link${active === section.id ? ' is-active' : ''}`}
                  href={`#${section.id}`}
                  aria-current={active === section.id ? 'true' : undefined}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
